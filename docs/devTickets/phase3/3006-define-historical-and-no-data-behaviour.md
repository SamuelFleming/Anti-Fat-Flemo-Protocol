# 3006 - Define Historical and No-Data Behaviour

**Status:** Implemented  
**Phase:** 3  
**Depends On:** 3002, 3004

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 11, 12, 13, 24 "History")

## Objective and User Outcome
Make the companion behave correctly for the same selected-day historical browsing the rest of the
app already supports, and make "no data" unambiguously read as unknown rather than a bad day.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/06_Historical-and-No-Data-Behaviour.md`.
- Define what "final known state" means for a completed historical day, how partial historical data
  behaves (per-dimension suppression, not all-or-nothing), and the final no-data/mannequin visual
  language (extending the neutral pose from 3004).
- Answer charter open questions 18-20.

## Out of Scope
- Live selected-day transition animation timing (belongs to 3005), implementation, any code.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/06_Historical-and-No-Data-Behaviour.md`

## Technical Tasks
- Reuse the app's existing selected-day concept (Dashboard/Progress `selectedDate`) as the source of
  "which day" rather than defining a competing notion of current context.
- Keep the distinction between a historical day with zero entries and a historical day that is
  simply in the future (not yet reachable) explicit.

## Acceptance Criteria
- "Final known state" for a completed day is defined precisely enough to implement against.
- Partial-data behaviour is defined per dimension, not as a single fallback state.
- The no-data language is explicit and consistent with 3004's neutral pose.

## Verification
- Review doc against charter sections 11-13 and the app's existing selected-day pattern; no code to
  run.

## Completion Notes
Produced `docs/DesignConcept/GoalStateCompanion/06_Historical-and-No-Data-Behaviour.md`. Selected
day owned by app `selectedDate`. Final known state = recompute from that day's metrics with
`day-complete` firm rules (no separate companion snapshot). Partial = per-dimension; empty past
and future share mannequin visual but differ in accessible copy. Charter History Q18–20 answered.
No app code.
