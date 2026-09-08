# 2002 - Complete Goal Management Experience

**Status:** Blocked  
**Phase:** 2  
**Depends On:** 1006, 1008, 1009

## Related Docs / Design References
- `docs/core-scope/03-User-Flows.md`
- `docs/core-scope/04-Screens-and-UX.md`
- `docs/DesignConcept/00_UI-Design-Concept.md`

## Objective and User Outcome
Let users create, inspect, edit and complete goals while retaining an understandable history.

## Scope
- Goals route, active-goal form/summary and previous-goal list.
- Create/edit/complete flows, validation and server-error handling.
- Continued use across sequential goal periods.

## Out of Scope
- Goal calculations, Dashboard implementation and `GoalStateCompanion`.

## Likely Files / Areas
- `client/src/features/goals/`
- Goal service/hooks and shared form primitives

## Technical Tasks
- Connect to the canonical goal API without duplicating server state.
- Preserve history and make destructive/completion actions explicit.
- Keep the screen quieter than Dashboard and compatible with the top navigation.

## Acceptance Criteria
- Users can complete the documented goal lifecycle.
- Previous goals remain available after a new goal is created.
- Loading, empty, validation and API-error states are usable.

## Verification
- Run client checks and goal create/edit/complete/history integration flows.

## Completion Notes
Pending implementation.
