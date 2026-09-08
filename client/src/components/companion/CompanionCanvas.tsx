import { Canvas } from '@react-three/fiber'
import type { ResolvedBehaviour } from '../../features/companion/companionState'
import { poseVisualFromBehaviour } from './poseTargets'
import { SeedCharacter } from './SeedCharacter'

type Props = {
  behaviour: ResolvedBehaviour
}

/** Lazy-loaded R3F canvas — keep Three.js out of the main companion shell chunk. */
export default function CompanionCanvas({ behaviour }: Props) {
  const visual = poseVisualFromBehaviour(behaviour)

  return (
    <Canvas
      camera={{ position: [0, 1.05, 3.1], fov: 35 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
      aria-hidden
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[2.4, 4, 2]} intensity={1.05} />
      <SeedCharacter visual={visual} />
    </Canvas>
  )
}
