import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { CenterStage } from '../components/CenterStage';
import {
  CharacterCircle,
  computeCircleRadius,
  computeCircularSlot,
} from '../components/CharacterCircle';
import { GiftBox } from '../components/GiftBox';
import { SnowParticles } from '../components/SnowParticles';
import {
  animateCameraToPose,
  getCenterStagePose,
  getFocusCharacterPose,
  getGroupPhotoCameraPose,
  getOverviewCameraPose,
  getRevealCameraPose,
} from '../animations/cameraAnimations';
import type { Participant } from '../../types/participant';
import type { DrawPhase } from '../../types/assignment';

export interface ChristmasSceneProps {
  participants: Participant[];
  phase: DrawPhase;
  currentGiverId: string | null;
  highlightedId: string | null;
  activeRecipientId: string | null;
  assignedRecipientIds: Set<string>;
  completedGiverIds: Set<string>;
  isPaused?: boolean;
  onCharacterClick?: (participant: Participant) => void;
}

function detectWebGLSupport(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

function CameraChoreographer({
  participants,
  circleRadius,
  phase,
  currentGiverId,
  isMobile,
  isPaused,
}: {
  participants: Participant[];
  circleRadius: number;
  phase: DrawPhase;
  currentGiverId: string | null;
  isMobile: boolean;
  isPaused: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const lookAtRef = useRef(new THREE.Vector3(0, 0.9, 0));
  const orbitAngleRef = useRef(0);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    activeTimelineRef.current?.kill();

    let pose = getOverviewCameraPose(circleRadius, isMobile);

    if (phase === 'giver_focus' && currentGiverId) {
      const idx = participants.findIndex((p) => p.id === currentGiverId);
      if (idx >= 0) {
        const slot = computeCircularSlot(idx, participants.length, circleRadius, 0, 0);
        pose = getFocusCharacterPose([slot.x, 0.1, slot.z], isMobile);
      }
    } else if (phase === 'giver_entering') {
      pose = getCenterStagePose(circleRadius, isMobile);
    } else if (phase === 'selecting') {
      pose = getOverviewCameraPose(circleRadius * 0.92, isMobile);
      orbitAngleRef.current = Math.atan2(camera.position.x, camera.position.z);
    } else if (phase === 'recipient_approaching' || phase === 'revealed') {
      pose = getRevealCameraPose(isMobile);
    } else if (phase === 'completed') {
      pose = getGroupPhotoCameraPose(participants.length, isMobile);
    }

    activeTimelineRef.current = animateCameraToPose(camera, lookAtRef.current, pose, () => {
      if (controlsRef.current) {
        controlsRef.current.target.copy(lookAtRef.current);
        controlsRef.current.update();
      }
    });

    return () => {
      activeTimelineRef.current?.kill();
    };
  }, [phase, currentGiverId, circleRadius, isMobile, participants, camera]);

  useEffect(() => {
    if (!activeTimelineRef.current) return;
    if (isPaused) {
      activeTimelineRef.current.pause();
    } else {
      activeTimelineRef.current.resume();
    }
  }, [isPaused]);

  // Smooth orbital spin around the circular stage while random selection is running
  useFrame((_, delta) => {
    if (phase !== 'selecting' || isPaused) return;
    if (activeTimelineRef.current?.isActive()) return;

    const dt = Math.min(delta, 0.05);
    orbitAngleRef.current += dt * 0.55;
    const radius = Math.max(isMobile ? 10.2 : 8.8, circleRadius * (isMobile ? 2.15 : 1.75));
    const height = Math.max(5.2, circleRadius * (isMobile ? 1.35 : 1.05));

    camera.position.x = Math.sin(orbitAngleRef.current) * radius;
    camera.position.z = Math.cos(orbitAngleRef.current) * radius;
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, height, dt * 2.5);
    camera.lookAt(0, 0.95, 0);

    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0.95, 0);
      controlsRef.current.update();
    }
  });

  const allowUserOrbit = phase === 'ready' || phase === 'revealed' || phase === 'completed';

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      enabled={allowUserOrbit}
      minDistance={4.2}
      maxDistance={Math.max(18, circleRadius * 3.4)}
      minPolarAngle={0.35}
      maxPolarAngle={Math.PI / 2 - 0.08}
    />
  );
}

