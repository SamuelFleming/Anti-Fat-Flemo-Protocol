# Data Model

## 1. Overview

The MVP contains six primary domain entities:

* User
* Profile
* Goal
* MealEntry
* DailyLog
* WeightEntry

Every health/tracking entity is owned by a User.

The model should support multiple goals and long-term historical data.

---

# 2. User

Authentication identity.

```ts
interface User {
  id: string;

  name: string;
  email: string;
  passwordHash: string;

  createdAt: Date;
  updatedAt: Date;
}
```

Email must be unique.

Password hashes must never be exposed through API responses.

---

# 3. Profile

Stores relatively stable user configuration.

```ts
interface Profile {
  id: string;
  userId: string;

  heightCm?: number;

  preferredWeightUnit: "kg";
  preferredEnergyUnit: "kJ";

  estimatedBaselineTdee?: number;

  createdAt: Date;
  updatedAt: Date;
}
```

Goal-specific targets should not live here.

---

# 4. Goal

Represents a defined tracking period or objective.

```ts
type GoalStatus =
  | "active"
  | "completed"
  | "archived";

interface Goal {
  id: string;
  userId: string;

  name: string;

  startDate: Date;
  targetDate?: Date;

  startingWeightKg: number;
  targetWeightKg: number;

  targetCalories: number;
  targetMoveKj: number;

  status: GoalStatus;

  createdAt: Date;
  updatedAt: Date;
}
```

For MVP:

* a user may have multiple goals
* only one may be active at a time

---

# 5. MealEntry

```ts
type MealType =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "snack"
  | "other";

interface MealEntry {
  id: string;
  userId: string;

  date: Date;

  name: string;
  mealType: MealType;

  calories: number;

  proteinGrams?: number;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

Meal entries are user-owned rather than permanently owned by a Goal.

Their relationship to a goal may be inferred from date range.

This allows long-term history to remain intact even when goals change.

---

# 6. DailyLog

```ts
interface DailyLog {
  id: string;
  userId: string;

  date: Date;

  moveKj?: number;
  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}
```

Unique constraint:

`userId + date`

---

# 7. WeightEntry

```ts
interface WeightEntry {
  id: string;
  userId: string;

  date: Date;
  weightKg: number;

  createdAt: Date;
  updatedAt: Date;
}
```

For MVP, one weight measurement per user per calendar date is sufficient.

---

# 8. Why Entries Are Not Directly Bound to Goals

Meals, activity and weight represent real historical observations.

Goals represent interpretation and intent over a period.

Keeping them separate means:

* records survive goal changes
* historical data can span multiple goals
* a user can take periods without an active goal
* future retrospective analysis remains possible

A goal's relevant data can be determined using its date range.

---

# 9. Historical Target Integrity

Long-term tracking introduces an important requirement:

current targets must not incorrectly rewrite historical interpretation.

If a goal changes materially during its active period, future versions may require target-history records.

For the first MVP, edits to an active goal are acceptable.

However, calculation services should use the appropriate historical goal wherever it can be identified from the date.

---

# 10. Derived Data

Do not normally persist:

* calorie totals
* calories remaining
* Move completion
* Move calories
* estimated deficit
* adherence status
* weekly aggregates
* weight lost
* progress percentage
* days remaining

These are derived values.

---

# 11. Date and Time Handling

Daily records must respect the user's local calendar day.

Backend storage may use UTC timestamps, but date-based aggregation must avoid timezone shifts.

The architecture should leave room for a future user timezone preference.

---

# 12. Suggested Indexes

### User

* unique email

### Goal

* userId
* userId + status
* userId + startDate

### MealEntry

* userId + date

### DailyLog

* unique userId + date

### WeightEntry

* unique userId + date

These indexes should support long-term data volumes without unnecessary complexity.

---

# 13. Future Entities

Do not implement in MVP:

* SavedMeal
* Food
* Recipe
* MacroTarget
* GoalTargetHistory
* ActivityImport
* Integration
* WeeklyReview
* Notification
* TdeeEstimateHistory
* SocialProfile
* SharedGoal
