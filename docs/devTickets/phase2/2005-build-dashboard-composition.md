# 2005 - Build Dashboard Composition

**Status:** Implemented  
**Phase:** 2  
**Depends On:** 2004, 1008

## Related Docs / Design References
- `docs/core-scope/04-Screens-and-UX.md`
- `docs/DesignConcept/00_UI-Design-Concept.md`
- `docs/DesignConcept/ReferenceItems/WireFrames.png` (reference only)

## Objective and User Outcome
Build the Dashboard's information hierarchy and data flow so users can understand today, this week and their goal immediately.

## Scope
- Dashboard query/state boundary and selected-day coordination.
- Page composition slots for signatures plus goal, balance, status and recent-meal support.
- Loading, error, empty and partial-data page states.

## Out of Scope
- Signature visual implementations, Progress charts and companion work.

## Likely Files / Areas
- `client/src/features/dashboard/`
- Dashboard service/query hooks and supporting components

## Technical Tasks
- Keep API data transformation outside presentational components.
- Use restrained surfaces rather than a generic equal-card grid.
- Prepare stable prop contracts for tickets 2006–2008.

## Acceptance Criteria
- Dashboard contract renders as a coherent responsive hierarchy.
- Selected day is shared by every day-aware section.
- Supporting content remains understandable before signature visuals are integrated.

## Verification
- Run client checks and exercise loading, current-day, historical and incomplete states.

## Completion Notes
Implemented alongside 2009 in `client/src/features/dashboard/DashboardPage.tsx` using
`services/dashboardService.ts`. A single `selectedDate` state (default today) drives the goal
section, both gauges, the energy balance card, status note, recent-meals list and the weekly ribbon.
Loading/error/no-goal states are explicit; the page composes restrained bordered sections rather than
a generic equal-card grid.
