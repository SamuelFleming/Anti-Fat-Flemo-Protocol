# 1008 - Build Frontend Application Shell

**Status:** Implemented  
**Phase:** 1  
**Depends On:** 1001

## Related Docs / Design References
- `docs/core-scope/04-Screens-and-UX.md`
- `docs/DesignConcept/00_UI-Design-Concept.md`
- `docs/DesignConcept/ui-component-architecture.md`

## Objective and User Outcome
Create a responsive, recognisable application shell with fast access to every primary destination.

## Scope
- Router, route placeholders, API client/service foundation and shared providers.
- Canonical design tokens and foundational accessible UI primitives.
- Persistent Card Nav-inspired top rail and accessible mobile drawer.

## Out of Scope
- Authentication integration, real feature content, signature widgets and copied GSAP navigation.

## Likely Files / Areas
- `client/src/app/`, `components/ui/`, `services/`, `styles/`
- Route-level feature placeholders

## Technical Tasks
- Implement project-owned navigation with Motion for React and reduced-motion fallback.
- Keep primary destinations visible on desktop; expansion is secondary only.
- Establish loading/error boundaries and responsive page container conventions.

## Acceptance Criteria
- Dashboard, Daily Log, Progress, Goals and Settings routes render in the shell.
- Current route, keyboard focus and mobile navigation are clear and accessible.
- Navigation fits the canonical palette and does not use GSAP or mimic the old sidebar.

## Verification
- Client `typecheck` and `build` pass.

## Completion Notes
Implemented 2026-09-09.

- Design tokens in `styles/tokens.css`; moss top rail `AppNav` with desktop links always
  visible and Escape-dismissable mobile drawer (Motion + `useReducedMotion`).
- Route placeholders for Dashboard / Daily Log / Progress / Goals / Settings.
- Shared `apiClient`, `Button` / `Input` / `PageContainer` primitives.
- Auth wiring landed in 1009 on top of this shell.
