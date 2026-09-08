import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { SpikePoseId } from './CompanionSpikePage'

type Props = {
  pose: SpikePoseId
}

/** Lazy-loaded R3F scene — keep this module free of app routing/state. */
export default function SpikeCanvas({ pose }: Props) {
  return (
    <Canvas camera={{ position: [0, 1.1, 3.2], fov: 35 }} dpr={[1, 1.75]}>
      <color attach="background" args={['#f3efe6']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[2.5, 4, 2]} intensity={1.1} />
      <SeedCharacter pose={pose} />
      <OrbitControls enablePan={false} minDistance={2.2} maxDistance={4.5} target={[0, 0.9, 0]} />
    </Canvas>
  )
}

function SeedCharacter({ pose }: { pose: SpikePoseId }) {
  const mannequin = pose === 'mannequin'
  const torsoY = mannequin ? 0.95 : 1.0
  const torsoScale: [number, number, number] = mannequin ? [1, 1, 1] : [1.08, 1.05, 1.08]
  const armSpread = mannequin ? 0.42 : 0.62
  const legSpread = mannequin ? 0.18 : 0.28
  const color = mannequin ? '#7a8f6a' : '#5f7a52'
  const opacity = mannequin ? 0.72 : 1

  return (
    <group position={[0, 0, 0]}>
      {/* head/torso fused mass */}
      <mesh position={[0, torsoY + 0.55, 0]} scale={torsoScale}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, torsoY, 0]} scale={torsoScale}>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>

      {/* eyes */}
      <mesh position={[-0.12, torsoY + 0.62, 0.32]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#1f2a1c" />
      </mesh>
      <mesh position={[0.12, torsoY + 0.62, 0.32]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color="#1f2a1c" />
      </mesh>

      {/* arms */}
      <mesh position={[-armSpread, torsoY - 0.05, 0]} rotation={[0, 0, mannequin ? 0.15 : 0.55]}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>
      <mesh position={[armSpread, torsoY - 0.05, 0]} rotation={[0, 0, mannequin ? -0.15 : -0.55]}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>

      {/* legs */}
      <mesh position={[-legSpread, 0.35, 0]}>
        <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>
      <mesh position={[legSpread, 0.35, 0]}>
        <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>

      {/* feet */}
      <mesh position={[-legSpread, 0.06, 0.04]} scale={[1.1, 0.45, 1.3]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>
      <mesh position={[legSpread, 0.06, 0.04]} scale={[1.1, 0.45, 1.3]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>

      {/* exertion accent (lavender cue) */}
      {!mannequin ? (
        <mesh position={[0, torsoY + 0.85, 0.1]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color="#9b8ec4" emissive="#9b8ec4" emissiveIntensity={0.35} />
        </mesh>
      ) : null}
    </group>
  )
}
