# Anti-Fat-Flemo — React UI Library Strategy

**Status:** Preliminary Recommendation

---

# 1. Principle

External component libraries should be used to:

* avoid reinventing solved interaction patterns;
* improve accessibility;
* accelerate development;
* provide implementation inspiration;
* and occasionally add visual polish.

They should **not** define the application's core visual identity.

The preferred strategy is therefore:

```text
CUSTOM
    Domain visualisations

+

FOUNDATION LIBRARY
    Conventional application UI

+

MOTION LAYER
    Shared animation behaviour

+

SELECTIVE COMPONENT SOURCES
    Occasional specialised effects
```

---

# 2. Recommended Foundation — shadcn/ui

### Role

Primary source for conventional application UI.

Likely components:

```text
Button
Input
Label
Select
Checkbox
Switch
Popover
Tooltip
Dialog
Drawer
Accordion
Tabs
Date Picker
Calendar
Dropdown Menu
Toast
Sidebar
Skeleton
Table
```

### Use Areas

Particularly appropriate for:

* authentication;
* settings;
* logging forms;
* date selection;
* navigation;
* confirmations;
* menus;
* responsive drawers;
* tooltips;
* loading states.

### Design Position

Do not treat default shadcn styling as the finished application's visual identity.

Instead:

```text
shadcn behaviour + primitives
        ↓
our tokens
our typography
our spacing
our surfaces
our motion
```

Because the component source lives within the project, it can be adapted rather than extensively overridden.

---

# 3. Motion — Motion for React

### Role

Primary animation system for custom application components.

Potential uses:

```text
GoalJourneyTrack marker movement
DailyTargetGauge state changes
ExpandableMetricCard transitions
DaySummaryPanel expansion
dashboard component entrances
shared selected-day indicators
number/value transitions
```

Using a single principal motion system will help the interface feel coherent.

---

## Motion Rules

Prefer:

```text
opacity
scale — small ranges
layout transitions
path/arc progress
number interpolation
short position transitions
```

Avoid excessive:

```text
parallax
cursor effects
3D rotation
large floating objects
continuous background motion
attention-seeking loops
```

The motion system must respect reduced-motion preferences.

---

# 4. Charts — Recharts

### Role

Initial charting layer for conventional historical visualisations.

Appropriate for:

```text
weight trend
calorie history
Move history
target-band charts
tooltips
reference ranges
responsive charts
```

Custom chart wrappers should hide Recharts-specific implementation from feature pages.

For example:

```text
TargetBandChart
    ↓
Recharts implementation
```

rather than:

```text
Dashboard
    ↓
directly assembling Recharts components
```

This allows the chart technology to change later without changing the feature API.

---

# 5. React Bits

### Role

**Component/effect source and inspiration library**, not the application's base UI framework.

Good categories to explore:

```text
Count Up
Animated Content
Fade Content
Glare Hover
Stepper
selected subtle card treatments
selected text transitions
```

Potential uses:

### Authentication / onboarding

A restrained background or content entrance could give these otherwise conventional screens more personality.

### Empty states

A small animated treatment may make an empty dashboard/log state feel intentional.

### Number transitions

Useful inspiration for:

```text
1,170 → 1,420
```

### First-run experience

`Stepper`-style patterns may be useful for configuring:

```text
starting weight
goal weight
calorie target
Move target
baseline assumptions
```

---

## React Bits — generally avoid in the core tracker

Do not make normal dashboard interaction dependent on effects such as:

```text
Blob Cursor
Target Cursor
Hyperspeed
Galaxy
Particles
Lightning
3D cards
large animated backgrounds
constant text effects
```

These are visually interesting but would compete with the tracked information.

A useful rule is:

> React Bits may decorate the experience; it should not become the experience.

---

# 6. Magic UI

Magic UI occupies a similar space but integrates naturally with the shadcn-style component model.

Potentially useful elements include:

```text
Number Ticker
Animated Circular Progress Bar
Blur Fade
Animated List
Magic Card
subtle background/grid treatments
```

Again, these should be treated principally as:

```text
implementation references
or selectively adopted pieces
```

rather than the source of the core design language.

For example, an animated circular progress implementation could inform `DailyTargetGauge`, but the finished gauge should remain a component owned and named by this application.

---

# 7. ReactComponents.com

Treat ReactComponents.com differently.

It is most useful as a:

```text
discovery / inspiration resource
```

rather than a single coherent dependency.

It can be used during design and implementation research to find examples of:

* application layouts;
* interactions;
* navigation;
* cards;
* form arrangements;
* unusual visualisations.

Any component selected from it should be assessed individually for:

```text
licensing
dependencies
accessibility
code quality
mobile behaviour
maintainability
visual fit
```

It should not become an architectural dependency.

---

# 8. React Aria

React Aria is worth considering underneath conventional interactive components where accessibility is especially important.

Potential areas:

```text
date controls
menus
dialogs
select/combobox interactions
keyboard navigation
focus management
```

If shadcn is adopted using a React Aria base, this could provide the accessibility behaviour while the application retains control over appearance.

---

# 9. Proposed Stack

The preliminary preferred UI stack is therefore:

```text
React
│
├── shadcn/ui
│   └── conventional UI primitives
│
├── Motion for React
│   └── primary animation system
│
├── Recharts
│   └── conventional charts
│
├── Custom SVG / CSS
│   ├── GoalJourneyTrack
│   └── DailyTargetGauge
│
├── React Bits
│   └── selective effects / inspiration
│
├── Magic UI
│   └── selective effects / inspiration
│
└── ReactComponents.com
    └── discovery / design research
```

---

# 10. Dependency Rule

Before adopting any external animated component, ask:

1. Could the effect be implemented simply with Motion?
2. Does it introduce another animation engine?
3. Does it introduce WebGL/Three.js/GSAP merely for a minor visual effect?
4. Will it respect reduced motion?
5. Can its styling be made consistent with the application?
6. Is the effect still useful after the novelty wears off?

If the answers are unfavourable, reproduce the useful interaction with the existing design/motion stack instead.

---

# 11. Central Architectural Decision

The following should be **owned by the application**:

```text
GoalJourneyTrack
DailyTargetGauge
WeeklyAccountabilityRibbon
EnergyBalanceCard
TargetBandChart
MetricTrendCard
DaySummaryPanel
GoalPhaseTimeline
```

Even where external code provides implementation inspiration.

That gives the project its own reusable health/progress component vocabulary rather than exposing:

```text
<MagicCard>
<AnimatedCircularProgressBar>
<SomeRandomLibraryWidget>
```

throughout feature code.

External implementation details remain below the domain-component boundary.
