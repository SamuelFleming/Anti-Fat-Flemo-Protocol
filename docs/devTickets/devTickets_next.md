# Development Ticket Queue

Tickets execute in dependency order. Start only tickets whose dependencies are implemented.
`GoalStateCompanion` and all Phase 3 work remain excluded through 2015.

## Next

1. [2001 - Implement Calculation Layer](phase2/2001-implement-calculation-layer.md)

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
1. [2001 - Implement Calculation Layer](phase2/2001-implement-calculation-layer.md) — after 1006 and 1007
2. [2002 - Complete Goal Management Experience](phase2/2002-complete-goal-management-experience.md) — after 1006, 1008 and 1009
3. [2003 - Complete Profile and Initial Setup](phase2/2003-complete-profile-and-initial-setup.md) — after 1006, 1008 and 1009

### Dashboard
4. [2004 - Implement Dashboard Aggregation Contract](phase2/2004-implement-dashboard-aggregation-contract.md) — after 2001
5. [2005 - Build Dashboard Composition](phase2/2005-build-dashboard-composition.md) — after 2004 and 1008

### Signature UI
6. [2006 - Implement GoalJourneyTrack](phase2/2006-implement-goal-journey-track.md) — after 1008
7. [2007 - Implement DailyTargetGauge](phase2/2007-implement-daily-target-gauge.md) — after 1008
8. [2008 - Implement WeeklyAccountabilityRibbon](phase2/2008-implement-weekly-accountability-ribbon.md) — after 1008 and 2001
9. [2009 - Integrate Dashboard Signature Widgets](phase2/2009-integrate-dashboard-signature-widgets.md) — after 2005–2008

### Tracking and history
10. [2010 - Build Daily Log and Meal Management](phase2/2010-build-daily-log-and-meal-management.md) — after 1007, 1008, 1009, 2001 and 2007
11. [2011 - Add Move and Weight Workflows](phase2/2011-add-move-and-weight-workflows.md) — after 1007, 1008, 1009, 2001, 2006 and 2007
12. [2012 - Implement Progress Aggregation API](phase2/2012-implement-progress-aggregation-api.md) — after 2001
13. [2013 - Build Progress Screen](phase2/2013-build-progress-screen.md) — after 2006 and 2012

### MVP completion
14. [2014 - Complete Responsive and Accessibility Pass](phase2/2014-complete-responsive-and-accessibility-pass.md) — after 2002, 2003, 2009, 2010, 2011 and 2013
15. [2015 - Validate and Finalise MVP](phase2/2015-validate-and-finalise-mvp.md) — after 2014

**Phase 2 gate:** 2015 implemented and every Phase 2 exit criterion verified.
