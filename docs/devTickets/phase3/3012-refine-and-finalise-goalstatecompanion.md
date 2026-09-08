# 3012 - Refine and Finalise GoalStateCompanion

**Status:** Blocked  
**Phase:** 3  
**Depends On:** 3011

## Related Docs / Design References
- `docs/phased-development-plan.md` (Phase 3 Exit Criteria and Testing Approach)
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md`

## Objective and User Outcome
Close out Phase 3: confirm the companion feels integrated rather than bolted on, runs acceptably,
and cannot destabilise the MVP — then record what remains genuinely deferred.

## Scope
- Visual pass, animation timing and state-transition polish against the 3001-3006 design docs.
- Responsive behaviour across supported breakpoints.
- Basic performance sanity check (frame smoothness / load impact) — not a full benchmarking suite.
- Full-suite verification (existing client/server typecheck, lint, test, build) to confirm no
  regression to Phase 1/2 functionality.
- Update `docs/devTickets/devCompletion.md` and this ticket's Completion Notes; record any
  genuinely deferred refinement as follow-up rather than expanding scope here.

## Out of Scope
- New character states, new dimensions, new signature components, any `08-Future-Scope.md` item.

## Likely Files / Areas
- `client/src/components/companion/`, `client/src/features/companion/`, `client/src/features/dashboard/`
- `docs/devTickets/devCompletion.md`, `docs/devTickets/devTickets_next.md`

## Technical Tasks
- Re-check reduced-motion and disabled-companion paths after polish changes.
- Confirm the companion's failure/loading behaviour still holds after any late changes.
- Do not introduce new automated test scope beyond what 3008/3010 already established, per the
  Phase 3 Testing Approach.

## Acceptance Criteria
- All Phase 3 exit criteria in `docs/phased-development-plan.md` are met.
- Full existing automated suite (client + server) passes with no regressions.
- The application remains fully usable with the companion disabled or failing to load.

## Verification
- Run client/server `typecheck`, `test`, and production `build`; manual smoke pass of Dashboard
  with the companion enabled, disabled, and simulated-failed.

## Completion Notes
Pending implementation.
