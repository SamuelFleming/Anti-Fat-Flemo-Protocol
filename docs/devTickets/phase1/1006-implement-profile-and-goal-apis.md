# 1006 - Implement Profile and Goal APIs

**Status:** Implemented  
**Phase:** 1  
**Depends On:** 1005

## Related Docs / Design References
- `docs/core-scope/05-Data-Model.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Provide the complete persisted API foundation for profile settings and sequential goal periods.

## Scope
- Profile GET/PUT.
- Goal list, active, create, detail, update and complete endpoints.
- Active-goal constraints, ownership, validation, tests and implemented OpenAPI.

## Out of Scope
- Frontend screens, goal-progress calculations and Dashboard aggregation.

## Likely Files / Areas
- `server/src/features/profile/`
- `server/src/features/goals/`
- `server/src/openapi/`

## Technical Tasks
- Preserve completed goals and historical targets.
- Enforce the documented active-goal rules.
- Keep endpoint contracts aligned with the API specification.

## Acceptance Criteria
- A user can maintain a profile and lifecycle multiple goals.
- Completing a goal preserves it while allowing continued future use.
- Cross-user access is blocked and OpenAPI matches implementation.

## Verification
- Run profile/goal integration tests including active-goal conflicts and completion.

## Completion Notes
- Response conventions established for future tickets: single-resource endpoints (Profile,
  Goal detail/create/update/complete) return the resource directly; `GET /api/goals/active`
  returns the goal directly or `null` (200, not 404 — absence is not failure); list endpoints
  return `{ items: [...] }` so pagination metadata can be added later without a breaking change.
- `features/profile/`: `GET`/`PUT /api/profile`, backed by `getOrCreateProfile` (defensive
  fallback — registration already creates one). `preferredWeightUnit`/`preferredEnergyUnit` are
  not client-editable (fixed-value MVP units); the update schema is `.strict()` so unknown/
  disallowed fields (e.g. `preferredWeightUnit`) are rejected with 400.
- `features/goals/`: list (optional `?status=`), `active`, create, detail, update, complete — all
  behind `requireAuth` and reusing `utils/ownership.ts` (1005) for detail/update, so an unowned
  or malformed id yields the identical 404 as ticket 1005 established.
- Active-goal rule: `POST /api/goals` throws 409 if the user already has a `status: "active"`
  goal; status can only move `active -> completed` via `POST /:id/complete` (409 if the goal
  isn't currently active) — `PUT /:id` cannot set `status` directly, so the invariant can't be
  bypassed through a generic update.
- `openapi/openapi.ts` updated with `/profile`, `/goals`, `/goals/active`, `/goals/{id}`,
  `/goals/{id}/complete`, plus `Profile`/`Goal`/`GoalInput` schemas.
- Found and fixed an Express 5 gotcha in `middleware/validate.ts`: `req.query` is a getter-only
  accessor there, so a plain assignment silently became a swallowed `TypeError` under ESM strict
  mode (surfaced as a generic 500). Fixed via `Object.defineProperty` to redefine it as writable
  before assigning the parsed query.
- Verified: 22 new tests (`tests/features/profile.test.ts`, `tests/features/goals.test.ts`)
  covering CRUD, active-goal conflict, cross-user 404s on detail/update/complete, and status-list
  filtering. `typecheck`, `lint`, `test` (95/95), `build` all pass.
