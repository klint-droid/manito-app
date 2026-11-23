import { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SnowParticlesProps {
  count?: number;
  spread?: number;
  height?: number;
  celebrationActive?: boolean;
  selectionMagicActive?: boolean;
}

const CONFETTI_COLORS = ['#ffd56b', '#ff9ec7', '#88f2cb', '#a8e4ff', '#b993ff', '#ffffff'];

export function SnowParticles({
  count = 260,
  spread = 28,
  height = 18,
  celebrationActive = false,
  selectionMagicActive = false,
}: SnowParticlesProps) {
  const snowRef = useRef<THREE.InstancedMesh>(null);
  const confettiRef = useRef<THREE.InstancedMesh>(null);
  const magicRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const confettiCount = 90;
  const magicCount = 48;

  const flakes = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * spread,
      y: Math.random() * height,
      z: (Math.random() - 0.5) * spread,
      speed: 0.45 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 0.6,
      size: 0.04 + Math.random() * 0.065,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count, spread, height]);

  const confettiPieces = useMemo(() => {
    return Array.from({ length: confettiCount }, (_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const radiusSpeed = 1.2 + Math.random() * 3.6;
      return {
        vx: Math.cos(angle) * radiusSpeed,
        vy: 3.4 + Math.random() * 3.8,
        vz: Math.sin(angle) * radiusSpeed,
        rotSpeedX: (Math.random() - 0.5) * 8,
        rotSpeedY: (Math.random() - 0.5) * 8,
        color: new THREE.Color(CONFETTI_COLORS[i % CONFETTI_COLORS.length]),
        scale: 0.07 + Math.random() * 0.07,
        delay: Math.random() * 0.3,
      };
    });
  }, []);

  const magicOrbs = useMemo(() => {
    return Array.from({ length: magicCount }, (_, i) => ({
      angle: (i / magicCount) * Math.PI * 2,
      radius: 1.8 + (i % 5) * 1.15,
      heightOffset: 0.4 + (i % 7) * 0.45,
      speed: 0.7 + (i % 4) * 0.35,
      scale: 0.05 + (i % 3) * 0.03,
      color: new THREE.Color(CONFETTI_COLORS[i % CONFETTI_COLORS.length]),
    }));
  }, []);

  const celebrationTimeRef = useRef(0);

  useEffect(() => {
    if (celebrationActive) {
      celebrationTimeRef.current = 0;
    }
  }, [celebrationActive]);

  useEffect(() => {
    if (confettiRef.current) {
      confettiPieces.forEach((p, idx) => {
        confettiRef.current?.setColorAt(idx, p.color);
      });
      if (confettiRef.current.instanceColor) {
        confettiRef.current.instanceColor.needsUpdate = true;
      }
    }
    if (magicRef.current) {
      magicOrbs.forEach((orb, idx) => {
        magicRef.current?.setColorAt(idx, orb.color);
      });
      if (magicRef.current.instanceColor) {
        magicRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [confettiPieces, magicOrbs]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;

    // Snowflakes falling softly
    if (snowRef.current) {
      for (let i = 0; i < flakes.length; i += 1) {
        const f = flakes[i];
        f.y -= f.speed * dt;
        if (f.y < -2) {
          f.y = height;
          f.x = (Math.random() - 0.5) * spread;
          f.z = (Math.random() - 0.5) * spread;
        }
        const swayX = Math.sin(elapsed * 0.8 + f.phase) * 0.45 + f.drift * dt;
        dummy.position.set(f.x + swayX, f.y, f.z);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(f.size);
        dummy.updateMatrix();
        snowRef.current.setMatrixAt(i, dummy.matrix);
      }
      snowRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3D Confetti fountain burst on reveal
    if (confettiRef.current) {
      if (celebrationActive) {
        celebrationTimeRef.current += dt;
        const burstT = celebrationTimeRef.current;

        for (let i = 0; i < confettiPieces.length; i += 1) {
          const p = confettiPieces[i];
          const localT = Math.max(0, (burstT - p.delay) % 3.4);
          const x = p.vx * localT * 0.85;
          const y = 1.1 + p.vy * localT - 2.65 * localT * localT;
          const z = p.vz * localT * 0.85;
          const visibleScale = y > 0.1 ? p.scale : 0.0001;

          dummy.position.set(x, Math.max(0.1, y), z);
          dummy.rotation.set(localT * p.rotSpeedX, localT * p.rotSpeedY, localT * 3);
          dummy.scale.set(visibleScale * 1.6, visibleScale * 0.8, visibleScale * 0.25);
          dummy.updateMatrix();
          confettiRef.current.setMatrixAt(i, dummy.matrix);
        }
      } else {
        for (let i = 0; i < confettiPieces.length; i += 1) {
          dummy.position.set(0, -100, 0);
          dummy.scale.setScalar(0.0001);
          dummy.updateMatrix();
          confettiRef.current.setMatrixAt(i, dummy.matrix);
        }
      }
      confettiRef.current.instanceMatrix.needsUpdate = true;
    }

    // Swirling magical star particles during selection spin or reveal
    if (magicRef.current) {
      const showMagic = selectionMagicActive || celebrationActive;
      for (let i = 0; i < magicOrbs.length; i += 1) {
        const orb = magicOrbs[i];
        if (showMagic) {
          const a = orb.angle + elapsed * orb.speed * (celebrationActive ? 1.4 : 1.1);
          const r = celebrationActive ? orb.radius * 0.68 : orb.radius;
          const y = orb.heightOffset + Math.sin(elapsed * 2.4 + i) * 0.42;
          const pulse = orb.scale * (0.8 + Math.sin(elapsed * 5 + i) * 0.35);
          dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r);
          dummy.rotation.set(elapsed * 1.5, elapsed * 2, 0);
          dummy.scale.setScalar(pulse);
        } else {
          dummy.position.set(0, -100, 0);
          dummy.scale.setScalar(0.0001);
        }
        dummy.updateMatrix();
        magicRef.current.setMatrixAt(i, dummy.matrix);
      }
      magicRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Floating Winter Snow */}
      <instancedMesh ref={snowRef} args={[undefined, undefined, count]} frustumCulled={false}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#eaf6ff" transparent opacity={0.82} />
      </instancedMesh>

      {/* Celebration 3D Confetti */}
      <instancedMesh
        ref={confettiRef}
        args={[undefined, undefined, confettiCount]}
        frustumCulled={false}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.3} metalness={0.2} emissive="#ffffff" emissiveIntensity={0.25} />
      </instancedMesh>

      {/* Swirling Magical Sparkles */}
      <instancedMesh ref={magicRef} args={[undefined, undefined, magicCount]} frustumCulled={false}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          roughness={0.2}
          metalness={0.4}
          emissive="#ffd56b"
          emissiveIntensity={0.95}
        />
      </instancedMesh>
    </group>
  );
}
