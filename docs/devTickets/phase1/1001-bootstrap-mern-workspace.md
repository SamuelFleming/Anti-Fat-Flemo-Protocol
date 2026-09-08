# 1001 - Bootstrap MERN Workspace

**Status:** Implemented  
**Phase:** 1  
**Depends On:** None

## Related Docs / Design References
- `CLAUDE.md`
- `docs/phased-development-plan.md`

## Objective and User Outcome
Create a reproducible TypeScript MERN workspace that future tickets can build and verify without setup guesswork.

## Scope
- React 19/Vite client and Node/Express server.
- Shared root scripts, environment examples, linting, formatting and test commands.
- Local development and production-build configuration.

## Out of Scope
- Database integration, routes, application screens or feature behaviour.

## Likely Files / Areas
- Root package/workspace files
- `client/`
- `server/`
- `.env.example` files

## Technical Tasks
- Establish TypeScript, ESM and documented folder conventions.
- Add install, dev, build, lint and test scripts.
- Keep secrets out of source control and document required environment variables.

## Acceptance Criteria
- Dependencies install from a clean checkout.
- Client and server start through documented commands.
- Type-check, lint and build commands exist and pass on the bootstrap.

## Verification
- Run install, type-check/lint and production builds for both packages.

## Completion Notes
- npm workspaces root (`client`, `server`); `concurrently`-based root `dev` script.
- `server`: Express 5 + TypeScript (NodeNext ESM), `tsx watch` for dev, `tsc` build, ESLint 9 flat
  config, Vitest + Supertest. Pinned `typescript@5.9.3` (repo tooling latest is a 7.x major not yet
  supported by `typescript-eslint`).
- `client`: Vite 8 + React 19 + TypeScript scaffold (`create-vite react-ts`), Tailwind CSS 4 via
  `@tailwindcss/vite`, oxlint (Vite's current default linter), Vitest + Testing Library.
- `.env.example` documented for both packages; secrets excluded via root `.gitignore`.
- Verified: server/client typecheck, lint, test and build all pass; both dev servers boot
  (`:4000`, `:5173`) from a clean `npm install`.
