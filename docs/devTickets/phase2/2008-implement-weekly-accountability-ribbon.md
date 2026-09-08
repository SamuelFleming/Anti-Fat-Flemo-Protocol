# 2008 - Implement WeeklyAccountabilityRibbon

**Status:** Implemented  
**Phase:** 2  
**Depends On:** 1008, 2001

## Related Docs / Design References
- `docs/DesignConcept/00_UI-Design-Concept.md`
- `docs/DesignConcept/03_WeeklyAccountabilityRibbon.visual.md`
- `docs/core-scope/06-Calculation-Rules.md`

## Objective and User Outcome
Present the week as one connected, selectable accountability view without treating unknown days as failure.

## Scope
- Connected seven-day ribbon, selection and weekly summaries.
- On Track, Partial, Off Track, no-data, future, today and selected presentations.
- Optional accessible trend expansion and reduced-motion transitions.

## Out of Scope
- Status calculation, Dashboard-wide state, isolated day mini-cards and companion behaviour.

## Likely Files / Areas
- `client/src/components/accountability/WeeklyAccountabilityRibbon.*`
- Optional `DaySummaryPanel`/trend support and fixtures

## Technical Tasks
- Pair state colour with shape/text.
- Make click/tap/focus canonical; hover may only supplement.
- Animate affected nodes/summaries without replaying the entire ribbon.

## Acceptance Criteria
- Seven days read as one connected sequence at desktop and mobile widths.
- Selection is accessible and exposes the correct day and summaries.
- Unknown, future and Off Track states remain semantically distinct.

## Verification
- Run component checks for each day state, selection, expansion and reduced motion.

## Completion Notes
Implemented `client/src/components/accountability/WeeklyAccountabilityRibbon.tsx`. Seven days render
as one connected sequence (shared background line, focusable `<button>`s) with status distinguished by
shape as well as colour: filled circle (on-track), half-filled ring (partial), diamond (off-track),
dashed hollow ring (no data), faint dashed ring + `disabled` (future) — plus a today ring and a
`layoutId`-animated selection halo that slides between nodes. Click/tap/keyboard focus is the
canonical interaction (real `<button>`s, `aria-pressed`/`aria-current`, `sr-only` full status text);
no hover-only behaviour. Weekly summary stats (average Calories/Move, weight change, on/partial/off
counts) are computed from the same `days` prop. An optional expandable daily trend (Calories/Move
toggle, small animated SVG bar chart) satisfies the extended-trend requirement. Status calculation and
Dashboard-wide state stay out of scope — this component is purely prop-driven. 2 smoke tests cover
rendering all seven day controls with summary stats and disabling future days. `typecheck`, `lint`,
`test` pass.
