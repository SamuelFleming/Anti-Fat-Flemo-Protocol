/** Shared polar-to-arc math for `DailyTargetGauge`'s ~300° instrument. */

export const GAUGE_START_ANGLE = 210
export const GAUGE_SWEEP_DEGREES = 300
export const GAUGE_END_ANGLE = GAUGE_START_ANGLE + GAUGE_SWEEP_DEGREES // 510 (=150 mod 360)

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg * Math.PI) / 180
  return {
    x: cx + r * Math.sin(angleRad),
    y: cy - r * Math.cos(angleRad),
  }
}

/** Describes an SVG arc path from `startAngle` sweeping `sweepDeg` clockwise. */
export function describeArc(cx: number, cy: number, r: number, startAngle: number, sweepDeg: number): string {
  if (sweepDeg <= 0) return ''
  const clampedSweep = Math.min(sweepDeg, 359.999)
  const endAngle = startAngle + clampedSweep
  const start = polarToCartesian(cx, cy, r, startAngle)
  const end = polarToCartesian(cx, cy, r, endAngle)
  const largeArcFlag = clampedSweep > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`
}
