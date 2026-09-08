# 2004 - Implement Dashboard Aggregation Contract

**Status:** Blocked  
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
Pending implementation.
