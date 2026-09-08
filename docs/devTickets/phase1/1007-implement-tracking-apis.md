# 1007 - Implement Tracking APIs

**Status:** Blocked  
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
Pending implementation.
