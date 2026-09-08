import type { PoseVisual } from './poseTargets'
import { accentHex } from './poseTargets'

const MOSS = '#5f7a52'
const MOSS_MUTED = '#8a9a7e'
const INK = '#1f2a1c'

type Props = {
  visual: PoseVisual
}

/** Soft seed/pebble character — static transforms only (animation in 3010). */
export function SeedCharacter({ visual }: Props) {
  const {
    opacity,
    torsoScale,
    armSpread,
    armReachZ,
    armLift,
    legSpread,
    leanZ,
    eyeScale,
    eyeOpen,
    mouthCurve,
    mouthOpen,
    accent,
  } = visual

  const skin = opacity < 0.85 ? MOSS_MUTED : MOSS
  const torsoY = 0.95
  const accentColor = accentHex(accent)

  return (
    <group position={[0, 0, leanZ]}>
      <mesh position={[0, torsoY + 0.55, 0]} scale={torsoScale}>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, torsoY, 0]} scale={torsoScale}>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>

      {/* eyes */}
      <mesh position={[-0.12, torsoY + 0.62, 0.32]} scale={[eyeScale, eyeOpen * eyeScale, eyeScale]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={INK} />
      </mesh>
      <mesh position={[0.12, torsoY + 0.62, 0.32]} scale={[eyeScale, eyeOpen * eyeScale, eyeScale]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial color={INK} />
      </mesh>

      {/* simple mouth bar */}
      <mesh
        position={[0, torsoY + 0.48, 0.34]}
        rotation={[0, 0, mouthCurve * 0.35]}
        scale={[0.12 + mouthOpen * 0.04, 0.02 + mouthOpen * 0.04, 0.02]}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={INK} />
      </mesh>

      {/* arms */}
      <mesh
        position={[-armSpread, torsoY - 0.05 + armLift, armReachZ]}
        rotation={[armReachZ * 1.2, 0, 0.2 + armLift]}
      >
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>
      <mesh
        position={[armSpread, torsoY - 0.05 + armLift, armReachZ]}
        rotation={[armReachZ * 1.2, 0, -0.2 - armLift]}
      >
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>

      {/* legs + feet */}
      <mesh position={[-legSpread, 0.35, 0]}>
        <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>
      <mesh position={[legSpread, 0.35, 0]}>
        <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-legSpread, 0.06, 0.04]} scale={[1.1, 0.45, 1.3]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>
      <mesh position={[legSpread, 0.06, 0.04]} scale={[1.1, 0.45, 1.3]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color={skin} roughness={0.88} transparent opacity={opacity} />
      </mesh>

      {accentColor ? (
        <mesh position={[0.16, torsoY + 0.58, 0.28]}>
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.3}
            transparent
            opacity={opacity}
          />
        </mesh>
      ) : null}
    </group>
  )
}
