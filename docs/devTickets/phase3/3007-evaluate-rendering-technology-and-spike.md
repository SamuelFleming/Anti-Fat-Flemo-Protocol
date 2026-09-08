# 3007 - Confirm 3D Rendering Technology (React Three Fiber) and Spike

**Status:** Blocked  
**Phase:** 3  
**Depends On:** 3004, 3005, 3006

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 19, 21, 24 "Technology")
- `docs/DesignConcept/react-ui-library-strategy.md` (Technology Position / Dependency Rule)

## Objective and User Outcome
The companion will be a proper 3D character, rendered with **React Three Fiber (Three.js)** —
this is a confirmed product decision, not an open evaluation. This ticket documents that decision
against the concrete requirements from 3004-3006 and proves it actually works before further
implementation invests in it.

## Decision (Locked)

**React Three Fiber / Three.js**, not Rive/Spline/Lottie/CSS-SVG/sprite-based. Rationale to expand
on in the produced doc:
- the character direction (3001) and pose/animation ambitions (3004/3005) call for genuine 3D
  posture, soft-body deformation and camera-consistent presentation, which 2D/vector tooling would
  only approximate;
- R3F integrates natively with the existing React/Vite client without a second UI paradigm;
- it is the most flexible option for the historical/no-data and composition-driven pose blending
  described in 3003/3006.

## Scope
- Produce `docs/DesignConcept/GoalStateCompanion/07_Technology-Evaluation.md` recording the R3F/
  Three.js decision above, briefly noting why Rive/Spline/Lottie/CSS-SVG/sprite-based were not
  chosen, and covering: dimensionality/deformation fit (3001), pose/expression range (3004),
  blending needs (3005), historical transitions (3006), performance/bundle-size impact, and
  reduced-motion support strategy for a WebGL-rendered character.
- Build a small throwaway technical spike proving R3F can render the character concept, load/swap
  at least two poses, and run acceptably in the existing Vite/React client.

## Out of Scope
- Final character asset/model production, the real state contract (3008), any permanent integration
  into app routes/navigation.

## Likely Files / Areas
- `docs/DesignConcept/GoalStateCompanion/07_Technology-Evaluation.md`
- `client/package.json` (adds `three`, `@react-three/fiber`, and likely `@react-three/drei`)
- A throwaway spike location such as `client/src/features/companion/_spike/` (deleted or replaced by
  3009, not left as production code)

## Technical Tasks
- Still apply the `react-ui-library-strategy.md` dependency rule in the write-up (justify why
  Motion for React alone cannot satisfy true 3D posture/deformation, since this is a new WebGL
  dependency for the client).
- Confirm R3F can be lazy-loaded (dynamic import) so the rest of the app bundle/first paint is
  unaffected, and so a WebGL-unavailable browser degrades gracefully (charter section 22).
- Keep the spike isolated from real routes/state; it should not be wired into the Dashboard yet.

## Acceptance Criteria
- The R3F/Three.js decision is documented with concrete reasoning against 3001/3004/3005/3006.
- The spike renders the character with R3F and swaps between at least two documented poses.
- The spike demonstrates a working failure/loading fallback path (including no-WebGL).

## Verification
- Manually run the spike locally; no permanent automated test required per the Phase 3 Testing
  Approach in `docs/phased-development-plan.md`.

## Completion Notes
Pending implementation.
