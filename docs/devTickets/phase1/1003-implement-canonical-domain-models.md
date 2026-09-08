# 1003 - Implement Canonical Domain Models

**Status:** Implemented  
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
- `utils/date.ts`: `toCalendarDate`/`formatCalendarDate` normalise any `Date`/`"YYYY-MM-DD"` input
  to UTC midnight of its calendar day; used as a Mongoose schema `set` on every `date` field so
  storage is timezone-shift-proof regardless of client input.
- `utils/mongooseJson.ts`: shared `toJSON` transform (`_id` -> `id`, drop `__v`, drop named
  sensitive fields) applied by every model.
- `models/User.ts`: unique `email`; `passwordHash` has `select: false` (excluded from default
  queries) and is also stripped in `toJSON` as defense-in-depth.
- `models/Profile.ts`: unique `userId` (one profile per user, matching the singular
  `GET/PUT /api/profile` contract); fixed-value `preferredWeightUnit`/`preferredEnergyUnit` enums.
- `models/Goal.ts`: `status` enum (`active`/`completed`/`archived`, default `active`); indexes on
  `userId`, `userId+status`, `userId+startDate` exactly as documented. Enforcing "only one active
  goal" is deferred to the ticket 1006 service layer, not a DB constraint (not specified as one).
- `models/MealEntry.ts`, `DailyLog.ts`, `WeightEntry.ts`: as documented; `DailyLog` and
  `WeightEntry` carry a unique `userId+date` index (one record per user per calendar day).
- No derived values (calorie totals, deficits, statuses, etc.) are persisted on any model.
- Verification: 42 model/utility tests (`tests/models/*`, `tests/utils/date.test.ts`) covering
  valid records, invalid/missing/enum-violating fields, unique-index rejection, and cross-user
  independence for the same dates. `typecheck`, `lint`, `test`, `build` all pass.
