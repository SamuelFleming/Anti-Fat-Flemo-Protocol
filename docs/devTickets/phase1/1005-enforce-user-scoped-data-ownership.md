# 1005 - Enforce User-Scoped Data Ownership

**Status:** Blocked  
**Phase:** 1  
**Depends On:** 1004

## Related Docs / Design References
- `docs/core-scope/02-Core-Scope.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Guarantee that authenticated users can never read or mutate another user's health or goal records.

## Scope
- Reusable authenticated ownership-query and not-found conventions.
- Controller/service patterns for list, detail, update and delete operations.
- Cross-user security tests used by subsequent API tickets.

## Out of Scope
- Administrator access, sharing, public profiles and feature endpoint implementation.

## Likely Files / Areas
- `server/src/middleware/`, `server/src/utils/` or service helpers
- Integration-test helpers and security test suites

## Technical Tasks
- Ignore client-supplied ownership identifiers.
- Prevent identifier probing from revealing whether another user's record exists.
- Document the required pattern for subsequent services.

## Acceptance Criteria
- Ownership always derives from authentication context.
- Cross-user read/update/delete attempts cannot access target records.
- The pattern supports all canonical domain models without bypasses.

## Verification
- Run integration tests with two users against representative owned resources.

## Completion Notes
Pending implementation.
