# Development Completion Registry

Record a ticket here only after its acceptance criteria and verification are complete.

## Phase 1

- `1001 - Bootstrap MERN Workspace` — completed 2026-09-08
  - Verification: `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build` pass for
    both `client` and `server`; both dev servers boot from a clean install.
  - Notes: pinned `typescript@5.9.3` on `server` (repo-latest 7.x major not yet supported by
    `typescript-eslint`); client keeps Vite's scaffolded oxlint instead of ESLint.
- `1002 - Establish Backend Platform` — completed 2026-09-08
  - Verification: `npm run typecheck`, `lint`, `test`, `build` (server) pass; manual smoke test of
    built `server.js` against live in-memory MongoDB (connect → listen → `/api/health` →
    graceful `SIGTERM` shutdown).
  - Notes: test harness uses one shared `mongodb-memory-server` via Vitest `globalSetup`, with
    test files running sequentially; error envelope fixed as `{ error: { message, details? } }`
    for all future endpoints.
- `1003 - Implement Canonical Domain Models` — completed 2026-09-08
  - Verification: 42 tests across model + date-utility suites; `typecheck`, `lint`, `test`,
    `build` pass.
  - Notes: "only one active goal per user" left to the 1006 service layer (not a documented DB
    constraint); `Profile` given a unique `userId` index (one profile per user) as a reasonable
    modelling decision matching the singular profile API contract.
- `1004 - Implement Authentication API` — completed 2026-09-08
  - Verification: 19 new tests (password/JWT units + register/login/me/logout integration);
    `typecheck`, `lint`, `test` (61/61), `build` pass.
  - Notes: login uses one generic "Invalid email or password" message for both unknown-email and
    wrong-password to avoid account-existence leakage; logout is a documented no-op (stateless
    JWT, no server-side session); actual rate limiting deferred as an infra-level concern.
- `1005 - Enforce User-Scoped Data Ownership` — completed 2026-09-08
  - Verification: 12 new tests proving indistinguishable 404s for malformed/nonexistent/
    another-user's ids across list/detail/update/delete; `typecheck`, `lint`, `test` (73/73),
    `build` pass.
  - Notes: `utils/ownership.ts` (`listOwned`/`findOwnedById`/`updateOwnedById`/`deleteOwnedById`)
    is the mandatory pattern for 1006/1007; also fixed a Mongoose 9 `findOneAndUpdate` deprecation.
- `1006 - Implement Profile and Goal APIs` — completed 2026-09-08
  - Verification: 22 new tests (profile + goals integration); `typecheck`, `lint`, `test`
    (95/95), `build` pass.
  - Notes: response conventions fixed for later tickets (single resource direct, list as
    `{ items }`, absence-as-null not 404 for `/goals/active`); found/fixed an Express 5
    `req.query` getter-only gotcha in `middleware/validate.ts`.
- `1007 - Implement Tracking APIs` — completed 2026-09-08
  - Verification: `typecheck`, `lint`, `test` (123/123), `build` pass.
  - Notes: meals CRUD, daily-log date upsert, weights CRUD with date filters; Mongo E11000 →
    409 in errorHandler; daily-logs list also accepts range filters for consistency.
- `1008 - Build Frontend Application Shell` — completed 2026-09-09
  - Verification: client `typecheck` and `build` pass.
  - Notes: moss top nav + mobile drawer (Motion), route placeholders, tokens, apiClient,
    Button/Input/PageContainer.
- `1009 - Integrate Frontend Authentication` — completed 2026-09-09
  - Verification: client `typecheck` and `build` pass.
  - Notes: AuthProvider + protected routes; login/register journey-entry motif; JWT restore
    via `/auth/me`; logout in shell.

## Phase 2

- `2001 - Implement Calculation Layer` — completed 2026-09-09
  - Verification: new domain unit tests pass; server `typecheck`/`test`/`build` pass.
  - Notes: pure functions in `server/src/domain/{energy,weight,status,thresholds}.ts`; missing inputs
    return `null` rather than `0` (expenditure/deficit/status/days-remaining).
