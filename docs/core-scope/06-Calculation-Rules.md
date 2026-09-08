# Calculation Rules

## 1. Purpose

All calculated values should follow documented formulas.

Calculation logic should live outside UI components wherever practical.

The UI should consume calculated results rather than independently reproducing formulas.

---

# 2. Daily Calories

```text
Daily Calories =
Sum of calories for all MealEntries on selected date
```

---

# 3. Calories Remaining

```text
Calories Remaining =
Target Calories - Daily Calories
```

If negative, display the absolute value as calories over target.

---

# 4. Move Conversion

Apple Fitness Move energy is entered in kilojoules.

Convert to kilocalories using:

```text
Move Calories =
Move kJ / 4.184
```

Example:

```text
1800 / 4.184
≈ 430 kcal
```

---

# 5. Estimated Daily Expenditure

For MVP:

```text
Estimated Daily Expenditure =
Estimated Baseline TDEE + Move Calories
```

This is a simplified approximation.

---

# 6. Estimated Daily Calorie Deficit

```text
Estimated Daily Deficit =
Estimated Baseline TDEE
+ Move Calories
- Daily Calories Consumed
```

Example:

```text
Baseline = 2150 kcal
Move = 1800 kJ = ~430 kcal
Food = 1800 kcal

Estimated Deficit =
2150 + 430 - 1800
= 780 kcal
```

Display:

`Estimated deficit: ~780 kcal`

---

# 7. Weekly Calories

```text
Weekly Calories =
Sum of daily calories for dates within selected week
```

---

# 8. Average Daily Calories

Preferred calculation:

```text
Average Daily Calories =
Weekly Calories / Number of Logged Days
```

The UI should clearly distinguish between:

* logged-day average
* calendar-week average

For MVP, logged-day average is acceptable.

---

# 9. Weekly Move

```text
Weekly Move =
Sum of Move kJ across selected week
```

---

# 10. Average Move

```text
Average Move =
Weekly Move / Number of Days With Move Data
```

---

# 11. Estimated Weekly Deficit

```text
Estimated Weekly Deficit =
Sum of Estimated Daily Deficit
```

Only include dates where sufficient data exists to calculate an estimate.

---

# 12. Current Weight

```text
Current Weight =
Most recent WeightEntry by date
```

If none exists:

```text
Current Weight =
Starting Weight
```

---

# 13. Total Weight Change

```text
Weight Change =
Starting Weight - Current Weight
```

A positive result indicates weight loss.

---

# 14. Remaining Weight

```text
Remaining Weight =
Current Weight - Target Weight
```

Never display a negative remaining value.

If current weight is equal to or below target:

`0 kg remaining`

---

# 15. Goal Progress Percentage

For a loss target:

```text
Required Loss =
Starting Weight - Target Weight

Loss Achieved =
Starting Weight - Current Weight

Progress % =
Loss Achieved / Required Loss × 100
```

Clamp between 0% and 100%.

---

# 16. Days Remaining

```text
Days Remaining =
Target Date - Current Date
```

If target date has passed:

display:

`Target date passed`

rather than a negative value.

---

# 17. Daily Status

Initial rules:

## On Track

```text
Calories <= Target Calories + 100
AND
Move >= Target Move × 0.90
```

## Off Track

```text
Calories > Target Calories + 300
OR
Move < Target Move × 0.60
```

## Partial

Any state between the above rules.

These thresholds should be maintained in one configuration/domain location.

---

# 18. Weekly Status

Suggested initial approach:

## On Track

* majority of logged days are On Track
* weekly calorie average remains near target
* weekly Move average remains near target

## Mixed

* performance varies significantly across the week

## Off Track

* majority of logged days are Off Track
* or both calorie and Move averages materially miss target

The exact implementation may be kept deliberately simple for MVP.

---

# 19. Missing Data

Missing data must not automatically be treated as zero.

Examples:

No Move entry:

`Move not recorded`

Not:

`0 kJ`

No weight entry:

do not infer a new weight.

This rule is important for accurate progress reporting.

---

# 20. Calculation Disclaimer

The application should display a short note where appropriate:

`Calorie expenditure, deficit and projected progress values are estimates and may differ from actual physiological outcomes.`

The application should not describe calculated values as medical measurements.
