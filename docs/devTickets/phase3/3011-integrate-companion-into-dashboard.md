# 3011 - Integrate GoalStateCompanion into the Dashboard

**Status:** Blocked  
**Phase:** 3  
**Depends On:** 3010

## Related Docs / Design References
- `docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` (sections 4.9, 16, 17, 22)
- `docs/core-scope/04-Screens-and-UX.md` (Dashboard)
- `docs/devTickets/phase2/MVP-FeedbackNotes.md`

## Objective and User Outcome
Give the companion a real home in the app, wired to the same selected-day data every other
Dashboard widget uses, without becoming a structural dependency.

## Locked Layout Decision

Per user feedback (`MVP-FeedbackNotes.md`), the companion sits **in the centre of the Dashboard's
metrics row, flanked by the Calories and Move gauges** — this replaces the current Phase 2
side-by-side full-width gauge layout, and is a confirmed decision, not an open design question.

- Use `DailyTargetGauge`'s existing `compact` variant (already built for this purpose, see Daily
  Log) for both Calories and Move on the Dashboard — no changes to `DailyTargetGauge` itself.
- Arrange as a 3-column row: Calories (compact) — `GoalStateCompanion` — Move (compact).
- This also helps the vertical-tightness concern in the same feedback note by shrinking that row's
  height versus the current `default`-variant gauges.

## Scope
- Update `DashboardPage`'s gauges section to the 3-column `compact`-gauge/companion/`compact`-gauge
  layout above.
- Embed `GoalStateCompanion` into `DashboardPage`'s existing `selectedDate` flow (reuse the same
  state already powering `GoalJourneyTrack`/gauges/ribbon; do not add a second data-fetch path).
- Build the `CompanionContext` for the current `selectedDate` from existing dashboard data via the
  3008 mapping functions.
- Add a simple, non-persisted show/hide affordance (e.g. local UI state) so the app remains fully
  usable with the companion disabled (charter 4.9); do not add new backend/profile fields for this.
  When hidden, collapse back to the two-gauge layout rather than leaving an empty centre gap.
- Handle loading and renderer-failure states without breaking the rest of the Dashboard; a failure
  should also collapse to the two-gauge layout rather than leaving a broken centre slot.

## Out of Scope
- New signature-component *behaviour* changes to `GoalJourneyTrack`, `DailyTargetGauge` (its
  existing `compact` variant is reused as-is), or `WeeklyAccountabilityRibbon`; any backend/API/
  schema changes; Progress-screen integration.

## Likely Files / Areas
- `client/src/features/dashboard/DashboardPage.tsx`
- `client/src/components/companion/GoalStateCompanion.tsx`

## Technical Tasks
- Selecting a different ribbon day must update the companion the same way it updates the gauges.
- Wrap the companion in an error boundary/lazy-load so a rendering failure cannot take down the
  Dashboard (charter section 22), and so the fallback (two-gauge, no centre slot) engages cleanly.
- Verify the 3-column row still stacks sensibly at mobile widths (companion likely stacks below or
  shrinks alongside the compact gauges — confirm against the existing responsive pass from 2014).

## Acceptance Criteria
- Dashboard renders Calories (compact) — companion — Move (compact) in that order by default.
- The companion reflects the currently selected Dashboard day and updates when the day changes.
- Disabling the companion, or a simulated render failure, collapses cleanly to the two-gauge layout
  without affecting any other Dashboard widget.

## Verification
- Manually exercise today/selected-historical-day/no-data/disabled/render-failure scenarios on the
  Dashboard at desktop and mobile widths; run existing Dashboard tests to confirm no regression.

## Completion Notes
Pending implementation.
