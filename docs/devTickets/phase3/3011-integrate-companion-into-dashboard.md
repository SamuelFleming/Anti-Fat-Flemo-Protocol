# 3011 - Integrate GoalStateCompanion into the Dashboard

**Status:** Blocked  
**Phase:** 3  
**Depends On:** 3010

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 4.9, 16, 17, 22)
- `docs/core-scope/04-Screens-and-UX.md` (Dashboard)

## Objective and User Outcome
Give the companion a real home in the app, wired to the same selected-day data every other
Dashboard widget uses, without becoming a structural dependency or redesigning the Dashboard.

## Scope
- Embed `GoalStateCompanion` into `DashboardPage`'s existing `selectedDate` flow (reuse the same
  state already powering `GoalJourneyTrack`/gauges/ribbon; do not add a second data-fetch path).
- Build the `CompanionContext` for the current `selectedDate` from existing dashboard data via the
  3008 mapping functions.
- Add a simple, non-persisted show/hide affordance (e.g. local UI state) so the app remains fully
  usable with the companion disabled (charter 4.9); do not add new backend/profile fields for this.
- Handle loading and renderer-failure states without breaking the rest of the Dashboard.

## Out of Scope
- New signature-component behaviour changes to `GoalJourneyTrack`/`DailyTargetGauge`/
  `WeeklyAccountabilityRibbon`, any backend/API/schema changes, Progress-screen integration.

## Likely Files / Areas
- `client/src/features/dashboard/DashboardPage.tsx`
- `client/src/components/companion/GoalStateCompanion.tsx`

## Technical Tasks
- Do not let the companion determine dashboard layout; it occupies its own clearly bounded region
  (charter section 16 spatial boundary).
- Selecting a different ribbon day must update the companion the same way it updates the gauges.
- Wrap the companion in an error boundary/lazy-load so a rendering failure cannot take down the
  Dashboard (charter section 22).

## Acceptance Criteria
- The companion reflects the currently selected Dashboard day and updates when the day changes.
- Disabling the companion leaves the rest of the Dashboard fully functional.
- A simulated companion render failure does not affect any other Dashboard widget.

## Verification
- Manually exercise today/selected-historical-day/no-data/disabled/render-failure scenarios on the
  Dashboard; run existing Dashboard tests to confirm no regression.

## Completion Notes
Pending implementation.
