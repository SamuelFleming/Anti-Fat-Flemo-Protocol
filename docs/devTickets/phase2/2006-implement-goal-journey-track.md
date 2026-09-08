# 2006 - Implement GoalJourneyTrack

**Status:** Blocked  
**Phase:** 2  
**Depends On:** 1008

## Related Docs / Design References
- `docs/DesignConcept/00_UI-Design-Concept.md`
- `docs/DesignConcept/01_GoalJourneyTrack.visual.md`

## Objective and User Outcome
Make start-to-current-to-goal progress legible as a journey without judging normal fluctuation.

## Scope
- Reusable prop-driven summary component and optional expanded history state.
- Normal, regression-beyond-start, beyond-goal and missing-data presentation.
- Fresh-load, update/history transition and reduced-motion behaviour.

## Out of Scope
- Goal calculations, API access, page layout and a generic filled progress bar.

## Likely Files / Areas
- `client/src/components/goals/GoalJourneyTrack.*`
- Component tests/stories or visual fixtures

## Technical Tasks
- Use a straight track with explicit start/current/goal values.
- Implement bounded overflow rather than clamping.
- Keep exact values and accessible interaction independent of motion/colour.

## Acceptance Criteria
- All documented states render accurately at representative widths.
- Previous-to-current animation does not replay from start.
- Keyboard/touch access and reduced motion preserve the same meaning.

## Verification
- Run component checks across default, regression, beyond-goal, history and reduced-motion fixtures.

## Completion Notes
Pending implementation.
