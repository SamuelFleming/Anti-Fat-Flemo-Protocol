# Implement Dev Ticket

Use as the default workflow for ticket-scoped Anti-Fat-Flemo development.

## Input

Provide a repo-local ticket path under `docs/devTickets/phase{N}/`, or a sufficiently scoped task
that should be captured as a ticket.

## Instructions

1. Read `CLAUDE.md`, the ticket, and `docs/devTickets/devTickets_next.md`.
2. Read only the core/design documents directly relevant to the ticket.
3. Inspect current code before deciding exact files or implementation details.
4. Apply relevant frontend/backend/documentation rules.
5. Before editing, briefly report:
   - relevant files/docs inspected
   - likely files to change
   - important API/data/calculation/design assumptions
   - any ticket/docs/code mismatch
   - verification approach
6. Implement the smallest complete solution within ticket scope.
7. Preserve existing architecture and reuse current components/services/utilities.
8. If backend HTTP behaviour changes, update the matching `server/src/openapi/` files.
9. If calculation behaviour changes, verify it against `06-Calculation-Rules.md`; do not improvise formulas.
10. If a signature visual is central to the ticket, apply **Implement UI Concept** discipline as part of the work.
11. Run relevant checks/tests/builds where practical.
12. Update ticket acceptance criteria/status/completion notes and required queue/completion registries.
13. Report changed files, verification results, and genuine follow-up work.

## Stop / escalate

Report before broadening work if implementation requires:
- another ticket/phase
- unrelated architectural refactoring
- a new framework/library not already justified
- material changes to core scope, API contract, calculation rules, or adopted visual design

Do not run git operations unless explicitly requested.
