# Phased Development Plan

## 1. Purpose

This document defines the high-level execution plan for the application.

It is the backbone for all development tickets. Tickets should be derived from the phases below and should not introduce scope that conflicts with the canonical product, UX, architecture, or design documentation.

The intended delivery model is:

**Phase 1 — Foundations → Phase 2 — MVP → Phase 3 — GoalStateCompanion**

The project should remain runnable at the end of every phase.

---

# 2. Development Principles

- Keep tickets small enough for reliable sequential AI-agent execution.
- Let tickets reference canonical project documentation instead of repeating large specifications.
- Prefer dependency-ordered implementation over parallel speculative work.
- Each ticket should leave the application in a valid, testable state.
- Avoid premature abstraction unless required by the documented architecture.
- Do not allow experimental Phase 3 work to destabilise the MVP.
- Functional correctness comes before visual polish, but core UX concepts belong inside the MVP rather than being deferred as optional polish.

---

# 3. Phase 1 — Foundations

## Objective

Establish a working full-stack application with the core architecture, authentication, persistence, and domain foundations required for the MVP.

At the end of this phase, the application should run locally end-to-end and provide a stable base for feature implementation.

## Included Scope

### Project Setup
- MERN project structure
- TypeScript configuration
- frontend and backend development environments
- environment configuration
- local run scripts
- core folder conventions

### Backend Foundation
- Express application
- MongoDB connection
- Mongoose configuration
- middleware and error handling
- request validation approach
- protected-route infrastructure

### Authentication
- user registration
- login
- logout/session handling
- current-user endpoint
- password hashing
- authenticated API access
- user-scoped data ownership

### Core Domain Models
- User
- Profile
- Goal
- MealEntry
- DailyLog
- WeightEntry

### Core API Foundation
Implement the essential CRUD/API surface required by later tickets, including:

- profile
- goals
- meals
- daily logs / Move energy
- weight entries

The goal is not to complete the product experience during this phase, but to ensure the domain can already be persisted and exercised through the API.

### Frontend Foundation
- React/Vite application
- routing
- auth state
- protected routes
- base application shell
- navigation
- API client/service structure
- initial design tokens/theme scaffolding

## Phase 1 Exit Criteria

Phase 1 is complete when:

- frontend and backend run locally
- database connection works
- a user can register and log in
- authenticated routes work
- core models persist correctly
- core CRUD APIs can be manually tested
- frontend can call authenticated backend endpoints
- application shell loads for an authenticated user

---

# 4. Phase 2 — MVP

## Objective

Implement the full usable application defined by the current Core Scope and UX documentation, excluding the GoalStateCompanion.

At the end of this phase, the app should be genuinely usable for day-to-day tracking.

## Included Scope

### Goal Management
- create goal
- active goal
- edit goal
- complete/archive goal
- historical goals
- support continued use across multiple goal periods

### Meal Tracking
- add meal
- edit meal
- delete meal
- daily meal list
- calorie aggregation
- optional protein tracking

### Daily Activity Tracking
- manual Apple Fitness Move entry in kJ
- daily update/upsert behaviour
- target comparison
- kJ-to-kcal conversion where required

### Weight Tracking
- add weight
- edit/delete weight
- current weight
- historical weight
- progress against goal

### Calculation Layer
- calorie totals
- calories remaining/over target
- Move completion
- estimated energy balance
- daily accountability state
- weekly aggregation
- goal progress
- missing-data handling

### Dashboard
Implement the primary product surface, including the designed custom widgets:

- GoalJourneyTrack
- DailyTargetGauge
- WeeklyAccountabilityRibbon
- current goal summary
- calorie state
- Move state
- estimated energy balance
- daily accountability status
- recent meals
- weekly snapshot

### Daily Log
- date navigation
- meal management
- Move entry
- optional weight entry
- daily summary

### Progress
- weight trend
- calorie trend
- Move trend
- goal-period view
- longer-range history
- history table

### Settings / Profile
- profile management
- calculation assumptions
- preferences
- goal-related settings where appropriate

### UX and Visual Design
Phase 2 includes implementation of the established visual language, not merely generic functional placeholders.

This includes:

- distinct dashboard composition
- custom progress components
- purposeful animation
- animated graphs where appropriate
- responsive behaviour
- expandable metric states
- reduced-motion support
- loading, empty, error, and incomplete-data states

### MVP Validation
- core user flows tested end-to-end
- removal of temporary/sample implementation artefacts

## Explicit Exclusion

The following feature is deliberately excluded from Phase 2:

**GoalStateCompanion**

The MVP should not depend on the companion being available.

## Phase 2 Exit Criteria

Phase 2 is complete when an authenticated user can:

