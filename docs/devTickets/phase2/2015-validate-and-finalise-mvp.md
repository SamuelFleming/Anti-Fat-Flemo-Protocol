# 2015 - Validate and Finalise MVP

**Status:** Blocked  
**Phase:** 2  
**Depends On:** 2014

## Related Docs / Design References
- `docs/core-scope/02-Core-Scope.md`
- `docs/core-scope/03-User-Flows.md`
- `docs/core-scope/06-Calculation-Rules.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Confirm the standalone MVP is reliable for day-to-day use before any Phase 3 work begins.

## Scope
- End-to-end core flows, security/ownership, calculation fixtures and historical-goal integrity.
- Full type-check, lint, tests and production builds.
- Remove temporary/sample artifacts and reconcile docs/OpenAPI with implementation.

## Out of Scope
- New features, speculative polish and all `GoalStateCompanion` work.

## Likely Files / Areas
- End-to-end/integration tests
- Any MVP files requiring verified corrections
- Tickets, completion registry and implemented OpenAPI

## Technical Tasks
- Test register/setup/goal/log/Move/weight/Dashboard/week/progress/complete/new-goal sequence.
- Validate failure, missing-data and cross-user paths.
- Record genuinely deferred work without expanding MVP scope.

## Acceptance Criteria
- Phase 2 exit criteria and documented user flows pass end to end.
- Calculations, API, OpenAPI and UI agree.
- Application runs locally without unfinished required functionality.

## Verification
- Run the complete automated suite, production builds and final manual MVP smoke test.

## Completion Notes
Pending implementation.
