# 2001 - Implement Calculation Layer

**Status:** Blocked  
**Phase:** 2  
**Depends On:** 1006, 1007

## Related Docs / Design References
- `docs/core-scope/05-Data-Model.md`
- `docs/core-scope/06-Calculation-Rules.md`

## Objective and User Outcome
Produce consistent, transparent daily, weekly and goal-derived values everywhere in the application.

## Scope
- Calories, Move conversion/completion, estimated energy balance.
- Weight/goal progress, days remaining, daily status and weekly aggregation/status.
- Explicit missing/partial-data results and deterministic unit tests.

## Out of Scope
- API response composition, persistence and UI formatting.

## Likely Files / Areas
- Shared server/domain calculation modules
- Pure calculation test fixtures

## Technical Tasks
- Implement each documented formula once as pure, composable functions.
- Preserve unknown values instead of coercing missing data to zero.
- Keep status thresholds/configuration centralised and explainable.

## Acceptance Criteria
- Every rule in `06-Calculation-Rules.md` has representative tests.
- Boundary, over-target, regression and missing-data cases are deterministic.
- Consumers do not need to duplicate formulas.

## Verification
- Run calculation tests, type-check and lint with documented example values.

## Completion Notes
Pending implementation.
