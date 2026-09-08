# Plan Large Feature

Use for a broad feature, phase, design batch, or requirement too large for one ticket.

## Instructions

1. Read `CLAUDE.md`.
2. Inspect only the relevant `docs/core-scope/`, `docs/DesignConcept/`, queue, and existing code.
3. Establish what already exists before proposing implementation details.
4. Do not edit application code.
5. Identify:
   - current-state/code-doc drift
   - prerequisites and dependencies
   - API/data/calculation impact
   - UX/design references
   - likely scope-creep boundaries
6. Break the feature into the smallest sensible ordered repo-local tickets.
7. Each ticket should include:
   - objective and user outcome
   - related canonical docs/design references
   - scope / out of scope
   - likely touched areas
   - technical tasks
   - dependencies
   - acceptance criteria
   - verification
8. Create/update tickets under `docs/devTickets/phase{N}/`.
9. Update `docs/devTickets/devTickets_next.md` with order and dependencies.
10. Do not copy large sections of canonical docs into tickets.
11. Do not run git operations unless explicitly requested.

## Output

Return current-state findings, proposed ticket sequence, created/updated ticket paths,
key risks/open questions, and the recommended first implementation ticket.
