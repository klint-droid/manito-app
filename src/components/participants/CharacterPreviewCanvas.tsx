import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FantasyCharacter } from '../../three/components/FantasyCharacter';
import type { CharacterAnimationState, CharacterVariantId } from '../../types/character';

interface CharacterPreviewCanvasProps {
  variantId: CharacterVariantId;
  label?: string;
  animationState?: CharacterAnimationState;
  heightClass?: string;
}

export function CharacterPreviewCanvas({
  variantId,
  label,
  animationState = 'giver_center',
  heightClass = 'h-64',
}: CharacterPreviewCanvasProps) {
  return (
    <div className={`relative w-full overflow-hidden rounded-3xl ${heightClass}`}>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 1.85, 4.85], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.85} color="#dbeeff" />
        <directionalLight position={[4, 6, 5]} intensity={1.35} color="#fff5e6" />
        <pointLight position={[-3, 2.5, -2]} intensity={1.1} color="#b993ff" />
        <pointLight position={[3, 2.5, 2]} intensity={0.85} color="#ff9ec7" />

        {/* Small floating frosty snow pedestal */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[1.05, 0.9, 0.22, 32]} />
          <meshStandardMaterial color="#e6f4ff" roughness={0.65} />
        </mesh>
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.92, 0.65, 0.2, 24]} />
          <meshStandardMaterial color="#1d2c63" roughness={0.5} />
        </mesh>

        <FantasyCharacter
          variantId={variantId}
          name={label}
          targetPosition={[0, 0.03, 0]}
          targetRotationY={0.12}
          animationState={animationState}
          scale={0.96}
          showLabel={Boolean(label)}
        />

        <OrbitControls
          target={[0, 1.05, 0]}
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1.6}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 2.05}
        />
      </Canvas>
    </div>
  );
}
