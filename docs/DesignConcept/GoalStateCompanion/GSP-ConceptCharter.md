# Goal State Companion — Concept Charter

## 1. Purpose

`GoalStateCompanion` is an animated character-based ambient data visualisation for a personal goal, health and weight-management tracking application.

Its purpose is to make the current tracked state more immediately understandable, expressive and memorable through:

* posture;
* movement;
* facial expression;
* breathing;
* physical behaviour;
* secondary animation;
* material/accent treatment.

It supplements the application's numerical information.

It does not replace it.

The companion is therefore best understood as a **living visual instrument**, rather than merely a mascot, virtual pet or decorative avatar.

---

## 2. What the Companion Represents

The companion does **not** literally represent the user's body.

Instead, it embodies the state of the application's currently selected tracking context.

Conceptually:

```text
Tracked Day / Context
        ↓
Interpreted State
        ↓
Goal State Companion
```

For today, this may represent an evolving live state.

For a historical date, it may represent the completed or partially completed state of that date.

This distinction is fundamental.

For example:

```text
Calories above today's target
        ↓
temporary intake-overrun / overfull visual language
```

does not mean:

```text
user gained body fat
```

Similarly:

```text
low movement late in the day
        ↓
restlessness / stiffness / unused-energy behaviour
```

does not mean:

```text
user is lazy, depressed or unmotivated
```

The character represents **data state**, not personal worth or identity.

---

## 3. Core Product Principles

The following principles should be treated as non-negotiable unless deliberately revised later:

1. **Informative, not judgemental.** The companion communicates conditions rather than issuing moral evaluations.

2. **Composite, not binary.** There is no universal `good`, `bad`, `success` or `failure` character state.

3. **Time-aware.** The meaning of today's values depends on how much of the day has elapsed.

4. **Range-aware.** Targets are interpreted using ranges, tolerances and context rather than simplistic threshold switches.

5. **No-data neutral.** Missing information means unknown, not failure.

6. **Extreme behaviour is not infinitely rewarded.** Very high movement, very low intake or very large estimated deficits should not produce increasingly positive character behaviour.

7. **Numerically redundant.** Anything important expressed by the companion must remain available elsewhere as normal data.

8. **Optional and accessible.** The application must remain functional without the companion and should support reduced-motion/static presentation.

---

## 4. State Architecture

The companion should not use a single enum such as:

```ts
type CharacterState =
  | "good"
  | "bad"
  | "hungry"
  | "bloated"
  | "lazy"
  | "sweaty";
```

This produces an increasingly unmanageable combination problem.

Instead, the system should be compositional.

A useful high-level architecture is:

```text
APPLICATION DATA
      │
      ▼
Companion State Interpreter
      │
      ▼
Semantic State Channels
      │
      ▼
Behaviour Resolver
      │
      ▼
Animation / Presentation Layers
      │
      ▼
Rendered Companion
```

This creates four distinct responsibilities.

### Application Data

The parent application owns factual values:

```text
calories consumed
calorie target
movement
movement target
estimated energy balance
weight trend
goal trajectory
selected date
time context
data completeness
```

### State Interpreter

The interpreter determines what those values currently mean.

For example:

```text
600 / 1800 kcal at 10:00
→ no meaningful under-fuel cue
```

while:

```text
600 / 1800 kcal at 21:00
→ potentially meaningful low-intake signal
```

### Semantic State

The semantic layer describes the condition without deciding exactly which animation should play.

### Behaviour Resolver

The resolver combines simultaneous semantic signals and determines pose, expression, animation weights and visual effects.

The renderer then performs those behaviours.

---

## 5. Initial Semantic Channels

The original concept of nutrition, movement, goal progress, data state and day phase remains useful, but these should eventually become richer than simple categorical enums.

An initial conceptual model is:

