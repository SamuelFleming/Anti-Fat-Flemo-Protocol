# API Specification

## 1. API Base

`/api`

Protected endpoints require authentication.

Authenticated resources must automatically scope queries to the current user.

---

# 2. Authentication

## POST `/api/auth/register`

Request:

```json
{
  "name": "Sam",
  "email": "user@example.com",
  "password": "..."
}
```

Creates:

* User
* Profile where appropriate

Returns authentication state/token according to chosen auth implementation.

---

## POST `/api/auth/login`

Authenticates existing user.

---

## GET `/api/auth/me`

Returns current authenticated user and basic profile context.

---

## POST `/api/auth/logout`

Terminates client authentication state where applicable.

---

# 3. Profile

## GET `/api/profile`

Returns the authenticated user's Profile.

---

## PUT `/api/profile`

Creates or updates Profile configuration.

No `userId` should be accepted as an ownership instruction from the client.

---

# 4. Goals

## GET `/api/goals`

Returns the authenticated user's goals.

Optional:

`?status=active`

---

## GET `/api/goals/active`

Returns current active goal.

---

## POST `/api/goals`

Creates a goal.

---

## GET `/api/goals/:id`

Returns one owned goal.

---

## PUT `/api/goals/:id`

Updates one owned goal.

---

## POST `/api/goals/:id/complete`

Marks an owned active goal as completed.

---

# 5. Meals

## GET `/api/meals`

Examples:

`?date=2026-09-08`

or:

`?startDate=2026-09-01&endDate=2026-09-08`

---

## POST `/api/meals`

```json
{
  "date": "2026-09-08",
  "name": "Chicken wrap",
  "mealType": "lunch",
  "calories": 520,
  "proteinGrams": 38
}
```

Ownership derives from authenticated user.

---

## PUT `/api/meals/:id`

Update owned meal.

---

## DELETE `/api/meals/:id`

Delete owned meal.

---

# 6. Daily Logs

## GET `/api/daily-logs`

Example:

`?date=2026-09-08`

---

## PUT `/api/daily-logs/:date`

Upsert authenticated user's DailyLog for the given date.

```json
{
  "moveKj": 1840
}
```

---

# 7. Weight Entries

## GET `/api/weights`

Optional:

`?startDate=2026-09-01&endDate=2026-09-30`

---

## POST `/api/weights`

```json
{
  "date": "2026-09-08",
  "weightKg": 81.4
}
```

---

## PUT `/api/weights/:id`

Update owned record.

---

## DELETE `/api/weights/:id`

Delete owned record.

---

# 8. Dashboard

## GET `/api/dashboard`

Returns composed data for the current user and active goal.

Example:

```json
{
  "activeGoal": {
    "id": "...",
    "name": "September Weight Cut",
    "startingWeightKg": 82,
    "targetWeightKg": 76,
    "targetCalories": 1800,
    "targetMoveKj": 1800
  },
  "today": {
    "date": "2026-09-08",
    "caloriesConsumed": 1420,
    "caloriesRemaining": 380,
    "moveKj": 1520,
    "moveRemainingKj": 280,
    "estimatedDeficit": 690,
    "status": "partial"
  },
  "weight": {
    "currentWeightKg": 81.4,
    "weightLostKg": 0.6,
    "remainingKg": 5.4,
    "progressPercent": 10
  },
  "week": {
    "totalCalories": 6840,
    "averageCalories": 1710,
    "totalMoveKj": 7060,
    "averageMoveKj": 1765,
    "estimatedDeficit": 3120,
    "weightChangeKg": -0.4,
    "status": "on-track"
  }
}
```

The composed endpoint is recommended because Dashboard is the primary product surface.

---

# 9. Progress

## GET `/api/progress`

Example:

`?range=30d`

or:

`?goalId=<id>`

or:

`?startDate=2026-08-01&endDate=2026-09-08`

Returns:

* daily aggregates
* weight records
* historical target context
* summary information

---

# 10. Security Rules

1. All protected routes require authentication.
2. User ownership is derived from authentication context.
3. Query filters must always include authenticated user ownership.
4. Passwords are securely hashed.
5. Password hashes are never returned.
6. Login errors should avoid leaking unnecessary account information.
7. Input is validated server-side.
8. IDs alone are never sufficient to access records belonging to another user.

---

# 11. API Design Rules

1. Keep endpoint behaviour domain-specific.
2. Avoid speculative abstractions.
3. Validate both client and server input.
4. Centralise calculations.
5. Maintain strict user scoping.
6. Avoid exposing persistence-specific implementation details unnecessarily.
7. Design list endpoints so larger historical datasets can later support pagination without major redesign.
