# 3003 - Define State Composition Rules

**Status:** Implemented  
**Phase:** 3  
**Depends On:** 3002

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 6, 8, 9, 24 "Composition")

## Objective and User Outcome
Decide how several simultaneous state dimensions combine into one coherent character without
requiring a manually authored combination for every possible state pairing.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/03_State-Composition-Rules.md`.
- Define candidate behaviour layers (posture, face, breathing, arms/legs, stomach/body, effects,
  idle, material/accent) and which state dimension(s) own or influence each layer.
- Define conflict/priority rules for when dimensions disagree (e.g. over-target calories + very
  high Move) and how longer-term goal trajectory influences the composition more quietly than
  immediate daily state (section 10).
- Answer charter open questions 13-17.

## Out of Scope
- Concrete poses/expressions (3004), animation clips/blending implementation (3005/3010), any code.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/03_State-Composition-Rules.md`

## Technical Tasks
- Keep the "what data means" vs "how the character expresses it" separation from charter section 6.
- Ensure partial data (section 12) can express known dimensions while suppressing unknown ones,
  rather than forcing an all-or-nothing state.
- Document composition as data → layer ownership → resolved behaviour, not literal animation names.

## Acceptance Criteria
- Every behaviour layer has a documented owning dimension (or explicit "unowned/idle default").
- At least one worked example resolves a multi-dimension conflict end-to-end.
- Partial-data composition behaviour is explicit.

## Verification
- Review doc against charter sections 6, 8, 9, 12 for consistency; no code to run.

## Completion Notes
Produced `docs/DesignConcept/GoalStateCompanion/03_State-Composition-Rules.md`. Defined eight
behaviour layers with ownership; posture driven by a priority table (significantly-over → …
balanced); face via nutrition×movement matrix; goal progress quiet secondary only. Additive
layer blending preferred over combo clips. Partial data expresses known dimensions only.
Charter Composition Q13–17 answered. Important composition IDs listed for 3004. No app code.
