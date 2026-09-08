# 2013 - Build Progress Screen

**Status:** Blocked  
**Phase:** 2  
**Depends On:** 2006, 2012

## Related Docs / Design References
- `docs/core-scope/04-Screens-and-UX.md`
- `docs/DesignConcept/00_UI-Design-Concept.md`
- `docs/DesignConcept/01_GoalJourneyTrack.visual.md`

## Objective and User Outcome
Let users inspect longer-term weight and behavioural history without losing goal context.

## Scope
- Range controls, expanded GoalJourneyTrack, weight trend, Calories/Move trends and history table.
- Historical target references, point details, missing gaps and responsive layouts.
- First-view and range-change motion with reduced-motion support.

## Out of Scope
- Predictive trends, companion visuals and direct Recharts assembly in page components.

## Likely Files / Areas
- `client/src/features/progress/`
- `client/src/components/charts/`

## Technical Tasks
- Hide chart-library details behind owned chart components.
- Keep exact values available to pointer, keyboard and touch users.
- Transition range changes quietly instead of replaying all entry motion.

## Acceptance Criteria
- Users can switch all documented ranges and inspect exact observations.
- Weight, Calories, Move and history agree with the API contract.
- Missing data remains gaps; responsive and reduced-motion states are usable.

## Verification
- Run client build and range, accessibility, historical-target and no-data scenarios.

## Completion Notes
Pending implementation.
