# 3010 - Implement Character States and Animation System

**Status:** Implemented  
**Phase:** 3  
**Depends On:** 3009

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/04_Pose-and-Expression-Catalogue.md`
- `docs/DesignConcept/GoalStateCompanion/05_Animation-Vocabulary.md`
- `docs/DesignConcept/00_UI-Design-Concept.md` (Motion Rules)

## Objective and User Outcome
Grow the prototype into the full documented state/animation system: every catalogued pose is
reachable, idle/gesture/transition behaviour is implemented, and reduced motion is respected.

## Scope
- Implement the full pose/expression catalogue (3004) and animation vocabulary (3005): idle
  behaviour, state transitions, reaction animations, blending where required.
- Implement the historical/no-data behaviour from 3006 (final-known-state for completed days,
  partial-data per-dimension suppression, neutral mannequin state).
- Respect `prefers-reduced-motion` centrally (reuse the app's existing reduced-motion pattern) with
  the static-pose fallback documented per animated behaviour in 3005.

## Out of Scope
- Embedding into the Dashboard/parent UI (3011), new design decisions not already covered by
  3001-3006 (escalate rather than improvise if a gap is found).

## Likely Files / Areas
- `client/src/components/companion/GoalStateCompanion.tsx` and supporting animation modules
- `client/src/features/companion/companionState.ts` (extended only if 3008 is missing something
  identified here — otherwise unchanged)

## Technical Tasks
- Keep semantic state (3008) and rendering fully separated; animation code should switch on
  composed state, not recompute it.
- Animate state changes from the previously displayed state, not from zero, consistent with the
  app's global Motion Rules.
- Verify at least one full day-to-day (selected-day) transition and one live-data-update transition.

## Acceptance Criteria
- Every state combination reachable through normal Dashboard data produces the documented pose/
  animation, including the no-data/mannequin state.
- Reduced motion produces the documented static-pose equivalent for every animated behaviour.
- Historical day selection shows the correct final-known-state without replaying live-day motion.

## Verification
- Manually exercise representative on-track/over-target/no-data/partial/historical states plus
  reduced-motion; targeted unit tests only for any new pure logic, per the Phase 3 Testing Approach.

## Completion Notes
Grew the 3009 prototype into the documented 3004/3005 system: all catalogue compositions are
reachable in `/dev/companion-prototype`; layered procedural breath/idle/sweat plus sparse
gestures (`hand-to-torso`, `recovery-stretch`, `pleased-pulse`); settle vs live-update vs
day-change damping (historical day selection does not replay fresh-load settle-in). Reduced
motion (`prefers-reduced-motion` + harness toggle) suppresses loops/gestures and lands on the
3004 static pose. Pure tests cover motion params, transition kind, and gestures. Dashboard
integration remains 3011.
