# 1002 - Establish Backend Platform

**Status:** Implemented  
**Phase:** 1  
**Depends On:** 1001

## Related Docs / Design References
- `docs/core-scope/07-API-Specification.md`
- `.cursor/rules/backend.mdc`

## Objective and User Outcome
Provide a stable Express platform with consistent configuration, validation and errors for every later API.

## Scope
- Express app/server separation, MongoDB connection and lifecycle.
- Environment validation, CORS, JSON parsing, request validation and central error handling.
- Health endpoint, test harness and initial implemented OpenAPI mirror.

## Out of Scope
- Domain models, authentication and feature endpoints.

## Likely Files / Areas
- `server/src/app.*`, `server/src/config/`, `server/src/middleware/`
- `server/src/openapi/`, server tests

## Technical Tasks
- Make the app importable without opening a network listener.
- Define shared success/error conventions aligned with the API specification.
- Handle startup and shutdown failures predictably.

## Acceptance Criteria
- Server connects to configured MongoDB and exposes a health endpoint.
- Validation and unexpected errors return consistent non-sensitive responses.
- Automated tests can run against the app in isolation.

## Verification
- Run server tests, type-check and lint; exercise health and representative error responses.

## Completion Notes
- `config/env.ts`: zod-validated env (`NODE_ENV`, `PORT`, `MONGODB_URI` required, `CLIENT_ORIGIN`),
  fails fast with a readable message on invalid/missing config.
- `db/connect.ts`: `connectDb`/`disconnectDb`; not called by `app.ts`, only by `server.ts` and
  tests, so the app remains importable/testable without a live listener or DB connection.
- `middleware/errorHandler.ts` + `utils/AppError.ts`: single response envelope
  `{ error: { message, details? } }`; `ZodError` -> 400 with field details, `AppError` -> its
  status code, anything else -> logged and generic 500 (never leaks internals).
- `middleware/validate.ts` + `utils/asyncHandler.ts`: reusable request validation and async route
  wrapping for all future feature routes.
- `GET /api/health` reports `{ status: "ok", mongo: "connected" | "disconnected" }` from live
  `mongoose.connection.readyState`.
- `openapi/openapi.ts` mirrors only `/health` so far; served at `GET /api/openapi.json`.
- `server.ts` connects to MongoDB before listening (exits non-zero on failure) and shuts down
  gracefully on `SIGINT`/`SIGTERM` (closes the HTTP server, then disconnects MongoDB).
- Test harness: `tests/globalSetup.ts` boots one shared `mongodb-memory-server` instance for the
  whole Vitest run and sets `MONGODB_URI` before any test module (incl. `config/env.ts`) loads;
  `tests/helpers/testDb.ts` connects/clears/disconnects per test file. Files run sequentially
  (`fileParallelism: false`) since they share one mongoose connection.
- Verified: `npm run typecheck`, `lint`, `test`, `build` pass; manual smoke test of the built
  `server.js` against a live in-memory MongoDB confirmed connect → listen → healthy
  `/api/health` → graceful `SIGTERM` shutdown.
