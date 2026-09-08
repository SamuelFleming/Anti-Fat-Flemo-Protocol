# 1005 - Enforce User-Scoped Data Ownership

**Status:** Implemented  
**Phase:** 1  
**Depends On:** 1004

## Related Docs / Design References
- `docs/core-scope/02-Core-Scope.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Guarantee that authenticated users can never read or mutate another user's health or goal records.

## Scope
- Reusable authenticated ownership-query and not-found conventions.
- Controller/service patterns for list, detail, update and delete operations.
- Cross-user security tests used by subsequent API tickets.

## Out of Scope
- Administrator access, sharing, public profiles and feature endpoint implementation.

## Likely Files / Areas
- `server/src/middleware/`, `server/src/utils/` or service helpers
- Integration-test helpers and security test suites

## Technical Tasks
- Ignore client-supplied ownership identifiers.
- Prevent identifier probing from revealing whether another user's record exists.
- Document the required pattern for subsequent services.

## Acceptance Criteria
- Ownership always derives from authentication context.
- Cross-user read/update/delete attempts cannot access target records.
- The pattern supports all canonical domain models without bypasses.

## Verification
- Run integration tests with two users against representative owned resources.

## Completion Notes
- `utils/ownership.ts`: the single reusable pattern every future owned-resource feature must use:
  - `listOwned(Model, userId, extraFilter?)` — list, returns a chainable `Query`.
  - `findOwnedById(Model, id, userId, notFoundMessage?)` — detail.
  - `updateOwnedById(Model, id, userId, update, notFoundMessage?, options?)` — atomic
    `findOneAndUpdate` scoped to `{ _id, userId }`, `runValidators: true`.
  - `deleteOwnedById(Model, id, userId, notFoundMessage?)` — atomic `deleteOne` scoped the same way.
  - `parseObjectId` guards malformed ids before they ever reach a query.
- Security invariant (documented in the file's JSDoc and enforced by every helper): a malformed
  id, a well-formed id that doesn't exist, and a well-formed id belonging to another user all
  produce the exact same `AppError.notFound` (404, identical message) — no client-observable
  difference reveals whether another user's record exists.
- Callers must always derive `userId` from `req.user.id` (set by `requireAuth`), never from a
  request body/param field; 1006/1007 controllers reuse these helpers rather than writing
  ownership filters ad hoc.
- No feature HTTP routes were added (out of scope); the pattern is proven directly against the
  existing `WeightEntry` model as a representative owned resource.
- Verified: 12 new tests in `tests/utils/ownership.test.ts` — two-user list isolation; detail
  fetch by owner vs. attacker vs. nonexistent vs. malformed id (all indistinguishable 404s);
  update/delete refused for a non-owner with the record left unmodified. `typecheck`, `lint`,
  `test` (73/73), `build` all pass. Also fixed a Mongoose 9 deprecation (`new` ->
  `returnDocument: "after"` on `findOneAndUpdate`).
