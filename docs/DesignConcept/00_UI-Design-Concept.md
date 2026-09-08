# UI Design Concept

**Status:** Canonical visual-language source of truth  
**Purpose:** Define identity, tokens, motion, and authority so implementation docs are not re-read as competing specs.

## Authority

Stop reading once the layer answers the question.

1. **Product what** — `docs/core-scope/` (status meanings, calculations, screens' jobs).
2. **Visual how** — this file (palette, chrome, motion, signature inventory).
3. **Signature how** — the matching `0N_*.visual.md`.
4. **Implementation how** — `react-ui-library-strategy.md`, `ui-component-architecture.md`.
5. **Reference only** — `ReferenceItems/`, `SomeComponents.md`.
6. **Deferred** — `GoalStateCompanion/` until a ticket explicitly adopts it.

Conflict rules:

- `.visual.md` vs Figma → **`.visual.md` wins**. Figma is palette and vibe, not layout law.
- DesignConcept vs core-scope on **visuals** → **DesignConcept wins**.
- DesignConcept vs core-scope on **status / calculations** → **core-scope / `06-Calculation-Rules.md` wins**.
- Cursor rules use the canonical names in this file. Do not invent aliases.

## Core Direction

- grounded moss / lime / coral / lavender palette;
- warm neutral canvas;
- left-side navigation;
- clear metric hierarchy;
- restrained use of cards;
- custom treatment for the main tracking widgets.

The app should feel more individual than a generic AI-generated dashboard, but development should not stop for low-value micro-design decisions.

## Kinetic grounded palette

Copy these tokens. Do not re-derive colours from the Figma screenshot.

| Token | Hex | Use |
|---|---|---|
| Moss / Primary | `#456B58` | Navigation, on-track, travelled-path / moss surfaces |
| Kinetic Lime | `#DDF38A` | Current/focus emphasis only — **not body text** |
| Energy Coral | `#F2898D` | Calories identity, partial status |
| Motion Lavender | `#C7BDF7` | Move identity, secondary accent |
| Canvas Neutral | `#F3F4EF` | App ground |
| Ink | `#17201E` | Primary text and controls |

Notes:

- Metric colours identify Calories vs Move; they do **not** mean good/bad.
- Ink on Canvas is the high-contrast text pairing (~13.4:1). Light surface on Moss should remain readable (~5.6:1).
- Lime is reserved for non-text emphasis (markers, today, current position).

`ReferenceItems/FigmaOutput.png` is the origin of this palette. Its dashboard layout, “Pulse” branding, filled progress bar, isolated day dots, and semicircle gauges are **not** binding. Ignore `ReferenceItems/CareerContext-Dashboard.png`.

## Signature Components (MVP)

- `GoalJourneyTrack` → `01_GoalJourneyTrack.visual.md`
- `DailyTargetGauge` → `02_DailyTargetGauge.visual.md`
- `WeeklyAccountabilityRibbon` → `03_WeeklyAccountabilityRibbon.visual.md`

Supporting (no competing visual spec unless a `.visual.md` exists): `EnergyBalanceCard`, compact metric/trend surfaces, conventional charts.

`GoalStateCompanion` is a separate workstream. Do not read or implement it during a normal dashboard/UI pass.

## Motion Rules

### Fresh screen/widget load
When there is no meaningful previous visual state:

- animate from neutral/zero;
- keep it brief;
- overlap/stagger widgets rather than playing a long sequence.

Examples:
- journey marker travels from start to current position;
- gauge sweeps from zero to current value;
- weekly ribbon resolves across the week;
- expanded charts draw/hatch into view.

### Data update
When data changes while the screen is already visible:

- animate **from the previous value/state**, not from zero;
- animate only affected components.

### Changing selected day/history
When moving between days:

- animate from the currently displayed day's state to the selected day's state;
- do not replay the full entrance animation.

### Navigation / general UX
Tasteful page transitions, hover/focus responses and layout animations are encouraged. Motion/React Bits/similar libraries may be used where useful.

Avoid:
- constant decorative motion;
- effects that compete with tracked data;
- inaccessible hover-only behaviour.

Respect `prefers-reduced-motion`. Animation must never be the sole carrier of meaning.

## Design Freedom

Where this documentation is silent, implementation should prefer:

1. clarity;
2. continuity of motion;
3. accessibility;
4. consistency with the established palette;
5. slightly more character than a stock SaaS dashboard.

Do not block development waiting for approval on small visual details unless they materially affect behaviour or information meaning.
