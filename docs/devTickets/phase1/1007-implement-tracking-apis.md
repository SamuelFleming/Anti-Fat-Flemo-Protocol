# 1007 - Implement Tracking APIs

**Status:** Implemented  
**Phase:** 1  
**Depends On:** 1005

## Related Docs / Design References
- `docs/core-scope/05-Data-Model.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Provide user-owned APIs for meals, daily Move records and weight history.

## Scope
- Meal list/create/update/delete.
- Daily-log list and date-keyed Move upsert.
- Weight list/create/update/delete.
- Date filters, validation, ownership, tests and implemented OpenAPI.

## Out of Scope
- Derived calculations, summary APIs and frontend tracking workflows.

## Likely Files / Areas
- `server/src/features/meals/`, `dailyLogs/`, `weights/`
- `server/src/openapi/`

## Technical Tasks
- Use canonical local-date semantics and deterministic query ranges.
- Preserve missing data rather than manufacturing zeros.
- Match all documented request and response contracts.

## Acceptance Criteria
- Authenticated users can perform the documented tracking operations.
- Date filtering/upsert behaviour is deterministic and user-scoped.
- Validation, implementation and OpenAPI remain aligned.

## Verification
- Run integration tests for CRUD, date boundaries, upsert and cross-user isolation.

## Completion Notes
Implemented 2026-09-08.

- Added `features/meals`, `features/dailyLogs`, `features/weights` (validation/service/
  controller/routes), each reusing the `ownership.ts` pattern from 1005 and mounted in
  `app.ts` at `/api/meals`, `/api/daily-logs`, `/api/weights`.
- Shared date-filter validation/logic factored out to `utils/validation.ts`
  (`calendarDateString`, `dateFilterQuerySchema` — `date` XOR `startDate`+`endDate`, both
  required together) and `utils/dateFilter.ts` (`buildDateRangeFilter`, deterministic
  `$gte`/`$lte` against normalized calendar dates). `goal.validation.ts` refactored to reuse
  the shared `calendarDateString` instead of a local copy.
  - Extension beyond the documented spec examples: `/api/daily-logs` also accepts the same
    `?date=` / `?startDate=&endDate=` filters as meals/weights (spec only showed `?date=`),
    since the underlying date-range semantics are identical and this keeps all three list
    endpoints consistent.
- Meals: full CRUD (list w/ date filter, create, update, delete). No uniqueness constraint —
  multiple meals per day are expected.
- Daily Logs: list (date-filterable) + `PUT /:date` upsert via `findOneAndUpdate({ userId,
  date }, { $set }, { upsert: true, returnDocument: "after" })` — one document per user/date,
  enforced by the existing unique index from 1003.
- Weights: full CRUD; `POST`/`PUT` can race against the unique `{ userId, date }` index.
  Added a generic Mongo duplicate-key (E11000) → `409 Conflict` fallback in the central
  `errorHandler` (`utils/mongoErrors.ts`) rather than per-service try/catch, so this also
  protects any future unique-indexed resource.
- DELETE endpoints return `204 No Content` (no body), consistent with REST convention; all
  other single-resource responses return the resource directly and lists return
  `{ items: [...] }`, matching the 1006 conventions.
- OpenAPI (`server/src/openapi/openapi.ts`) extended with `/meals`, `/meals/{id}`,
  `/daily-logs`, `/daily-logs/{date}`, `/weights`, `/weights/{id}` and their
  `MealEntry(Input)`, `DailyLog(Input)`, `WeightEntry(Input)` schemas.
- Tests: `tests/features/meals.test.ts`, `dailyLogs.test.ts`, `weights.test.ts` (28 new tests)
  cover CRUD, date/range filtering, upsert-vs-create semantics, unique-date conflicts, and
  cross-user isolation.
- Verification: `typecheck`, `lint`, `test` (123/123), `build` all pass.
