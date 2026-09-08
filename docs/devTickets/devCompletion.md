# Development Completion Registry

Record a ticket here only after its acceptance criteria and verification are complete.

## Phase 1

- `1001 - Bootstrap MERN Workspace` — completed 2026-09-08
  - Verification: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` pass for
    both `client` and `server`; both dev servers boot from a clean install.
  - Notes: pinned `typescript@5.9.3` on `server` (repo-latest 7.x major not yet supported by
    `typescript-eslint`); client keeps Vite's scaffolded oxlint instead of ESLint.
- `1002 - Establish Backend Platform` — completed 2026-09-08
  - Verification: `npm run typecheck`, `lint`, `test`, `build` (server) pass; manual smoke test of
    built `server.js` against live in-memory MongoDB (connect → listen → `/api/health` →
    graceful `SIGTERM` shutdown).
  - Notes: test harness uses one shared `mongodb-memory-server` via Vitest `globalSetup`, with
    test files running sequentially; error envelope fixed as `{ error: { message, details? } }`
    for all future endpoints.
- `1003 - Implement Canonical Domain Models` — completed 2026-09-08
  - Verification: 42 tests across model + date-utility suites; `typecheck`, `lint`, `test`,
    `build` pass.
  - Notes: "only one active goal per user" left to the 1006 service layer (not a documented DB
    constraint); `Profile` given a unique `userId` index (one profile per user) as a reasonable
    modelling decision matching the singular profile API contract.
- `1004 - Implement Authentication API` — completed 2026-09-08
  - Verification: 19 new tests (password/JWT units + register/login/me/logout integration);
    `typecheck`, `lint`, `test` (61/61), `build` pass.
  - Notes: login uses one generic "Invalid email or password" message for both unknown-email and
    wrong-password to avoid account-existence leakage; logout is a documented no-op (stateless
    JWT, no server-side session); actual rate limiting deferred as an infra-level concern.
- `1005 - Enforce User-Scoped Data Ownership` — completed 2026-09-08
  - Verification: 12 new tests proving indistinguishable 404s for malformed/nonexistent/
    another-user's ids across list/detail/update/delete; `typecheck`, `lint`, `test` (73/73),
    `build` pass.
  - Notes: `utils/ownership.ts` (`listOwned`/`findOwnedById`/`updateOwnedById`/`deleteOwnedById`)
    is the mandatory pattern for 1006/1007; also fixed a Mongoose 9 `findOneAndUpdate` deprecation.
- `1006 - Implement Profile and Goal APIs` — completed 2026-09-08
  - Verification: 22 new tests (profile + goals integration); `typecheck`, `lint`, `test`
    (95/95), `build` pass.
  - Notes: response conventions fixed for later tickets (single resource direct, list as
    `{ items }`, absence-as-null not 404 for `/goals/active`); found/fixed an Express 5
    `req.query` getter-only gotcha in `middleware/validate.ts`.
- `1007 - Implement Tracking APIs` — completed 2026-09-08
  - Verification: `typecheck`, `lint`, `test` (123/123), `build` pass.
  - Notes: meals CRUD, daily-log date upsert, weights CRUD with date filters; Mongo E11000 →
    409 in errorHandler; daily-logs list also accepts range filters for consistency.
- `1008 - Build Frontend Application Shell` — completed 2026-09-09
  - Verification: client `typecheck` and `build` pass.
  - Notes: moss top nav + mobile drawer (Motion), route placeholders, tokens, apiClient,
    Button/Input/PageContainer.
- `1009 - Integrate Frontend Authentication` — completed 2026-09-09
  - Verification: client `typecheck` and `build` pass.
  - Notes: AuthProvider + protected routes; login/register journey-entry motif; JWT restore
    via `/auth/me`; logout in shell.

## Phase 2

No implemented tickets yet.

## Entry Format

- `XXXX - Ticket Name` — completed `YYYY-MM-DD`
  - Verification: concise command/result summary
  - Notes: material implementation decisions or intentionally deferred work
