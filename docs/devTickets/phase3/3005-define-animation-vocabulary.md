# 3005 - Define Animation Vocabulary

**Status:** Implemented  
**Phase:** 3  
**Depends On:** 3004

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 8, 9, 10)
- `docs/DesignConcept/00_UI-Design-Concept.md` (Motion Rules)

## Objective and User Outcome
Turn the static pose catalogue into a living-but-restrained animation vocabulary: idle behaviour,
gestures, breathing, transitions and effects, without over-scoping into full clip production.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/05_Animation-Vocabulary.md`.
- Define idle behaviour, breathing/exertion cues, gesture set, transition behaviour between states
  (including day-to-day/selected-day transitions per section 11), and any secondary/particle-free
  effects (e.g. sweat cue).
- Define how much blending is required (additive layers vs discrete clip swaps) at a conceptual
  level, informing the technology evaluation in 3007.

## Out of Scope
- Choosing the rendering/animation technology (3007), implementing any animation (3010), any code.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/05_Animation-Vocabulary.md`

## Technical Tasks
- Keep restrained, non-decorative motion consistent with the app's global Motion Rules (fresh load
  animates from neutral once; data updates animate from previous state, not from zero).
- Avoid designing animation that requires dozens of hand-authored full-body clips; prefer
  layered/composable motion consistent with 3003's composition model.
- Note reduced-motion equivalents inline (link back to the 3004 static pose per animated behaviour).

## Acceptance Criteria
- Idle, transition and gesture behaviour are each documented with a reduced-motion fallback.
- Historical day-to-day transition behaviour is addressed (not just live-day updates).
- The blending/complexity level is concrete enough to evaluate technology against in 3007.

## Verification
- Review doc against the app's global Motion Rules and charter sections 8-11 for consistency; no
  code to run.

## Completion Notes
Produced `docs/DesignConcept/GoalStateCompanion/05_Animation-Vocabulary.md`. Layered procedural
channels + sparse gesture one-shots (not full-body clip-per-state). Idle, breath, transitions
(fresh load / live update / selected-day cross-fade), particle-free sweat/accent effects, and
reduced-motion → 3004 static pose mapping each documented. Aligns with app Motion Rules. Enough
blending concreteness for 3007 R3F spike. No app code.
