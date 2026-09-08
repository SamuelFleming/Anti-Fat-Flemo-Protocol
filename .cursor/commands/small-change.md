# Small Change

Use for tiny, obvious, isolated, low-risk edits.

## Instructions

1. Read enough surrounding code/context to avoid accidental breakage.
2. Make the smallest safe change that satisfies the request.
3. Preserve existing architecture, design language, and conventions.
4. Do not refactor unrelated code or introduce new abstractions/libraries.
5. Do not create a dev ticket unless the change affects API behaviour, data model,
   calculation semantics, routing, a signature component contract, or multiple features.
6. If backend HTTP behaviour changes, update the affected OpenAPI file in the same change.
7. If a calculation changes, verify against `06-Calculation-Rules.md`.
8. Run one quick relevant check when practical.
9. Report files changed, what changed, and checks run.

## Escalation

If the task is no longer isolated or changes feature behaviour, switch to **Implement Dev Ticket**.
If the main uncertainty is why something is broken, switch to **Audit / Diagnose**.

Do not run git operations unless explicitly requested.
