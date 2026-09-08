# GoalStateCompanion — State Composition Rules

**Status:** Decided (Phase 3, ticket 3003). Resolves `GSP-ConceptCharter.md` §24 "Composition"
(Q13–17). Consumes semantic dimensions from `02_State-Model.md`; does not invent poses (3004) or
clips (3005).

**Component:** `GoalStateCompanion` (behaviour resolution)
**Purpose:** Decide how several simultaneous state dimensions combine into one coherent character
without requiring a manually authored combination for every pairing.

---

## 1. Separation of Concerns (charter §6)

```text
CompanionSemanticState          (02_State-Model.md — what data means)
        ↓
ResolvedBehaviour               (this document — which layers express what)
        ↓
StaticPose / AnimationVocab     (3004 / 3005 — how it looks/moves)
```

Composition outputs **semantic behaviour tokens** (e.g. `posture: recovery-low-fuel`), never
renderer clip names like `sweaty_03`.

---

## 2. Behaviour Layers

| Layer ID | Role | Default when unowned / unknown |
|---|---|---|
| `idle` | Base standing / quiet presence | Soft neutral sway (or static stand under reduced-motion) |
| `posture` | Whole-body stance and weight | `neutral-stand` |
| `face` | Eyes / mouth / optional brows | `neutral` |
| `breathing` | Torso breath amplitude/rate | Soft resting breath |
| `limbs` | Arms + stance micro-gestures | Arms relaxed at sides |
| `bodyForm` | Temporary soft torso squash/stretch | Rest proportions |
| `effects` | Non-particle physical cues (e.g. sweat sheen) | None |
| `materialAccent` | Small colour accent only (never full-body recolour) | Moss base, no accent — or subdued for no-data |

Layers are **semi-independent**. Resolution sets each layer from one primary owner, then applies
quiet secondary influence. Additive combination is allowed where layers do not fight (see §5).

---

## 3. Layer Ownership (Q13–14)

| Layer | Primary owner | Secondary influence | Must suppress when |
|---|---|---|---|
| `posture` | **Dominant immediate physical condition** — see §4 priority | `goalProgress` (quiet: slightly more/less upright confidence) | `dataState = no-data` → mannequin stand only |
| `face` | Comfort vs effort from **nutrition + movement** conflict rules | `goalProgress` only for milestone soft smile | Dimension `unknown` → keep neutral for that cue |
| `breathing` | `movement` (exertion) | Soften when `nutrition = low` late day (recovery) | `movement = unknown` → resting breath only |
| `limbs` | Gestures driven by same dominant condition as posture | Occasional idle fidget when energy allows | Unknown primary → no invented gesture |
| `bodyForm` | `nutrition` only (`over-target` / `significantly-over` → slight fullness; `low` late → slight tuck) | None | `nutrition = unknown` → rest form |
| `effects` | `movement` (`high` / `very-high` → sweat/exertion cue) | None | `movement = unknown` → no effects |
| `materialAccent` | Contextual cue: coral = nutrition-led moment; lavender = movement-led; lime = milestone/highlight | `goalProgress` for quiet lime on ahead/milestone | `no-data` → reduced saturation, no accent |
| `idle` | Energy leftover after primary resolution | `goalProgress` (quieter vs livelier idle) | `no-data` → subdued / near-static |

**Answers:**
- **Q13 — What owns posture?** The dominant immediate physical condition (§4), not goal progress.
- **Q14 — What owns face?** Effort/comfort/attentiveness from the nutrition×movement resolution;
  goal progress may only add a soft milestone smile, never sadness from a weigh-in.

---

## 4. Dominant Immediate Condition (posture priority)

When nutrition and movement both have known values, pick **one** posture driver:

