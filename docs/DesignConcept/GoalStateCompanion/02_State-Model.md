# GoalStateCompanion — State Model

**Status:** Decided (Phase 3, ticket 3002). Resolves `GSP-ConceptCharter.md` §24 "State" (Q7–12)
and implements the principles in charter §2–5 (selected-day context, informative/not judgemental,
range-aware, time-aware, no-data-as-unknown, more-is-not-infinitely-better).

**Component:** `GoalStateCompanion` (semantic layer only)
**Purpose:** Define what tracked conditions the companion is allowed to know about, and how raw
dashboard/domain metrics become renderer-independent semantic state. Composition into poses/
animations is ticket 3003+. Implementation is ticket 3008.

This document deliberately does **not** invent new calorie, Move, deficit or status formulas. It
consumes outputs already defined by `docs/core-scope/06-Calculation-Rules.md` and implemented in
`server/src/domain/` / the Dashboard contract.

---

## 1. Authority and Derivation Rule

```text
SelectedDayContext (parent app)
        ↓
Existing metrics / status (06-Calculation-Rules.md)
        ↓
Companion semantic dimensions (this document)
        ↓
Composition / behaviour (ticket 3003+)
        ↓
Renderer (ticket 3007+)
```

Rules:

- The parent owns factual tracking state. The companion subsystem owns interpretation into
  **semantic labels**, not animation names (charter §17, §20).
- Prefer categorical labels with an optional continuous intensity in `[0, 1]` where gradual
  expression helps (hybrid model — see §8 / Q9).
- Thresholds that already exist in domain config (`DAILY_STATUS_THRESHOLDS`) are reused, not
  redefined. Companion-only tolerances below are **presentation bands** around those same numbers,
  not a second calculation system.

---

## 2. Input Snapshot (what the companion may read)

For a selected calendar day, the companion may only consume values already available from the
Dashboard / Progress aggregation (or equivalent pure mapping of those fields):

| Field | Source | Notes |
|---|---|---|
| `date` | selected day | `YYYY-MM-DD` |
| `isToday` / `isFuture` | derived | Future days stay `dataState: no-data` |
| `caloriesConsumed` | meal sum | 0 means logged-empty or unlogged — see §6 |
| `targetCalories` | active/historical goal | null → nutrition unknown |
| `caloriesRemaining` | target − consumed | negative = over |
| `moveKj` | daily log | null = not recorded (never coerce to 0) |
| `targetMoveKj` | goal | null → movement unknown |
| `estimatedDeficit` | domain | optional cue only; never sole meaning |
| `dailyStatus` | domain | `on-track` / `partial` / `off-track` / `awaiting-data` |
| `progressPercent` | domain | goal trajectory; smoothed use — §7 |
| `currentWeightKg` | weight / start fallback | goalProgress only |
| `hasMeals` | meals.length > 0 | distinguishes empty day vs unlogged |
| `clockHourLocal` | client clock | live day only; historical → day-complete |

The companion must **not** independently fetch, store, or invent:

- medical/psychological states;
- "hunger", "tiredness", "laziness" as facts about the user;
- streak / absence punishment signals;
- formulas outside `06-Calculation-Rules.md`.

---

## 3. Dimensions That Deserve Representation (Q7)

These five dimensions are in scope:

```ts
type CompanionSemanticState = {
  nutrition: NutritionState
  movement: MovementState
  goalProgress: GoalProgressState
  dataState: DataState
  timeContext: DayPhase
  /** Optional continuous intensities in [0, 1] for gradual expression. */
  intensity?: {
    nutrition?: number
    movement?: number
    goalProgress?: number
  }
}
```

### 3.1 Nutrition

Finite set:

```text
unknown | low | within-range | approaching-target | over-target | significantly-over
```

