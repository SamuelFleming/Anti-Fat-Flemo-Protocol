# Core Scope

## 1. Scope Statement

The MVP is an authenticated calorie, movement, weight and goal-tracking application.

Its purpose is to provide users with a central location for recording daily behaviour and assessing whether progress is aligned with a defined health goal.

The application should support both:

* short-term initiatives
* continued long-term use

A user may complete one goal and later create another while retaining historical records.

The application does not provide clinical nutrition advice or claim to precisely measure total energy expenditure.

Its role is to organise user-entered information, calculate transparent estimates and present useful behavioural trends.

---

# 2. Core Functional Areas

The MVP consists of seven functional areas:

1. Authentication
2. User Profile
3. Goal Management
4. Meal Tracking
5. Daily Activity Tracking
6. Weight Tracking
7. Progress & Accountability

---

# 3. Authentication

## 3.1 Registration

A user must be able to register using:

* name
* email
* password

Email must be unique.

Passwords must never be persisted in plain text.

---

## 3.2 Login

A registered user must be able to authenticate using:

* email
* password

Successful authentication should establish an authenticated application session using an appropriate token mechanism.

---

## 3.3 Current User

The frontend must be able to retrieve the currently authenticated user's basic profile.

---

## 3.4 Logout

The user must be able to terminate the current authenticated session.

---

## 3.5 Data Ownership

All domain records must belong to a user.

This includes:

* goals
* meals
* daily logs
* weight entries

Every protected API operation must derive user ownership from authentication context.

Client-supplied user identifiers must not be trusted to establish ownership.

---

# 4. User Profile

Each user has one profile.

Profile information may contain:

* name
* height
* preferred measurement units
* estimated baseline daily energy expenditure

The user must be able to modify their profile.

Goal-specific information should not be stored exclusively on the Profile.

---

# 5. Goal Management

A user may have multiple goals over the lifetime of the account.

Only one goal needs to be active at a time for MVP.

A goal should contain:

* name
* start date
* optional target date
* starting weight
* target weight
* daily calorie target
* daily Move target
* status

Initial statuses:

* active
* completed
* archived

Example:

`September Weight Cut`

or:

`Maintenance — October to December`

---

## 5.1 Create Goal

The user must be able to create a goal.

If no active goal exists, a new goal may become active immediately.

---

## 5.2 Active Goal

The Dashboard should use the currently active goal when calculating:

* calorie target
* Move target
* weight progress
* target date progress
* adherence status

---

## 5.3 Complete Goal

The user must be able to mark an active goal as completed.

Historical data associated with that period must remain available.

---

## 5.4 Goal History

The user should be able to view previous goals and their high-level results.

Detailed comparison between goals may remain future scope.

---

# 6. Meal Tracking

## 6.1 Add Meal

Required:

* name
* date
* meal type
* calories

Optional:

* protein
* notes

Supported meal types:

* Breakfast
* Lunch
* Dinner
* Snack
* Other

Every meal belongs to the authenticated user.

---

## 6.2 Edit Meal

The user must be able to edit their own meal entries.

Changes must update relevant daily and weekly totals.

---

## 6.3 Delete Meal

The user must be able to delete their own meal entries.

Deleting a meal recalculates all affected summaries.

---

## 6.4 Daily Meal Display

For a selected date, display:

* meals logged
* calories for each meal
* total calories
* active calorie target
* calories remaining or exceeded

Optional protein totals may also be displayed.

---

# 7. Daily Movement Tracking

The user must be able to record Apple Fitness Move energy manually.

Required:

* date
* Move energy in kilojoules

Only one movement record should exist per user per calendar date.

Entering a new value for an existing date should update that record.

Display:

* Move energy
* active Move target
* amount remaining
* percentage completed

---

# 8. Weight Tracking

The user must be able to record body weight.

Required:

* date
* weight in kilograms

The user may edit or remove their own entries.

Weight does not need to be recorded daily.

The most recent valid measurement is considered current weight.

---

# 9. Dashboard

The Dashboard is the main application screen.

It should answer:

**How am I tracking today, this week and against my current goal?**

---

## 9.1 Active Goal Summary

Display:

* goal name
* current weight
* starting weight
* target weight
* total change
* remaining change
* target date where applicable
* goal progress

---

## 9.2 Today's Calories

Display:

* calories consumed
* calorie target
* calories remaining or exceeded
* percentage consumed

---

## 9.3 Today's Move

Display:

* current Move energy
* Move target
* amount remaining
* completion percentage

---

## 9.4 Estimated Energy Balance

Display an estimated daily deficit or surplus.

For the initial MVP:

`Estimated Baseline Expenditure + Move Calories - Calories Consumed`