| Priority | Condition | Posture token |
|---|---|---|
| 1 | `nutrition = significantly-over` | `over-full` |
| 2 | `nutrition = over-target` | `mildly-full` |
| 3 | `movement = very-high` | `high-exertion` |
| 4 | `movement = high` | `exertion` |
| 5 | `nutrition = low` **and** firm time (`evening` / `day-complete`) | `low-fuel` |
| 6 | `movement = low` **and** firm time | `under-moved` (soft, not punitive) |
| 7 | otherwise within-range / target-met / moderate / soft morning under-reads | `balanced` |

If only one dimension is known (`dataState = partial`), that dimension alone may drive posture;
unknown dimensions stay at defaults (charter §12).

`goalProgress` never wins posture priority. It may nudge uprightness ± a small confidence bias after
the primary token is chosen (charter §10).

---

## 5. Conflict Resolution and Blending (Q15–16)

### 5.1 Competing states (Q15)

Dimensions may disagree. Resolution order:

1. Apply `dataState` gate (force unknowns / mannequin).
2. Resolve `bodyForm` from nutrition only; `effects` + `breathing` from movement only.
3. Resolve `posture` via §4 priority table.
4. Resolve `face` from a small matrix (§5.2) — may differ from posture when that is more honest
   (e.g. over-target + high Move → mildly-full posture + content/effort face, not shame).
5. Apply quiet `goalProgress` confidence bias and optional milestone accent.
6. Idle fills leftover energy; never invent a second story.

No combinatorial explosion: **N layer owners × M category values**, not N×M hand-authored full
poses for every pairing.

### 5.2 Face matrix (informative, not judgemental)

| Nutrition ↓ / Movement → | low / moderate | target-met | high / very-high |
|---|---|---|---|
| low (firm) | `concern-soft` | `low-fuel` | `effort-tired` |
| within / approaching | `attentive` | `content` | `effort-content` |
| over / significantly-over | `full-soft` | `full-content` | `full-effort` |

Unknown side of a pair → use the known side's "alone" face (content/attentive/effort as appropriate)
without inventing the missing cue.

### 5.3 Additive blending (Q16)

**Yes, layers blend additively** where they do not conflict:

- Allowed together: `bodyForm` fullness + `effects` sweat + elevated `breathing` + `mildly-full`
  posture.
- Not allowed: two competing postures, or inventing movement effects when Move is unknown.
- Prefer **layered parameters** (breath rate, torso scale, accent intensity) over discrete
  full-body clip swaps for every combo. Clip swaps are reserved for rare gestures/milestones
  (see 3005).

### 5.4 Temporary effects (Q17)

Temporary effects are short-lived cues that do **not** redefine the day's semantic state:

| Trigger | Effect | Lifetime |
|---|---|---|
| Fresh load / first paint | Brief settle from mannequin/neutral into resolved pose | Once per mount |
| Live data update | Cross-fade layers from previous resolved behaviour | Brief; from previous, not from zero |
| Selected-day change | Transition previous day → new day's resolved behaviour | Per Motion Rules |
| Goal milestone (crossing a meaningful progress band) | Soft lime accent + brief pleased face | Short celebratory beat, then return |
| `movement` enters `high` / `very-high` | Sweat/exertion cue intensity ramp | While condition holds |
| End of high exertion while nutrition low (evening) | Recovery breath + low-fuel face over exertion posture decay | While both hold |

No "missed day guilt" temporary effects. No particle systems required for Phase 3 vocabulary.

---

## 6. Partial-Data Composition

When `dataState = partial`:

```text
Express known dimensions on their owned layers.
Suppress unknown-owned layers to defaults.
Do not invent the missing half of a conflict.
```

Example — meals logged, Move null:

- `bodyForm` / nutrition-led face cues: allowed
- `effects`, exertion breathing, high-Move posture: **suppressed**
- Posture falls through nutrition-only rows of §4
- Accent may use coral if nutrition is the active story; never lavender for invented Move

Example — Move logged, no meal evidence:

- Exertion layers allowed from movement
- `bodyForm` stays rest; no fullness/low-fuel from invented calories

When `dataState = no-data`: every expressive layer collapses to mannequin defaults (detail in 3006;
static pose in 3004).

---

## 7. Quiet Goal-Progress Influence

