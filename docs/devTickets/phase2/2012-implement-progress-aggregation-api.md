# 2012 - Implement Progress Aggregation API

**Status:** Blocked  
**Phase:** 2  
**Depends On:** 2001

## Related Docs / Design References
- `docs/core-scope/05-Data-Model.md`
- `docs/core-scope/06-Calculation-Rules.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Return historically correct weight, Calories, Move and status data over useful date ranges.

## Scope
- Implement `GET /api/progress` for 7-day, 30-day, goal-period and all-time views.
- Historical targets, goal context, history rows and missing observations.
- Tests and implemented OpenAPI mirror.

## Out of Scope
- Charts, client filtering and prediction/trajectory features.

## Likely Files / Areas
- `server/src/features/progress/`
- `server/src/openapi/`
- Progress integration tests

## Technical Tasks
- Avoid applying today's target retroactively.
- Preserve gaps for unrecorded observations.
- Keep range/date boundaries and ownership deterministic.

## Acceptance Criteria
- Every documented range returns chart and history data with correct historical context.
- Multiple completed goals remain queryable.
- Missing data, date boundaries and OpenAPI alignment are tested.

## Verification
- Run integration tests across ranges, target changes, multiple goals and two users.

## Completion Notes
Pending implementation.
