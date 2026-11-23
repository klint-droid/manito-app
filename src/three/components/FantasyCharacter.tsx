import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { getCharacterVariant } from '../../assets/characters/registry';
import { sampleCharacterMotion } from '../animations/characterAnimations';
import type { CharacterAnimationState, CharacterVariantId } from '../../types/character';

export interface FantasyCharacterProps {
  variantId: CharacterVariantId;
  name?: string;
  targetPosition: [number, number, number];
  targetRotationY: number;
  animationState?: CharacterAnimationState;
  phaseOffset?: number;
  scale?: number;
  showLabel?: boolean;
  labelBadge?: 'giver' | 'recipient' | 'selected' | 'done' | null;
  highlightIntensity?: number;
  /** Reserved for future custom GLB character swapping */
  modelUrl?: string;
  onClick?: () => void;
}

function CharacterAccessory({
  variantId,
  primaryColor,
  secondaryColor,
  accentColor,
}: {
  variantId: CharacterVariantId;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}) {
  switch (variantId) {
    case 'santa':
      return (
        <group>
          {/* Santa Hat Brim */}
          <mesh position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.38, 0.1, 12, 24]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.65} />
          </mesh>
          {/* Tilted Cone */}
          <mesh position={[-0.08, 1.66, -0.02]} rotation={[0.08, 0, 0.34]} castShadow>
            <coneGeometry args={[0.36, 0.64, 20]} />
            <meshStandardMaterial color={primaryColor} roughness={0.38} />
          </mesh>
          {/* Pom-pom */}
          <mesh position={[-0.28, 1.94, -0.05]} castShadow>
            <sphereGeometry args={[0.11, 14, 14]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.7} />
          </mesh>
          {/* Cute Beard Puff */}
          <mesh position={[0, 0.8, 0.42]} scale={[1.15, 0.65, 0.55]}>
            <sphereGeometry args={[0.24, 16, 16]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.65} />
          </mesh>
          {/* Festive Belt & Gold Buckle */}
          <mesh position={[0, 0.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.47, 0.055, 10, 28]} />
            <meshStandardMaterial color="#1d2238" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.62, 0.48]}>
            <boxGeometry args={[0.18, 0.14, 0.06]} />
            <meshStandardMaterial color={accentColor} roughness={0.25} metalness={0.55} />
          </mesh>
        </group>
      );

    case 'reindeer':
      return (
        <group>
          {/* Left Antler */}
          <group position={[-0.24, 1.46, -0.02]} rotation={[0, 0, 0.35]}>
            <mesh position={[0, 0.18, 0]} castShadow>
              <capsuleGeometry args={[0.045, 0.3, 8, 12]} />
              <meshStandardMaterial color="#6e4226" roughness={0.5} />
            </mesh>
            <mesh position={[-0.1, 0.24, 0]} rotation={[0, 0, 0.72]} castShadow>
              <capsuleGeometry args={[0.035, 0.16, 8, 10]} />
              <meshStandardMaterial color="#6e4226" roughness={0.5} />
            </mesh>
            <mesh position={[0.09, 0.28, 0]} rotation={[0, 0, -0.65]} castShadow>
              <capsuleGeometry args={[0.032, 0.14, 8, 10]} />
              <meshStandardMaterial color="#6e4226" roughness={0.5} />
            </mesh>
          </group>
          {/* Right Antler */}
          <group position={[0.24, 1.46, -0.02]} rotation={[0, 0, -0.35]}>
            <mesh position={[0, 0.18, 0]} castShadow>
              <capsuleGeometry args={[0.045, 0.3, 8, 12]} />
              <meshStandardMaterial color="#6e4226" roughness={0.5} />
            </mesh>
            <mesh position={[0.1, 0.24, 0]} rotation={[0, 0, -0.72]} castShadow>
              <capsuleGeometry args={[0.035, 0.16, 8, 10]} />
              <meshStandardMaterial color="#6e4226" roughness={0.5} />
            </mesh>
            <mesh position={[-0.09, 0.28, 0]} rotation={[0, 0, 0.65]} castShadow>
              <capsuleGeometry args={[0.032, 0.14, 8, 10]} />
              <meshStandardMaterial color="#6e4226" roughness={0.5} />
            </mesh>
          </group>
          {/* Cute Ears */}
          <mesh position={[-0.42, 1.32, 0]} rotation={[0, 0, 0.6]} scale={[1.2, 0.65, 0.6]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={primaryColor} roughness={0.45} />
          </mesh>
          <mesh position={[0.42, 1.32, 0]} rotation={[0, 0, -0.6]} scale={[1.2, 0.65, 0.6]}>
            <sphereGeometry args={[0.12, 12, 12]} />
            <meshStandardMaterial color={primaryColor} roughness={0.45} />
          </mesh>
          {/* Glowing Ruby Nose */}
          <mesh position={[0, 1.03, 0.49]} castShadow>
            <sphereGeometry args={[0.095, 16, 16]} />
            <meshStandardMaterial
              color={accentColor}
              emissive={accentColor}
              emissiveIntensity={0.85}
              roughness={0.2}
            />
          </mesh>
          {/* Jingle Collar */}
          <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.05, 10, 24]} />
            <meshStandardMaterial color="#e63956" roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.68, 0.47]}>
            <sphereGeometry args={[0.085, 14, 14]} />
            <meshStandardMaterial color="#ffd56b" metalness={0.65} roughness={0.2} />
          </mesh>
        </group>
      );

    case 'snowman':
      return (
        <group>
          {/* Carrot Nose */}
          <mesh position={[0, 1.02, 0.54]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.07, 0.24, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.35} />
          </mesh>
          {/* Cozy Ice-Blue Scarf */}
          <mesh position={[0, 0.76, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.08, 12, 26]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.24, 0.54, 0.4]} rotation={[0.15, 0, -0.22]}>
            <boxGeometry args={[0.15, 0.34, 0.07]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.5} />
          </mesh>
          {/* Mini Top Hat */}
          <mesh position={[0, 1.44, 0]} rotation={[0.06, 0, -0.08]} castShadow>
            <cylinderGeometry args={[0.38, 0.38, 0.07, 22]} />
            <meshStandardMaterial color="#1f2847" roughness={0.45} />
          </mesh>
          <mesh position={[0.02, 1.66, 0]} rotation={[0.06, 0, -0.08]} castShadow>
            <cylinderGeometry args={[0.24, 0.26, 0.38, 22]} />
            <meshStandardMaterial color="#1f2847" roughness={0.45} />
          </mesh>
          <mesh position={[0.01, 1.51, 0]} rotation={[0.06, 0, -0.08]}>
            <cylinderGeometry args={[0.265, 0.265, 0.07, 22]} />
            <meshStandardMaterial color="#ff7eb6" roughness={0.35} />
          </mesh>
          {/* Coal Buttons */}
          <mesh position={[0, 0.58, 0.47]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#1f2847" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.42, 0.45]}>
            <sphereGeometry args={[0.045, 10, 10]} />
            <meshStandardMaterial color="#1f2847" roughness={0.5} />
          </mesh>
        </group>
      );

    case 'elf':
      return (
        <group>
          {/* Pointed Elf Hat */}
          <mesh position={[0, 1.4, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <torusGeometry args={[0.37, 0.075, 10, 24]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.35} />
          </mesh>
          <mesh position={[0.07, 1.72, -0.02]} rotation={[0.05, 0, -0.26]} castShadow>
            <coneGeometry args={[0.34, 0.72, 18]} />
            <meshStandardMaterial color={primaryColor} roughness={0.38} />
          </mesh>
          <mesh position={[0.2, 2.06, -0.04]} castShadow>
            <sphereGeometry args={[0.095, 14, 14]} />
            <meshStandardMaterial color={secondaryColor} metalness={0.55} roughness={0.22} />
          </mesh>
          {/* Pointy Elf Ears */}
          <mesh position={[-0.47, 1.12, 0.02]} rotation={[0, 0, 1.25]} castShadow>
            <coneGeometry args={[0.08, 0.24, 12]} />
            <meshStandardMaterial color="#ffdcc2" roughness={0.4} />
          </mesh>
          <mesh position={[0.47, 1.12, 0.02]} rotation={[0, 0, -1.25]} castShadow>
            <coneGeometry args={[0.08, 0.24, 12]} />
            <meshStandardMaterial color="#ffdcc2" roughness={0.4} />
          </mesh>
          {/* Festive Pink Collar */}
          <mesh position={[0, 0.74, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.45, 0.065, 10, 20]} />
            <meshStandardMaterial color={accentColor} roughness={0.35} />
          </mesh>
        </group>
      );

    case 'penguin':
      return (
        <group>
          {/* Cute Orange Beak */}
          <mesh position={[0, 0.99, 0.5]} rotation={[Math.PI / 2 + 0.12, 0, 0]} castShadow>
            <coneGeometry args={[0.1, 0.18, 12]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} />
          </mesh>
          {/* Pastel Pink Earmuffs */}
          <mesh position={[0, 1.26, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[0.44, 0.045, 10, 26, Math.PI]} />
            <meshStandardMaterial color="#a8e4ff" roughness={0.35} />
          </mesh>
          <mesh position={[-0.45, 1.18, 0]} castShadow>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color="#ff9ec7" roughness={0.5} />
          </mesh>
          <mesh position={[0.45, 1.18, 0]} castShadow>
            <sphereGeometry args={[0.14, 14, 14]} />
            <meshStandardMaterial color="#ff9ec7" roughness={0.5} />
          </mesh>
          {/* Mint Bow Tie */}
          <mesh position={[-0.09, 0.74, 0.46]} rotation={[0, 0, 0.25]}>
            <coneGeometry args={[0.07, 0.14, 10]} />
            <meshStandardMaterial color="#88f2cb" roughness={0.3} />
          </mesh>
          <mesh position={[0.09, 0.74, 0.46]} rotation={[0, 0, -0.25]}>
            <coneGeometry args={[0.07, 0.14, 10]} />
            <meshStandardMaterial color="#88f2cb" roughness={0.3} />
          </mesh>
        </group>
      );

    case 'gingerbread':
      return (
        <group>
          {/* White Frosting Crown */}
          <mesh position={[0, 1.38, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.34, 0.06, 10, 24]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.35} />
          </mesh>
          {/* Gumdrop Topper */}
          <mesh position={[0, 1.54, 0]} castShadow>
            <sphereGeometry args={[0.12, 14, 14]} />
            <meshStandardMaterial color="#ff6b9d" roughness={0.25} />
          </mesh>
          {/* Mint Bow Tie */}
          <mesh position={[-0.1, 0.75, 0.47]} rotation={[0, 0, 0.4]}>
            <boxGeometry args={[0.14, 0.09, 0.05]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} />
          </mesh>
          <mesh position={[0.1, 0.75, 0.47]} rotation={[0, 0, -0.4]}>
            <boxGeometry args={[0.14, 0.09, 0.05]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} />
          </mesh>
          {/* Pastel Gumdrop Buttons */}
          <mesh position={[0, 0.57, 0.48]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#ff9ec7" roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.4, 0.46]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#ffd56b" roughness={0.25} />
          </mesh>
        </group>
      );

    case 'polar_bear':
      return (
        <group>
          {/* Round Bear Ears */}
          <mesh position={[-0.31, 1.44, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={primaryColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.31, 1.44, 0.08]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#ffaad4" roughness={0.5} />
          </mesh>
          <mesh position={[0.31, 1.44, 0]} castShadow>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={primaryColor} roughness={0.5} />
          </mesh>
          <mesh position={[0.31, 1.44, 0.08]}>
            <sphereGeometry args={[0.08, 12, 12]} />
            <meshStandardMaterial color="#ffaad4" roughness={0.5} />
          </mesh>
          {/* Snout & Dark Button Nose */}
          <mesh position={[0, 0.99, 0.46]} scale={[1.15, 0.85, 0.8]}>
            <sphereGeometry args={[0.11, 14, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.45} />
          </mesh>
          <mesh position={[0, 1.03, 0.54]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#1f2847" roughness={0.3} />
          </mesh>
          {/* Lavender Knit Scarf */}
          <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.08, 12, 26]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.5} />
          </mesh>
          <mesh position={[-0.22, 0.54, 0.4]} rotation={[0.1, 0, 0.2]}>
            <boxGeometry args={[0.15, 0.34, 0.07]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.5} />
          </mesh>
        </group>
      );

    case 'christmas_tree':
      return (
        <group>
          {/* Layered Pine Tree Crown */}
          <mesh position={[0, 1.48, 0]} castShadow>
            <coneGeometry args={[0.44, 0.42, 16]} />
            <meshStandardMaterial color="#258f5e" roughness={0.42} />
          </mesh>
          <mesh position={[0, 1.74, 0]} castShadow>
            <coneGeometry args={[0.32, 0.42, 16]} />
            <meshStandardMaterial color={primaryColor} roughness={0.42} />
          </mesh>
          {/* Glowing Golden Star Topper */}
          <mesh position={[0, 2.02, 0]} castShadow>
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial
              color={secondaryColor}
              emissive={secondaryColor}
              emissiveIntensity={0.8}
              roughness={0.2}
              metalness={0.4}
            />
          </mesh>
          {/* Colorful Mini Ornaments */}
          <mesh position={[0.28, 1.42, 0.2]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.4} />
          </mesh>
          <mesh position={[-0.26, 1.44, 0.22]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#a8e4ff" emissive="#a8e4ff" emissiveIntensity={0.45} />
          </mesh>
          <mesh position={[0, 1.65, 0.22]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={secondaryColor} emissive={secondaryColor} emissiveIntensity={0.5} />
          </mesh>
        </group>
      );

    case 'candy':
      return (
        <group>
          {/* Peppermint Swirl Beret */}
          <mesh position={[0, 1.48, 0]} rotation={[0.16, 0, -0.18]} castShadow>
            <cylinderGeometry args={[0.34, 0.34, 0.14, 24]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.5, 0]} rotation={[0.16, 0, -0.18]}>
            <torusGeometry args={[0.24, 0.055, 10, 24]} />
            <meshStandardMaterial color={primaryColor} roughness={0.25} />
          </mesh>
          <mesh position={[0, 1.56, 0]} castShadow>
            <sphereGeometry args={[0.09, 14, 14]} />
            <meshStandardMaterial color={accentColor} roughness={0.25} />
          </mesh>
          {/* Cute Mint Ribbon Sash */}
          <mesh position={[0, 0.72, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.06, 10, 24]} />
            <meshStandardMaterial color={accentColor} roughness={0.3} />
          </mesh>
          {/* Twin Sugar Pearls */}
          <mesh position={[-0.16, 0.54, 0.45]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.2} />
          </mesh>
          <mesh position={[0.16, 0.54, 0.45]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial color={secondaryColor} roughness={0.2} />
          </mesh>
        </group>
      );

    case 'star':
      return (
        <group>
          {/* Floating Halo Ring */}
          <mesh position={[0, 1.62, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.34, 0.04, 10, 28]} />
            <meshStandardMaterial
              color="#fff4c2"
              emissive="#ffd56b"
              emissiveIntensity={0.85}
              roughness={0.2}
            />
          </mesh>
          {/* Floating Star Crest */}
          <mesh position={[0, 1.72, 0]} castShadow>
            <octahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial
              color="#ffd56b"
              emissive="#ffd56b"
              emissiveIntensity={0.95}
              roughness={0.18}
              metalness={0.35}
            />
          </mesh>
          {/* Pastel Purple Cape Collar */}
          <mesh position={[0, 0.76, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.46, 0.075, 10, 24]} />
            <meshStandardMaterial color={accentColor} roughness={0.35} />
          </mesh>
          <mesh position={[0, 0.74, 0.47]}>
            <octahedronGeometry args={[0.08, 0]} />
            <meshStandardMaterial color="#a8e4ff" emissive="#72d2ff" emissiveIntensity={0.65} />
          </mesh>
        </group>
      );
  }
}

export function FantasyCharacter({
  variantId,
  name,
  targetPosition,
  targetRotationY,
  animationState = 'idle',
  phaseOffset = 0,
  scale = 1,
  showLabel = true,
  labelBadge = null,
  highlightIntensity = 0,
  onClick,
}: FantasyCharacterProps) {
  const variant = useMemo(() => getCharacterVariant(variantId), [variantId]);

  const outerRef = useRef<THREE.Group>(null);
  const bodyBounceRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const currentPos = useRef(new THREE.Vector3(...targetPosition));
  const initializedRef = useRef(false);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const elapsed = state.clock.elapsedTime;

    if (!initializedRef.current) {
      currentPos.current.set(...targetPosition);
      if (outerRef.current) {
        outerRef.current.position.copy(currentPos.current);
        outerRef.current.rotation.y = targetRotationY;
      }
      initializedRef.current = true;
    }

    // Smoothly interpolate character movement between circle and center stage
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetPosition[0], dt * 5.2);
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetPosition[1], dt * 5.2);
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetPosition[2], dt * 5.2);

    const motion = sampleCharacterMotion(elapsed, phaseOffset, animationState);

    if (outerRef.current) {
      outerRef.current.position.copy(currentPos.current);
      // Shortest-angle lerp for smooth turning
      const currentYaw = outerRef.current.rotation.y;
      let diff = targetRotationY + motion.rotYOffset - currentYaw;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      outerRef.current.rotation.y = currentYaw + diff * Math.min(1, dt * 6.5);
    }

    if (bodyBounceRef.current) {
      bodyBounceRef.current.position.y = motion.posY;
      bodyBounceRef.current.rotation.z = motion.rotZ;
      bodyBounceRef.current.rotation.x = motion.headNodX;
      bodyBounceRef.current.scale.set(
        motion.scaleX * scale,
        motion.scaleY * scale,
        motion.scaleZ * scale,
      );
    }

    if (leftArmRef.current) {
      leftArmRef.current.rotation.z = motion.leftArmZ;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.z = motion.rightArmZ;
    }
    if (leftLegRef.current) {
      leftLegRef.current.rotation.x = motion.leftLegX;
    }
    if (rightLegRef.current) {
      rightLegRef.current.rotation.x = motion.rightLegX;
    }
    if (leftEyeRef.current) {
      leftEyeRef.current.scale.y = motion.blinkScaleY;
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.scale.y = motion.blinkScaleY;
    }

    if (ringRef.current) {
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      const isLit =
        highlightIntensity > 0 ||
        animationState === 'highlighted' ||
        animationState === 'giver_center' ||
        animationState === 'recipient_reveal' ||
        animationState === 'celebrate';
      const pulse = 0.7 + Math.sin(elapsed * 8) * 0.3;
      const targetOpacity = isLit ? Math.max(0.55, highlightIntensity) * pulse : 0.12;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOpacity, dt * 10);
      const ringScale = isLit ? 1.08 + Math.sin(elapsed * 7) * 0.08 : 0.85;
      ringRef.current.scale.setScalar(ringScale * scale);
    }
  });

  const isHighlighted =
    animationState === 'highlighted' ||
    animationState === 'recipient_reveal' ||
    animationState === 'celebrate' ||
    highlightIntensity > 0.3;

  const isMuted = animationState === 'assigned_muted';

  return (
    <group ref={outerRef} onClick={onClick}>
      {/* Glowing Base Selection Ring */}
      <mesh ref={ringRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 0.72, 32]} />
        <meshBasicMaterial
          color={
            labelBadge === 'giver'
              ? '#ffd56b'
              : labelBadge === 'recipient'
                ? '#ff9ec7'
                : variant.emissiveColor
          }
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Animated Bean Character Rig */}
      <group ref={bodyBounceRef} scale={scale}>
        {/* Main Bean Body */}
        <mesh position={[0, 0.85, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.45, 0.56, 16, 28]} />
          <meshStandardMaterial
            color={variant.primaryColor}
            roughness={0.34}
            metalness={0.06}
            emissive={isHighlighted ? variant.emissiveColor : '#000000'}
            emissiveIntensity={isHighlighted ? 0.32 : 0}
            opacity={isMuted ? 0.85 : 1}
          />
        </mesh>

        {/* Soft Belly Patch */}
        <mesh position={[0, 0.62, 0.33]} scale={[0.72, 0.78, 0.45]} receiveShadow>
          <sphereGeometry args={[0.38, 18, 18]} />
          <meshStandardMaterial color={variant.bellyColor} roughness={0.45} />
        </mesh>

        {/* Fall Guys-style Inset Oval Face Plate */}
        <mesh position={[0, 1.08, 0.36]} scale={[0.92, 0.78, 0.42]}>
          <sphereGeometry args={[0.33, 20, 20]} />
          <meshStandardMaterial
            color={variantId === 'gingerbread' ? '#d99252' : '#fff5ec'}
            roughness={0.42}
          />
        </mesh>

        {/* Large Expressive Eyes + White Specular Catchlights */}
        <mesh ref={leftEyeRef} position={[-0.125, 1.13, 0.49]} scale={[0.85, 1.15, 0.65]}>
          <sphereGeometry args={[0.062, 14, 14]} />
          <meshStandardMaterial color="#14182b" roughness={0.12} metalness={0.25} />
        </mesh>
        <mesh position={[-0.105, 1.16, 0.525]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        <mesh ref={rightEyeRef} position={[0.125, 1.13, 0.49]} scale={[0.85, 1.15, 0.65]}>
          <sphereGeometry args={[0.062, 14, 14]} />
          <meshStandardMaterial color="#14182b" roughness={0.12} metalness={0.25} />
        </mesh>
        <mesh position={[0.145, 1.16, 0.525]}>
          <sphereGeometry args={[0.02, 10, 10]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>

        {/* Rosy Cheeks */}
        <mesh position={[-0.21, 1.03, 0.46]} scale={[1.2, 0.75, 0.5]}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={variant.cheekColor} roughness={0.5} />
        </mesh>
        <mesh position={[0.21, 1.03, 0.46]} scale={[1.2, 0.75, 0.5]}>
          <sphereGeometry args={[0.048, 12, 12]} />
          <meshStandardMaterial color={variant.cheekColor} roughness={0.5} />
        </mesh>

        {/* Cute Small Curved Smile */}
        <mesh position={[0, 0.99, 0.485]} rotation={[0.15, 0, Math.PI]}>
          <torusGeometry args={[0.055, 0.015, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#3c2a3e" roughness={0.4} />
        </mesh>

        {/* Short Rounded Arms */}
        <group ref={leftArmRef} position={[-0.47, 0.82, 0.04]}>
          <mesh position={[-0.08, -0.14, 0]} rotation={[0, 0, 0.25]} castShadow>
            <capsuleGeometry args={[0.11, 0.2, 10, 14]} />
            <meshStandardMaterial color={variant.primaryColor} roughness={0.36} />
          </mesh>
        </group>

        <group ref={rightArmRef} position={[0.47, 0.82, 0.04]}>
          <mesh position={[0.08, -0.14, 0]} rotation={[0, 0, -0.25]} castShadow>
            <capsuleGeometry args={[0.11, 0.2, 10, 14]} />
            <meshStandardMaterial color={variant.primaryColor} roughness={0.36} />
          </mesh>
        </group>

        {/* Short Stubby Legs */}
        <group ref={leftLegRef} position={[-0.18, 0.34, 0]}>
          <mesh position={[0, -0.16, 0.03]} castShadow>
            <capsuleGeometry args={[0.125, 0.16, 10, 14]} />
            <meshStandardMaterial color={variant.primaryColor} roughness={0.38} />
          </mesh>
        </group>

        <group ref={rightLegRef} position={[0.18, 0.34, 0]}>
          <mesh position={[0, -0.16, 0.03]} castShadow>
            <capsuleGeometry args={[0.125, 0.16, 10, 14]} />
            <meshStandardMaterial color={variant.primaryColor} roughness={0.38} />
          </mesh>
        </group>

        {/* Variant-Specific Festive Accessories */}
        <CharacterAccessory
          variantId={variantId}
          primaryColor={variant.primaryColor}
          secondaryColor={variant.secondaryColor}
          accentColor={variant.accentColor}
        />

        {/* Floating Name Label */}
        {showLabel && name && (
          <Html
            position={[0, 2.26, 0]}
            center
            zIndexRange={[10, 0]}
            style={{ pointerEvents: 'none' }}
          >
            <div
              className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide shadow-md backdrop-blur-md transition-all duration-300 ${
                labelBadge === 'giver'
                  ? 'border border-pastel-gold bg-navy-900/90 text-pastel-gold shadow-gold'
                  : labelBadge === 'recipient'
                    ? 'border border-pastel-pink bg-navy-900/95 text-pastel-pink shadow-glow'
                    : labelBadge === 'selected'
                      ? 'border border-ice-300 bg-navy-800/95 text-white scale-105'
                      : labelBadge === 'done'
                        ? 'border border-white/15 bg-navy-950/60 text-white/50'
                        : 'border border-ice-300/30 bg-navy-900/75 text-white'
              }`}
            >
              {labelBadge === 'giver' && <span className="mr-1">🎁</span>}
              {labelBadge === 'recipient' && <span className="mr-1">✨</span>}
              {labelBadge === 'done' && <span className="mr-1">✓</span>}
              {name}
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}
