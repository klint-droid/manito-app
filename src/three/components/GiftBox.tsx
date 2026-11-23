import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GiftBoxProps {
  visible: boolean;
  opened: boolean;
  position?: [number, number, number];
}

export function GiftBox({ visible, opened, position = [0, 0.35, 0.85] }: GiftBoxProps) {
  const rootRef = useRef<THREE.Group>(null);
  const lidRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const scaleProgress = useRef(0);
  const openProgress = useRef(0);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    const targetScale = visible ? 1 : 0;
    scaleProgress.current = THREE.MathUtils.lerp(scaleProgress.current, targetScale, dt * 6.5);

    const targetOpen = visible && opened ? 1 : 0;
    openProgress.current = THREE.MathUtils.lerp(openProgress.current, targetOpen, dt * 5.2);

    if (rootRef.current) {
      const s = scaleProgress.current;
      rootRef.current.visible = s > 0.02;

      // Anticipation wiggle before opening, gentle float once open
      const wiggle = visible && !opened ? Math.sin(t * 16) * 0.07 : Math.sin(t * 2.5) * 0.02;
      const bounceY = visible ? Math.sin(t * 3.5) * 0.04 : 0;

      rootRef.current.scale.setScalar(s);
      rootRef.current.rotation.z = wiggle;
      rootRef.current.rotation.y = Math.sin(t * 1.4) * 0.16;
      rootRef.current.position.set(position[0], position[1] + bounceY, position[2]);
    }

    if (lidRef.current) {
      const op = openProgress.current;
      lidRef.current.position.y = 0.44 + op * 0.62;
      lidRef.current.position.z = -op * 0.36;
      lidRef.current.rotation.x = -op * 0.95;
      lidRef.current.rotation.z = op * 0.22;
    }

    if (glowRef.current) {
      const op = openProgress.current;
      glowRef.current.scale.set(0.55 + op * 0.85, 0.4 + op * 1.5, 0.55 + op * 0.85);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = op * (0.48 + Math.sin(t * 6) * 0.12);
    }
  });

  return (
    <group ref={rootRef} position={position} visible={false}>
      {/* Box Base */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.56, 0.78]} />
        <meshStandardMaterial color="#ff5e96" roughness={0.28} metalness={0.12} />
      </mesh>

      {/* Vertical Gold Ribbons */}
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.81, 0.57, 0.16]} />
        <meshStandardMaterial
          color="#ffd56b"
          roughness={0.22}
          metalness={0.45}
          emissive="#ffb703"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[0, 0.16, 0]} castShadow>
        <boxGeometry args={[0.16, 0.57, 0.81]} />
        <meshStandardMaterial
          color="#ffd56b"
          roughness={0.22}
          metalness={0.45}
          emissive="#ffb703"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Magical Golden Beam emerging from inside when opened */}
      <mesh ref={glowRef} position={[0, 0.68, 0]}>
        <coneGeometry args={[0.62, 1.4, 24, 1, true]} />
        <meshBasicMaterial
          color="#ffe082"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Animated Lid + Festive Bow */}
      <group ref={lidRef} position={[0, 0.44, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.88, 0.18, 0.88]} />
          <meshStandardMaterial color="#ff77a8" roughness={0.26} metalness={0.12} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.9, 0.19, 0.16]} />
          <meshStandardMaterial color="#ffd56b" roughness={0.22} metalness={0.45} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.16, 0.19, 0.9]} />
          <meshStandardMaterial color="#ffd56b" roughness={0.22} metalness={0.45} />
        </mesh>

        {/* Puffy Bow Loops */}
        <mesh position={[-0.18, 0.18, 0]} rotation={[0, 0, 0.42]} castShadow>
          <torusGeometry args={[0.15, 0.055, 12, 24]} />
          <meshStandardMaterial
            color="#ffd56b"
            roughness={0.2}
            metalness={0.4}
            emissive="#ffd56b"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0.18, 0.18, 0]} rotation={[0, 0, -0.42]} castShadow>
          <torusGeometry args={[0.15, 0.055, 12, 24]} />
          <meshStandardMaterial
            color="#ffd56b"
            roughness={0.2}
            metalness={0.4}
            emissive="#ffd56b"
            emissiveIntensity={0.25}
          />
        </mesh>
        <mesh position={[0, 0.15, 0]} castShadow>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial color="#fff1b8" roughness={0.2} metalness={0.35} />
        </mesh>
      </group>
    </group>
  );
}
