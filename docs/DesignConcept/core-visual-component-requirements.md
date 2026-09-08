# Core Visual Component Inventory

**Status:** Index only — not a second visual spec.

Canonical form, states, and motion live in `00_UI-Design-Concept.md` and each `0N_*.visual.md`. Do not duplicate them here.

Status meanings (On Track / Partial / Off Track / Awaiting data) live in `docs/core-scope/`. Visual day-states on the ribbon may add today / future / selected without renaming the domain statuses.

## P0 — signature identity

| Component | Spec | Screens |
|---|---|---|
| `GoalJourneyTrack` | `01_GoalJourneyTrack.visual.md` | `/dashboard` (summary), `/progress` (expanded) |
| `DailyTargetGauge` | `02_DailyTargetGauge.visual.md` | `/dashboard` (Calories + Move), `/log` (compact) |
| `WeeklyAccountabilityRibbon` | `03_WeeklyAccountabilityRibbon.visual.md` | `/dashboard`; optional week selector on `/progress` |

## P1 — supporting dashboard language

| Component | Role |
|---|---|
| `EnergyBalanceCard` | Estimated deficit/surplus; expandable breakdown; labelled as estimate |
| `DaySummaryPanel` | Selected-day detail consumed by the ribbon / log / history — not a modal |
| `MetricTrendCard` | Compact value + short trend; visually subordinate |

## P2 — progress/history

| Component | Role |
|---|---|
| `TargetBandChart` | Calories/Move vs a target region over time. Weight uses a conventional trend, not a narrow daily band. |

## P3 — deferred

| Component | Role |
|---|---|
| `GoalPhaseTimeline` | Multiple sequential goals. Do not prioritise until `GoalJourneyTrack` is right. |
| `GoalStateCompanion` | Separate workstream under `GoalStateCompanion/`. Read only if the ticket adopts it. |

Domain wrappers such as `CalorieBudgetGauge` / `MoveTargetGauge` may compose `DailyTargetGauge`; they must not fork a second gauge implementation.