**Derivation** (reuse calorie remaining + daily status thresholds from `06` #3 and #17):

Let `over = caloriesConsumed - targetCalories` (negative means under).

| Semantic | Condition |
|---|---|
| `unknown` | `targetCalories == null` **or** no meal evidence for the day (see §6) |
| `low` | meals exist **and** intake is contextually low for `timeContext` (see §5) |
| `within-range` | `caloriesConsumed <= target + 100` **and** not `low` |
| `approaching-target` | within-range **and** remaining ≤ ~15% of target **and** not over |
| `over-target` | `over > 100` **and** `over ≤ 300` |
| `significantly-over` | `over > 300` |

`+100` / `+300` are the existing on-track / off-track calorie bands from
`DAILY_STATUS_THRESHOLDS` — not companion-invented cliffs.

**"More is not infinitely better":** there is no `ecstatic-deficit` or ever-improving under-eating
band. Very large estimated deficit does **not** produce a more-positive nutrition label; if anything
it stays `low` / contextual, never celebrated.

### 3.2 Movement

Finite set:

```text
unknown | low | moderate | target-met | high | very-high
```

**Derivation** (reuse Move ratios from `06` #17):

Let `ratio = moveKj / targetMoveKj` when both are non-null.

| Semantic | Condition |
|---|---|
| `unknown` | `moveKj == null` **or** `targetMoveKj == null` |
| `low` | `ratio < 0.60` (same as off-track Move band) |
| `moderate` | `0.60 ≤ ratio < 0.90` |
| `target-met` | `0.90 ≤ ratio ≤ 1.15` |
| `high` | `1.15 < ratio ≤ 1.50` |
| `very-high` | `ratio > 1.50` |

**"More is not infinitely better":** `very-high` means high achievement **plus** high exertion /
possible recovery need — not "happier still". There is no unbounded sixth "ecstatic" movement band.

### 3.3 Goal progress

Finite set:

```text
unknown | behind-trajectory | on-trajectory | ahead-of-trajectory | neutral
```

**Derivation** (reuse `goalProgressPercent` from `06` #15; do not react to single weigh-ins):

| Semantic | Condition |
|---|---|
| `unknown` | no active goal **or** insufficient weight history to trust progress |
| `neutral` | goal exists but progress is near start / noise band (~0–5%) **or** gain/loss direction unclear |
| `behind-trajectory` | progress meaningfully below expected linear path for elapsed goal time |
| `on-trajectory` | progress within a quiet band of expected linear path |
| `ahead-of-trajectory` | progress meaningfully above expected linear path |

Smoothing rule (Q12): goal progress must use a **quiet, trajectory-based** reading — prefer
`progressPercent` vs elapsed fraction of the goal window, optionally buffered by recent weight
trend — **never** "weight went up today → sad / down today → happy". Single-day weight noise must
not flip this dimension.

### 3.4 Data state

Finite set:

```text
no-data | partial | live | complete
```

| Semantic | Condition |
|---|---|
| `no-data` | future day, **or** neither meals nor Move recorded |
| `partial` | exactly one of nutrition-evidence / Move recorded |
| `live` | selected day is today **and** at least one dimension has evidence |
| `complete` | historical (not today) **and** both calories evidence and Move recorded, **or** day marked complete for companion purposes after end-of-day |

`no-data` must never map to a negative emotional or "abandoned" meaning (charter §4.5, §13).

### 3.5 Time context (day phase)

Finite set:

```text
morning | midday | afternoon | evening | day-complete
```

| Semantic | Live day (`isToday`) | Historical / future |
|---|---|---|
| `morning` | local hour &lt; 11 | — |
| `midday` | 11–14 | — |
| `afternoon` | 14–18 | — |
| `evening` | ≥ 18 | — |
| `day-complete` | — | always for past days; also usable late evening if product later marks day closed |

Future days: do not invent a phase — keep `dataState: no-data` and treat timeContext as
`day-complete` only if needed as a placeholder; prefer suppressing timed cues entirely.

---

## 4. Dimensions That Must Not Affect the Character (Q8)

Do **not** drive companion semantics from:

- account age, login streaks, or "days since last log";
- estimated deficit magnitude as a moral score;
- weekly status alone (weekly ribbon already owns week narrative; companion is day-primary);
- protein / macros (MVP optional fields only);
- other users' data or social comparison;
- speculative medical inferences;
- UI chrome / navigation state.

Weekly accountability may later provide a **quiet secondary accent** via composition (3003), but it
is not a first-class companion dimension in this model.

---

## 5. How Time Modifies Interpretation (Q10)

Raw ratios alone are insufficient. `timeContext` gates whether an under-target reading is
meaningful:

### Nutrition × time examples

| Situation | Without time | With time |
|---|---|---|
| 600 / 1800 kcal at 10:00 (`morning`) | looks "low" | **not** `low` yet — still early; prefer `within-range` / quiet unless literally empty of meals when the user has started logging |
| 600 / 1800 kcal at 21:00 (`evening`) | same number | **`low`** — day is nearly over with little intake evidence |
| 1900 / 1800 at any phase | over | `over-target` regardless of time (overshoot is not rescued by morning) |

### Movement × time examples

| Situation | With time |
|---|---|
| `ratio = 0.4` at `morning` | soft `low` / provisional — opportunity remaining |
| `ratio = 0.4` at `evening` | firm `low` — unused movement opportunity late in day |
| `ratio = 1.6` at any phase | `very-high` (exertion/recovery reading), not "more happiness" |

Time never invents data. It only changes how **under**-target readings are labelled.

---

## 6. How Data Confidence Modifies Behaviour (Q11)

`dataState` is a hard gate on other dimensions:

| `dataState` | Effect on other dimensions |
|---|---|
| `no-data` | Force `nutrition = unknown`, `movement = unknown`. Goal progress may still show if an active goal exists, but must stay quiet/`neutral`–level influence only. Presentation → mannequin / uninstantiated (visual language in 3004/3006). |
| `partial` | Express **only** dimensions with evidence. Example: meals logged, Move null → nutrition may resolve; movement stays `unknown` (do not invent Move behaviour). |
| `live` | Full interpretation with time-aware soft/firm under-target rules. |
| `complete` | Full interpretation; timeContext = `day-complete`; under-target readings use the firm (end-of-day) reading. |

**Meal evidence vs zero calories:** `caloriesConsumed === 0` with no meal rows is **not** proof of a
fast — treat nutrition as `unknown` unless product later adds an explicit "logged empty day" signal.
Missing Move stays `unknown`, never `low` via coerced `0` (`06` #19).

---

## 7. Goal Trajectory Smoothing (Q12)

Decided approach for Phase 3:

1. Compute expected progress as elapsed fraction of `[startDate, targetDate]` (if no target date,
   use `neutral` / `on-trajectory` based only on whether progressPercent is mid-range without
   daily flips).
2. Compare `progressPercent` to that expected fraction with a **wide quiet band** (e.g. ±10–15
   percentage points) before leaving `on-trajectory`.
3. Prefer multi-day weight evidence over the latest single weigh-in when available.
4. Goal progress influences the companion more quietly than nutrition/movement (charter §10) —
   exact layer ownership is ticket 3003.

---

## 8. Categorical vs Continuous (Q9)

**Hybrid:**

- Every dimension has a **finite categorical** label (required for reduced-motion static poses,
  explainability, and testing).
- Optional `intensity` in `[0, 1]` may refine how strongly a pose/effect reads within that category
  (e.g. how far into `over-target`). Intensity must never create a new semantic meaning that is not
  already named by the category.

---

## 9. Worked Examples (acceptance)

### Example A — time × nutrition

Inputs: today 21:00, meals sum 600, target 1800, Move 1600/1800.

- `timeContext = evening`
- `dataState = live`
- `nutrition = low` (late day + low intake)
- `movement = target-met`
- `goalProgress` unchanged by this meal total alone

### Example B — data confidence × partial

Inputs: historical Wednesday, meals 1900/1800, Move null.

- `dataState = partial`
- `nutrition = over-target` (`over = 100` exactly → on the `> 100` band → `over-target`; if
  implementing equality edge, treat `over > 100` strictly and `over == 100` as still within the
  daily on-track calorie band → `within-range` / `approaching-target` as appropriate)
- `movement = unknown` (must not invent exertion behaviour)
- `timeContext = day-complete`

### Example C — movement ceiling

Inputs: Move ratio 2.0, calories on track, evening.

- `movement = very-high` (not a sixth "better" state)
- Intensity may be high, but meaning is exertion/recovery, not infinite celebration

### Example D — no data

Inputs: selected day with no meals and no Move.

- `dataState = no-data`
- `nutrition = unknown`, `movement = unknown`
- Never "disappointed" / "abandoned"

---

## 10. Answers to Charter §24 State Questions

| # | Question | Answer |
|---|---|---|
| 7 | Which dimensions deserve representation? | `nutrition`, `movement`, `goalProgress`, `dataState`, `timeContext` (§3). |
| 8 | Which should not affect the character? | Streaks, absence punishment, deficit-as-morality, weekly-only narrative as primary, macros, social/medical inference (§4). |
| 9 | Categorical, continuous, or hybrid? | Hybrid: required categories + optional `[0,1]` intensity (§8). |
| 10 | How should time modify interpretation? | Soft vs firm under-target labelling by day phase; overshoot not rescued by morning (§5). |
| 11 | How should confidence modify behaviour? | `dataState` gates unknown/partial/live/complete; never coerce missing Move to 0 (§6). |
| 12 | How should goal trajectory be smoothed? | Quiet band vs elapsed expected progress; no single weigh-in emotional flips (§7). |

---

## 11. Implementation Freedom / Next Tickets

- Exact ± quiet-band percentages for goal trajectory may be tuned in ticket 3008 as long as the
  smoothing *principle* above holds.
- Equality edges on calorie `+100` / `+300` bands must stay consistent with `calculateDailyStatus`
  in `server/src/domain/status.ts` — companion mapping should not disagree with Dashboard status
  language for the same inputs.
- Composition (which layer owns posture/face, conflict resolution) is **out of scope** here →
  ticket 3003.
- Historical final-state / mannequin visual language → tickets 3004 / 3006.
- Code mapping module → ticket 3008.
