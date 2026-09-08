import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import type { ResolvedBehaviour } from '../../features/companion/companionState'
import {
  MANNEQUIN_VISUAL,
  motionParamsFromBehaviour,
  poseVisualFromBehaviour,
  type GestureId,
  type PoseVisual,
  type TransitionKind,
} from './poseTargets'
import { SeedCharacter } from './SeedCharacter'

type Props = {
  behaviour: ResolvedBehaviour
  reduceMotion: boolean
  transitionKind: TransitionKind
  gesture: GestureId
}

/** Lazy-loaded R3F canvas — keep Three.js out of the main companion shell chunk. */
export default function CompanionCanvas({
  behaviour,
  reduceMotion,
  transitionKind,
  gesture,
}: Props) {
  const visual = poseVisualFromBehaviour(behaviour)
  const motion = motionParamsFromBehaviour(behaviour, transitionKind)

  // Fresh load animates from mannequin/neutral once; reduced motion starts at the target pose.
  // Later updates keep SeedCharacter mounted so channels blend from the previous state.
  const initialVisual = useRef<PoseVisual>(reduceMotion ? visual : MANNEQUIN_VISUAL)

  return (
    <Canvas
      camera={{ position: [0, 0.95, 3.4], fov: 35 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
      frameloop="always"
      aria-hidden
      onCreated={({ camera }) => {
        // Character stands on y≈0 with head near y≈1.5; look at mid-body so the full figure fits.
        camera.lookAt(0, 0.9, 0)
      }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[2.4, 4, 2]} intensity={1.05} />
      <SeedCharacter
        visual={visual}
        motion={motion}
        reduceMotion={reduceMotion}
        initialVisual={initialVisual.current}
        gesture={reduceMotion ? 'none' : gesture}
      />
    </Canvas>
  )
}
