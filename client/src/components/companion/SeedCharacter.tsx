import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { AccentToken } from '../../features/companion/companionState'
import type { MotionParams, PoseVisual, GestureId } from './poseTargets'
import { accentHex } from './poseTargets'

const MOSS = new THREE.Color('#5f7a52')
const MOSS_MUTED = new THREE.Color('#8a9a7e')
const INK = '#1a2420'
const EYE = '#f3f4ef'
const SWEAT_TINT = new THREE.Color('#dfeef2')
const TORSO_Y = 0.95
const FACE_Z = 0.37

type Props = {
  /** Target pose (3004 static equivalents — reduced motion lands exactly here). */
  visual: PoseVisual
  motion: MotionParams
  reduceMotion: boolean
  /** Starting values on mount: mannequin for fresh load (Motion Rules "from neutral once"). */
  initialVisual: PoseVisual
  gesture: GestureId
}

type Channels = {
  opacity: number
  torsoX: number
  torsoY: number
  torsoZ: number
  armSpread: number
  armReachZ: number
  armLift: number
  legSpread: number
  leanZ: number
  eyeScale: number
  eyeOpen: number
  mouthCurve: number
  mouthOpen: number
  sweat: number
  accent: number
}

function channelsFrom(v: PoseVisual, m: { sweatIntensity: number; accentIntensity: number }): Channels {
  return {
    opacity: v.opacity,
    torsoX: v.torsoScale[0],
    torsoY: v.torsoScale[1],
    torsoZ: v.torsoScale[2],
    armSpread: v.armSpread,
    armReachZ: v.armReachZ,
    armLift: v.armLift,
    legSpread: v.legSpread,
    leanZ: v.leanZ,
    eyeScale: v.eyeScale,
    eyeOpen: v.eyeOpen,
    mouthCurve: v.mouthCurve,
    mouthOpen: v.mouthOpen,
    sweat: m.sweatIntensity,
    accent: m.accentIntensity,
  }
}

/**
 * Soft seed character with the 3005 layered animation system:
 * damped transitions from the previously displayed state + procedural breath/idle/sweat.
 */
