# 2011 - Add Move and Weight Workflows

**Status:** Implemented  
**Phase:** 2  
**Depends On:** 1007, 1008, 1009, 2001, 2006, 2007

## Related Docs / Design References
- `docs/core-scope/03-User-Flows.md`
- `docs/core-scope/04-Screens-and-UX.md`
- `docs/core-scope/06-Calculation-Rules.md`

## Objective and User Outcome
Let users record daily Move and body weight with immediate, accurate feedback.

## Scope
- Date-aware Move entry/upsert in kJ.
- Weight add, edit and delete flows.
- Compact Move gauge, current-weight/journey feedback and affected derived summaries.

## Out of Scope
- Automatic Apple Health/Fitness import and new calculation rules.

## Likely Files / Areas
- `client/src/features/daily-log/`, shared weight entry UI
- Move/weight services and hooks

## Technical Tasks
- Keep Move input in kJ and display conversion only where canonically required.
- Update only affected UI after successful mutation.
- Distinguish no measurement from numeric zero.

## Acceptance Criteria
- Users can upsert Move and manage weight entries for allowed dates.
- Derived feedback updates without a full-page animation/reset.
- Validation, missing data and API errors are explicit.

## Verification
- Run Move/weight mutation flows and verify calculation fixtures and widget updates.

## Completion Notes
Implemented `client/src/features/dailyLog/MoveWeightPanel.tsx`, composed into `DailyLogPage`. Move
is a simple kJ upsert against `PUT /daily-logs/:date`; weight add/edit/delete uses the one-entry-per-
date model constraint (`WeightEntry` has a unique `{userId, date}` index) to decide create vs. update.
Both feed the compact Move gauge via callback; unset Move/weight is shown as `—`, distinct from `0`.