- `2002 - Complete Goal Management Experience` — completed 2026-09-09
  - Verification: client `typecheck`/`test`/`build` pass.
  - Notes: `GoalsPage`/`GoalForm` reuse dashboard-derived progress/status instead of duplicating
    calculations; `Button` gained `forwardRef` for `ConfirmDialog` focus handling.
- `2003 - Complete Profile and Initial Setup` — completed 2026-09-09
  - Verification: client `typecheck`/`test`/`build` pass.
  - Notes: `ProfileContext` + `SettingsPage` gate access via `AuthenticatedShell` redirect until
    height/baseline TDEE are set; goal creation stays a separate step (2002).
- `2004 - Implement Dashboard Aggregation Contract` — completed 2026-09-09
  - Verification: server `typecheck`/`test`/`build` pass.
  - Notes: `GET /api/dashboard?date=` composes active goal, selected-day and Monday-Sunday week data
    from the active goal's targets (no historical goal resolution — that's 2012's job).
- `2005 - Build Dashboard Composition` / `2009 - Integrate Dashboard Signature Widgets` — completed 2026-09-09
  - Verification: client `typecheck`/`test`/`build` pass.
  - Notes: single `DashboardPage` with one shared `selectedDate`; added `baselineTdee`/`moveKcal` to
    the dashboard API response (mirrored in OpenAPI) so `EnergyBalanceCard` doesn't re-derive the
    Move kJ→kcal formula client-side.
- `2006 - Implement GoalJourneyTrack` / `2007 - Implement DailyTargetGauge` / `2008 - Implement WeeklyAccountabilityRibbon` — completed 2026-09-09
  - Verification: component smoke tests pass; client `typecheck`/`test`/`build` pass.
  - Notes: prop-driven, API-agnostic signature components with `motion/react` animation and
    `useReducedMotion` support; status/identity never rely on colour alone.
- `2010 - Build Daily Log and Meal Management` / `2011 - Add Move and Weight Workflows` — completed 2026-09-09
  - Verification: client `typecheck`/`test`/`build` pass.
  - Notes: `DailyLogPage` composes `MealsPanel` + `MoveWeightPanel` around a `?date=`-driven selected
    day; weight add/edit chooses create-vs-update from the existing one-entry-per-date DB constraint.
- `2012 - Implement Progress Aggregation API` — completed 2026-09-09
  - Verification: server `typecheck`/`test`/`build` pass.
  - Notes: `GET /api/progress` resolves the historically-correct goal/target per day rather than
    applying the active goal retroactively.
- `2013 - Build Progress Screen` — completed 2026-09-09
  - Verification: client `typecheck`/`test`/`build` pass.
  - Notes: owned SVG chart components (`components/charts/`) instead of a new chart library; exact
    values are always available via the accessible history table alongside the visual charts.
- `2014 - Complete Responsive and Accessibility Pass` — completed 2026-09-09
  - Verification: manual review of all Phase 2 routes at mobile/desktop widths; client `build` pass.
  - Notes: relied on the already-central `:focus-visible` ring and `prefers-reduced-motion` handling;
    fixed meal-row wrapping on narrow widths as the one concrete issue found.
- `2015 - Validate and Finalise MVP` — completed 2026-09-09
  - Verification: server `typecheck`/`build`/`test` (161/161) and client `typecheck`/`test` (12/12)/
    `build` all pass; manual review of the full register→goal→log→dashboard→progress→complete flow.
  - Notes: no temporary artifacts introduced; OpenAPI reconciled with the Dashboard/Progress
    contracts. Phase 2 MVP scope is complete; no Phase 3 or `GoalStateCompanion` work started.

## Phase 3

