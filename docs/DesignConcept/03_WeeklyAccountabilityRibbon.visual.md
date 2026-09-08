# WeeklyAccountabilityRibbon

**Component:** `WeeklyAccountabilityRibbon`  
**Purpose:** Present the week as one connected accountability view while retaining useful weekly summary statistics.

## Base Layout

Retain the broad card/surface treatment from the Figma concept, but replace the seven isolated mini-cards with a connected ribbon/timeline.

```text
┌──────────────────────────────────────────────────────────────┐
│ THIS WEEK                              3 ON TRACK · 1 PARTIAL│
│ Consistency over perfection.                                │
│                                                              │
│ MON ━━━━━ TUE ━━━━━ WED ━━━━━ THU ━━━━━ FRI ━━━━━ SAT ━ SUN │
│  ●          ●          ◐          ●          ○          ○   ○ │
│                                                              │
│ Average Calories      Average Move       Weight Change       │
│ 1,740 kcal            1,710 kJ           −0.4 kg             │
└──────────────────────────────────────────────────────────────┘
```

The **card stays**; the days inside it form one continuous week.

## Day States

Support visibly distinct states for:
- on track;
- partial;
- outside target;
- no data;
- future;
- today;
- selected day.

Do not rely on colour alone.

`No data` means unknown, not failure.

## Selection

Selecting a day should:
- visibly move/emphasise the active node;
- update other day-aware dashboard widgets;
- animate from the previously displayed day's values rather than replaying from zero.

## Weekly Summary

Retain useful weekly aggregates, initially such as:
- average Calories;
- average Move;
- weight change;
- on-track / partial counts.

Exact metrics may evolve.

## Extended Trend View

Provide an optional expanded view for daily Calories and/or Move across the week.

```text
VALUE
2000 |       ●              ●
1800 | ●          ●    ●
1600 |      ●
     +----------------------------
       M   T   W   T   F   S   S
```

Possible modes:
- Calories;
- Move;
- both where readable.

Requirements:
- x-axis = day/time;
- y-axis = metric value;
- target/target range may be shown;
- chart can draw/hatch into view when expanded.

Click/tap is the canonical toggle. Hover may preview on desktop but must not be the only access method.

## Motion

- **Fresh load:** resolve/draw the ribbon across the week and introduce existing day states.
- **Day selection:** move the selected indicator from old node to new node.
- **Data update:** animate only affected day state(s) and weekly summaries.
- **Historical change:** transition from current values to new values rather than replaying entry animations.

## Implementation Freedom

Implementation may decide:
- exact node icons/shapes;
- ribbon line treatment;
- subtle organic/elastic response;
- expanded-chart placement;
- chart library;
- detailed transition timings.

Preserve the broad weekly card, connected seven-day ribbon, summary stats and optional trend expansion.