| Channel                  | Represents                                              | Example Outputs                                            |
| ------------------------ | ------------------------------------------------------- | ---------------------------------------------------------- |
| **Intake load**          | Intake relative to today's target                       | neutral → approaching → over → substantially over          |
| **Fuel adequacy**        | Whether intake appears unusually low given time/context | neutral → somewhat low → materially low                    |
| **Movement opportunity** | Movement remaining relative to time left                | neutral → movement opportunity remaining → strongly behind |
| **Exertion load**        | How much movement has already occurred                  | normal → active → high → very high                         |
| **Energy balance**       | Broad estimated daily balance context                   | neutral/moderate → substantial imbalance                   |
| **Goal trajectory**      | Longer-term direction                                   | behind → around trajectory → ahead                         |
| **Data confidence**      | How completely the state is known                       | none → partial → sufficient → complete                     |
| **Temporal context**     | How today's values should be interpreted                | morning → midday → afternoon → evening → complete          |

This separation is important.

For example, **movement opportunity** and **exertion load** are different concepts.

Someone could simultaneously have:

```text
high movement achieved
+
high exertion load
```

producing an energetic-but-tired character.

Similarly, intake should not simply exist on one:

```text
LOW ←────────→ HIGH
```

axis.

Being substantially over target and being meaningfully under-fuelled are different semantic conditions with different rules.

---

## 6. State Composition

The final companion appearance is assembled rather than selected.

For example:

```text
INTAKE OVER TARGET
        +
HIGH MOVEMENT
        +
EVENING
```

might resolve into:

```text
torso:
    slightly full / relaxed

posture:
    upright but recovering

breathing:
    moderately elevated

face:
    satisfied / tired

effects:
    light sweat

idle:
    occasional stretch or hands-on-knees recovery
```

Another combination:

```text
LOW INTAKE
      +
VERY HIGH MOVEMENT
      +
LATE EVENING
```

might become:

```text
posture:
    lower-energy

face:
    physically depleted / hungry

breathing:
    elevated from movement

effects:
    sweat

idle:
    slower recovery behaviour
```

Crucially, this should **not** resolve to:

```text
VERY GOOD
```

because neither a very large deficit nor extreme movement is automatically desirable.

---

## 7. Visual Information Layers

The character should eventually be constructed from semi-independent animation layers.

Conceptually:

```text
BASE IDLE
   +
POSTURE
   +
FACIAL EXPRESSION
   +
BREATHING
   +
GESTURE
   +
SECONDARY PHYSICS
   +
EFFECTS
   +
MATERIAL / ACCENT
```

This is preferable to authoring hundreds of complete animations such as:

```text
hungry-and-sweaty-and-ahead-of-goal.anim
```

A high-movement state might increase breathing and sweat independently of whether the nutrition layer changes the stomach pose.

Likewise goal trajectory might subtly affect posture or accent treatment without replacing the current physical state.

---

## 8. Animation Hierarchy

Different visual channels should carry different kinds of information.

| Visual Layer                   | Best suited to                                 |
| ------------------------------ | ---------------------------------------------- |
| **Posture**                    | strongest current physical state               |
| **Face**                       | comfort, fatigue, effort, attentiveness        |
| **Breathing**                  | activity/exertion                              |
| **Hands/arms**                 | stomach holding, stretching, recovery gestures |
| **Legs/stance**                | restlessness, confidence, exertion             |
| **Idle frequency**             | energy/activity level                          |
| **Sweat/effects**              | high exertion                                  |
| **Material/accent**            | subtle long-term or contextual state           |
| **Environmental/stage detail** | longer-term progression or selected context    |

This prevents every state variable competing for the character's face.

---

## 9. Goal Progress Should Be Quiet

Longer-term goal trajectory should generally have **less visual authority** than today's immediate physical state.

One weight measurement should not make the character suddenly appear unhappy.

Goal progress should therefore use smoothed or trend-based information rather than daily scale noise.

Its effects may include:

```text
slightly more confident stance
subtle animation amplitude
accent/material treatment
stage/environment progression
small celebratory behaviours after meaningful milestones
```

rather than:

```text
ahead = happy face
behind = sad face
```

---

## 10. Missing and Partial Data

Missing data is a first-class state.

```text
NO DATA
```

should produce a deliberately neutral companion.

Possible language:

```text
neutral stance
minimal facial expression
soft idle breathing
muted/desaturated material
reduced animation complexity
```

Partial data is different from no data.

If calories are known but movement is not, the companion may express nutrition-related information while suppressing movement-derived behaviours.

Visual intensity should therefore be capable of scaling with **data confidence**.

The character must never confidently invent a state from missing information.

---

## 11. Historical Context

