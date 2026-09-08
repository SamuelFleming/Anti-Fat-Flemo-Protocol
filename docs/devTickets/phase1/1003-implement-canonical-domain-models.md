# 1003 - Implement Canonical Domain Models

**Status:** Blocked  
**Phase:** 1  
**Depends On:** 1002

## Related Docs / Design References
- `docs/core-scope/05-Data-Model.md`

## Objective and User Outcome
Persist the canonical user, goal and tracking records without compromising ownership or historical interpretation.

## Scope
- User, Profile, Goal, MealEntry, DailyLog and WeightEntry Mongoose models.
- Canonical indexes, timestamps, defaults and validation.
- Date representation and historical target integrity required by the data model.

## Out of Scope
- Controllers, HTTP routes, derived calculations and future entities.

## Likely Files / Areas
- `server/src/models/`
- Model tests and fixtures

## Technical Tasks
- Implement relationships and ownership exactly as documented.
- Add uniqueness/range indexes, including one daily log per user/date where specified.
- Avoid persisting derived values identified by the canonical model.

## Acceptance Criteria
- All six model types persist and validate documented records.
- Invalid relationships and duplicate constrained records are rejected.
- Two users can store independent records for the same dates.

## Verification
- Run model tests covering valid, invalid, indexed and cross-user records.

## Completion Notes
Pending implementation.
