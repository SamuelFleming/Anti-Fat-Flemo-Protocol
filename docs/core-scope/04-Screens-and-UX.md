# Screens and UX

## 1. UX Objective

The application should feel like a focused personal progress product rather than a generic calorie database or administrative dashboard.

The interface should prioritise:

1. fast entry
2. immediate understanding
3. visual progression
4. useful historical context
5. distinctive identity
6. restrained, meaningful motion

The central visual metaphor is:

**progress through energy, movement and time**

---

# 2. Primary Navigation

* Dashboard
* Daily Log
* Progress
* Goals
* Profile / Settings

Unauthenticated routes:

* Login
* Register

Navigation should remain lightweight.

---

# 3. Dashboard

## Purpose

Answer three questions immediately:

1. How am I going today?
2. How am I going this week?
3. Am I progressing toward my goal?

The Dashboard should be the most visually distinctive screen.

---

## 3.1 Goal Journey

Rather than a standard text-only card, present:

`82.0 kg → 80.7 kg → 76.0 kg`

using a visual progress path.

Potential treatment:

* curved or horizontal track
* start marker
* animated current marker
* target marker
* progress percentage

When a new weight is recorded, the current marker may animate to its new position.

---

## 3.2 Calorie Widget

Preferred concept:

**Calorie Orbit / Energy Ring**

Display:

`1,420 / 1,800 kcal`

with a radial or arc-based indicator.

Behaviour:

* arc grows to current value on load
* arc transitions smoothly when a meal is added
* central value counts toward the new total
* exceeding target remains legible without overly punitive styling

Expanded state can show meal contribution breakdown.

---

## 3.3 Move Widget

Use a related visual system so calories and activity feel connected but distinct.

Possible treatment:

**Move Arc / Pulse Meter**

Display:

`1,620 / 1,800 kJ`

Behaviour:

* fills as Move increases
* subtle completion animation at target
* no continuous motion once settled

---

## 3.4 Energy Balance

Compact initial state:

`Estimated deficit ~710 kcal`

Selectable expanded state:

`Baseline     2,150 kcal`

`Move          +387 kcal`

`Food        -1,827 kcal`

`Estimated      710 kcal deficit`

Expansion should animate spatially from the compact widget where practical.

---

## 3.5 Daily Status

Possible states:

* On Track
* Partial
* Off Track
* Awaiting Data

Status should include a small amount of contextual explanation.

Avoid aggressive red/green success-failure language.

---

# 4. Weekly Snapshot

Visualise the week as a sequence rather than only summary numbers.

Possible concept:

**Seven-Day Ribbon**

Each day displays a small state marker containing:

* adherence status
* calorie indication
* Move completion

Hovering/selecting a day reveals detail.

The weekly component should make patterns visually apparent.

---

# 5. Daily Log

The Daily Log is primarily functional.

It should prioritise speed over decorative interaction.

Date navigation:

`‹ Previous | Tuesday 8 September | Next ›`

Sections:

* Meals
* Move
* Weight
* Daily Summary

Adding a meal should not require navigation away from the context of the selected day.

---

# 6. Progress

The Progress screen provides longer-term visual feedback.

Date-range controls:

* 7 Days
* 30 Days
* Goal
* All Time

---

## 6.1 Weight Graph

Line graph behaviour:

* line draws into position when first displayed
* changing range transitions rather than hard-resets where supported
* point selection reveals date and value
* missing weight entries remain missing

Target weight may appear as a reference line.

---

## 6.2 Calories Graph

Show:

* daily intake
* historical target

Where practical, target changes should be represented correctly rather than applying today's target retroactively to all history.

---

## 6.3 Move Graph

Show:

* daily Move
* relevant Move target

Use visual continuity with the Dashboard Move widget.

---

## 6.4 Goal Progress

Show overall movement from goal start to current state.

Potential forms:

* trajectory curve
* stepped timeline
* progress ribbon

---

# 7. Goals

## Active Goal

Display:

* name
* dates
* starting weight
* target weight
* calorie target
* Move target
* progress
* current status

Actions:

* Edit
* Complete

---

## Previous Goals

Display historical goals compactly.

Example:

`September Cut`

`82.0 → 77.1 kg`

`24 days`

`Completed`

Selecting a goal can filter Progress to that period.

---

# 8. Authentication Screens

Login and Register should share the same product visual language.

Avoid a generic enterprise login page.

A restrained visual element based on the application's progress motif may appear without distracting from the form.

---

# 9. Visual Design Direction

The app should avoid feeling like:

* MyFitnessPal clone
* generic Bootstrap admin panel
* generic SaaS analytics dashboard

Potential themes to explore separately:

### A. Kinetic Minimalism

Clean neutral surfaces combined with flowing progress arcs and motion.

### B. Instrument Panel

Metrics behave like refined gauges without becoming automotive or overly technical.

### C. Living Data

Charts, values and progress surfaces appear to grow and settle as new information arrives.

### D. Journey

Weight and goals are represented spatially as movement from one state toward another.

The final theme may combine aspects of these.

---

# 10. Motion System

Use motion deliberately.

### Entry

Widgets may softly reveal or grow into their state.

### Data Change

Values interpolate from previous state to new state.

### Navigation

Page transitions may use subtle fades or positional continuity.

### Expansion

Expandable widgets should visually originate from their compact location.

### Completion

Target completion may receive a short visual response.

---

# 11. Accessibility

The application must support:

* keyboard navigation
* clear focus states
* readable contrast
* labels not dependent on colour
* reduced-motion preferences

When `prefers-reduced-motion` is enabled, nonessential animation should be disabled or significantly reduced.

---

# 12. Responsive Design

Desktop should support a richer Dashboard layout.

Mobile web should stack primary components while preserving:

* rapid meal logging
* today's totals
* Move entry
* current goal state

A native mobile app is not required initially.

---

# 13. UX Rules

1. Common tracking actions require minimal interaction.
2. Visual identity must not reduce clarity.
3. Missing data is explicitly represented.
4. Estimated values are labelled.
5. Weekly trends take priority over perfectionism.
6. Long-term history remains navigable.
7. Motion communicates state changes.
8. Animations never block data entry.
9. Core widgets should feel designed specifically for this product.
