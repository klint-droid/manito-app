import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GiftBoxProps {
  visible: boolean;
  opened: boolean;
  position?: [number, number, number];
}

const SPARKLE_COLORS = ['#ffd56b', '#fff4b8', '#ff9ec7', '#a8e4ff', '#88f2cb'];
const SPARKLE_COUNT = 12;

export function GiftBox({ visible, opened, position = [0, 0.34, 0.95] }: GiftBoxProps) {
  const rootRef = useRef<THREE.Group>(null);
  const bodySquashRef = useRef<THREE.Group>(null);
  const lidHingeRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const innerGlowRef = useRef<THREE.Mesh>(null);
  const innerLightRef = useRef<THREE.PointLight>(null);
  const sparklesRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Spring physics states for smooth organic motion
  const scaleRef = useRef(0);
  const scaleVelRef = useRef(0);
  const openAngleRef = useRef(0);
  const openVelRef = useRef(0);
  const popImpulseRef = useRef(0);
  const prevOpenedRef = useRef(false);

  const sparkles = useMemo(
    () =>
      Array.from({ length: SPARKLE_COUNT }, (_, i) => {
        const angle = (i / SPARKLE_COUNT) * Math.PI * 2;
        return {
          angle,
          radius: 0.12 + (i % 3) * 0.14,
          speed: 0.75 + (i % 4) * 0.22,
          phase: (i / SPARKLE_COUNT) * 2.2,
          size: 0.045 + (i % 3) * 0.018,
          color: new THREE.Color(SPARKLE_COLORS[i % SPARKLE_COLORS.length]),
        };
      }),
    [],
  );

  useEffect(() => {
    if (sparklesRef.current) {
      sparkles.forEach((s, idx) => {
        sparklesRef.current?.setColorAt(idx, s.color);
      });
      if (sparklesRef.current.instanceColor) {
        sparklesRef.current.instanceColor.needsUpdate = true;
      }
    }
  }, [sparkles]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    // Trigger joyful squash-pop impulse the instant the gift transitions to opened
    if (visible && opened && !prevOpenedRef.current) {
      popImpulseRef.current = 1;
    }
    prevOpenedRef.current = visible && opened;

    // Reset spring instantly when hidden
    if (!visible && scaleRef.current < 0.01) {
      openAngleRef.current = 0;
      openVelRef.current = 0;
      popImpulseRef.current = 0;
    }

    // Damped spring for box pop-in / pop-out scale
    const targetScale = visible ? 1 : 0;
    const scaleForce = (targetScale - scaleRef.current) * (visible ? 120 : 95);
    scaleVelRef.current = (scaleVelRef.current + scaleForce * dt) * Math.exp(-10.5 * dt);
    scaleRef.current = Math.max(0, scaleRef.current + scaleVelRef.current * dt);

    // Damped spring for hinged lid opening (0 rad closed -> ~2.22 rad / 127 deg open behind box)
    const targetOpenAngle = visible && opened ? 2.22 : 0;
    const lidStiffness = opened ? 95 : 130;
    const lidDamping = opened ? 8.2 : 14;
    const openForce = (targetOpenAngle - openAngleRef.current) * lidStiffness;
    openVelRef.current = (openVelRef.current + openForce * dt) * Math.exp(-lidDamping * dt);
    openAngleRef.current = Math.max(0, openAngleRef.current + openVelRef.current * dt);

    // Decay pop impulse
    popImpulseRef.current = Math.max(0, popImpulseRef.current - dt * 3.1);
    const openNorm = Math.min(1, openAngleRef.current / 2.22);

    if (rootRef.current) {
      const s = scaleRef.current;
      rootRef.current.visible = s > 0.015;
      rootRef.current.position.set(position[0], position[1], position[2]);
      rootRef.current.scale.setScalar(s);
    }

    if (bodySquashRef.current) {
      if (visible && !opened) {
        // Excited anticipation rattle & tiny hop before opening
        const rattle = Math.sin(t * 15);
        const hop = Math.max(0, Math.sin(t * 7.5)) * 0.07;
        const stretch = 1 + hop * 0.9;
        const squash = 1 / Math.sqrt(stretch);
        bodySquashRef.current.position.y = hop;
        bodySquashRef.current.rotation.z = rattle * 0.065;
        bodySquashRef.current.rotation.y = Math.sin(t * 4.5) * 0.08;
        bodySquashRef.current.scale.set(squash, stretch, squash);
      } else {
        // Joyful pop squash-and-stretch on reveal, then calm grounded idle
        const popWave = Math.sin(popImpulseRef.current * Math.PI) * 0.18;
        const sy = 1 + popWave;
        const sxz = 1 / Math.sqrt(sy);
        bodySquashRef.current.position.y = popWave * 0.35;
        bodySquashRef.current.rotation.z = THREE.MathUtils.lerp(
          bodySquashRef.current.rotation.z,
          0,
          dt * 10,
        );
        bodySquashRef.current.rotation.y = THREE.MathUtils.lerp(
          bodySquashRef.current.rotation.y,
          Math.sin(t * 1.4) * 0.06,
          dt * 6,
        );
        bodySquashRef.current.scale.set(sxz, sy, sxz);
      }
    }

    // Back-hinged lid rotation (swings cleanly backward behind the box)
    if (lidHingeRef.current) {
      lidHingeRef.current.rotation.x = -openAngleRef.current;
    }

    // Soft upward-flaring golden light shaft (subtle, never blinding)
    if (beamRef.current) {
      beamRef.current.visible = openNorm > 0.05;
      const pulse = 0.92 + Math.sin(t * 4.5) * 0.08;
      beamRef.current.scale.set(0.75 + openNorm * 0.3, Math.max(0.05, openNorm * pulse), 0.75 + openNorm * 0.3);
      const mat = beamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = openNorm * (0.17 + Math.sin(t * 4.5) * 0.03);
    }

    // Glowing magical interior pad
    if (innerGlowRef.current) {
      const mat = innerGlowRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = openNorm * (1.2 + Math.sin(t * 6) * 0.25);
    }

    if (innerLightRef.current) {
      innerLightRef.current.intensity = openNorm * 1.65;
    }

    // Shimmering sparkles rising gently out of the open box
    if (sparklesRef.current) {
      for (let i = 0; i < SPARKLE_COUNT; i += 1) {
        const sp = sparkles[i];
        if (openNorm > 0.15) {
          const cycle = (t * sp.speed + sp.phase) % 1.6;
          const life = cycle / 1.6; // 0 at bottom inside box -> 1 high fade-out
          const spread = sp.radius * (0.6 + life * 1.9);
          const angle = sp.angle + t * 0.9;
          const x = Math.cos(angle) * spread;
          const z = Math.sin(angle) * spread;
          const y = 0.56 + life * 1.15;
          const fadeScale = Math.sin(life * Math.PI) * sp.size * openNorm;

          dummy.position.set(x, y, z);
          dummy.rotation.set(t * 2.5 + i, t * 3.2, 0);
          dummy.scale.setScalar(Math.max(0.0001, fadeScale));
        } else {
          dummy.position.set(0, -100, 0);
          dummy.scale.setScalar(0.0001);
        }
        dummy.updateMatrix();
        sparklesRef.current.setMatrixAt(i, dummy.matrix);
      }
      sparklesRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={rootRef} position={position} visible={false}>
      <group ref={bodySquashRef}>
        {/* Grounded Gift Box Base (sits cleanly on y = 0) */}
        <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.76, 0.56, 0.76]} />
          <meshStandardMaterial color="#ff5e96" roughness={0.28} metalness={0.1} />
        </mesh>

        {/* Crossed Golden Ribbons around Base */}
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.785, 0.565, 0.15]} />
          <meshStandardMaterial
            color="#ffd56b"
            roughness={0.22}
            metalness={0.45}
            emissive="#ffb703"
            emissiveIntensity={0.22}
          />
        </mesh>
        <mesh position={[0, 0.28, 0]} castShadow>
          <boxGeometry args={[0.15, 0.565, 0.785]} />
          <meshStandardMaterial
            color="#ffd56b"
            roughness={0.22}
            metalness={0.45}
            emissive="#ffb703"
            emissiveIntensity={0.22}
          />
        </mesh>

        {/* Recessed Glowing Golden Interior Top */}
        <mesh ref={innerGlowRef} position={[0, 0.563, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.64, 0.64]} />
          <meshStandardMaterial
            color="#fff3b0"
            emissive="#ffd56b"
            emissiveIntensity={0}
            roughness={0.25}
          />
        </mesh>

        {/* Warm interior light illuminating nearby characters when opened */}
        <pointLight ref={innerLightRef} position={[0, 0.85, 0]} color="#ffe082" intensity={0} distance={5.5} />

        {/* Subtle Upward-Flaring Golden Light Shaft (narrow inside box -> wider above) */}
        <mesh ref={beamRef} position={[0, 0.98, 0]} visible={false}>
          <cylinderGeometry args={[0.52, 0.24, 0.86, 24, 1, true]} />
          <meshBasicMaterial
            color="#ffe599"
            transparent
            opacity={0}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Rising Magical Sparkles out of the opened box */}
        <instancedMesh
          ref={sparklesRef}
          args={[undefined, undefined, SPARKLE_COUNT]}
          frustumCulled={false}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            roughness={0.2}
            metalness={0.35}
            emissive="#ffd56b"
            emissiveIntensity={1.1}
          />
        </instancedMesh>

        {/* True Back-Hinged Lid + Festive Bow */}
        <group ref={lidHingeRef} position={[0, 0.56, -0.38]}>
          <group position={[0, 0.08, 0.38]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.84, 0.16, 0.84]} />
              <meshStandardMaterial color="#ff77a8" roughness={0.26} metalness={0.1} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.86, 0.17, 0.15]} />
              <meshStandardMaterial color="#ffd56b" roughness={0.22} metalness={0.45} />
            </mesh>
            <mesh>
              <boxGeometry args={[0.15, 0.17, 0.86]} />
              <meshStandardMaterial color="#ffd56b" roughness={0.22} metalness={0.45} />
            </mesh>

            {/* Puffy Bow Loops */}
            <mesh position={[-0.17, 0.16, 0]} rotation={[0, 0, 0.42]} castShadow>
              <torusGeometry args={[0.14, 0.05, 12, 24]} />
              <meshStandardMaterial
                color="#ffd56b"
                roughness={0.2}
                metalness={0.4}
                emissive="#ffd56b"
                emissiveIntensity={0.25}
              />
            </mesh>
            <mesh position={[0.17, 0.16, 0]} rotation={[0, 0, -0.42]} castShadow>
              <torusGeometry args={[0.14, 0.05, 12, 24]} />
              <meshStandardMaterial
                color="#ffd56b"
                roughness={0.2}
                metalness={0.4}
                emissive="#ffd56b"
                emissiveIntensity={0.25}
              />
            </mesh>
            <mesh position={[0, 0.13, 0]} castShadow>
              <sphereGeometry args={[0.085, 16, 16]} />
              <meshStandardMaterial color="#fff1b8" roughness={0.2} metalness={0.35} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
