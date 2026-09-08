# GoalStateCompanion — Character Visual Language

**Status:** Decided (Phase 3, ticket 3001). Resolves `GSP-ConceptCharter.md` §24 "Character" (Q1-6)
and §15 (personality boundary). Anatomy/material/face are described conceptually — no rigging,
mesh, or asset production here; that begins once a renderer is chosen (ticket 3007+).

**Component:** `GoalStateCompanion`
**Purpose:** Give the currently selected tracking context a physical, animated presence — "the
tracked day, given a body" — distinct from a mascot, pet, avatar, or decorative animation.

---

## 1. Silhouette and Proportions

A single-piece, rounded, upright humanoid — closer to a **soft standing seed/pebble form** than a
jointed action-figure. No visible neck: head and torso read as one continuous rounded mass, with
short rounded arms and legs and simplified rounded feet as its base.

Proportions lean **tall and narrow** rather than wide (roughly 1:2.2 width\:height at rest), for two
reasons:
- a slender silhouette stays recognisable at small dashboard sizes;
- product feedback (`docs/devTickets/phase2/MVP-FeedbackNotes.md`) already anticipates the companion
  sitting in a narrow centre column with a gauge/ring either side. This document does not decide
  Dashboard layout (ticket 3011), but the silhouette should not fight that intent later.

```text
   ___
  ( o o )      <- head/torso fused, no neck
   \_◕_/
    | |        <- short rounded torso
   /   \
  (     )      <- stubby rounded arms
   \   /
    | |        <- short legs
   (   )       <- rounded feet, no visible toes
```

This is illustrative only — final form belongs to visual production, not this document.

## 2. Anatomy

Loosely humanoid, simplified for soft-body animation rather than rigid-joint rigging:
- head, torso, two arms, two legs — no visible hands (rounded mitten-like terminations) and no
  visible articulated joints (elbows/knees/fingers).
- deformation is implied through **squash/stretch of soft forms**, not skeletal bending. Anatomy
  should support posture, gesture and breathing without requiring detailed rigging or costuming.
- no accessories, clothing, or props as part of the base identity (a subtle accent per §4 is
  permitted; a wardrobe system is not).

## 3. Face System

Minimal and readable at small sizes:
- **Eyes:** two simple rounded shapes, capable of at least neutral, soft/content, wide/alert, and
  closed/resting variants.
- **Mouth:** a single simple line/shape, capable of at least neutral, small smile, slightly-open/
  effortful, and flat variants.
- **Eyebrows (optional):** simple shapes usable to extend the expression range (e.g. concern,
  effort) without adding new face elements.
- No nose, ears, or other facial detail. The face should communicate *effort, comfort and
  attentiveness* (per the composition-layer ownership to be finalised in ticket 3003) — not literal
  emotion diagnosis.

## 4. Material and Colour Identity

One dominant material/colour, matching charter §14's "one dominant material" direction and keeping
the companion visually distinct from the app's UI chrome rather than competing with it:

- **Base "skin":** a matte, muted variant of `var(--color-moss)` — the app's grounded primary
  colour — as the character's neutral/default material. This keeps the companion visually part of
  the same palette family as the rest of the product rather than introducing a competing colour
  identity.
- **Accent, not colour-swap:** state-relevant colour (coral for Calories-related cues, lavender for
  Move-related cues, lime for current/highlight emphasis) appears only as a **small accent** (e.g. a
  cheek/chest glow, a small highlight), never as a full-body recolour. Full-body recolouring would
  make the character read as a status light rather than a character, and would fight the
  established rule that metric colours identify Calories vs Move rather than good/bad.
- Meaning must still be legible without colour (posture/face carry primary meaning; colour is
  reinforcement only), consistent with the app's general accessibility rule.

## 5. What Makes It Recognisably Ours

- The moss-family base material ties it to the app's palette rather than a generic bright mascot
  palette.
- The fused head/torso "seed" silhouette (no neck, no joints) is a deliberately uncommon shape
  compared to typical humanoid mascots, and is not shared with any existing signature component.
- A small, optional lime accent (e.g. a soft sprout-like tuft or highlight near the head) may echo
  the app's "growth/tracking" language without becoming literal plant iconography or a logo.
- It must remain visually distinct from `GoalJourneyTrack`, `DailyTargetGauge`, and
  `WeeklyAccountabilityRibbon` — those stay data-first signature widgets; the companion is the only
  character-like element in the product.

## 6. Dimensionality Direction

No renderer/technology decision is made here (that is ticket 3007). This document only expresses a
**leaning**: the rounded, low-detail, soft-body silhouette above is deliberately compatible with
either a 2.5D (flat-shaded/soft-shaded 3D) or 3D soft-body treatment, and should remain simple enough
that a 2D/sprite fallback is also plausible if ticket 3007 finds 3D impractical. Nothing above
depends on a specific dimensionality.

## 7. Humour and Tone

Mild, physical, situational humour only — a stretch after a high-Move day, a gentle sway when idle,
looking pleased with itself after a milestone. Never verbal jokes, never mockery, never aimed at the
user. Charm over comedy. This keeps tone consistent with charter §4.1 (informative, not judgemental).

## 8. Physical Deformation Boundary

Deformation communicates **temporary tracked conditions**, not body-composition change:
- modest squash/stretch/scale blends only (e.g. a slightly fuller torso shape as a temporary,
  reversible cue after high intake; a more compact/tucked shape during a low-fuel cue);
- always bounded and gentle — never large enough to imply the character (or by extension, the user)
  has "become" a different size;
- no hard mesh deformation, no permanent morphs tied to long-term weight; long-term goal trajectory
  should influence posture/confidence/material subtlety (per charter §10), not body shape.

## 9. Personality Boundary

The companion may fidget, stretch, sigh, recover after exertion, react physically, and appear
pleased with itself. It must not become a separate entity whose wellbeing the user is responsible
for, and missed tracking days must never appear to harm or upset it (charter §15, §4.6). The
relationship is strictly:

```text
DATA → CHARACTER EXPRESSION
```

never:

```text
USER → CARE FOR CHARACTER
```

## 10. What This Character Is Not

Restated from charter §1/§22 for this document's own scope: not a mascot, not a virtual pet, not an
avatar of the user, not decorative animation, not a literal digital body twin, and not a health/
diagnostic indicator. It is a living visual interpretation of the currently selected tracked state.

## Implementation Freedom

Exact line weight, precise proportion ratios, exact eye/mouth shapes, and any accent-motif detail may
be refined during later visual production (asset creation, ticket 3007+) as long as the silhouette,
material identity, face system, deformation boundary, and personality boundary above are preserved.
