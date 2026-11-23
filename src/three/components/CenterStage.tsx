import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CenterStageProps {
  circleRadius: number;
  highlightCenter?: boolean;
  celebrating?: boolean;
  isMobile?: boolean;
}

function FestiveTree({
  position,
  scale = 1,
  tint = '#2b9c6e',
}: {
  position: [number, number, number];
  scale?: number;
  tint?: string;
}) {
  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 0.7, 10]} />
        <meshStandardMaterial color="#6e4429" roughness={0.75} />
      </mesh>
      {/* Snow-dusted foliage tiers */}
      <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
        <coneGeometry args={[1.05, 1.3, 14]} />
        <meshStandardMaterial color={tint} roughness={0.62} />
      </mesh>
      <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.8, 1.15, 14]} />
        <meshStandardMaterial color={tint} roughness={0.58} />
      </mesh>
      <mesh position={[0, 2.55, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.52, 0.9, 14]} />
        <meshStandardMaterial color="#34b37e" roughness={0.55} />
      </mesh>
      {/* Snow Cap */}
      <mesh position={[0, 2.75, 0]}>
        <coneGeometry args={[0.26, 0.38, 12]} />
        <meshStandardMaterial color="#eef6ff" roughness={0.5} />
      </mesh>
      {/* Golden Star Topper */}
      <mesh position={[0, 3.06, 0]}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color="#ffd56b"
          emissive="#ffd56b"
          emissiveIntensity={0.9}
          roughness={0.2}
        />
      </mesh>
      {/* Glowing Baubles */}
      <mesh position={[0.56, 1.1, 0.42]}>
        <sphereGeometry args={[0.09, 10, 10]} />
        <meshStandardMaterial color="#ff9ec7" emissive="#ff9ec7" emissiveIntensity={0.65} />
      </mesh>
      <mesh position={[-0.48, 1.75, 0.35]}>
        <sphereGeometry args={[0.085, 10, 10]} />
        <meshStandardMaterial color="#a8e4ff" emissive="#72d2ff" emissiveIntensity={0.7} />
      </mesh>
      <mesh position={[0.22, 2.28, 0.34]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color="#ffd56b" emissive="#ffd56b" emissiveIntensity={0.75} />
      </mesh>
    </group>
  );
}

function DecorativeGift({
  position,
  rotationY = 0,
  color,
  ribbonColor,
  size = 0.55,
}: {
  position: [number, number, number];
  rotationY?: number;
  color: string;
  ribbonColor: string;
  size?: number;
}) {
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh position={[0, size * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} roughness={0.35} />
      </mesh>
      <mesh position={[0, size * 0.5, 0]}>
        <boxGeometry args={[size * 1.03, size * 1.02, size * 0.2]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.25} metalness={0.3} />
      </mesh>
      <mesh position={[0, size * 0.5, 0]}>
        <boxGeometry args={[size * 0.2, size * 1.02, size * 1.03]} />
        <meshStandardMaterial color={ribbonColor} roughness={0.25} metalness={0.3} />
      </mesh>
    </group>
  );
}

