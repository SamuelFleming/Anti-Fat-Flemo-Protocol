# 1004 - Implement Authentication API

**Status:** Blocked  
**Phase:** 1  
**Depends On:** 1003

## Related Docs / Design References
- `docs/core-scope/02-Core-Scope.md`
- `docs/core-scope/07-API-Specification.md`

## Objective and User Outcome
Let users register, authenticate, restore their session and log out securely.

## Scope
- Register, login, current-user and logout endpoints.
- Password hashing, JWT issuance/verification and protected-route middleware.
- Input validation, rate-limit-ready boundaries, tests and implemented OpenAPI.

## Out of Scope
- Frontend auth UI, password reset, social login and production token rotation.

## Likely Files / Areas
- `server/src/features/auth/`
- `server/src/middleware/auth.*`
- `server/src/openapi/`

## Technical Tasks
- Derive authenticated identity from validated credentials/token only.
- Never expose password hashes or sensitive token details.
- Match documented endpoint payloads and status behaviour.

## Acceptance Criteria
- Valid users can register, login, call `/api/auth/me` and log out.
- Invalid credentials and protected requests fail safely.
- Passwords are hashed and API/OpenAPI behaviour is aligned.

## Verification
- Run auth integration tests including duplicate email, invalid password and expired/invalid token cases.

## Completion Notes
Pending implementation.
