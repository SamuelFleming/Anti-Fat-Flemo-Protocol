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

Present start → current → goal weight, e.g. `82.0 kg → 80.7 kg → 76.0 kg`.

Visual: `GoalJourneyTrack` (`docs/DesignConcept/01_GoalJourneyTrack.visual.md`).

---

## 3.2 Calories

Display `1,420 / 1,800 kcal` (current / target), remaining or over-target, and missing data as unknown.

Visual: `DailyTargetGauge` (`docs/DesignConcept/02_DailyTargetGauge.visual.md`). Calories and Move are independent instances of the same component.

---

## 3.3 Move

Display `1,620 / 1,800 kJ` with the same gauge contract as Calories, distinct metric colour.

Visual: `DailyTargetGauge`.

---

## 3.4 Energy Balance

Compact initial state:

`Estimated deficit ~710 kcal`

Selectable expanded state:

`Baseline     2,150 kcal`

`Move          +387 kcal`

`Food        -1,827 kcal`

`Estimated      710 kcal deficit`

Expansion should animate spatially from the compact widget where practical. Labelled as an estimate. Supporting widget — not a fourth signature spec.

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

Visual: `WeeklyAccountabilityRibbon` (`docs/DesignConcept/03_WeeklyAccountabilityRibbon.visual.md`).

Selecting a day updates other day-aware dashboard widgets. Domain statuses remain those in `02-Core-Scope.md` (On Track / Partial / Off Track / Awaiting data).

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

Show overall movement from goal start to current state using `GoalJourneyTrack` (expanded variant). Do not substitute a generic progress bar.

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

Avoid MyFitnessPal, Bootstrap-admin, and generic SaaS-dashboard clones.

Visual language, palette, and motion: `docs/DesignConcept/00_UI-Design-Concept.md`.
Signature widgets: the matching `.visual.md` files. Do not explore alternate theme names or metaphors here.

---

# 10. Motion System

Defined in `docs/DesignConcept/00_UI-Design-Concept.md`.

UX constraints that remain here:

* animations never block data entry
* expandable widgets should originate from their compact location where practical
* missing data is explicit; estimates are labelled

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