1. create and manage a goal
2. log meals
3. record Move energy
4. record body weight
5. use the Dashboard as the primary daily tracking view
6. review weekly accountability
7. review historical progress
8. complete a goal and continue into another
9. use the application locally without requiring unfinished functionality

---

# 5. Phase 3 — GoalStateCompanion

## Objective

Experimentally implement and integrate the GoalStateCompanion as a distinct visual representation of the user's tracked state.

This phase is intentionally isolated because 3D character rendering and animation are new technical territory and should not threaten MVP delivery.

## Testing Approach

Phase 3 is experimental and visual/animation-heavy by nature, so favour lightweight verification over
exhaustive automated coverage:

- Prefer manual/visual verification and a small number of targeted smoke tests over broad unit/
  integration suites for rendering, animation, and state-transition behaviour.
- Reserve automated tests for the companion state contract (pure state → visual-state mapping logic),
  since that logic is cheap to test and easy to regress.
- Do not block ticket completion on exhaustive test coverage, cross-browser matrices, or perf
  benchmarking beyond a basic sanity check; deeper hardening can be deferred as noted follow-up work.
- Phase 1/2 testing conventions still apply to any non-companion code touched in this phase (e.g.
  shared services, contracts).

## Included Scope

### Technical Spike
Before full integration, validate the selected technical approach for:

- 3D rendering in React
- model loading
- animation playback/blending
- performance
- responsive embedding
- state-driven visual changes

Potential technologies may include WebGL-based tooling such as Three.js / React Three Fiber and supporting animation libraries.

### Companion State Contract
Implement the integration contract between application state and companion behaviour.

The companion should consume derived application state rather than independently calculate health logic.

Potential inputs include:

- goal progress
- calorie adherence
- Move adherence
- weekly accountability
- recent trend
- completion / regression states

### Character States
Implement the defined companion state system, such as:

- neutral
- positive/on-track
- under-target activity
- over-target intake
- improving
- regressing
- goal completion

Exact states should follow the dedicated GoalStateCompanion design documentation.

### Animation Behaviour
Implement:

- idle animation
- state transitions
- reaction animations
- animation blending where required
- restrained recurring motion

### Application Integration
- embed companion in the intended parent UI
- connect to real application state
- handle loading/fallback states
- ensure the app remains functional if 3D rendering fails or is unavailable
- respect performance constraints and reduced-motion preferences

### Refinement
- visual pass
- animation timing
- state-transition polish
- responsive behaviour
- performance testing

## Phase 3 Exit Criteria

Phase 3 is complete when:

- the companion renders reliably
- it responds to real application state
- state changes produce the intended visual behaviour
- performance is acceptable
- failure of the companion does not break the core application
- the feature feels integrated rather than bolted onto the Dashboard

---

# 6. Ticketing Strategy

Development tickets should be written beneath this phase structure.

Each ticket should contain only enough detail to:

- identify the intended outcome
- define the relevant scope
- identify dependencies
- reference canonical documentation
- state acceptance criteria
- describe any important implementation constraints

Tickets should not duplicate entire sections of the Core Scope, UX, API, or architecture documentation.

A useful ticket structure is:

```md
# <Ticket ID> — <Title>

## Goal
What this ticket delivers.

## Scope
What should be implemented.

## References
Relevant canonical project documentation.

## Dependencies
Earlier tickets that must already be complete.

## Acceptance Criteria
Observable conditions that define completion.

## Notes / Constraints
Only implementation details that the agent cannot safely infer.
```

---

# 7. Ticket Sequencing Guidance

Tickets should generally follow dependency order:

### Phase 1
1. project/bootstrap
2. backend foundation
3. database/domain models
4. authentication
5. core API services/routes
6. frontend foundation
7. auth integration/application shell

### Phase 2
1. goal management
2. daily tracking primitives
3. calculation/aggregation layer
4. Dashboard data contract
5. core Dashboard widgets
6. daily logging UX
7. progress/history
8. settings/profile
9. responsive/UX refinement
10. MVP validation/polish

### Phase 3
1. technical spike
2. render prototype
3. state contract
4. state/animation system
5. application integration
6. performance and UX refinement

This order is guidance rather than a rigid ticket list. Exact tickets should be created only after reviewing dependencies against the current codebase and canonical documentation.

---

# 8. Definition of Project Execution Success

The development plan succeeds if:

- Phase 1 produces a stable full-stack foundation.
- Phase 2 produces a complete and useful standalone MVP.
- Phase 3 enhances that MVP without becoming a prerequisite for it.
- Development agents can execute tickets sequentially with limited repeated context.
- Canonical documentation remains the source of truth while tickets remain concise implementation units.
