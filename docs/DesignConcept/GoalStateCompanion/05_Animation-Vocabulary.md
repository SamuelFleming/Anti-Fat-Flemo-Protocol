# GoalStateCompanion — Animation Vocabulary

**Status:** Decided (Phase 3, ticket 3005). Turns the static catalogue in
`04_Pose-and-Expression-Catalogue.md` into a restrained living vocabulary: idle, breath, gestures,
transitions, and effects — without requiring dozens of hand-authored full-body clips.

**Component:** `GoalStateCompanion` (motion language)
**Purpose:** Conceptual motion rules for ticket 3007 technology confirmation and ticket 3010
implementation. Aligns with `00_UI-Design-Concept.md` Motion Rules and charter §8–11.

---

## 1. Motion Principles

1. **Meaning lives in the static pose** (3004). Animation elaborates; it never carries meaning alone.
2. **Layered / composable motion** preferred over combinatorial full-body clips (matches 3003 §5.3).
3. **Restrained** — no constant decorative looping that competes with gauges/ribbon data.
4. **App Motion Rules apply:**
   - Fresh load → animate once from neutral/mannequin into resolved pose.
   - Live data update → animate from **previous** resolved behaviour, not from zero.
   - Selected-day change → cross-fade/transition previous day → new day; do not replay full entrance.
5. Respect `prefers-reduced-motion`: snap or cross-dissolve to the matching 3004 static pose; suppress
   idle loops, sweat shimmer, and gesture one-shots.

---

## 2. Blending Model (for 3007 evaluation)

Phase 3 assumes a **layered parameter + sparse clip** model, not a huge state-machine of full-body
takes:

| Channel | Mechanism | Complexity |
|---|---|---|
| Posture | Blend toward target pose parameters / morph weights | Continuous |
| Face | Discrete face token cross-fade (eyes/mouth/brows) | Low |
| Breathing | Procedural sinus on torso scale/offset; rate/amplitude from movement | Procedural |
| Body form | Bounded torso squash parameter from nutrition | Continuous |
| Effects | Sweat sheen opacity/intensity from movement | Continuous |
| Material accent | Colour/emissive accent intensity | Continuous |
| Idle | Soft procedural sway **or** rare short additive clips | Low |
| Gestures / milestones | Sparse one-shot clips or procedural arcs, additive on top | Few clips |

**Technology implication (already locked to R3F / Three.js in 3007):** the runtime must support
additive or parallel layering of procedural channels + occasional clip one-shots. A pure
"one full-body clip per composition ID" approach is explicitly **out of preference**.

Reduced-motion: disable procedural loops and one-shots; keep pose/face/bodyForm/accent at their
static targets.

---

## 3. Breathing

| Movement semantic | Breath rate | Amplitude | Reduced-motion |
|---|---|---|---|
| `unknown` / `low` / `moderate` | Slow resting | Small | Static torso at rest pose |
| `target-met` | Easy | Small–medium | Static |
| `high` | Elevated | Medium | Static mid-inhale bias allowed in pose |
| `very-high` | Higher | Larger (still bounded) | Static high-exertion torso |

When firm `nutrition = low` coexists with high Move: prefer **recovery** breath (slower than peak
exertion, still present) — matches 3003 recovery temporary behaviour.

---

## 4. Idle Behaviour

Idle is what remains after primary layers are set. It must feel alive without stealing attention.

| Energy leftover | Idle motion | Reduced-motion |
|---|---|---|
| `no-data` | Near-static; optional imperceptible settle only | Fully static `mannequin` |
| Low (low-fuel / under-moved / over-full) | Minimal sway | Static matching pose |
| Balanced | Soft weight shift / gentle sway (slow) | Static `balanced` |
| Post-exertion | Occasional slow recovery sway; rare stretch one-shot | Static exertion/high-exertion pose |

Idle never introduces a second narrative (e.g. no random "sad fidget" on a balanced day).

---

## 5. Gesture Set (sparse)

Gestures are **optional one-shots**, not continuous stories. Author few; trigger rarely.

| Gesture ID | When | Motion sketch | Static fallback (3004) |
|---|---|---|---|
| `settle-in` | Fresh mount | Soft drop into resolved pose from mannequin/neutral | Final resolved pose |
| `hand-to-torso` | Entering mildly-full / over-full | One arm arcs toward midsection | Arms already in full pose |
| `recovery-stretch` | After very-high while settling | Soft overhead/side stretch then return | `high-exertion` or `balanced` |
| `pleased-pulse` | Milestone | Brief open posture + face to pleased | `milestone` pose |
| `day-crossfade` | Selected-day change | Cross-fade layers A→B | Snap to day B pose |

No talk animations, no wave-at-user pet behaviours, no guilt gestures for missed days.

---

## 6. Transitions

### 6.1 Fresh load

```text
mannequin / neutral → settle-in → resolved layers for selected day
```

Brief; stagger with other dashboard widgets per global Motion Rules. Do not sequence a long intro.

### 6.2 Live data update (same day)

```text
previous ResolvedBehaviour → short cross-fade of changed layers only → new ResolvedBehaviour
```

Examples: meal logged pushing nutrition to over-target → bodyForm + posture + face update; Move
unchanged layers stay put.

### 6.3 Historical / selected-day change (charter §11)

```text
Day A resolved → day-crossfade → Day B resolved
```

Rules:

- Always interpolate from the **currently displayed** companion state to the newly selected day's
  final/known state (3006 defines what "final" means).
- Do **not** replay fresh-load entrance.
- Future day or empty day → cross-fade toward `mannequin`.
- Partial day B → only known layers animate to expressive targets; unknown layers fade to defaults.

### 6.4 Timing guidance (non-normative)

Keep transitions short (subjectively sub-second to ~1.5s for day changes). Exact ms are free in
3010 so long as they feel quieter than signature gauge sweeps when competing for attention.

---

## 7. Effects (particle-free)

| Effect | Driver | Motion | Reduced-motion |
|---|---|---|---|
| Sweat sheen | `movement` high / very-high | Soft opacity pulse or static sheen | Static sheen at low opacity **or** omit if pose already reads exertion |
| Accent glow | coral / lavender / lime | Fade in/out with state | Static accent colour at target intensity |
| Saturation drop | `no-data` | Instant or short fade to subdued moss | Subdued static material |

No confetti, spark trails, or floating icons.

---

## 8. Mapping Animated Behaviour → Static Pose

| Animated behaviour | Reduced-motion / static equivalent |
|---|---|
| Balanced idle sway | `balanced` |
| Fullness settle + hand-to-torso | `mildly-full` or `over-full` |
| Exertion breath + sweat | `exertion` / `high-exertion` |
| Low-fuel tuck + soft sway | `low-fuel` |
| Under-moved quiet idle | `under-moved` |
| Milestone pleased-pulse | `milestone` |
| No-data subdued idle | `mannequin` |
| Day cross-fade mid-flight | Prefer end-state pose of target day if interrupted |

---

## 9. What This Vocabulary Is Not

- Not a cutscene system.
- Not a pet emotion simulator.
- Not unbounded clip production.
- Not a replacement for readable gauges — companion motion is interpretive, secondary to data widgets.

---

## 10. Implementation Freedom / Next

- Exact curves, clip counts, and R3F animation graph → 3007 spike + 3010.
- Historical final-state semantics that transitions land on → **3006**.
- State contract feeding these layers → 3008.