Where:

`Move Calories = Move kJ / 4.184`

All such outputs must be labelled as estimates.

---

# 10. Accountability Status

The application should classify sufficiently complete days as:

* On Track
* Partial
* Off Track

Rules should exist in shared domain/configuration logic rather than UI components.

Incomplete days should not automatically be classified negatively.

The interface may instead display:

`Awaiting data`

where required values have not yet been entered.

---

# 11. Weekly Summary

For a selected week, calculate:

* total calories
* average daily calories
* calorie target comparison
* total Move energy
* average Move energy
* Move target comparison
* estimated energy balance
* weight change
* On Track days
* Partial days
* Off Track days
* incomplete/unlogged days

Weekly performance should be emphasised more strongly than individual daily perfection.

---

# 12. Long-Term Usage

The application must remain usable when significant historical data accumulates.

Progress views should therefore support:

* 7-day views
* 30-day views
* longer date ranges
* goal-period views

Historical records must not depend on the current goal remaining unchanged.

Where historical interpretation depends upon past targets, the application should preserve sufficient goal information to correctly interpret that period.

---

# 13. Progress Screen

Minimum views:

### Weight Trend

Animated line chart showing measured body weight over time.

### Daily Calories

Chart showing calorie intake and relevant target.

### Move Energy

Chart showing Move values and target.

### Goal Progress

Visual representation of progress between starting and target values.

### History Table

Display:

* date
* calories
* Move
* estimated energy balance
* weight
* status

---

# 14. Visual and Interaction Requirements

Do not implement Dashboard widgets as stock statistic cards where a purpose-built treatment exists.

Canonical visuals live in `docs/DesignConcept/`. Functional requirements here; form, tokens, and motion there.

MVP signature widgets:

- `GoalJourneyTrack` — start / current / target weight as a journey (`01_GoalJourneyTrack.visual.md`)
- `DailyTargetGauge` — Calories and Move vs daily target (`02_DailyTargetGauge.visual.md`)
- `WeeklyAccountabilityRibbon` — connected week + summaries (`03_WeeklyAccountabilityRibbon.visual.md`)

Supporting:

- estimated energy balance as an expandable, labelled estimate
- numeric values that may interpolate on change
- trend graphs that draw in on first view

Do not invent alternate metaphors (orbit, pulse meter, curved-or-horizontal track, theme A–D). If a visual is unspecified, follow `00_UI-Design-Concept.md` design freedom.

# 15. Motion Principles

Motion rules are defined in `docs/DesignConcept/00_UI-Design-Concept.md`.

Functionally: animation must communicate change, remain performant, respect reduced-motion, and never block data entry.

---

# 16. Settings

Settings/Profile should allow modification of:

### Profile

* name
* height
* baseline expenditure estimate

### Preferences

* units where applicable

Goal targets should normally be edited through Goal Management rather than general profile settings.

---

# 17. Core Data Entities

The MVP now contains six primary entities:

1. User
2. Profile
3. Goal
4. MealEntry
5. DailyLog
6. WeightEntry

Authentication records and health records must remain appropriately separated.

---

# 18. Validation Principles

Validation should prevent clearly invalid input while avoiding unnecessary assumptions about what constitutes an appropriate health goal.

Examples:

* weight > 0
* height > 0
* calories >= 0
* Move >= 0
* valid dates
* valid account email
* required password rules

The application should not enforce arbitrary health recommendations as validation rules.

---

# 19. Explicitly Out of Scope

Still outside MVP:

* social feeds
* public profiles
* user following
* coach/client relationships
* Apple Health integration
* automatic Apple Fitness ingestion
* barcode scanning
* external food databases
* full nutrient analysis
* AI meal estimation
* automated nutritional recommendations
* push notifications
* native mobile application
* subscriptions
* billing
* predictive medical functionality

---

# 20. MVP Acceptance Criteria

The core scope is complete when:

1. A user can register.
2. A user can authenticate and log out.
3. User data is securely isolated.
4. A user can create and manage an active goal.
5. A user can add, edit and delete meals.
6. Daily calorie totals update correctly.
7. A user can record Move energy.
8. A user can record weight.
9. Dashboard shows active goal progress.
10. Dashboard shows daily calories.
11. Dashboard shows movement progress.
12. Dashboard shows estimated energy balance.
13. Dashboard displays an appropriate daily status.
14. Weekly summaries aggregate correctly.
15. Progress views display historical trends.
16. Historical data remains usable across different goals.
17. Key Dashboard widgets use the project's defined visual identity.
18. Core animations communicate changes without interfering with use.
19. A user can complete a short-term goal and continue using the same account for another goal.
