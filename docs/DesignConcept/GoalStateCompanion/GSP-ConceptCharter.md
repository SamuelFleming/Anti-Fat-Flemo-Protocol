# Goal State Companion — Concept Charter

## Status

**Deferred / exploratory — v0.2.** Do not treat this as MVP or dashboard implementation scope. Read only if the active ticket adopts `GoalStateCompanion`.

This document establishes the purpose, design prin

ciples, conceptual boundaries and high-level architecture of `GoalStateCompanion`.

It deliberately does **not** yet define:

* the final character model;
* exact character proportions;
* final state thresholds;
* final animation clips;
* whether the character is 2D, 2.5D or 3D;
* the animation/runtime technology;
* detailed React implementation;
* dashboard layout.

Those decisions belong to later design stages.

---

# 1. Purpose

`GoalStateCompanion` is an expressive humanoid ambient data visualisation for a personal goal, health and weight-management tracking application.

Its purpose is to give the user's currently selected tracking state a physical, animated representation through mechanisms such as:

* posture;
* facial expression;
* breathing;
* gesture;
* movement;
* idle behaviour;
* body deformation;
* secondary effects;
* material treatment.

It supplements the application's conventional metrics.

It does not replace them.

The companion should therefore be treated as a:

> **living visual interpretation of tracked state**

rather than merely:

* a mascot;
* a virtual pet;
* an avatar of the user;
* a decorative animation.

---

# 2. Core Mental Model

The companion does **not** literally represent the user's body.

It represents the state of the currently selected tracking context.

A useful conceptual description is:

> **The tracked day, given a body.**

Or:

> **The user's tracked state, embodied.**

Conceptually:

```text
Selected Day Context
        ↓
Tracked Metrics
        ↓
State Interpretation
        ↓
Companion Behaviour
        ↓
Rendered Character
```

This distinction is fundamental.

For example:

```text
calorie intake above today's target
        ↓
temporary overfull behaviour
```

does **not** mean:

```text
the user's body has suddenly become larger
```

Likewise:

```text
low movement late in the day
        ↓
restlessness / stiffness / unused-energy behaviour
```

does **not** mean:

```text
the user is lazy, depressed or unmotivated
```

The companion embodies **conditions in the tracked data**, not characteristics of the person.

---

# 3. Selected Day Context Is Fundamental

The companion must not be architected around an implicit assumption of:

```ts
today
```

Instead it should operate against a selected tracking context, provisionally referred to as:

```ts
SelectedDayContext
```

or:

```ts
DayContext
```

This context may represent:

* the current live day;
* a completed historical day;
* a partially logged historical day;
* a historical day with no data.

Conceptually:

```text
Weekly / Historical Selection
            ↓
     SelectedDayContext
            │
     ┌──────┼──────┐
     ↓      ↓      ↓
 Calories  Move  Balance
            │
            ▼
   GoalStateCompanion
```

The companion is therefore another visual interpretation of the **same selected dataset** used elsewhere by the parent application.

---

# 4. Core Design Principles

## 4.1 Informative, Not Judgemental

The companion communicates tracked conditions.

It does not assess the user's worth, discipline, morality or personality.

The intended language is:

> "Movement has been low today."

Not:

> "You were lazy."

And:

> "Today's intake is above target."

Not:

> "You failed."

---

## 4.2 Composite, Not Good/Bad

There must not be one universal companion state such as:

```ts
"good"
"bad"
"perfect"
"failed"
```

The user's tracked condition is multidimensional.

Someone might simultaneously be:

```text
slightly over calorie target
+
well above movement target
+
broadly on goal trajectory
+
viewing the day at 9 PM
```

The companion must be capable of embodying those signals together.

---

## 4.3 Time-Aware

Values must be interpreted in temporal context.

For example:

```text
600 / 1,800 kcal at 10 AM
```

may require no special visual behaviour.

The same:

```text
600 / 1,800 kcal at 9 PM
```

may justify a low-fuel visual cue.

Likewise low movement in the morning should generally have different meaning from low movement late in the evening.

The raw number alone is therefore insufficient.

---

## 4.4 Range-Aware

Targets should not behave as simplistic binary switches.

For example:

```text
1,799 kcal = GOOD
1,801 kcal = BAD
```

would be inappropriate.