| `goalProgress` | Allowed influence |
|---|---|
| `unknown` / `neutral` | None |
| `behind-trajectory` | Slightly softer uprightness; never sad face as primary |
| `on-trajectory` | Default confidence |
| `ahead-of-trajectory` | Slightly taller/open posture bias; optional quiet lime accent |
| Milestone (implementation flag from 3008+) | Temporary pleased face + lime accent (§5.4) |

Goal progress must remain quieter than daily nutrition/movement (charter §10).

---

## 8. Important Resolved Compositions (inputs to 3004)

These are the **important** composed states that must each get a static pose in ticket 3004.
They are named by resolved behaviour, not by every raw enum pairing:

| ID | Typical drivers | Posture | Face | Body | Effects |
|---|---|---|---|---|---|
| `mannequin` | `dataState = no-data` | mannequin-stand | blank-neutral | rest | none |
| `balanced` | within-range + target-met/moderate | balanced | content | rest | none |
| `over-full` | significantly-over (± any Move) | over-full | full-* | slight fullness | optional sweat if Move high |
| `mildly-full` | over-target | mildly-full | full-soft / full-content | slight fullness | as Move |
| `high-exertion` | very-high Move, nutrition not significantly-over | high-exertion | effort-* | rest unless over | sweat |
| `exertion` | high Move | exertion | effort-content | rest unless over | light sweat |
| `low-fuel` | firm low nutrition | low-fuel | low-fuel / effort-tired | slight tuck | sweat if Move high |
| `under-moved` | firm low Move, nutrition ok | under-moved | attentive | rest | none |
| `partial-nutrition-only` | partial + nutrition known | nutrition-led | nutrition-led | as nutrition | none |
| `partial-movement-only` | partial + movement known | movement-led | movement-led | rest | as Move |
| `milestone` | ahead / milestone flag | balanced+open | pleased | rest | lime accent |

Historical `day-complete` uses the same catalogue with firm under-target readings (see 3006).

---

## 9. Worked Conflict Example

**Inputs (live evening):** `nutrition = over-target`, `movement = very-high`,
`goalProgress = on-trajectory`, `dataState = live`, `timeContext = evening`.

**Resolution:**

1. Gate: all dimensions known → full composition.
2. `bodyForm` ← nutrition → slight fullness.
3. `effects` + `breathing` ← very-high Move → sweat + heavy breath.
4. Posture priority: `over-target` (priority 2) beats `very-high` (priority 3) → `mildly-full`.
5. Face matrix: over × very-high → `full-effort`.
6. Goal: on-trajectory → no extra bias.
7. Idle: reduced (exertion already owns energy).

**Resolved behaviour tokens:**

```text
posture: mildly-full
face: full-effort
breathing: heavy
limbs: optional hand-near-torso micro-gesture
bodyForm: slight-fullness
effects: sweat
materialAccent: none (or soft coral if emphasising intake cue)
idle: subdued
```

Meaning communicated: finished-feeling + high exertion, not punishment.

---

## 10. Answers to Charter §24 Composition Questions

| # | Question | Answer |
|---|---|---|
| 13 | Which signal owns posture? | Dominant immediate physical condition via §4 priority; goal progress is secondary bias only. |
| 14 | Which signal owns facial expression? | Nutrition×movement face matrix; milestone may add a soft pleased face. |
| 15 | How do competing states resolve? | Layer ownership + posture priority + face matrix; unknowns suppressed (§5, §6). |
| 16 | Can animations blend additively? | Yes for non-conflicting layers/parameters; avoid full-body clip-per-combo (§5.3). |
| 17 | What creates temporary effects? | Load settle, data/day transitions, milestone beat, exertion sweat while condition holds (§5.4). |

---

## 11. Implementation Freedom / Next

- Exact numeric intensity curves belong to 3008/3010.
- Static readable forms of each important ID → **3004**.
- Motion, idle loops, transitions → **3005**.
- Historical final-state and mannequin language detail → **3006**.
