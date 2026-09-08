# DailyTargetGauge

**Component:** `DailyTargetGauge`  
**Initial uses:** Calories, Move  
**Purpose:** Show the current daily value relative to a target as a responsive instrument.

## Base Visual

Use an approximately **300° circular gauge**.

```text
CALORIES

       ╭━━━━━━╮
     ╱          ╲
    │   1,420    │
    │ / 1,800    │
     ╲          ╱
       ╰━━━

380 kcal remaining
```

Key decisions:
- retain the circular form;
- retain an intentional open gap;
- the 300° endpoint should clearly represent the target/end point;
- the number is more important than the arc;
- Calories and Move remain independent components/surfaces.

## Normal Range

The active arc represents `0 → target`.

Metric identity colours may remain:
- Calories: coral;
- Move: lavender.

These identify the metric; they do **not** mean good/bad.

## Target / Overrun

At target, the normal 300° gauge is complete.

Above target, do **not** wrap around for another lap.

Use an **overrun indicator** extending beyond the target endpoint.

```text
      ╭━━━━━━━━━━━━╮
    ╱                ╲
   │                  │
    ╲                ╱
      ╰━━━━━━━━━━━╯───╴
                    ↑
                  overrun
```

The overrun has a sensible visual cap; exact excess remains textual.

Example:

```text
1,950 / 1,800 kcal
150 kcal over target
```

## Missing / Partial Data

Missing data is not genuine zero.

```text
—
/ 1,800 kcal
No data
```

Partial data may be explicitly labelled when known.

## Motion

- **Fresh load:** animate from zero to current value.
- **Data update:** animate from previous value to new value.
- **Selected-day change:** animate from the currently displayed day's gauge position to the selected day's value.
- Do not reset to zero when a prior visual state exists.

A small amount of physical easing/inertia is encouraged.

## Interaction

The gauge does not require complex interaction. Hover/focus may expose exact percentage or additional detail if useful.

## Implementation Freedom

Implementation may choose SVG/CSS/chart primitives, exact start angle, target marker styling, overrun styling and easing values.

Preserve:
- circular ~300° form;
- explicit target endpoint;
- overrun behaviour;
- state-aware animation.

> A familiar gauge, treated as a responsive instrument rather than a decorative chart.
