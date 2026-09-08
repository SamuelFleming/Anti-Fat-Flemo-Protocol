# 2003 - Complete Profile and Initial Setup

**Status:** Implemented  
**Phase:** 2  
**Depends On:** 1006, 1008, 1009

## Related Docs / Design References
- `docs/core-scope/03-User-Flows.md`
- `docs/core-scope/04-Screens-and-UX.md`
- `docs/core-scope/05-Data-Model.md`

## Objective and User Outcome
Guide a new user to the minimum usable configuration and let them maintain profile assumptions later.

## Scope
- Missing-profile detection and initial setup flow.
- Profile, height, baseline expenditure and unit/preferences settings.
- Redirect to Dashboard after valid setup.

## Out of Scope
- Health recommendations, goal-management duplication and advanced personalisation.

## Likely Files / Areas
- `client/src/features/settings/`, setup route
- Profile service/hooks and form primitives

## Technical Tasks
- Use an accessible focused form or restrained stepper where it reduces complexity.
- Distinguish profile assumptions from goal-owned targets.
- Handle partial setup, validation and server errors.

## Acceptance Criteria
- A user without required setup is guided to completion.
- Profile fields can later be reviewed and updated.
- The experience works by keyboard and at mobile widths.

## Verification
- Run client checks and first-run plus returning-user profile flows.

## Completion Notes
Implemented `client/src/features/settings/SettingsPage.tsx`, `services/profileService.ts` and
`contexts/ProfileContext.tsx`. Settings edits height and estimated baseline TDEE (read-only account
info, fixed unit labels). `AuthenticatedShell` redirects to `/settings` until the profile is complete,
then to Dashboard; goal creation stays a separate step handled by 2002.
