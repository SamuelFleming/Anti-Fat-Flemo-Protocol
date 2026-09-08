# 2004 - Implement Dashboard Aggregation Contract

**Status:** Implemented  
**Phase:** 2  
**Depends On:** 2001

## Related Docs / Design References
- `docs/core-scope/06-Calculation-Rules.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Return one coherent, trustworthy data contract for the primary daily Dashboard.

## Scope
- Implement `GET /api/dashboard` for selected day and current/selected week.
- Active goal, latest/current weight, Calories, Move, balance, status, recent meals and weekly summary.
- Tests and implemented OpenAPI mirror.

## Out of Scope
- Dashboard UI, progress-range aggregation and new formulas.

## Likely Files / Areas
- `server/src/features/dashboard/`
- `server/src/openapi/`
- Dashboard integration tests

## Technical Tasks
- Compose canonical models and calculation functions without re-deriving logic.
- Preserve absent/partial values explicitly.
- Ensure historical selected-day data never silently uses today's values.

## Acceptance Criteria
- Contract matches the API specification and supports all Dashboard widgets.
- Current and historical selections return correctly scoped data.
- Missing-data and cross-user cases are tested; OpenAPI is aligned.

## Verification
- Run Dashboard API integration, calculation fixture and ownership tests.

## Completion Notes
Implemented `GET /api/dashboard?date=` in `server/src/features/dashboard/`. Composes the current
active goal, selected-day meals/Move/status, current weight/goal progress, and a Monday-Sunday week
(with a `days[]` array carrying per-day calories/Move/status for the ribbon). Dashboard always uses
the *current* active goal's targets (selecting a historical day only changes which day's recorded
meals/Move/weight are shown, not which goal's targets apply — full historical-target resolution
across goal changes is handled by `/api/progress`, ticket 2012). No active goal yields explicit
`null`s rather than fabricated targets/status. OpenAPI mirrored in `server/src/openapi/openapi.ts`.
7 integration tests cover no-goal shape, full composition, historical-day meal scoping and cross-user
isolation. `typecheck`, `lint`, `test` pass.
