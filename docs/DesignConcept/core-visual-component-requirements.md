# Anti-Fat-Flemo — Core Visual Component Requirements

**Status:** Preliminary / Prototype Requirements

This document defines the initial canonical names and responsibilities of the application's domain visualisations.

---

# 1. `GoalJourneyTrack`

## Purpose

Represent current progress between the starting state and the active goal.

Primary initial use:

```text
Weight
```

The component should feel like a journey rather than a conventional percentage progress bar.

---

## Example

```text
82.0 kg                                      76.0 kg
START                                           GOAL

●━━━━━━━━━━━━━━●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━○
               ↑
            80.7 kg
             TODAY
```

---

## Primary Locations

* `/dashboard` — hero/summary version
* `/progress` — expanded analytical version

---

## Required Data

Conceptually:

```ts
type GoalJourneyTrackProps = {
  startValue: number;
  currentValue: number;
  targetValue: number;
  unit: string;

  startLabel?: string;
  currentLabel?: string;
  targetLabel?: string;

  previousValue?: number;
};
```

The implementation may evolve beyond this interface.

---

## Required Behaviour

The component must:

* display start, current and target values;
* make the current position immediately identifiable;
* support both progress and regression;
* support a current value outside the original start/goal bounds;
* not imply that each measurement must move toward the goal;
* provide exact numeric values in addition to visual position.

---

## Motion

On initial dashboard load:

* track appears;
* current marker settles into its calculated position.

After a new weigh-in:

* current value changes;
* marker transitions from previous position to current position;
* related textual deltas update.

Animation should communicate movement rather than celebrate it.

No confetti or success animation should occur for normal weigh-ins.

---

## Future Extension

`GoalJourneyTrack` should eventually support:

```text
milestones
goal phases
historical markers
date information
predicted trajectory
```

without requiring a fundamentally different visual metaphor.

---

# 2. `DailyTargetGauge`

## Purpose

Represent a metric's current value relative to its daily target.

This is the canonical component behind the two dashboard hero metrics.

Initial instances:

```text
Calories
Move
```

---

## Example

```text
CALORIES

  1,420
 / 1,800 kcal

  ◜━━━━━━━━◝
  ◟━━━━────◞

380 remaining
```

---

## Primary Locations

### `/dashboard`

Large/hero variant:

```text
Calories
Move
```

### `/log`

Compact variant providing immediate feedback after logging.

---

## Proposed Interface

```ts
type DailyTargetGaugeProps = {
  label: string;

  value: number;
  target: number;
  unit: string;

  displayMode?: "remaining" | "percentage" | "delta";

  status?: "default" | "complete" | "overTarget";
  size?: "compact" | "default" | "hero";
};
```

---

## Domain Wrappers

Do not duplicate gauge implementation.

Use:

```tsx
<DailyTargetGauge
  label="Calories"
  ...
/>

<DailyTargetGauge
  label="Move"
  ...
/>
```

Domain wrappers may eventually be introduced:

```text
CalorieBudgetGauge
MoveTargetGauge
```

but they should compose `DailyTargetGauge`.

---

## Required Behaviour

The gauge must:

* prioritise the actual numbers over decorative progress;
* remain understandable without the arc;
* clearly distinguish current value from target;
* display useful remaining/over-target information;
* handle values above 100%;
* never wrap repeatedly around the gauge when exceeding the target.

For example:

```text
1,950 / 1,800 kcal

+150 over target
```

is preferable to visually drawing a 108% circular loop.

---

## Motion

After data changes:

```text
970 → 1,420
```

the numeric display may count toward the new value while the arc moves toward its corresponding position.

Only the affected gauge should animate.

---

# 3. `WeeklyAccountabilityRibbon`

## Purpose

Provide a compact visual history of the active week.

This should become one of the application's most recognisable components.

The design philosophy is:

> The week is the primary accountability unit.

---

## Example

```text
THIS WEEK

MON ━━━ TUE ━━━ WED ━━━ THU ━━━ FRI ━━━ SAT ━━━ SUN
 ●        ●        ◐        ●        ○        ○        ○

        3 ON TRACK · 1 PARTIAL
```

---

## Primary Locations

* `/dashboard` — principal implementation
* `/progress` — potentially used as a week selector/history component

---

## Day States

Initial visual states should support approximately:

