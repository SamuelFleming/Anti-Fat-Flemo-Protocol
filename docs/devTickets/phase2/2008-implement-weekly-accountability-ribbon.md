# 2008 - Implement WeeklyAccountabilityRibbon

**Status:** Blocked  
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
Pending implementation.
