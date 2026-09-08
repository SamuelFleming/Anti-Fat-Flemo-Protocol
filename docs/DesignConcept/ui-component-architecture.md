# UI Component Architecture

**Status:** Placement and layering only. Visual law is `00_UI-Design-Concept.md` + `.visual.md` files.

Identity comes from a few domain visualisations, not from a library of animated cards. Supporting UI stays quiet.

## Layers

### A — UI primitives (`src/components/ui/`)

No domain knowledge. Prefer the foundation library in `react-ui-library-strategy.md`.

Examples: Button, Input, Dialog, Tabs, Badge, Card, Sidebar, Toast.

### B — Design-system (`src/components/design-system/`)

App-specific, not feature-specific: MetricValue, MetricDelta, StatusIndicator, ExpandableMetricCard, EmptyMetricState, SectionHeader.

### C — Domain (`src/components/…`)

Owned visualisations. Do not import Magic UI / React Bits widgets by name into feature pages.

```text
goals/          GoalJourneyTrack
metrics/        DailyTargetGauge, EnergyBalanceCard, MetricTrendCard
accountability/ WeeklyAccountabilityRibbon, DaySummaryPanel
charts/         TargetBandChart
```

### D — Feature composites (`src/features/<domain>/components/`)

Page assemblies (`DashboardGoalSummary`, `DailyLogSummary`, …). Compose domain components; do not reimplement their visualisation.

## Signature vs supporting

**Signature (bespoke; see `.visual.md`):** `GoalJourneyTrack`, `DailyTargetGauge`, `WeeklyAccountabilityRibbon`.

**Supporting:** `EnergyBalanceCard`, `MetricTrendCard`, `DaySummaryPanel`, `TargetBandChart`. Same tokens and motion rules; do not compete for attention.

`GoalStateCompanion` is not part of this layering until a ticket adopts it.

## Screen composition (what, not how)

| Screen | Assemble |
|---|---|
| `/dashboard` | Journey + Calories/Move gauges + ribbon + energy balance |
| `/log` | Compact gauge(s), live energy balance, day summary; no full-page animation on log |
| `/progress` | Expanded journey, conventional/target-band charts |
| `/settings` | Conventional forms; signature widgets only if they aid preview |

Motion, reduced-motion, and palette: `00_UI-Design-Concept.md`.