State interpretation will ultimately require:

* ranges;
* tolerances;
* progressive intensities;
* temporal context;
* possibly confidence or uncertainty.

Exact rules will be defined later.

---

## 4.5 No Data Means Unknown

A day with no tracked information must never be interpreted as a bad day.

The companion must not appear:

* dead;
* abandoned;
* disappointed;
* ill;
* angry;
* emotionally injured.

Instead:

```text
NO DATA
        =
UNKNOWN STATE
```

This is particularly important for long-term usage.

Users must be able to stop tracking temporarily and return without the application behaving as though something has been damaged.

---

## 4.6 Accountability Without Guilt

The companion may be humorous, expressive and noticeable.

It may draw attention to an unusual state.

It must not become:

* a guilt mechanic;
* a streak punishment system;
* a virtual pet requiring care;
* an emotional manipulation mechanic.

Missing days must not accumulate emotional consequences.

Returning after an absence simply resumes tracking.

---

## 4.7 More Is Not Infinitely Better

Some dimensions should have meaningful upper extremes.

For example, progressively higher movement should not simply produce:

```text
happy
→ happier
→ ecstatic
→ infinitely better
```

Very high movement may instead communicate:

```text
high achievement
+
high exertion
+
possible recovery need
```

Likewise extremely low intake or a very large estimated deficit should not be celebrated simply because it increases a numerical deficit.

---

## 4.8 Data Remains Primary

Every materially important state communicated by the companion must also exist through conventional application information.

For example:

```text
character appears overfull
```

should correspond to information such as:

```text
Calories
1,950 / 1,800 kcal
+150 kcal over target
```

The companion supplies:

* glanceability;
* personality;
* physical interpretation;
* animation;
* visual shorthand.

It is never the sole source of important health or goal information.

---

## 4.9 Optionality

The wider application must remain usable if the companion is disabled.

The companion is a signature experience, not a structural dependency.

---

## 4.10 Accessible and Reduced-Motion Compatible

The companion must eventually support reduced-motion presentation.

Meaning must not depend exclusively on:

* continuous animation;
* colour;
* rapid movement;
* particle effects.

An animated state such as:

```text
foot tapping
+
stretching
+
pacing
```

should have a corresponding static visual interpretation through:

```text
stance
+
pose
+
expression
```

The data itself remains available conventionally elsewhere.

---

# 5. Preliminary State Dimensions

The final state model is deliberately unresolved.

The following represents a **starting taxonomy to investigate**, not a final enum design.

Possible dimensions include:

```ts
interface GoalState {
  nutrition: NutritionState;
  movement: MovementState;
  goalProgress: ProgressState;
  dataState: DataState;
  timeContext: DayPhase;
}
```

With preliminary concepts such as:

```text
NUTRITION
unknown
low
within range
approaching target
over target
significantly over


MOVEMENT
unknown
low
moderate
target met
high
very high


GOAL PROGRESS
unknown
behind trajectory
on trajectory
ahead of trajectory
neutral


DATA
no data
partial
live
complete


DAY PHASE
morning
midday
afternoon
evening
day complete
```

These categories should be challenged rather than simply implemented.

---

# 6. Semantic State Versus Character Behaviour

An important architectural distinction should be retained:

> **What the data means should be separated from how the character expresses it.**

For example, the application may determine:

```text
movement = very high
```

That does not automatically mean:

```text
play animation "sweaty_03"
```

Instead:

```text
Tracked Data
     ↓
Semantic Interpretation
     ↓
Behaviour Resolution
     ↓
Animation / Pose / Effects
```

This separation allows the visual implementation to evolve independently.

It also avoids embedding health/domain interpretation inside animation code.

---

# 7. Avoid Claiming Internal States We Do Not Know

The companion may anthropomorphically **look hungry**, but the application does not necessarily know:

```text
the user is hungry
```

Likewise it does not necessarily know:

```text
the user feels full
the user feels tired
the user feels energetic
```

Therefore the underlying semantic model should preferably describe observable/inferred tracking conditions such as:

```text
low contextual intake
intake over target
high exertion
movement opportunity remaining
```

while the character is permitted to translate those conditions into expressive physical behaviour.

This keeps the data model honest while allowing the animation to remain playful.

---

# 8. Composite Behaviour