export function ChristmasScene({
  participants,
  phase,
  currentGiverId,
  highlightedId,
  activeRecipientId,
  assignedRecipientIds,
  completedGiverIds,
  isPaused = false,
  onCharacterClick,
}: ChristmasSceneProps) {
  const [webglSupported] = useState<boolean>(() => detectWebGLSupport());
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const circleRadius = useMemo(
    () => computeCircleRadius(participants.length),
    [participants.length],
  );

  if (!webglSupported) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl bg-navy-900/90 p-8 text-center">
        <div className="mb-3 text-4xl">🎄</div>
        <h3 className="font-display text-2xl font-bold text-pastel-gold">
          WebGL Unavailable in This Browser
        </h3>
        <p className="mt-2 max-w-md text-sm text-ice-200/80">
          Your device or browser has WebGL disabled. You can still run the gift exchange using the
          organizer controls below, and all pairings remain completely valid and secure.
        </p>
      </div>
    );
  }

  const showGiftBox =
    phase === 'recipient_approaching' || phase === 'revealed' || phase === 'completed';
  const giftOpened = phase === 'revealed' || phase === 'completed';
  const giftBoxPosition: [number, number, number] =
    phase === 'completed' ? [0, 0.12, 2.25] : [0, 0.34, 0.95];

  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows={!isMobile}
        dpr={isMobile ? [1, 1.4] : [1, 2]}
        camera={{ position: [0, 7.2, 12.6], fov: isMobile ? 54 : 45, near: 0.1, far: 120 }}
        gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true }}
      >
        <color attach="background" args={['#0b1230']} />
        <fog attach="fog" args={['#0b1230', 20, 48]} />

        {/* Atmospheric Night Sky Stars */}
        <Stars
          radius={55}
          depth={35}
          count={isMobile ? 900 : 1800}
          factor={3.5}
          saturation={0.5}
          fade
          speed={0.6}
        />

        {/* Warm & Cool Magical Festive Lighting Rig */}
        <ambientLight intensity={0.72} color="#cde6ff" />
        <hemisphereLight args={['#a8e4ff', '#1c1842', 0.65]} />
        <directionalLight
          position={[8, 14, 9]}
          intensity={1.35}
          color="#fff4e0"
          castShadow={!isMobile}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-near={1}
          shadow-camera-far={36}
          shadow-camera-left={-12}
          shadow-camera-right={12}
          shadow-camera-top={12}
          shadow-camera-bottom={-12}
          shadow-bias={-0.0005}
        />
        <pointLight position={[-6, 5, -5]} intensity={1.1} color="#b993ff" distance={22} />
        <pointLight position={[6, 4.5, -5]} intensity={0.95} color="#ff9ec7" distance={22} />
        <pointLight
          position={[0, 4.4, 1.2]}
          intensity={phase === 'revealed' ? 2.4 : 1.15}
          color="#ffd56b"
          distance={14}
        />

        {/* Floating Snow-Covered Christmas Platform & Environment */}
        <CenterStage
          circleRadius={circleRadius}
          highlightCenter={
            phase === 'giver_entering' ||
            phase === 'selecting' ||
            phase === 'recipient_approaching'
          }
          celebrating={phase === 'revealed' || phase === 'completed'}
          isMobile={isMobile}
        />

        {/* Circular Formation of Fantasy Characters */}
        <CharacterCircle
          participants={participants}
          circleRadius={circleRadius}
          phase={phase}
          currentGiverId={currentGiverId}
          highlightedId={highlightedId}
          activeRecipientId={activeRecipientId}
          assignedRecipientIds={assignedRecipientIds}
          completedGiverIds={completedGiverIds}
          isMobile={isMobile}
          onCharacterClick={onCharacterClick}
        />

        {/* Animated Reveal Gift Box */}
        <GiftBox visible={showGiftBox} opened={giftOpened} position={giftBoxPosition} />

        {/* Snowfall, Selection Magic Orbs, and Celebration 3D Confetti */}
        <SnowParticles
          count={isMobile ? 130 : 280}
          spread={Math.max(24, circleRadius * 4.5)}
          height={17}
          celebrationActive={phase === 'revealed' || phase === 'completed'}
          selectionMagicActive={phase === 'selecting' || phase === 'recipient_approaching'}
        />

        {/* Dynamic GSAP Camera Choreography & OrbitControls */}
        <CameraChoreographer
          participants={participants}
          circleRadius={circleRadius}
          phase={phase}
          currentGiverId={currentGiverId}
          isMobile={isMobile}
          isPaused={isPaused}
        />
      </Canvas>
    </div>
  );
}
