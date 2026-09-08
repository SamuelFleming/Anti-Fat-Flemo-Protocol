# UI Design Concept

**Status:** Working design direction  
**Purpose:** Preserve the app's visual identity without over-specifying minor UI decisions.

## Core Direction

Keep the current Figma direction as the baseline:

- grounded moss / lime / coral / lavender palette;
- warm neutral canvas;
- left-side navigation;
- clear metric hierarchy;
- restrained use of cards;
- custom treatment for the main tracking widgets.

The app should feel more individual than a generic AI-generated dashboard, but development should not stop for low-value micro-design decisions.

## Signature Components

- `GoalJourneyTrack`
- `DailyTargetGauge`
- `WeeklyAccountabilityRibbon`

`GoalStateCompanion` is handled in a separate design workstream.

## Motion Rules

### Fresh screen/widget load
When there is no meaningful previous visual state:

- animate from neutral/zero;
- keep it brief;
- overlap/stagger widgets rather than playing a long sequence.

Examples:
- journey marker travels from start to current position;
- gauge sweeps from zero to current value;
- weekly ribbon resolves across the week;
- expanded charts draw/hatch into view.

### Data update
When data changes while the screen is already visible:

- animate **from the previous value/state**, not from zero;
- animate only affected components.

### Changing selected day/history
When moving between days:

- animate from the currently displayed day's state to the selected day's state;
- do not replay the full entrance animation.

### Navigation / general UX
Tasteful page transitions, hover/focus responses and layout animations are encouraged. Motion/React Bits/similar libraries may be used where useful.

Avoid:
- constant decorative motion;
- effects that compete with tracked data;
- inaccessible hover-only behaviour.

Respect `prefers-reduced-motion`.

## Design Freedom

Where this documentation is silent, implementation should prefer:

1. clarity;
2. continuity of motion;
3. accessibility;
4. consistency with the established palette;
5. slightly more character than a stock SaaS dashboard.

Do not block development waiting for approval on small visual details unless they materially affect behaviour or information meaning.