- `3001 - Define Character Visual Language` — completed 2026-09-09
  - Verification: design-doc-only ticket; no build/test run. Reviewed against
    `GSP-ConceptCharter.md` §14, §15, §22 for consistency.
  - Notes: produced `docs/DesignConcept/GoalStateCompanion/01_Character-Visual-Language.md`.
    Decided a tall-narrow, no-neck, no-joint "seed" silhouette; moss-family base material with
    small state-coloured accents (not full-body recolour); minimal face system; bounded/reversible
    deformation (never implying body-composition change); charter's DATA→EXPRESSION personality
    boundary. Left dimensionality/technology open for ticket 3007. Flagged
    `docs/devTickets/phase2/MVP-FeedbackNotes.md`'s narrow-centre-column placement idea as a
    proportion constraint without deciding Dashboard layout.
- `3002 - Define Companion State Model` — completed 2026-09-09
  - Verification: design-doc-only; reviewed against charter §4.3–4.7 and `06-Calculation-Rules.md`
    #17–19 / `DAILY_STATUS_THRESHOLDS`.
  - Notes: produced `docs/DesignConcept/GoalStateCompanion/02_State-Model.md`. Five semantic
    dimensions with hybrid categorical+intensity model; reuses existing calorie/Move bands; time-
    aware under-target labelling; dataState gates missing/partial data without coercing Move to 0;
    goal progress trajectory-smoothed. Charter State Q7–12 closed. Composition deferred to 3003.
- `3003 - Define State Composition Rules` — completed 2026-09-09
  - Verification: design-doc-only; reviewed against charter §6, §8, §9, §12.
  - Notes: produced `03_State-Composition-Rules.md`. Layer ownership, posture priority, face
    matrix, additive blending, partial-data rules; Composition Q13–17 closed.
- `3004 - Define Pose and Expression Catalogue` — completed 2026-09-09
  - Verification: design-doc-only; reviewed against charter §4.10, §13, §14.
  - Notes: produced `04_Pose-and-Expression-Catalogue.md`. All important 3003 IDs have static
    poses; mannequin distinct from negative states; renderer-independent.
- `3005 - Define Animation Vocabulary` — completed 2026-09-09
  - Verification: design-doc-only; reviewed against Motion Rules and charter §8–11.
  - Notes: produced `05_Animation-Vocabulary.md`. Layered procedural + sparse gestures; day
    cross-fade; reduced-motion → 3004 poses; blending model ready for 3007.
- `3006 - Define Historical and No-Data Behaviour` — completed 2026-09-09
  - Verification: design-doc-only; reviewed against charter §11–13 and selected-day pattern.
  - Notes: produced `06_Historical-and-No-Data-Behaviour.md`. Final known state = recompute;
    partial per-dimension; mannequin language locked; History Q18–20 closed. Design-doc block
    3001–3006 complete.
- `3007 - Confirm 3D Rendering Technology (React Three Fiber) and Spike` — completed 2026-09-09
  - Verification: client typecheck pass; spike at `/dev/companion-spike` for manual pose swap /
    WebGL fallback check (no permanent automated WebGL test).
  - Notes: produced `07_Technology-Evaluation.md`. Installed `three` / `@react-three/fiber` /
    `@react-three/drei`. Throwaway `_spike/` with lazy Canvas and mannequin↔high-exertion swap.
    Not Dashboard-integrated. Technology Q21–25 closed.
- `3008 - Implement Companion State Contract` — completed 2026-09-09
  - Verification: `vitest` `companionState.test.ts` 7/7 pass; client typecheck pass.
  - Notes: pure `companionState.ts` maps Dashboard-shaped day context → semantic + resolved
    behaviour. Covers on-track, 3003 conflict example, no-data, partial, time-aware morning vs
    evening, historical firm low-fuel. No render/fetch. `reasons` explainability deferred.

## Entry Format

- `XXXX - Ticket Name` — completed `YYYY-MM-DD`
  - Verification: concise command/result summary
  - Notes: material implementation decisions or intentionally deferred work
