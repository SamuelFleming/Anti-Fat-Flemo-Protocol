# 2009 - Integrate Dashboard Signature Widgets

**Status:** Implemented  
**Phase:** 2  
**Depends On:** 2005, 2006, 2007, 2008

## Related Docs / Design References
- `docs/core-scope/04-Screens-and-UX.md`
- `docs/DesignConcept/00_UI-Design-Concept.md`

## Objective and User Outcome
Deliver the complete distinctive Dashboard with coordinated data and motion across all signature widgets.

## Scope
- Integrate journey, Calories/Move gauges and weekly ribbon into Dashboard.
- Connect weekly day selection to every selected-day-aware component.
- Coordinate balance, status and recent-meal updates.

## Out of Scope
- New visual metaphors, new calculations, Progress screen and companion work.

## Likely Files / Areas
- `client/src/features/dashboard/`
- Signature component adapters and integration tests

## Technical Tasks
- Animate changed data from previous displayed state, never page-wide from zero.
- Preserve stable layout during loading/updates.
- Ensure selected historical days do not consume today's live values.

## Acceptance Criteria
- Dashboard answers today/week/goal questions at a glance.
- Day selection updates relevant widgets with spatial continuity.
- All incomplete, boundary, responsive and reduced-motion states remain understandable.

## Verification
- Run client build plus integrated current-day, selected-day, data-update and no-data scenarios.

## Completion Notes
Integrated `GoalJourneyTrack`, `DailyTargetGauge` (Calories + Move) and `WeeklyAccountabilityRibbon`
into `DashboardPage`. Selecting a ribbon day updates `selectedDate`, which refetches the dashboard for
that date and re-renders the gauges, energy balance, status and meals list for that day; the journey
track always reflects the live goal/current weight, not the selected day. Added `baselineTdee` and
`moveKcal` to the `GET /api/dashboard` `today` payload (server-computed, via existing `moveKjToKcal`)
so `EnergyBalanceCard`'s expanded breakdown does not duplicate the conversion formula client-side;
mirrored in `server/src/openapi/openapi.ts`.
