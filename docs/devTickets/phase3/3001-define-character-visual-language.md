# 3001 - Define Character Visual Language

**Status:** Implemented  
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
Produced `docs/DesignConcept/GoalStateCompanion/01_Character-Visual-Language.md`. Resolved: a
single-piece, no-neck, tall-narrow (~1:2.2) rounded "seed" silhouette; simplified anatomy with no
visible joints/hands (soft-body squash/stretch instead of rigging); a minimal eyes+mouth(+optional
eyebrows) face system; one dominant matte moss-family base material with small state-coloured
accents rather than full-body recolour (colour stays reinforcement, not primary meaning); a bounded,
reversible deformation model tied to temporary conditions, not body-composition/weight change; and
the charter's personality boundary (DATA → CHARACTER EXPRESSION, never USER → CARE FOR CHARACTER).
No dimensionality/technology choice was made (left to ticket 3007) — the silhouette is deliberately
compatible with 2D, 2.5D or 3D treatments. Noted `docs/devTickets/phase2/MVP-FeedbackNotes.md`'s
"narrow centre column with a ring either side" placement idea as a proportion constraint to respect
later, without deciding Dashboard layout here (that remains ticket 3011's scope). No code changed;
no build/test run required for a design-doc-only ticket.
