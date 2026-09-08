# 1006 - Implement Profile and Goal APIs

**Status:** Blocked  
**Phase:** 1  
**Depends On:** 1005

## Related Docs / Design References
- `docs/core-scope/05-Data-Model.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Provide the complete persisted API foundation for profile settings and sequential goal periods.

## Scope
- Profile GET/PUT.
- Goal list, active, create, detail, update and complete endpoints.
- Active-goal constraints, ownership, validation, tests and implemented OpenAPI.

## Out of Scope
- Frontend screens, goal-progress calculations and Dashboard aggregation.

## Likely Files / Areas
- `server/src/features/profile/`
- `server/src/features/goals/`
- `server/src/openapi/`

## Technical Tasks
- Preserve completed goals and historical targets.
- Enforce the documented active-goal rules.
- Keep endpoint contracts aligned with the API specification.

## Acceptance Criteria
- A user can maintain a profile and lifecycle multiple goals.
- Completing a goal preserves it while allowing continued future use.
- Cross-user access is blocked and OpenAPI matches implementation.

## Verification
- Run profile/goal integration tests including active-goal conflicts and completion.

## Completion Notes
Pending implementation.
