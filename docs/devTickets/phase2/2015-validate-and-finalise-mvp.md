# 2015 - Validate and Finalise MVP

**Status:** Implemented  
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
Full-suite verification: server `typecheck`/`build` (tsc), `test` (161/161 passing across 21 files),
and client `typecheck`, `test` (12/12 passing) and production `build` all pass with no errors.
Ownership/cross-user isolation and calculation-fixture coverage were already established in Phase 1
(1005) and 2001 and re-verified as part of this suite run rather than re-authored. Manual review of
the register → settings → goal → daily log (meals/Move/weight) → dashboard → week → progress →
complete-goal → new-goal sequence confirms the flow is reachable and internally consistent against
`03-User-Flows.md`. No temporary/sample artifacts were introduced during Phase 2. OpenAPI
(`server/src/openapi/openapi.ts`) was kept in sync with the Dashboard/Progress contracts, including
the `baselineTdee`/`moveKcal` addition from 2009. No new Phase 3 or `GoalStateCompanion` scope was
started.
