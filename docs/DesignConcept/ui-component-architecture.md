# Anti-Fat-Flemo — UI Component Architecture

**Status:** Preliminary Design
**Purpose:** Establish the component vocabulary, architectural boundaries and reusable UI patterns for the application.

---

## 1. Design Objective

The application should feel like a purpose-built personal tracking product rather than:

* a generic SaaS dashboard;
* a collection of unrelated cards;
* a clone of Apple Fitness, WHOOP or another health application;
* or a showcase of animated React components.

The visual identity should principally emerge from a small number of **domain-specific visual components** representing:

1. progress toward a goal;
2. today's behaviour against a target;
3. accountability across a week;
4. trends relative to desired ranges;
5. transparent calculated estimates.

Supporting application UI should remain comparatively quiet.

---

# 2. Component Layers

## Layer A — UI Primitives

Generic application components with no knowledge of calories, weight, Move, goals or tracking.

Examples:

```text
Button
IconButton
Input
NumberInput
Select
DatePicker
Dialog
Drawer
Tooltip
Popover
Tabs
Accordion
Badge
Card
Skeleton
Toast
Navigation
Sidebar
```

These should generally be adopted from an established accessible UI foundation rather than custom-built.

Suggested location:

```text
src/components/ui/
```

---

## Layer B — Design-System Components

Reusable visual constructs specific to the application's design language but not to one feature.

Initial components:

```text
MetricValue
MetricDelta
MetricLabel
StatusIndicator
ProgressArc
ExpandableMetricCard
ChartTooltip
SectionHeader
EmptyMetricState
```

Suggested location:

```text
src/components/design-system/
```

These components establish typography, spacing, states, motion and visual hierarchy.

---

## Layer C — Domain Components

Components that represent concepts belonging to this application.

These are the primary source of the application's visual identity.

### Canonical initial component names

```text
GoalJourneyTrack
DailyTargetGauge
WeeklyAccountabilityRibbon
EnergyBalanceCard
TargetBandChart
MetricTrendCard
GoalPhaseTimeline
DaySummaryPanel
```

Suggested organisation:

```text
src/components/
    goals/
        GoalJourneyTrack.tsx
        GoalPhaseTimeline.tsx

    metrics/
        DailyTargetGauge.tsx
        EnergyBalanceCard.tsx
        MetricTrendCard.tsx

    accountability/
        WeeklyAccountabilityRibbon.tsx
        DaySummaryPanel.tsx

    charts/
        TargetBandChart.tsx
```

---

## Layer D — Feature Composites

Page-specific assemblies of the reusable domain components.

Examples:

```text
DashboardGoalSummary
DashboardDailyTargets
DashboardWeeklySummary
DailyLogSummary
ProgressOverview
```

Suggested location:

```text
src/features/
    dashboard/components/
    log/components/
    progress/components/
    settings/components/
```

Feature components may compose domain components but should not duplicate their underlying visualisation logic.

---

# 3. Signature vs Supporting Components

Not every component should compete for attention.

## Signature Components

The following components establish the application's identity:

1. `GoalJourneyTrack`
2. `DailyTargetGauge`
3. `WeeklyAccountabilityRibbon`
4. `TargetBandChart`

These should receive bespoke visual design and animation.

They should not simply be imported unchanged from an external component library.

---

## Supporting Domain Components

These communicate information but should remain visually subordinate:

* `EnergyBalanceCard`
* `MetricTrendCard`
* `DaySummaryPanel`
* `GoalPhaseTimeline`

They should share the same design tokens and motion principles as the signature components.

---

# 4. Screen Usage

The current application structure consists principally of:

```text
/dashboard
/log
/progress
/settings
```

## `/dashboard`

Primary use of the signature system.

Expected composition:

```text
GoalJourneyTrack

DailyTargetGauge
    ├── Calories
    └── Move

WeeklyAccountabilityRibbon

EnergyBalanceCard

MetricTrendCard
    └── Weight trend
```

The dashboard should answer:

> Where am I going?

> How am I doing today?

> How has this week gone?

without requiring navigation.

---

## `/log`

Focused on data entry and immediate feedback.

Potential components:

```text
DailyTargetGauge — compact variant
EnergyBalanceCard — compact/live variant
DaySummaryPanel
MetricValue
MetricDelta
```

Logging food should visibly update the relevant daily metrics.

Logging should not trigger full-page animation.

Only components affected by the new data should respond.

---

## `/progress`

The analytical/history view.

Expected components:

```text
GoalJourneyTrack — expanded variant
TargetBandChart — calories
TargetBandChart — Move
Weight trend chart
MetricTrendCard
GoalPhaseTimeline — later/long-term usage
```

This screen should favour temporal context over today's exact values.

---

## `/settings`

Predominantly conventional application UI.

Expected components:

```text
Inputs
NumberInputs
DatePickers
Selects
Tabs
Dialogs
Goal configuration forms
Profile configuration forms
```

Signature visualisations should only appear where they genuinely aid configuration or previewing.

---

# 5. Animation Philosophy

Animation should principally communicate **state change**.

Acceptable examples:

* journey marker moves after a weigh-in;
* progress arc increases after logging food or Move;
* displayed number counts toward its updated value;
* dashboard graph draws on initial entry;
* expanded card transitions physically into its detailed state;
* selected accountability day expands into its details.

Animation should not exist simply because an element can animate.

---

## Initial Dashboard Entrance

Approximate sequence:

```text
GoalJourneyTrack settles

DailyTargetGauge arcs fill

WeeklyAccountabilityRibbon appears

Trend visualisation draws
```

Animations should overlap.

Approximate total perceived sequence:

```text
400–700 ms
```

The dashboard should not play a long intro every time data refreshes.

---

## Data-Change Motion

After initial load:

> Animate the data that changed, not the page.

Example:

```text
Lunch added
    ↓
Calories 970 → 1,420
    ↓
Calorie arc advances
    ↓
Energy balance updates
```

Move and weight components should remain stationary unless their underlying values changed.

---

# 6. Motion Accessibility

All non-essential physical motion must support reduced-motion preferences.

Under reduced motion:

* large position transitions become fades;
* chart drawing may appear immediately or fade in;
* number changes may update without prolonged counting;
* journey markers should not slide large distances;
* information must remain fully understandable.

Animation must never be the sole representation of state.

---

# 7. Long-Term Design Requirement

Although initially used for short-term weight management, the component model must support long-term usage.

The system therefore must not assume:

```text
one user
one goal
one weight-loss period
one permanently decreasing weight
```

In particular:

* `GoalJourneyTrack` must allow backward movement;
* historical goals should remain representable;
* future phases may form a sequence;
* charts must tolerate months or years of data;
* domain components should consume data rather than contain hard-coded campaign assumptions.

A future progression might therefore become:

```text
September Cut
      ↓
Maintenance
      ↓
Summer Goal
      ↓
Maintenance
```

without replacing the original visual language.

---

# 8. Design Rule

The application's identity should come from:

> **how it represents progress and accountability**

rather than unusual buttons, excessive visual effects or decorative animation.

That rule should be used when deciding whether a new bespoke component is justified.
