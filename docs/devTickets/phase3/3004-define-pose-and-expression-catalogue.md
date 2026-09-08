# 3004 - Define Pose and Expression Catalogue

**Status:** Implemented  
**Phase:** 3  
**Depends On:** 3001, 3003

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 9, 13, 14)

## Objective and User Outcome
Give every important resolved composition state a canonical, readable static pose/expression, so
reduced-motion users and static-fallback rendering still communicate meaning correctly.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/04_Pose-and-Expression-Catalogue.md`.
- Catalogue canonical static poses/expressions for the composed states resolved by 3003, including
  the neutral/no-data "mannequin" state (section 13) and normal, over-target, high-exertion,
  low-fuel and goal-milestone examples.
- Each entry must describe the pose in terms usable by any renderer (stance, weight distribution,
  arm/hand position, facial expression) rather than technology-specific rigging detail.

## Out of Scope
- Idle/transition/gesture animation vocabulary (3005), rendering technology (3007), any code.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/04_Pose-and-Expression-Catalogue.md`

## Technical Tasks
- Ensure every animated state from 3003 has a corresponding static-pose entry (accessibility
  requirement, charter section 4.10).
- Keep the no-data pose neutral/uninstantiated rather than sad/abandoned (section 13).
- Reference each pose back to the composition rule(s) that produce it.

## Acceptance Criteria
- Every state layer combination identified as "important" in 3003 has a documented static pose.
- The no-data pose is explicitly specified and distinct from any negative-state pose.
- Poses are described renderer-independently.

## Verification
- Review doc against charter sections 4.10, 13, 14 for consistency; no code to run.

## Completion Notes
Produced `docs/DesignConcept/GoalStateCompanion/04_Pose-and-Expression-Catalogue.md`. Catalogue
covers all important 3003 composition IDs (`mannequin`, `balanced`, `mildly-full`, `over-full`,
`exertion`, `high-exertion`, `low-fuel`, `under-moved`, partial variants, `milestone`) with
renderer-independent stance/torso/arms/face/accent specs. Mannequin explicitly distinct from
negative poses. Face token map included. No app code.
