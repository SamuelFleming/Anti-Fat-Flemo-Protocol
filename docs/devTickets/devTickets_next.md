# Development Ticket Queue

Tickets execute in dependency order. Start only tickets whose dependencies are implemented.
`GoalStateCompanion`/Phase 3 was excluded from Phase 1-2 (through ticket 2015). Phase 3 is now
sequenced below as the active queue.

## Next

1. [3002 - Define Companion State Model](phase3/3002-define-companion-state-model.md)

## Phase 1 — Foundations

### Platform
1. [1001 - Bootstrap MERN Workspace](phase1/1001-bootstrap-mern-workspace.md) — implemented
2. [1002 - Establish Backend Platform](phase1/1002-establish-backend-platform.md) — implemented
3. [1003 - Implement Canonical Domain Models](phase1/1003-implement-canonical-domain-models.md) — implemented

### Authentication and ownership
4. [1004 - Implement Authentication API](phase1/1004-implement-authentication-api.md) — implemented
5. [1005 - Enforce User-Scoped Data Ownership](phase1/1005-enforce-user-scoped-data-ownership.md) — implemented

### Core APIs
6. [1006 - Implement Profile and Goal APIs](phase1/1006-implement-profile-and-goal-apis.md) — implemented
7. [1007 - Implement Tracking APIs](phase1/1007-implement-tracking-apis.md) — implemented

### Frontend foundation
8. [1008 - Build Frontend Application Shell](phase1/1008-build-frontend-application-shell.md) — implemented
9. [1009 - Integrate Frontend Authentication](phase1/1009-integrate-frontend-authentication.md) — implemented

**Phase 1 gate:** all 1001–1009 implemented; local authenticated shell and manually exercisable core CRUD APIs.

## Phase 2 — MVP

### Domain and setup
1. [2001 - Implement Calculation Layer](phase2/2001-implement-calculation-layer.md) — implemented
2. [2002 - Complete Goal Management Experience](phase2/2002-complete-goal-management-experience.md) — implemented
3. [2003 - Complete Profile and Initial Setup](phase2/2003-complete-profile-and-initial-setup.md) — implemented


### Dashboard
4. [2004 - Implement Dashboard Aggregation Contract](phase2/2004-implement-dashboard-aggregation-contract.md) — implemented
5. [2005 - Build Dashboard Composition](phase2/2005-build-dashboard-composition.md) — implemented

### Signature UI
6. [2006 - Implement GoalJourneyTrack](phase2/2006-implement-goal-journey-track.md) — implemented
7. [2007 - Implement DailyTargetGauge](phase2/2007-implement-daily-target-gauge.md) — implemented
8. [2008 - Implement WeeklyAccountabilityRibbon](phase2/2008-implement-weekly-accountability-ribbon.md) — implemented
9. [2009 - Integrate Dashboard Signature Widgets](phase2/2009-integrate-dashboard-signature-widgets.md) — implemented

### Tracking and history
10. [2010 - Build Daily Log and Meal Management](phase2/2010-build-daily-log-and-meal-management.md) — implemented
11. [2011 - Add Move and Weight Workflows](phase2/2011-add-move-and-weight-workflows.md) — implemented
12. [2012 - Implement Progress Aggregation API](phase2/2012-implement-progress-aggregation-api.md) — implemented
13. [2013 - Build Progress Screen](phase2/2013-build-progress-screen.md) — implemented

### MVP completion
14. [2014 - Complete Responsive and Accessibility Pass](phase2/2014-complete-responsive-and-accessibility-pass.md) — implemented
15. [2015 - Validate and Finalise MVP](phase2/2015-validate-and-finalise-mvp.md) — implemented

**Phase 2 gate:** 2015 implemented and every Phase 2 exit criterion verified. ✅ Phase 2 complete.

## Phase 3 — GoalStateCompanion

Deferred until adopted; now sequenced per `docs/phased-development-plan.md` §5 and
`docs/DesignConcept/GoalStateCompanion/GSP-ConceptCharter.md` §25-26. Design-doc tickets (3001-3006)
produce `docs/DesignConcept/GoalStateCompanion/0N_*.md` artefacts only — no app code — before any
implementation begins.

**Two decisions are locked (not open questions for their tickets to re-litigate):**
- **Rendering technology:** React Three Fiber / Three.js — a proper 3D character (ticket 3007
  documents/confirms this rather than evaluating alternatives from scratch).
- **Dashboard placement:** centred between the Calories and Move `DailyTargetGauge` (`compact`
  variant) on the Dashboard, replacing the current full-width side-by-side gauge row (ticket 3011).

### Design decisions (no app code)
1. [3001 - Define Character Visual Language](phase3/3001-define-character-visual-language.md) — implemented
2. [3002 - Define Companion State Model](phase3/3002-define-companion-state-model.md) — after 3001
3. [3003 - Define State Composition Rules](phase3/3003-define-state-composition-rules.md) — after 3002
4. [3004 - Define Pose and Expression Catalogue](phase3/3004-define-pose-and-expression-catalogue.md) — after 3001 and 3003
5. [3005 - Define Animation Vocabulary](phase3/3005-define-animation-vocabulary.md) — after 3004
6. [3006 - Define Historical and No-Data Behaviour](phase3/3006-define-historical-and-no-data-behaviour.md) — after 3002 and 3004

### Technology and implementation
7. [3007 - Confirm 3D Rendering Technology (React Three Fiber) and Spike](phase3/3007-evaluate-rendering-technology-and-spike.md) — after 3004, 3005 and 3006
8. [3008 - Implement Companion State Contract](phase3/3008-implement-companion-state-contract.md) — after 3002, 3003 and 3006
9. [3009 - Build Minimum Viable Render Prototype](phase3/3009-build-minimum-viable-render-prototype.md) — after 3007 and 3008
10. [3010 - Implement Character States and Animation System](phase3/3010-implement-character-states-and-animation.md) — after 3009

### Integration and finalisation
11. [3011 - Integrate GoalStateCompanion into the Dashboard](phase3/3011-integrate-companion-into-dashboard.md) — after 3010
12. [3012 - Refine and Finalise GoalStateCompanion](phase3/3012-refine-and-finalise-goalstatecompanion.md) — after 3011

**Phase 3 gate:** 3012 implemented and every Phase 3 exit criterion in `docs/phased-development-plan.md` verified.
