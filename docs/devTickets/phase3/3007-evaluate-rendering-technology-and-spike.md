# 3007 - Evaluate Rendering Technology and Spike

**Status:** Blocked  
**Phase:** 3  
**Depends On:** 3004, 3005, 3006

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 19, 21, 24 "Technology")
- `docs/DesignConcept/react-ui-library-strategy.md` (Technology Position / Dependency Rule)

## Objective and User Outcome
Choose a rendering/animation technology against the now-concrete requirements from 3004-3006 rather
than picking a technology first and designing around it, and prove the choice actually works.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/07_Technology-Evaluation.md` evaluating candidates
  (Rive, Spline, React Three Fiber/Three.js, Lottie, CSS/SVG, sprite-based, hybrid) against: required
  dimensionality/deformation (3001), pose/expression range (3004), blending needs (3005), historical
  transitions (3006), performance and bundle-size impact, and reduced-motion support.
- Build a small throwaway technical spike proving the chosen technology can render the character
  concept, load/swap at least two poses, and run acceptably in the existing Vite/React client.
- Record the decision and rejected-alternative reasoning.

## Out of Scope
- Final character asset production, the real state contract (3008), any permanent integration into
  app routes/navigation.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/07_Technology-Evaluation.md`
- A throwaway spike location such as `client/src/features/companion/_spike/` (deleted or replaced by
  3009, not left as production code)

## Technical Tasks
- Apply the `react-ui-library-strategy.md` dependency rule before adding any new runtime/animation
  library (could Motion for React already satisfy it? does it need WebGL?).
- Confirm the chosen technology can be lazy-loaded so the rest of the app is unaffected if it fails
  to load (charter section 22 "not a technology experiment looking for a purpose").
- Keep the spike isolated from real routes/state; it should not be wired into the Dashboard yet.

## Acceptance Criteria
- A technology is chosen with documented reasoning against the concrete design requirements.
- The spike renders the character and swaps between at least two documented poses.
- The spike demonstrates a working failure/loading fallback path.

## Verification
- Manually run the spike locally; no permanent automated test required per the Phase 3 Testing
  Approach in `docs/phased-development-plan.md`.

## Completion Notes
Pending implementation.
