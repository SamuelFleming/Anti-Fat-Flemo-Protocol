# GoalStateCompanion — Prototype Plan

**Status:** Active prototype plan (Phase 3, ticket 3009).

**Component:** `GoalStateCompanion`
**Purpose:** Prove end-to-end that R3F (3007) can render the seed character driven by the pure
state contract (3008) for a **small representative set** of composed states — before investing in
the full animation system (3010) or Dashboard integration (3011).

---

## 1. What This Prototype Validates

| Claim | How validated |
|---|---|
| Parent-owned context → semantic → resolved behaviour → visible pose | Component accepts only `CompanionDayContext`; calls `resolveCompanionState` |
| At least three distinct readable states | `mannequin`, `balanced`, `mildly-full` (plus `high-exertion` as a stretch check) |
| Pose language matches 3004 statically | Transform/face/accent targets keyed off resolved tokens — no animation loops yet |
| Renderer failure does not break the page | WebGL detect + lazy chunk error boundary → neutral placeholder |
| Isolation without Dashboard | Dev harness at `/dev/companion-prototype` |

---

## 2. Explicit Limits (out of prototype)

- No idle sway, breath loops, sweat shimmer, or gesture one-shots (→ 3010).
- No selected-day cross-fade / live update interpolation (→ 3010).
- Not the full 3004 catalogue — only representative poses needed for proof.
- No Dashboard centre-column layout (→ 3011).
- No production mesh/asset pipeline — still soft primitives approximating the 3001 silhouette.
- No data fetching inside the companion.

---

## 3. Architecture

```text
CompanionDayContext (prop)
        ↓
resolveCompanionState()          ← client/src/features/companion/companionState.ts
        ↓
ResolvedBehaviour
        ↓
GoalStateCompanion (shell)
  ├── lazy CompanionCanvas (R3F) when WebGL OK
  └── NeutralPlaceholder on no-WebGL / load failure
        ↓
SeedCharacter (static pose targets from behaviour)
```

---

## 4. Representative Fixtures (harness)

| Fixture | Expected composition |
|---|---|
| No data | `mannequin` |
| On-track afternoon | `balanced` |
| Over-target evening | `mildly-full` |
| Very-high Move (optional) | `high-exertion` |

---

## 5. Success Criteria for Exiting Prototype

- Three representative states are visually distinct at dashboard-ish size.
- Failure path never throws into the parent tree.
- Ready to layer 3010 animation on the same prop/contract surface without redesigning inputs.
