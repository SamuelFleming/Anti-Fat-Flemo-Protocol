# Anti-Fat-Flemo-Protocol
A rapidly developed calorie tracking app. Built to help those who want to reach goals over a period of time.

## Workspace

npm workspaces monorepo:

- `client/` — React 19, TypeScript, Vite, Tailwind CSS 4
- `server/` — Node.js, TypeScript, Express 5, MongoDB/Mongoose

## Setup

```bash
npm install
cp server/.env.example server/.env
cp client/.env.example client/.env
```

`server/.env` requires a reachable `MONGODB_URI` from ticket `1002` onward (e.g. a local MongoDB instance).

## Common commands

Run from the repo root (targets both workspaces) or with `-w client` / `-w server` for a single package.

| Command | Effect |
|---|---|
| `npm run dev` | Start server (`:4000`) and client (`:5173`) together |
| `npm run build` | Production build for both packages |
| `npm run typecheck` | TypeScript project check for both packages |
| `npm run lint` | ESLint (server) / oxlint (client) |
| `npm run test` | Vitest for both packages |

## Documentation

- Project context and working rules: `CLAUDE.md`
- Product scope: `docs/core-scope/`
- Visual design language: `docs/DesignConcept/`
- Development tickets and execution order: `docs/devTickets/`
