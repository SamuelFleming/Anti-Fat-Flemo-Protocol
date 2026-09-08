# GoalStateCompanion — Technology Evaluation

**Status:** Decided (Phase 3, ticket 3007). Confirms the locked product choice of
**React Three Fiber / Three.js** for a proper 3D companion, documents why alternatives were not
chosen, and records the throwaway spike that proves the stack works in this Vite/React client.

**Component:** `GoalStateCompanion` (runtime / rendering technology)
**Depends on:** visual language (3001), poses (3004), animation vocabulary (3005), historical/
no-data behaviour (3006).

---

## 1. Decision (Locked)

```text
Renderer: React Three Fiber (@react-three/fiber) + Three.js
Helpers:  @react-three/drei (as needed)
Host:     Existing React 19 + Vite client
Load:     Dynamic import / lazy Canvas so the rest of the app is unaffected
```

This is **not** an open bake-off. Product direction requires a genuine 3D character in the
Dashboard centre column; R3F is the confirmed stack.

---

## 2. Why R3F Fits 3001 / 3004 / 3005 / 3006

| Requirement | Fit |
|---|---|
| **3001** soft seed silhouette, squash/stretch, camera-consistent form | Native 3D mesh/primitive deformation and lighting; moss material + small accents as materials, not flat fills pretending to be volume |
| **3004** stance / weight / torso / arms as readable static poses | Pose parameters / morphs / simple transform targets per catalogue ID; reduced-motion lands on the same static pose |
| **3005** layered procedural breath, bodyForm, sweat sheen, sparse gestures | Additive channels in the R3F frame loop + occasional clip/one-shot — matches the preferred blending model (not one full-body clip per combo) |
| **3006** day-to-day cross-fade, mannequin saturation drop | Interpolate layer targets between resolved behaviours; material saturation is a uniform/material prop |

---

## 3. Why Not the Alternatives

| Option | Why not |
|---|---|
| **Motion for React alone** | Excellent for DOM/SVG signature widgets; cannot provide true 3D posture, soft-body volume, or camera-consistent lighting without faking depth. Dependency rule: Motion remains the primary *UI* motion system; WebGL is justified here because the companion is a dimensional character, not a minor flourish. |
| **Rive** | Strong 2D/state-machine tool; poor fit for the locked “proper 3D” direction and soft volumetric deformation. |
| **Spline** | Possible 3D authoring, but introduces a second design/runtime paradigm and weaker React-native composition for our layer-owned behaviour model. |
| **Lottie** | Vector/timeline clips; no real 3D posture blending or procedural breath/bodyForm layers. |
| **CSS / SVG / sprites** | Acceptable fallback sketches only; cannot honestly deliver 3001/3004 soft-body 3D presence. |

---

## 4. Dependency Rule (`react-ui-library-strategy.md`)

Before adding Three.js / R3F we asked:

1. **Could Motion alone do it?** No — not for true 3D posture/deformation.
2. **Second animation engine?** Yes for the companion only; Motion stays for gauges/ribbon/page UX. Scope the WebGL island tightly.
3. **WebGL merely for a minor effect?** No — the companion *is* the 3D character surface.
4. **Reduced motion?** Yes — disable procedural loops/gestures; snap to 3004 static pose; keep meaning in pose/face (see §6).
5. **Styling consistency?** Moss-family materials and coral/lavender/lime accents only as small cues (3001).
6. **Useful after novelty?** Yes — it is the interpretive centre of the Dashboard composition (3011), not a one-off flourish.

---

## 5. Bundle, Lazy Load, and Degradation

- Install `three`, `@react-three/fiber`, and `@react-three/drei` in the client.
- Mount the Canvas only via **dynamic `import()`** so the main app chunk does not pay Three.js cost on every route.
- Detect WebGL; if unavailable or the dynamic import fails, show a static 2D/HTML fallback (mannequin-equivalent copy + posture label) — charter §22 graceful degradation.
- Spike location: `client/src/features/companion/_spike/` (throwaway; replaced by real prototype in 3009). Dev-only route `/dev/companion-spike` — **not** wired into Dashboard or nav.

---

## 6. Reduced-Motion Strategy (WebGL)

When `prefers-reduced-motion: reduce`:

- Do not run idle sway, breath loops, sweat shimmer, or gesture one-shots.
- Pose/face/bodyForm/accent jump (or brief cross-dissolve) to the 3004 static targets for the resolved composition ID.
- Canvas may still render the static 3D pose (preferred) or fall back to a static image/SVG later if needed — meaning must remain without motion.

---

## 7. Charter §24 Technology Questions

| # | Question | Answer |
|---|---|---|
| 21 | 2D, 2.5D or 3D? | **3D** via R3F/Three.js (locked). |
| 22 | Minimum viable animation system? | Layered procedural channels (breath, bodyForm, accent) + sparse gesture one-shots; static pose catalogue as the accessibility baseline (3004/3005). |
| 23 | Which runtime best supports composition? | R3F React tree + per-frame layer parameters matching 3003 ownership. |
| 24 | How should React communicate state? | Parent passes context → pure contract (3008) → renderer props; companion does not fetch. |
| 25 | Asset pipeline? | Spike uses primitives; production assets (3009+) stay simple soft-body-friendly meshes — exact pipeline refined when modelling begins. |

---

## 8. Spike Results (ticket 3007)

| Check | Result |
|---|---|
| R3F Canvas in Vite/React client | Proven via `/dev/companion-spike` |
| Seed-like character (primitives approximating 3001 silhouette) | Yes |
| Swap ≥ 2 documented poses (`mannequin` ↔ `high-exertion`) | Yes |
| Lazy load of R3F chunk | Yes (`React.lazy` / dynamic import) |
| No-WebGL / load failure fallback UI | Yes |
| Not integrated into Dashboard | Confirmed |

Performance: spike is intentionally tiny (primitives only). Bundle-size impact of Three.js is accepted for the companion island and deferred from the critical path by lazy loading; measure again when 3009 adds real assets.

---

## 9. Next

- Pure state contract → **3008** (can proceed in parallel once this ticket lands).
- Real render prototype replacing `_spike` → **3009**.
- Full animation system → **3010**; Dashboard centre integration → **3011**.