The companion should operate against a shared `selectedDate` or equivalent parent-app context.

Conceptually:

```text
Selected Tracking Context
          │
    ┌─────┼─────┐
    ▼     ▼     ▼
 calories move  balance
          │
          ▼
 GoalStateCompanion
```

Today's state is dynamic.

A historical day should normally represent the final known state for that day.

This means selecting a previous day may trigger:

```text
current live pose
      ↓
transition
      ↓
historical final pose
```

The companion therefore becomes another coherent representation of the selected dataset rather than an isolated dashboard decoration.

---

## 12. Character Identity

The intended character family is:

> A small, rounded, soft-bodied humanoid with deliberately simplified anatomy, an original recognisable silhouette, minimal facial features and highly readable physical movement.

The character should feel:

```text
physical
tactile
slightly comedic
warm
expressive
simple
modern
```

but not:

```text
childish
hyper-cute
cartoonishly obese/thin
realistically human
medically anatomical
overly emotional
pet-like in a guilt-inducing way
```

A particularly useful design principle is:

> **The simpler the character geometry, the more responsibility movement carries.**

The final silhouette should therefore be designed around animation readability rather than static illustration detail.

---

## 13. Relationship to the User

The companion should sit somewhere between:

```text
YOUR BODY
```

and:

```text
A RANDOM MASCOT
```

It is neither.

A better mental model is:

```text
THE DAY, GIVEN A BODY
```

or:

```text
YOUR TRACKED STATE, EMBODIED
```

This gives it personality without turning every animation into a judgement about the user.

---

## 14. Explainability

The interpretation engine should eventually expose **why** the companion is behaving in a particular way.

For example:

```ts
reasons: [
  {
    code: "INTAKE_OVER_TARGET",
    strength: 0.42
  },
  {
    code: "HIGH_EXERTION",
    strength: 0.63
  }
]
```

This could support:

```text
Why is my companion doing this?
```

and produce an explanation such as:

```text
You've logged more than today's calorie target,
and your movement is substantially above target.
```

This is valuable for:

* user trust;
* debugging;
* tuning thresholds;
* accessibility;
* automated testing;
* future personalisation.

---

## 15. Integration Boundary

`GoalStateCompanion` should not fetch health data itself.

The parent application should provide a state snapshot or derived view model.

A likely eventual architecture is:

```ts
Parent Application
       │
       ▼
GoalStateSnapshot
       │
       ▼
deriveCompanionState(...)
       │
       ▼
CompanionSemanticState
       │
       ▼
resolveCompanionBehaviour(...)
       │
       ▼
<GoalStateCompanion />
```

This keeps:

```text
business/domain interpretation
```

separate from:

```text
animation implementation
```

and means the renderer could theoretically change from one technology to another without rewriting the health/goal interpretation rules.

---

## 16. Renderer Independence

The conceptual state model should not depend on whether the final renderer uses:

```text
Rive
Spline
Three.js / React Three Fiber
another 3D engine
a static reduced-motion representation
```

For example:

```ts
semanticState.exertion = 0.72
```

is preferable to:

```ts
playAnimation("sweaty-animation-3")
```

inside application business logic.

The renderer decides what `0.72` means visually.

This separation should be treated as an architectural requirement.

---

## 17. Accessibility and Reduced Motion

The state system must support a static interpretation.

Animated:

```text
foot tapping
stretch
breathing
sweat
```

might become, under reduced motion:

```text
restless stance
arms raised slightly
static exertion pose
sweat marks
```

Therefore:

> The companion's meaning must come from **pose + expression + animation**, not animation alone.

---

## 18. Success Criterion

The companion is successful when a user can glance at it and think something approximately like:

```text
I've been fairly inactive today.
```

or:

```text
I've done a lot of movement and I'm probably finished for the day.
```

or:

```text
I've eaten beyond my target.
```

before reading the precise figures.

The figures then provide accuracy.

The companion provides recognition.

---

# Design Definition

The current working definition of `GoalStateCompanion` is therefore:

> **An optional, state-machine-driven humanoid ambient visualisation that embodies the currently selected tracking context by composing time-aware nutrition, movement, exertion, energy-balance, goal-trajectory and data-confidence signals into readable pose, expression, animation and material behaviour without replacing numerical data or making moral judgements about the user.**