```ts
type AccountabilityStatus =
  | "onTrack"
  | "partial"
  | "outsideTarget"
  | "unlogged"
  | "future";
```

Final business definitions for these states belong to application logic rather than the visual component.

---

## Required Interaction

Selecting a completed/current day should reveal its details.

Example:

```text
WEDNESDAY
────────────────────────

Calories    1,970 / 1,800
Move        1,210 / 1,800
Weight      80.9 kg

PARTIAL

Calories    +170 kcal
Move        -590 kJ
```

The expanded content should preferably appear as part of the layout rather than as a modal.

---

## Supporting Component

Expanded details should be represented by:

```text
DaySummaryPanel
```

rather than being hard-coded into the ribbon itself.

---

## Motion

Selection should:

* move the active indicator;
* expand/collapse `DaySummaryPanel`;
* preserve spatial continuity.

The entire seven-day ribbon should not replay its entrance animation every time a day is selected.

---

# 4. `EnergyBalanceCard`

## Purpose

Explain the estimated energy balance transparently.

Example collapsed state:

```text
ESTIMATED BALANCE

     −710 kcal

estimated deficit          ⌄
```

Expanded:

```text
ESTIMATED BALANCE

Baseline expenditure       2,150 kcal
Move                        +387 kcal
Food                      −1,827 kcal
                          ──────────
Estimated deficit             710 kcal
```

---

## Primary Locations

* `/dashboard`
* `/log`

---

## Required Behaviour

The component must:

* clearly label the value as an estimate;
* make the calculation inspectable;
* expose the underlying values;
* expand inline where practical;
* avoid implying false precision.

The collapsed value is useful.

The expanded calculation establishes trust.

---

## Structural Pattern

This component should use a reusable:

```text
ExpandableMetricCard
```

design-system component.

Expansion should be a layout transition rather than an unrelated popup.

---

# 5. `TargetBandChart`

## Purpose

Visualise behaviour relative to an acceptable or desired range rather than simply plotting raw history.

---

## Example

```text
CALORIES · LAST 14 DAYS

2000 |                 ●
1900 |       ●       ╱
1850 | ┌─────────────────────────┐
     | │      TARGET BAND        │
1750 | └─────────────────────────┘
1700 |   ●             ●
     +────────────────────────────
```

---

## Initial Metrics

Potential uses:

```text
Calories
Move
```

Weight should generally use a conventional trend interpretation rather than implying that every daily weight must sit inside a narrow target band.

---

## Primary Location

`/progress`

A smaller preview could later exist on `/dashboard`.

---

## Required Behaviour

The component must distinguish:

```text
actual observations
desired/target region
time
```

without relying solely on colour.

Hover/focus should expose exact values.

---

## Motion

On first presentation the line may draw left-to-right.

Subsequent filter/range changes should transition more quietly.

---

# 6. `MetricTrendCard`

## Purpose

Provide a compact value plus short historical context.

Example:

```text
WEIGHT

80.7 kg
−1.3 kg since start

╲
 ╲___
     ╲__●
```

---

## Primary Locations

* `/dashboard`
* `/progress`

This component is supporting rather than a signature visualisation.

---

# 7. `DaySummaryPanel`

## Purpose

Show detailed information for a single selected day.

Likely consumers:

```text
WeeklyAccountabilityRibbon
Daily log history
Progress history
```

It should support the same underlying day's data without each screen creating its own presentation model.

---

# 8. `GoalPhaseTimeline`

## Purpose

Support longer-term usage once the user has more than one goal period.

Example:

```text
September Cut        Maintenance       Summer Goal
──────●──────────────────●─────────────────●──────
```

---

## Initial Status

**Deferred / design for extensibility, do not prioritise for MVP.**

It should not distract from getting `GoalJourneyTrack` right.

---

# 9. Initial Prototype Priority

### P0 — establish visual identity

1. `GoalJourneyTrack`
2. `DailyTargetGauge`
3. `WeeklyAccountabilityRibbon`

### P1 — complete dashboard language

4. `EnergyBalanceCard`
5. `MetricTrendCard`
6. `DaySummaryPanel`

### P2 — progress/history language

7. `TargetBandChart`

### P3 — longer-term evolution

8. `GoalPhaseTimeline`

The first three components should be visually prototyped together rather than independently, because their combined appearance will determine whether the dashboard feels cohesive.
