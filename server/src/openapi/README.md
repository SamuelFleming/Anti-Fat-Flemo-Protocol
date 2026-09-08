# Implemented OpenAPI Mirror

`openapi.ts` mirrors HTTP behaviour that is **actually implemented**, not the aspirational
contract in `docs/core-scope/07-API-Specification.md`.

Rules:

- Any ticket that changes request/response shape, status codes, or adds/removes an endpoint must
  update this file in the same change.
- Do not describe endpoints that are not yet implemented.
- Served at `GET /api/openapi.json` for manual/tool introspection.
