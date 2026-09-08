# 3009 - Build Minimum Viable Render Prototype

**Status:** Blocked  
**Phase:** 3  
**Depends On:** 3007, 3008

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (section 25 "09_Prototype-Plan.md")
- `docs/DesignConcept/GoalStateCompanion/07_Technology-Evaluation.md`

## Objective and User Outcome
Prove the concept end-to-end with the smallest real implementation: chosen technology (3007)
rendering the character, driven by real composed state (3008), for a small representative set of
states — before investing in the full animation system.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/09_Prototype-Plan.md` describing what the
  prototype validates and its explicit limits.
- A real (non-throwaway) `GoalStateCompanion` render component consuming a `CompanionContext` prop
  and rendering the correct static pose (from 3004) for a handful of representative composed states.
- Loading and failure fallback behaviour (renders nothing/a neutral placeholder rather than breaking
  the page if the renderer fails to load).

## Out of Scope
- Full animation/idle/transition system (3010), Dashboard integration (3011), the full pose
  catalogue (only representative states are required here).

## Likely Files / Areas
- `client/src/components/companion/GoalStateCompanion.tsx`
- `docs/DesignConcept/GoalStateCompanion/09_Prototype-Plan.md`

## Technical Tasks
- Build on the technology decision and spike code from 3007; do not re-evaluate alternatives here.
- Consume `client/src/features/companion/companionState.ts` (3008) as the only state input.
- Keep the component usable in isolation (e.g. a local dev route or story-style harness) so later
  tickets can visually verify without full Dashboard wiring.

## Acceptance Criteria
- The component renders at least 3 distinct representative composed states correctly (e.g. neutral/
  no-data, on-track, over-target).
- A simulated renderer-load failure does not break the surrounding page.
- The component takes no props beyond the companion context (no direct data fetching).

## Verification
- Manually verify each representative state renders correctly; no broad automated suite required
  per the Phase 3 Testing Approach.

## Completion Notes
Pending implementation.
