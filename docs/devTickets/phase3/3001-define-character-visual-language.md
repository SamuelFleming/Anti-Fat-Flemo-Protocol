# 3001 - Define Character Visual Language

**Status:** Blocked  
**Phase:** 3  
**Depends On:** None (Phase 2 complete)

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 14, 15, 24 "Character")
- `docs/DesignConcept/00_UI-Design-Concept.md` (palette/tone, for consistency only)

## Objective and User Outcome
Resolve who/what the companion visually is before any state or animation work begins, so later
tickets have a stable silhouette and personality to design against instead of re-litigating it.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/01_Character-Visual-Language.md`.
- Resolve silhouette, rough anatomy/proportions, dimensionality direction (2D/2.5D/3D leaning, not
  final tech choice), face/eyebrow system, material/colour identity, and the personality boundary
  from charter section 15.
- Answer charter open questions 1-6 and 15.

## Out of Scope
- Final animation technology choice (3007), pose/expression catalogue (3004), any rendering code.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/01_Character-Visual-Language.md`

## Technical Tasks
- Keep the character distinct from `GoalJourneyTrack`/`DailyTargetGauge`/`WeeklyAccountabilityRibbon`
  identity (own silhouette/material) while staying compatible with the app's palette.
- Explicitly document what the character is not (mascot/pet/avatar) per charter section 1.
- Keep the doc a design decision record, not implementation detail.

## Acceptance Criteria
- Silhouette, proportions, face system and material identity are decided and documented.
- The personality boundary (expressive but not a dependent entity) is explicit.
- No open question from charter section 24's "Character" group remains unanswered.

## Verification
- Review doc against charter sections 14, 15, 22 for consistency; no code to run.

## Completion Notes
Pending implementation.
