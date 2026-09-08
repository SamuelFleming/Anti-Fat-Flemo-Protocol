# Audit / Diagnose

Use for bugs, build errors, regressions, architecture/design drift, or unclear behaviour.

## Instructions

1. Read `CLAUDE.md` and inspect the relevant code, errors/logs, ticket, and canonical docs.
2. Do not edit files initially.
3. Trace the affected path far enough to distinguish symptom from cause.
4. Identify:
   - likely root cause
   - supporting evidence
   - affected files/components/services
   - whether code, ticket, core docs, design docs, calculations, API spec, or OpenAPI disagree
   - smallest safe fix
   - regression risk and useful verification
5. For visual regressions, compare against the relevant `.visual.md` and component requirements,
   not against a generic UI expectation.
6. For derived-data issues, verify against `06-Calculation-Rules.md`.
7. For API issues, compare `07-API-Specification.md`, implemented handler behaviour, and OpenAPI.
8. Classify the fix as Small Change, Implement Dev Ticket, Implement UI Concept, or Plan Large Feature.
9. Do not run git operations unless explicitly requested.

## Output

Return a concise diagnosis, evidence, proposed fix path, risk level, verification approach,
and recommended workflow mode.