One of the central design challenges of this project is:

> How can multiple independent state signals combine into one coherent character without requiring hundreds of manually authored state combinations?

For example:

```text
Calories: OVER
Movement: HIGH
Time: EVENING
```

might produce:

```text
slightly full torso
+
sweat
+
heavier breathing
+
otherwise reasonably content posture
```

while:

```text
Calories: LOW
Movement: HIGH
Time: LATE EVENING
```

might produce:

```text
lower-energy posture
+
sweat
+
low-fuel facial cue
+
recovery breathing
```

The eventual animation model should therefore investigate semi-independent behavioural layers.

---

# 9. Candidate Behaviour Layers

A preliminary visual decomposition is:

```text
BASE IDLE
    +
POSTURE
    +
FACE
    +
BREATHING
    +
GESTURE
    +
STOMACH / BODY FORM
    +
MOVEMENT / EXERTION EFFECTS
    +
MATERIAL / ACCENT
    +
SECONDARY IDLE BEHAVIOUR
```

Different state dimensions may own or influence different layers.

For example:

| Layer           | Likely information                           |
| --------------- | -------------------------------------------- |
| Posture         | dominant immediate physical condition        |
| Face            | effort, comfort, attentiveness               |
| Breathing       | exertion                                     |
| Arms/hands      | stomach holding, stretching, recovery        |
| Legs/stance     | restlessness, exertion, confidence           |
| Stomach/body    | temporary intake/fullness cue                |
| Sweat/effects   | exertion intensity                           |
| Idle behaviour  | energy/restlessness                          |
| Material/accent | subtle contextual or longer-term information |

Exact ownership rules remain to be designed.

---

# 10. Longer-Term Goal Progress

Goal trajectory should generally influence the companion more quietly than immediate daily state.

A single weight measurement should not cause dramatic emotional changes.

Goal progress should eventually be based on an appropriate trend or trajectory model rather than simply:

```text
weight went down today = happy
weight went up today = sad
```

Possible longer-term visual influence could include:

* posture;
* confidence;
* idle quality;
* subtle material/accent treatment;
* occasional milestone behaviour;
* environmental/stage progression.

This remains exploratory.

---

# 11. Historical Behaviour

When viewing the current day, the companion may evolve as data changes.

When viewing a completed historical day, it should represent the final known state of that day.

For example:

```text
Select Wednesday
       ↓
SelectedDayContext = Wednesday
       ↓
Wednesday calorie data
Wednesday movement data
Wednesday balance data
Wednesday progress context
       ↓
Wednesday companion state
```

The companion may transition visually between selected days, but the precise transition system belongs to later animation design.

---

# 12. Partial Data

`partial` is distinct from both `noData` and `complete`.

For example:

```text
calorie data exists
movement data missing
```

should not force the entire companion into an N/A state.

Instead, the system should eventually be capable of expressing supported dimensions while suppressing unsupported ones.

Conceptually:

```text
known nutrition signal
+
unknown movement signal
```

may still produce nutrition-related behaviour without inventing movement behaviour.

The character's certainty should never exceed the certainty of the underlying information.

---

# 13. No-Data Visual Language

The exact design remains unresolved, but the no-data companion should probably feel closer to:

> **neutral / uninstantiated / mannequin**

than:

> **sad / inactive / abandoned**

Candidate cues include:

* neutral material;
* reduced saturation;
* simple standing pose;
* minimal expression;
* subdued idle;
* reduced visual emphasis;
* explicit accessible `NO DATA` communication.

This requires its own later design treatment.

---

# 14. Character Direction

The current broad visual target is:

> A simplistic, rounded, toy-like humanoid character with one dominant material or colour, an original silhouette, low visual complexity and highly readable physical animation.

Desired characteristics include:

* simple silhouette;
* rounded forms;
* low detail;
* expressive body pose;
* readable eyes and mouth;
* optional eyebrow system;
* recognisable small-scale rendering;
* material/colour flexibility;
* animation-readable anatomy.

Gang Beasts is useful only as a reference for:

* physical readability;
* simplicity;
* humour;
* exaggerated animation;
* toy-like presence.

The final character must have its own:

* silhouette;
* proportions;
* facial system;
* movement language;
* material identity;
* personality.

Detailed visual exploration has not yet begun.

