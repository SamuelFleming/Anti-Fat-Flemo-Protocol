# Anti-Fat-Flemo — Project Context

## Project identity

Anti-Fat-Flemo is a personal health, weight-management and accountability application.
It combines daily calorie tracking, movement/energy expenditure, weight and goal progress,
estimated energy balance, weekly accountability, and short- or long-term goal periods.

The product should make tracked state understandable at a glance without becoming punitive,
clinical, or a generic fitness-dashboard clone. Data remains primary; animation and character
systems add interpretation and personality rather than replacing the underlying metrics.

## Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS 4 |
| Backend | Node.js, Express 5, JWT auth |
| Database | MongoDB, Mongoose |

Use the same general MERN implementation patterns as CareerContext unless a ticket explicitly changes them.

## Sources of truth

Use documents selectively; do not preload the whole documentation set for every task.

- Product purpose and boundaries → `docs/core-scope/01-Project-Overview.md`, `02-Core-Scope.md`
- User behaviour and navigation → `03-User-Flows.md`, `04-Screens-and-UX.md`
- Canonical data shape → `05-Data-Model.md`
- Domain/calculation behaviour → `06-Calculation-Rules.md`
- HTTP/API design intent → `07-API-Specification.md`
- Explicitly deferred ideas → `08-Future-Scope.md`
- Visual language → `docs/DesignConcept/00_UI-Design-Concept.md`, then only the matching `.visual.md`
- Current implementation scope → relevant file in `docs/devTickets/`
- Implemented behaviour → current codebase and implemented OpenAPI mirror

Functional scope is governed by `core-scope`; visual treatment is governed by `DesignConcept`.
Do not preload the DesignConcept folder. `GoalStateCompanion/` is deferred unless a ticket adopts it.

## Signature UI

Canonical names: `GoalJourneyTrack`, `DailyTargetGauge`, `WeeklyAccountabilityRibbon`.

Do not replace a specified signature component with a conventional progress bar, chart, card,
or stock dashboard equivalent merely because it is easier to implement.
Read `00_UI-Design-Concept.md` and the matching `.visual.md` only. Architecture and library
strategy are optional, on demand.

## Working rules

- Prefer small, ticket-aligned changes over broad unguided refactors.
- Check `docs/devTickets/devTickets_next.md` before introducing feature scope.
- Preserve the established React and Express/Mongoose architecture unless explicitly refactoring.
- Keep frontend, backend, docs, API specification, and implemented OpenAPI aligned.
- Never invent or re-derive health/energy formulas when `06-Calculation-Rules.md` defines them.
- Keep calculations centralised and testable rather than duplicated across UI and controllers.
- Support historical selected-day context where the relevant screen/component requires it.
- Treat missing data as unknown, not as failure or negative user behaviour.
- Respect reduced-motion and accessibility requirements for animated state.
- Avoid implementing `08-Future-Scope.md` early.
- If ticket, docs, and code materially disagree, report the mismatch before broad edits.
- Do not run git operations unless the user explicitly requests them.

## Development workflow

1. **Plan Large Feature** — inspect scope/design/code and create repo-local tickets; no app code.
2. **Implement Dev Ticket** — default implementation workflow for ticket-scoped development.
3. **Implement UI Concept** — implement/refine a visually specified component with design review.
4. **Small Change** — smallest safe isolated edit.
5. **Audit / Diagnose** — investigate bugs, regressions, drift, or uncertain behaviour before edits.

Use `.cursor/rules/frontend.mdc`, `backend.mdc`, and `documentation.mdc` for domain-specific guidance.

## Development records

Tickets live in `docs/devTickets/phase{N}/`.
`docs/devTickets/devTickets_next.md` tracks execution order and dependencies.
`docs/devTickets/devCompletion.md` records implemented work.
Implemented backend HTTP behaviour should be mirrored in `server/src/openapi/`.

## Common commands

Server: `cd server && npm install && node server.js`
Client: `cd client && npm install && npm run dev`
