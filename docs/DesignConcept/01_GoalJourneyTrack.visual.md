# GoalJourneyTrack

**Component:** `GoalJourneyTrack`  
**Purpose:** Show progress from goal start to goal target as a journey rather than a filled progress bar.

## Base Visual

Use a **straight horizontal track**.

```text
82.0 kg                    80.7 kg                    76.0 kg
START                         TODAY                      GOAL

●━━━━━━━━━━━━━━━━━━━━━━━━━━━━●────────────────────────────○
```

## Core Behaviour

- Start, current and goal positions remain visible.
- Current position is the visual focus.
- Travelled and future path should look subtly different.
- Avoid making it look like a generic filled progress bar.

Suggested direction:
- travelled path: slightly brighter/lighter/more active;
- future path: quieter moss/neutral;
- current marker: focal lime and visually strongest.

A very subtle animated texture/pulse on the travelled path is optional if it improves the effect without distraction.

## Out-of-Bounds States

The current value may extend beyond either boundary.

### Regression beyond start

```text
CURRENT      START                                  GOAL
   ●──────────●──────────────────────────────────────○
```

### Beyond goal

```text
START                                  GOAL       CURRENT
  ●────────────────────────────────────○────────────●
```

Use a short bounded overflow region rather than clamping the marker.

Normal backward weight fluctuation should not automatically become a red/error state.

## Motion

- **Fresh load:** animate from start to current position.
- **New weigh-in/data update:** animate from previous marker position to new position.
- **Selected-day/history change:** animate from the currently displayed journey state to the selected state.
- Do not restart from the beginning when a previous display state exists.

## Expanded History View

Provide an optional expanded view showing actual weight over time.

```text
WEIGHT
82 ─────●
        ╲
81       ╲__●
            ╲___●
80               ╲__●
   ┆                         ┆
 START                     TARGET
   └────────────────────────────── TIME
```

Requirements:
- x-axis = time;
- y-axis = weight;
- actual weigh-ins form the main line;
- start/goal context remains identifiable;
- graph may draw/hatch into view when opened.

Desktop hover may preview it, but click/tap/focus must provide the canonical accessible interaction.

## Implementation Freedom

Exact marker shape, line weight, overflow flourish, chart library and easing may be chosen during implementation as long as the behaviour above is preserved.