export function CenterStage({
  circleRadius,
  highlightCenter = false,
  celebrating = false,
  isMobile = false,
}: CenterStageProps) {
  const starRingRef = useRef<THREE.Mesh>(null);
  const floatingStarsRef = useRef<THREE.Group>(null);
  const platformRadius = Math.max(7.6, circleRadius + 3.4);

  const perimeterTrees = useMemo(() => {
    const count = isMobile ? 6 : 9;
    const r = platformRadius - 1.05;
    // Arrange trees in an open amphitheater arc from 125° to 415° (keeping the front +Z camera corridor at 90° completely clear!)
    const startAngle = Math.PI * 0.72;
    const endAngle = Math.PI * 2.28;
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const angle = startAngle + t * (endAngle - startAngle);
      return {
        pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r] as [number, number, number],
        scale: 0.7 + (i % 3) * 0.2,
        tint: i % 2 === 0 ? '#2b9c6e' : '#32a88c',
      };
    });
  }, [platformRadius, isMobile]);

  const decorativeGifts = useMemo(() => {
    const colors = ['#ff9ec7', '#b993ff', '#72d2ff', '#88f2cb', '#ffd56b'];
    const count = isMobile ? 5 : 8;
    const r = platformRadius - 1.85;
    const startAngle = Math.PI * 0.68;
    const endAngle = Math.PI * 2.32;
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      const angle = startAngle + t * (endAngle - startAngle);
      return {
        pos: [Math.cos(angle) * r, 0, Math.sin(angle) * r] as [number, number, number],
        rotY: angle + 0.4,
        color: colors[i % colors.length],
        ribbonColor: i % 2 === 0 ? '#ffd56b' : '#ffffff',
        size: 0.42 + (i % 3) * 0.14,
      };
    });
  }, [platformRadius, isMobile]);

  const perimeterLights = useMemo(() => {
    const count = isMobile ? 14 : 24;
    const r = platformRadius - 0.35;
    const bulbColors = ['#ffd56b', '#ff9ec7', '#a8e4ff', '#88f2cb', '#b993ff'];
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      return {
        pos: [Math.cos(angle) * r, 0.28, Math.sin(angle) * r] as [number, number, number],
        color: bulbColors[i % bulbColors.length],
      };
    });
  }, [platformRadius, isMobile]);

  const floatingStars = useMemo(() => {
    const count = isMobile ? 6 : 12;
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = platformRadius + 1.4 + (i % 3) * 1.1;
      return {
        x: Math.cos(angle) * r,
        y: 2.2 + (i % 4) * 1.15,
        z: Math.sin(angle) * r,
        scale: 0.16 + (i % 3) * 0.08,
        color: i % 2 === 0 ? '#ffd56b' : '#a8e4ff',
      };
    });
  }, [platformRadius, isMobile]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (starRingRef.current) {
      starRingRef.current.rotation.z = t * (celebrating ? 0.85 : 0.25);
      const mat = starRingRef.current.material as THREE.MeshStandardMaterial;
      mat.emissiveIntensity = (highlightCenter || celebrating ? 1.15 : 0.55) + Math.sin(t * 3.2) * 0.22;
    }
    if (floatingStarsRef.current) {
      floatingStarsRef.current.rotation.y = t * 0.08;
      floatingStarsRef.current.position.y = Math.sin(t * 1.2) * 0.22;
    }
  });

  return (
    <group>
      {/* Floating Magical Island Base (Deep Navy & Frosty Ice) */}
      <mesh position={[0, -0.55, 0]} receiveShadow>
        <cylinderGeometry args={[platformRadius, platformRadius * 0.88, 1.1, 48]} />
        <meshStandardMaterial color="#182552" roughness={0.62} metalness={0.18} />
      </mesh>

      {/* Lower Tapered Crystal Underside */}
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[platformRadius * 0.86, platformRadius * 0.36, 1.15, 32]} />
        <meshStandardMaterial color="#10193b" roughness={0.55} metalness={0.25} />
      </mesh>

      {/* Snow-Covered Top Ground */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <cylinderGeometry args={[platformRadius + 0.14, platformRadius + 0.08, 0.22, 48]} />
        <meshStandardMaterial color="#eef6ff" roughness={0.78} metalness={0.04} />
      </mesh>

      {/* Frosted Ice-Blue Track Ring where characters stand */}
      <mesh position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[circleRadius - 0.82, circleRadius + 0.82, 64]} />
        <meshStandardMaterial
          color="#d5efff"
          emissive="#72d2ff"
          emissiveIntensity={0.18}
          roughness={0.45}
        />
      </mesh>

      {/* Golden Outer Trim Ring */}
      <mesh position={[0, 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[platformRadius + 0.06, 0.1, 12, 64]} />
        <meshStandardMaterial
          color="#ffd56b"
          emissive="#ffd56b"
          emissiveIntensity={0.25}
          metalness={0.5}
          roughness={0.25}
        />
      </mesh>

      {/* Elevated Magical Center Stage Pedestal */}
      <group position={[0, 0.08, 0]}>
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.15, 2.38, 0.24, 36]} />
          <meshStandardMaterial color="#1f2f68" roughness={0.35} metalness={0.22} />
        </mesh>
        <mesh position={[0, 0.23, 0]} receiveShadow>
          <cylinderGeometry args={[2.0, 2.08, 0.06, 36]} />
          <meshStandardMaterial
            color="#d8f3ff"
            emissive={celebrating ? '#ffd56b' : '#72d2ff'}
            emissiveIntensity={highlightCenter || celebrating ? 0.35 : 0.14}
            roughness={0.32}
          />
        </mesh>
        {/* Glowing Golden Center Halo */}
        <mesh ref={starRingRef} position={[0, 0.27, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.68, 1.88, 36]} />
          <meshStandardMaterial
            color="#ffd56b"
            emissive="#ffd56b"
            emissiveIntensity={0.65}
            roughness={0.2}
            metalness={0.4}
          />
        </mesh>
        {/* Center Star Emblem */}
        <mesh position={[0, 0.265, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.78, 5]} />
          <meshStandardMaterial
            color="#b993ff"
            emissive="#b993ff"
            emissiveIntensity={0.35}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* Perimeter Snow-Dusted Christmas Trees */}
      {perimeterTrees.map((tree, idx) => (
        <FestiveTree key={`tree-${idx}`} position={tree.pos} scale={tree.scale} tint={tree.tint} />
      ))}

      {/* Decorative Wrapped Gift Boxes */}
      {decorativeGifts.map((gift, idx) => (
        <DecorativeGift
          key={`gift-${idx}`}
          position={gift.pos}
          rotationY={gift.rotY}
          color={gift.color}
          ribbonColor={gift.ribbonColor}
          size={gift.size}
        />
      ))}

      {/* Festive Glowing Perimeter Light Orbs */}
      {perimeterLights.map((light, idx) => (
        <group key={`light-${idx}`} position={light.pos}>
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.22, 8]} />
            <meshStandardMaterial color="#2a3a74" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <sphereGeometry args={[0.11, 12, 12]} />
            <meshStandardMaterial
              color={light.color}
              emissive={light.color}
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </mesh>
        </group>
      ))}

      {/* Floating Magical Stars around the floating island */}
      <group ref={floatingStarsRef}>
        {floatingStars.map((star, idx) => (
          <mesh key={`star-${idx}`} position={[star.x, star.y, star.z]} scale={star.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={star.color}
              emissive={star.color}
              emissiveIntensity={1.25}
              roughness={0.15}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
