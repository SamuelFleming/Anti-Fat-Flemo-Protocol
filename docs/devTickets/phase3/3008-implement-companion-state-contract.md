# 3008 - Implement Companion State Contract

**Status:** Implemented  
**Phase:** 3  
**Depends On:** 3002, 3003, 3006

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 3, 17, 20, 21)
- `docs/DesignConcept/GoalStateCompanion/02_State-Model.md`
- `docs/DesignConcept/GoalStateCompanion/03_State-Composition-Rules.md`
- `docs/DesignConcept/GoalStateCompanion/06_Historical-and-No-Data-Behaviour.md`

## Objective and User Outcome
Implement the pure, renderer-independent logic that turns existing selected-day tracking data into
composed companion state, so the renderer (3009/3010) has a stable, testable contract to consume.

## Scope
- A `SelectedDayContext`/`CompanionContext` type and pure mapping functions from existing
  Dashboard/Progress data (calories, Move, goal progress, daily/weekly status, data completeness,
  time-of-day) to the semantic state dimensions defined in 3002.
- Composition resolution implementing the layer-ownership/conflict rules from 3003 and the
  historical/no-data rules from 3006.
- The companion must not fetch its own data; it only accepts a context object from its parent.

## Out of Scope
- Any rendering, animation, or UI (3009/3010), technology-specific code, new backend endpoints or
  calculation formulas (reuse existing domain/dashboard outputs only).

## Likely Files / Areas
- `client/src/features/companion/companionState.ts` (or similar) for pure mapping/composition
- `client/src/features/companion/companionState.test.ts` for the pure-logic tests

## Technical Tasks
- Keep this layer pure (plain data in, semantic state out) so it is cheap and reliable to unit test,
  per the Phase 3 Testing Approach's explicit exception for state-contract logic.
- Derive inputs from already-computed dashboard/domain values; do not re-derive calorie/Move/status
  formulas here.
- Include the optional "reasons" explainability shape from charter section 21 only if it does not
  meaningfully expand scope; otherwise defer and note it.

## Acceptance Criteria
- Given representative Dashboard/Progress payloads (on-track, over-target, no-data, partial-data,
  historical-completed-day), the mapping produces the expected composed state for each.
- The module has no rendering, animation, or data-fetching dependencies.
- Behaviour matches 3002/3003/3006 documented rules for at least one worked example each.

## Verification
- Run a small, targeted unit test suite for the mapping/composition functions only (lightweight per
  the Phase 3 Testing Approach — not exhaustive combinatorial coverage).

## Completion Notes
Implemented pure contract in `client/src/features/companion/companionState.ts` (context → semantic
dimensions → resolved behaviour layers/compositionId). Reuses domain calorie/Move bands; time-aware
nutrition; no-data/partial/historical rules from 3002/3003/3006. No fetch/render deps. Explainability
`reasons` shape deferred (not needed for renderer contract). Light unit tests:
`companionState.test.ts` (7 cases) all passing.