---

# 15. Character Personality Boundary

The companion may possess personality.

It may:

* fidget;
* stretch;
* sigh;
* recover after exertion;
* react comedically;
* appear pleased with itself;
* behave physically.

However, it should not become a separate entity whose wellbeing the user is responsible for.

That means avoiding mechanics such as:

```text
You didn't log yesterday,
so your companion is upset with you.
```

The relationship should remain:

```text
DATA
↓
CHARACTER EXPRESSION
```

not:

```text
USER
↓
CARE FOR CHARACTER
```

---

# 16. Spatial Boundary

The companion does not necessarily need to live inside a conventional dashboard card.

Potential presentation environments include:

* a small stage;
* ground plane;
* open canvas region;
* subtle environmental space.

However, this project will define only what spatial requirements the companion has.

It will **not** redesign the wider dashboard.

The parent UI design process determines final placement.

---

# 17. Integration Boundary

The companion should not independently fetch or own health/goal data.

The parent application should provide the selected tracking context or an appropriate state snapshot.

Conceptually:

```text
Parent Application
       ↓
SelectedDayContext
       ↓
Relevant Metrics
       ↓
Companion Interpretation
       ↓
GoalStateCompanion
```

A later technical architecture might resemble:

```ts
<GoalStateCompanion
  context={companionContext}
/>
```

but the exact contract is intentionally deferred.

The important boundary is:

> **The parent application owns factual tracking state.
> The companion subsystem owns interpretation and visual embodiment.**

The exact placement of some interpretation rules between shared domain code and the companion subsystem will require later design.

---

# 18. Relationship to Other Signature Components

The wider application currently includes concepts such as:

```text
GoalJourneyTrack
DailyTargetGauge
WeeklyAccountabilityRibbon
GoalStateCompanion
```

These should eventually belong to a coherent visual system.

However, this project is concerned only with:

* companion behaviour;
* companion visual language;
* shared state requirements;
* interaction requirements;
* integration contracts.

It should not redefine those other components.

---

# 19. Technology Position

No animation technology is selected.

Candidate approaches currently include:

```text
Rive
Spline
React Three Fiber / Three.js
Lottie
CSS / SVG
sprite-based systems
hybrid approaches
```

Technology evaluation should occur only after sufficient understanding exists of:

* character dimensionality;
* required deformation;
* state composition;
* animation blending;
* runtime interaction;
* historical transitions;
* material behaviour;
* performance expectations.

The implementation technology must support the design.

The design should not be prematurely constrained around a chosen technology.

---

# 20. Renderer Independence

Where practical, semantic state should remain renderer-independent.

Prefer conceptual inputs such as:

```ts
exertion: "high"
intakeState: "overTarget"
dataState: "complete"
```

or later continuous equivalents over application logic such as:

```ts
playAnimation("sweatyCharacterAnimation03");
```

The renderer should decide how semantic state becomes:

* animation;
* pose;
* expression;
* effects;
* material.

This supports future renderer changes and reduced-motion presentation.

---

# 21. Explainability

A recommended additional principle is that state interpretation should eventually be inspectable.

For example:

```ts
reasons: [
  {
    code: "INTAKE_OVER_TARGET",
    strength: 0.4
  },
  {
    code: "HIGH_MOVEMENT",
    strength: 0.7
  }
]
```

This could eventually support:

* debugging;
* automated testing;
* threshold tuning;
* accessibility;
* user-facing explanations.

For example:

> Your companion is recovering because today's movement is substantially above your current target.

This is a proposed architectural quality rather than an MVP requirement.

---

# 22. What the Companion Must Not Become

The following are explicit conceptual boundaries.

`GoalStateCompanion` is **not**:

### A literal digital body twin

Short-term states should not imply immediate physical body-composition change.

### A health diagnosis system

It should not infer medical or psychological conditions from tracking data.

### A moral score

It does not communicate whether the user has been "good" or "bad."

### A virtual pet

The user is not responsible for keeping it emotionally healthy.

### A streak mechanic

Missed days do not harm it.

### A replacement for metrics

Important information remains numerical/textual elsewhere.

### A dashboard redesign project

This subsystem integrates into the parent interface but does not determine the entire application's layout.

### A technology experiment looking for a purpose

