# GoalStateCompanion — Historical and No-Data Behaviour

**Status:** Decided (Phase 3, ticket 3006). Resolves `GSP-ConceptCharter.md` §24 "History" (Q18–20)
and locks behaviour for selected-day browsing already used by Dashboard/Progress.

**Component:** `GoalStateCompanion` (context / confidence presentation)
**Purpose:** Define what the companion shows for completed days, partial days, empty days, and
future days — without treating missing data as failure.

Depends on: `02_State-Model.md` (dimensions), `04_Pose-and-Expression-Catalogue.md` (`mannequin`
and expressive poses). Transition *timing* lives in `05_Animation-Vocabulary.md`; this document
defines **what state those transitions land on**.

---

## 1. Selected-Day Authority

The companion does **not** invent its own notion of "current context".

```text
App selectedDate (Dashboard / Progress / shared day context)
        ↓
Dashboard (or equivalent) payload for that date
        ↓
CompanionSemanticState (02)
        ↓
ResolvedBehaviour (03) → Pose (04) / Motion (05)
```

Changing `selectedDate` is the only way to change which day's companion state is shown. Live clock
phase (`morning`…`evening`) applies **only** when `selectedDate` is today.

---

## 2. Day Classes

| Class | Definition | Companion stance |
|---|---|---|
| **Live today** | `selectedDate === today` | Evolving; soft under-target rules by clock phase |
| **Completed historical** | `selectedDate < today` | Final known state (§3); `timeContext = day-complete` |
| **Empty historical** | `selectedDate < today` **and** no meal evidence **and** Move null | `dataState = no-data` → mannequin (§5) |
| **Future** | `selectedDate > today` | Always `no-data` → mannequin; never invent upcoming behaviour |
| **Partial historical** | Past day with only one of nutrition/Move evidence | Per-dimension expression (§4) |

Empty historical ≠ future: both render mannequin, but copy/accessibility text should distinguish
"No data for this day" vs "Day not started yet" when the parent surfaces a label. The companion
visual itself stays the same neutral mannequin (no sad empty-history pose).

---

## 3. Final Known State (Q18)

For a **completed historical** day, "final known state" means:

1. Build `CompanionSemanticState` from that date's stored metrics exactly as 02 defines.
2. Force `timeContext = day-complete` (firm under-target labelling — evening-strength readings).
3. Set `dataState`:
   - `complete` if meal evidence **and** Move are both present;
   - `partial` if only one is present;
   - `no-data` if neither is present.
4. Resolve behaviour via 3003 using those semantics.
5. **Do not** keep a separate persisted "companion snapshot" document for Phase 3 — recompute from
   canonical tracking data so companion and gauges cannot disagree.
6. Goal progress uses the goal trajectory **as of that selected day** when the parent API provides
   historical progress context; if only "current" progress exists, use quiet/`neutral` influence
   rather than today's progress painted onto Wednesday.

The visual landing pose is the matching 3004 catalogue entry (e.g. Wednesday over + high Move →
`mildly-full` / `full-effort` static form under reduced-motion).

---

## 4. Partial Historical Data (Q19)

Partial is **not** all-or-nothing and **not** mannequin.

| Known | Unknown | Behaviour |
|---|---|---|
| Nutrition only | Movement | Nutrition-owned layers express; exertion/sweat/athletic posture suppressed → `partial-nutrition-only` |
| Movement only | Nutrition | Movement-owned layers express; bodyForm fullness/tuck suppressed → `partial-movement-only` |
| Neither | — | `no-data` / mannequin |
| Both | — | Full final known state |

Certainty must never exceed evidence (charter §12). Unknown Move on a historical day must not be
treated as `0 kJ` / `low`.

---

## 5. No-Data / Mannequin Language (Q20)

Extends 3004 `mannequin` and charter §13:

| Cue | Spec |
|---|---|
| Pose | `mannequin` — centred stand, arms at sides, blank-neutral face |
| Material | Moss base at **reduced saturation**; no coral/lavender/lime accent |
| Motion | Subdued / near-static (05); reduced-motion → fully static |
| Meaning | Uninstantiated / unknown — **not** sad, abandoned, inactive-as-punishment |
| Distinction | Must remain visually distinct from `low-fuel` and `under-moved` |
| A11y | Parent should expose text such as "No data" / "Day not started"; companion animation is never the sole signal |

Future days and empty historical days share this visual language.

---

## 6. Live vs Historical Contrast

| Concern | Live today | Historical completed |
|---|---|---|
| Time phase | Clock-based soft/firm under-reads | Always firm (`day-complete`) |
| Evolution | Updates as meals/Move change | Stable until underlying logs for that date change |
| Entrance | Fresh load settle-in | Day-crossfade from previously shown day |
| Partial | Same per-dimension rules | Same |
| No data | Mannequin until first evidence | Mannequin for empty past days |

Editing a historical day's log (if the product allows) recomputes final known state and may animate
from previous historical resolution → new resolution (still not a full entrance replay).

---

## 7. Worked Examples

### A — Complete Wednesday

Meals 2100 / 1800, Move 2000/1800, past day.

- `dataState = complete`, `timeContext = day-complete`
- `nutrition = over-target`, `movement = target-met` (or high if ratio warrants)
- Resolve → `mildly-full` (+ content/full face); land on that 3004 pose

### B — Partial Thursday (Move only)

Move 900/1800, no meals, past day.

- `dataState = partial`, movement `low` (firm), nutrition `unknown`
- → `partial-movement-only` / `under-moved`; no fullness cue

### C — Empty Monday

No meals, Move null, past day.

- `dataState = no-data` → `mannequin`
- Not `low-fuel`

### D — Tomorrow

Future date selected.

- `dataState = no-data` → `mannequin`
- Accessible label: day not started (parent)

---

## 8. Answers to Charter §24 History Questions

| # | Question | Answer |
|---|---|---|
| 18 | What is a historical day's final state? | Recomputed semantic state for that date with `day-complete` time rules and complete/partial/no-data gating; no separate companion snapshot store in Phase 3 (§3). |
| 19 | How does partial historical data behave? | Per-dimension expression with unknown-owned layers suppressed (§4). |
| 20 | What is the N/A mannequin language? | Subdued moss, blank-neutral centred stand, near-static; never sad/abandoned; shared by empty past and future days; distinct from low/negative poses (§5). |

---

## 9. Implementation Freedom / Next

- Day-crossfade animation parameters → already sketched in 3005; implement in 3010.
- Pure mapping functions from dashboard DTO → semantic → resolved behaviour → 3008.
- Dashboard centre placement → 3011 (locked layout).