export function SeedCharacter({ visual, motion, reduceMotion, initialVisual, gesture }: Props) {
  const group = useRef<THREE.Group>(null)
  const head = useRef<THREE.Mesh>(null)
  const torso = useRef<THREE.Mesh>(null)
  const sheen = useRef<THREE.Mesh>(null)
  const eyeL = useRef<THREE.Mesh>(null)
  const eyeR = useRef<THREE.Mesh>(null)
  const mouth = useRef<THREE.Mesh>(null)
  const armL = useRef<THREE.Mesh>(null)
  const armR = useRef<THREE.Mesh>(null)
  const legL = useRef<THREE.Mesh>(null)
  const legR = useRef<THREE.Mesh>(null)
  const footL = useRef<THREE.Mesh>(null)
  const footR = useRef<THREE.Mesh>(null)
  const accentMesh = useRef<THREE.Mesh>(null)

  const skinMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: MOSS.clone(),
        roughness: 0.88,
        transparent: true,
        opacity: initialVisual.opacity,
      }),
    // Material is a stable instance; opacity/colour are driven per-frame.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const inkMat = useMemo(() => new THREE.MeshStandardMaterial({ color: INK, roughness: 0.7 }), [])
  const eyeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: EYE,
        roughness: 0.55,
        emissive: EYE,
        emissiveIntensity: 0.12,
      }),
    [],
  )
  const sheenMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SWEAT_TINT.clone(),
        roughness: 0.35,
        transparent: true,
        opacity: 0,
        depthWrite: false,
      }),
    [],
  )
  const accentMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#ddf38a',
        emissive: '#ddf38a',
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: 0,
      }),
    [],
  )

  useEffect(() => {
    return () => {
      skinMat.dispose()
      inkMat.dispose()
      eyeMat.dispose()
      sheenMat.dispose()
      accentMat.dispose()
    }
  }, [skinMat, inkMat, eyeMat, sheenMat, accentMat])

  const cur = useRef<Channels>(
    channelsFrom(initialVisual, { sweatIntensity: 0, accentIntensity: 0 }),
  )
  // Last non-'none' accent so the glow fades out in its own colour.
  const accentColorTarget = useRef<AccentToken>('lime')
  const gestureClock = useRef(0)

  if (visual.accent !== 'none') accentColorTarget.current = visual.accent

  useEffect(() => {
    gestureClock.current = 0
  }, [gesture])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const c = cur.current
    const target = channelsFrom(visual, motion)

    const step = (from: number, to: number) =>
      reduceMotion ? to : THREE.MathUtils.damp(from, to, motion.transitionSpeed, delta)

    for (const key of Object.keys(target) as (keyof Channels)[]) {
      c[key] = step(c[key], target[key])
    }

    // Oscillators (suppressed under reduced motion → exact static 3004 pose).
    const breath = reduceMotion
      ? 0
      : Math.sin(t * motion.breathRate * Math.PI * 2) * motion.breathAmplitude
    const sway = reduceMotion
      ? 0
      : Math.sin(t * motion.idleSwaySpeed * Math.PI * 2) * motion.idleSwayAmplitude
    const sweatPulse = reduceMotion ? 0 : (Math.sin(t * 1.4) + 1) * 0.04

    let extraReach = 0
    let extraLift = 0
    let extraSmile = 0
    if (!reduceMotion && gesture !== 'none') {
      gestureClock.current += delta
      const u = Math.min(1, gestureClock.current / 0.7)
      const envelope = Math.sin(u * Math.PI)
      if (gesture === 'hand-to-torso') extraReach = envelope * 0.1
      if (gesture === 'recovery-stretch') extraLift = envelope * 0.22
      if (gesture === 'pleased-pulse') extraSmile = envelope * 0.22
    }

    if (group.current) {
      group.current.position.z = c.leanZ
      group.current.rotation.z = sway
    }
    if (head.current) {
      head.current.scale.set(c.torsoX * (1 + breath * 0.5), c.torsoY * (1 + breath), c.torsoZ * (1 + breath * 0.5))
    }
    if (torso.current) {
      torso.current.scale.set(c.torsoX * (1 + breath), c.torsoY * (1 + breath * 0.6), c.torsoZ * (1 + breath))
    }
    if (sheen.current) {
      sheen.current.scale.copy(torso.current ? torso.current.scale : sheen.current.scale).multiplyScalar(1.03)
    }
    if (eyeL.current) eyeL.current.scale.set(c.eyeScale, c.eyeOpen * c.eyeScale, c.eyeScale)
    if (eyeR.current) eyeR.current.scale.set(c.eyeScale, c.eyeOpen * c.eyeScale, c.eyeScale)
    if (mouth.current) {
      mouth.current.rotation.z = (c.mouthCurve + extraSmile) * 0.35
      mouth.current.scale.set(0.18 + c.mouthOpen * 0.05, 0.035 + c.mouthOpen * 0.05, 0.03)
    }
    if (armL.current) {
      armL.current.position.set(-c.armSpread, TORSO_Y - 0.05 + c.armLift + extraLift, c.armReachZ + extraReach)
      armL.current.rotation.set((c.armReachZ + extraReach) * 1.2, 0, 0.2 + c.armLift + extraLift)
    }
    if (armR.current) {
      armR.current.position.set(c.armSpread, TORSO_Y - 0.05 + c.armLift + extraLift * 0.4, c.armReachZ + extraReach)
      armR.current.rotation.set((c.armReachZ + extraReach) * 1.2, 0, -0.2 - c.armLift - extraLift * 0.4)
    }
    if (legL.current) legL.current.position.x = -c.legSpread
    if (legR.current) legR.current.position.x = c.legSpread
    if (footL.current) footL.current.position.x = -c.legSpread
    if (footR.current) footR.current.position.x = c.legSpread

    // Saturation drop for mannequin (3006 §5): lerp skin between muted and full moss.
    const vitality = THREE.MathUtils.clamp((c.opacity - 0.7) / 0.3, 0, 1)
    skinMat.color.copy(MOSS_MUTED).lerp(MOSS, vitality)
    skinMat.opacity = c.opacity

    sheenMat.opacity = c.sweat * (0.1 + sweatPulse)

    const accentColor = accentHex(accentColorTarget.current)
    if (accentColor) {
      accentMat.color.set(accentColor)
      accentMat.emissive.set(accentColor)
    }
    accentMat.opacity = c.accent * c.opacity
    if (accentMesh.current) accentMesh.current.visible = accentMat.opacity > 0.02
  })

  return (
    <group ref={group}>
      <mesh ref={head} position={[0, TORSO_Y + 0.55, 0]} material={skinMat}>
        <sphereGeometry args={[0.38, 24, 24]} />
      </mesh>
      <mesh ref={torso} position={[0, TORSO_Y, 0]} material={skinMat}>
        <capsuleGeometry args={[0.28, 0.55, 8, 16]} />
      </mesh>
      {/* sweat sheen shell over the torso */}
      <mesh ref={sheen} position={[0, TORSO_Y, 0]} material={sheenMat}>
        <capsuleGeometry args={[0.285, 0.55, 8, 16]} />
      </mesh>

      <mesh ref={eyeL} position={[-0.13, TORSO_Y + 0.64, FACE_Z]} material={eyeMat}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>
      <mesh ref={eyeR} position={[0.13, TORSO_Y + 0.64, FACE_Z]} material={eyeMat}>
        <sphereGeometry args={[0.07, 16, 16]} />
      </mesh>
      {/* pupils for readable contrast at small dashboard size */}
      <mesh position={[-0.13, TORSO_Y + 0.64, FACE_Z + 0.045]} material={inkMat}>
        <sphereGeometry args={[0.032, 12, 12]} />
      </mesh>
      <mesh position={[0.13, TORSO_Y + 0.64, FACE_Z + 0.045]} material={inkMat}>
        <sphereGeometry args={[0.032, 12, 12]} />
      </mesh>
      <mesh ref={mouth} position={[0, TORSO_Y + 0.5, FACE_Z + 0.01]} material={inkMat}>
        <boxGeometry args={[1, 1, 1]} />
      </mesh>

      <mesh ref={armL} material={skinMat}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
      </mesh>
      <mesh ref={armR} material={skinMat}>
        <capsuleGeometry args={[0.09, 0.35, 6, 12]} />
      </mesh>

      <mesh ref={legL} position={[-0.18, 0.35, 0]} material={skinMat}>
        <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
      </mesh>
      <mesh ref={legR} position={[0.18, 0.35, 0]} material={skinMat}>
        <capsuleGeometry args={[0.1, 0.4, 6, 12]} />
      </mesh>
      <mesh ref={footL} position={[-0.18, 0.06, 0.04]} scale={[1.1, 0.45, 1.3]} material={skinMat}>
        <sphereGeometry args={[0.12, 12, 12]} />
      </mesh>
      <mesh ref={footR} position={[0.18, 0.06, 0.04]} scale={[1.1, 0.45, 1.3]} material={skinMat}>
        <sphereGeometry args={[0.12, 12, 12]} />
      </mesh>

      <mesh ref={accentMesh} position={[0.16, TORSO_Y + 0.58, 0.28]} material={accentMat}>
        <sphereGeometry args={[0.05, 12, 12]} />
      </mesh>
    </group>
  )
}