Rive, Spline, Three.js or another renderer should be selected only after the behaviour warrants it.

---

# 23. What Would Make the Companion Useful

The companion should pass a simple test:

> **Does it communicate meaningful state before the user reads the numbers?**

For example, a glance might communicate:

```text
I've done a lot of movement today.
```

or:

```text
I've been fairly stationary and there's not much day left.
```

or:

```text
I've gone somewhat beyond today's intake target.
```

The user then looks at the conventional metrics for precision.

If the character merely:

* looks attractive;
* performs random animations;
* celebrates arbitrary thresholds;

then it is decoration rather than ambient data visualisation.

---

# 24. Design Questions Still Open

The following remain deliberately unresolved.

## Character

1. What should its silhouette be?
2. What makes it recognisably ours?
3. How humanoid should its anatomy be?
4. How expressive should its face be?
5. How humorous should it be?
6. How exaggerated should physical deformation become?

## State

7. Which dimensions genuinely deserve representation?
8. Which dimensions should not affect the character?
9. Should states ultimately be categorical, continuous, or hybrid?
10. How should time modify interpretation?
11. How should confidence/data completeness modify behaviour?
12. How should goal trajectory be smoothed?

## Composition

13. Which signal owns posture?
14. Which signal owns facial expression?
15. How do competing states resolve?
16. Can animations blend additively?
17. What conditions create temporary effects?

## History

18. What exactly constitutes a historical day's "final state"?
19. How does partial historical data behave?
20. What is the final N/A/mannequin language?

## Technology

21. Should the character be 2D, 2.5D or 3D?
22. What is the minimum viable animation system?
23. Which runtime best supports composition?
24. How should React communicate state to it?
25. What asset pipeline is appropriate?

These questions should be answered progressively rather than prematurely.

---

# 25. Planned Design Artefacts

The current proposed document sequence is:

```text
00_Goal-State-Companion-Concept.md
01_Character-Visual-Language.md
02_State-Model.md
03_State-Composition-Rules.md
04_Pose-and-Expression-Catalogue.md
05_Animation-Vocabulary.md
06_Historical-and-No-Data-Behaviour.md
07_Technology-Evaluation.md
08_React-Integration-Architecture.md
09_Prototype-Plan.md
```

These names may evolve, but the separation of concerns is useful.

### `00_Goal-State-Companion-Concept.md`

Purpose, principles, boundaries and core conceptual model.

### `01_Character-Visual-Language.md`

Silhouette, anatomy, material, face, personality and visual identity.

### `02_State-Model.md`

Input dimensions, semantic states, temporal interpretation and data-confidence rules.

### `03_State-Composition-Rules.md`

How simultaneous signals combine and compete.

### `04_Pose-and-Expression-Catalogue.md`

Canonical static/readable manifestations of important states.

### `05_Animation-Vocabulary.md`

Idle behaviour, gestures, breathing, deformation, transitions and effects.

### `06_Historical-and-No-Data-Behaviour.md`

Live versus historical behaviour, partial data and neutral unknown-state presentation.

### `07_Technology-Evaluation.md`

Rive, Spline, Three.js/R3F and other implementation approaches evaluated against actual requirements.

### `08_React-Integration-Architecture.md`

Parent/companion contract, state transformation, renderer adapter and runtime integration.

### `09_Prototype-Plan.md`

Smallest implementation capable of validating whether the concept actually works.

---

# 26. Development Sequence

The preferred evolution path is:

```text
Concept boundaries
        ↓
Character personality / visual language
        ↓
State dimensions
        ↓
State interpretation
        ↓
Composition rules
        ↓
Pose catalogue
        ↓
Animation vocabulary
        ↓
Historical / no-data behaviour
        ↓
Visual prototype
        ↓
Technology evaluation
        ↓
Technical architecture
        ↓
Implementation prototype
```

Each stage should remain reviewable and revisable before the next is treated as settled.

---

# 27. Working Definition

The current working definition is:

> **GoalStateCompanion is an optional animated humanoid ambient visualisation that embodies the application's currently selected tracking context by composing time-aware nutrition, movement, exertion, goal-trajectory and data-confidence signals into readable physical behaviour, while remaining non-judgemental, accessible, historically aware, renderer-independent at the conceptual level, and subordinate to the application's underlying numerical data.**

