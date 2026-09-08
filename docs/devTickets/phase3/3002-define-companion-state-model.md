# 3002 - Define Companion State Model

**Status:** Blocked  
**Phase:** 3  
**Depends On:** 3001

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 2-4, 5, 24 "State")
- `docs/core-scope/06-Calculation-Rules.md`

## Objective and User Outcome
Decide what tracked conditions the companion is allowed to know about and how raw metrics become
semantic, time-aware, range-aware state — without inventing new health calculations.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/02_State-Model.md`.
- Define the input dimensions (nutrition, movement, goalProgress, dataState, timeContext) and their
  categorical/continuous value sets.
- Define temporal interpretation (e.g. low intake reads differently at 10am vs 9pm) and range/
  tolerance-based thresholds (no binary target cliffs).
- Define how data confidence (no data / partial / live / complete) modifies interpretation.
- Answer charter open questions 7-12.

## Out of Scope
- New calorie/Move/status formulas (reuse `06-Calculation-Rules.md` outputs as inputs), composition
  rules for combining dimensions (3003), any code.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/02_State-Model.md`

## Technical Tasks
- Derive nutrition/movement/goalProgress dimensions from existing dashboard/domain outputs
  (`caloriesRemaining`, Move vs target, `goalProgressPercent`, daily/weekly status) rather than
  redefining thresholds.
- Keep the model renderer-independent (semantic labels, not animation names) per charter section 20.
- Follow "no data means unknown" (section 4.5) and "more is not infinitely better" (section 4.7).

## Acceptance Criteria
- Every state dimension has a documented, finite value set and derivation source.
- Time-of-day and data-confidence modify interpretation in at least one concrete documented example
  per dimension.
- No open question from charter section 24's "State" group remains unanswered.

## Verification
- Review doc against charter sections 4.3, 4.4, 4.5, 4.7 and `06-Calculation-Rules.md` for
  consistency; no code to run.

## Completion Notes
Pending implementation.
