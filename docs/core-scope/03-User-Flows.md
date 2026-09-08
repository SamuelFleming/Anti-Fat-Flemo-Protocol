# User Flows

## 1. Application Startup

### Goal

Allow the user to immediately understand current progress.

### Flow

1. User opens the application.
2. Application loads the Dashboard.
3. Dashboard retrieves:

   * profile
   * today's meals
   * today's movement
   * latest weight
   * current-week data
4. Dashboard calculates daily and weekly summaries.
5. User sees current status immediately.

No login screen is required.

---

# 2. First-Time Setup

1. User opens the application.
2. No profile exists.
3. User is directed to Settings / Initial Setup.
4. User enters:

   * height
   * starting weight
   * target weight
   * target date
   * calorie target
   * Move target
   * baseline estimated expenditure
5. User saves configuration.
6. User is redirected to Dashboard.

---

# 3. Add Meal

1. User selects `Add Meal`.
2. Meal form opens.
3. User enters:

   * meal name
   * meal type
   * calories
   * optional protein
   * optional notes
4. User saves.
5. Meal appears in today's meal list.
6. Daily calorie total recalculates.
7. Calories remaining recalculates.
8. Estimated deficit recalculates.
9. Daily status recalculates.

The entire flow should require minimal interaction.

---

# 4. Edit Meal

1. User selects an existing meal.
2. User selects Edit.
3. Existing values populate the form.
4. User changes values.
5. User saves.
6. Dashboard totals update.

---

# 5. Delete Meal

1. User selects an existing meal.
2. User selects Delete.
3. User confirms deletion.
4. Meal is removed.
5. Daily totals recalculate.

---

# 6. Record Move Energy

1. User opens Dashboard or Daily Log.
2. User selects Move input.
3. User enters the Move kilojoule value from Apple Fitness.
4. User saves.
5. Application converts Move kJ to estimated kcal where required.
6. Dashboard updates:

   * Move progress
   * Move remaining
   * estimated deficit
   * adherence status

---

# 7. Record Weight

1. User selects Add Weight.
2. User enters:

   * date
   * weight in kilograms
3. User saves.
4. Current weight updates if the entry is the latest record.
5. Goal progress updates.
6. Weight chart updates.

---

# 8. Review Today's Status

1. User opens Dashboard.
2. User reviews:

   * calories consumed
   * calories remaining
   * Move energy
   * estimated deficit
   * current weight
   * adherence status
3. User decides whether behaviour needs adjustment.

This is the core accountability loop.

---

# 9. Review Weekly Progress

1. User opens Dashboard or Progress.
2. User selects the current week.
3. Application displays:

   * total calories
   * average calories
   * total movement
   * average movement
   * estimated deficit
   * weight change
   * adherence distribution
4. User can determine whether the week overall is progressing toward goal.

---

# 10. Review Historical Progress

1. User opens Progress.
2. User views:

   * weight chart
   * calorie chart
   * Move chart
   * daily history
3. User may change date range.
4. Application updates displayed data.

---

# 11. Adjust Goal

1. User opens Settings.
2. User changes one or more targets.
3. User saves.
4. Current and future calculations use the new targets.
5. Historical logged entries remain unchanged.

---

# 12. End-of-Day Flow

A typical end-of-day workflow should be:

1. Open application.
2. Confirm all meals have been logged.
3. Enter final Apple Fitness Move value.
4. Optionally enter weight.
5. Review final daily status.
6. Review current weekly progress.

The process should take approximately one or two minutes once data is available.
