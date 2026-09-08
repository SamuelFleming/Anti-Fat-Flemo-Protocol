# 2007 - Implement DailyTargetGauge

**Status:** Blocked  
**Phase:** 2  
**Depends On:** 1008

## Related Docs / Design References
- `docs/DesignConcept/00_UI-Design-Concept.md`
- `docs/DesignConcept/02_DailyTargetGauge.visual.md`

## Objective and User Outcome
Show Calories or Move against a target through one readable instrument that remains precise at and beyond the target.

## Scope
- Reusable approximately 300-degree gauge with compact/default variants.
- Normal, target, capped overrun, missing and partial states.
- Previous-value transitions, metric identities and reduced motion.

## Out of Scope
- Calculations, data fetching, a second metric-specific gauge implementation and stock chart widgets.

## Likely Files / Areas
- `client/src/components/metrics/DailyTargetGauge.*`
- Shared arc/value primitives and component fixtures

## Technical Tasks
- Prioritise current/target text over the arc.
- Keep explicit target endpoint and non-wrapping overrun indicator.
- Make Calories coral and Move lavender without implying good/bad.

## Acceptance Criteria
- Both metrics compose the same implementation.
- Values over 100% remain exact and do not draw another lap.
- Missing data is distinct from zero; motion and colour are nonessential.

## Verification
- Run component checks for zero, normal, target, overrun, missing, metric and reduced-motion states.

## Completion Notes
Pending implementation.
