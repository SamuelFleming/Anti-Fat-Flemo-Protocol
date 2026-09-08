# 1009 - Integrate Frontend Authentication

**Status:** Implemented  
**Phase:** 1  
**Depends On:** 1004, 1008

## Related Docs / Design References
- `docs/core-scope/03-User-Flows.md`
- `docs/core-scope/07-API-Specification.md`
- `docs/DesignConcept/00_UI-Design-Concept.md`

## Objective and User Outcome
Let users enter and leave the protected application through an accessible auth experience that already feels like this product.

## Scope
- Register/login forms, auth state restoration, protected routes and logout.
- Journey-entry composition using project form primitives and a restrained progress-path motif.
- Validation, loading/error states and post-auth redirects.

## Out of Scope
- Password recovery, social authentication and ornamental third-party auth effects.

## Likely Files / Areas
- `client/src/features/auth/`, auth context/provider
- Protected route and API-client integration

## Technical Tasks
- Align requests and errors with the implemented auth API.
- Implement the motif with Motion for React and a reduced-motion static state.
- Prefer cohesive project primitives; reject external effects that add an animation engine or weaken accessibility.

## Acceptance Criteria
- Users can register, log in, restore a valid session and log out.
- Unauthenticated protected access redirects correctly.
- Auth screens are recognisable, keyboard accessible and visually coherent rather than generic.

## Verification
- Client `typecheck` and `build` pass.

## Completion Notes
Implemented 2026-09-09.

- `AuthProvider` restores JWT from `localStorage` via `/auth/me`; clears invalid sessions.
- `/login` and `/register` journey-entry screens with `JourneyEntryMotif`; protected shell
  redirects unauthenticated users; logout clears token and calls `/auth/logout` best-effort.
- Existing `App.test.tsx` smoke updated to assert login journey when anonymous.
