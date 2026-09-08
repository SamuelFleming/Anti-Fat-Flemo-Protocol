# Implement UI Concept

Use for signature visual components or work where interaction/animation fidelity is a primary requirement.

Typical targets: `GoalJourneyTrack`, `DailyTargetGauge`, `WeeklyAccountabilityRibbon`.
`GoalStateCompanion` only if the ticket explicitly adopts it.

## Instructions

1. Read `CLAUDE.md`, the active ticket, and the relevant screen/UX requirements.
2. Read `00_UI-Design-Concept.md` and the target component's `.visual.md`.
3. Do not read architecture, library strategy, inventory, or `GoalStateCompanion/`
   unless file placement, a new library, or an adopted companion ticket requires it.
4. Inspect existing implementation/primitives before choosing libraries or component boundaries.
5. Extract the required states before coding:
   - default/live
   - historical selected day where applicable
   - no-data/partial states
   - boundary/out-of-bounds states where specified
   - responsive behaviour
   - reduced-motion/accessibility behaviour
6. Briefly state the implementation approach and any deliberate simplifications.
7. Implement the smallest faithful version; do not substitute a stock widget for the concept.
8. Keep animation derived from state/data rather than scattered timing side effects.
9. Keep numerical/text meaning available independently of the animation/colour treatment.
10. Reuse project primitives and the approved UI-library strategy.
11. Verify representative states, not only the happy/default state.
12. Run relevant frontend checks/build.
13. Update the ticket with implemented states, verification, and any intentionally deferred visual polish.

## Escalation

Do not introduce a new animation/rendering framework or materially reinterpret the concept
without recording the decision in the ticket/design docs first.

Do not run git operations unless explicitly requested.
