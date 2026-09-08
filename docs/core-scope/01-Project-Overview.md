# Calorie & Progress Tracker — Project Overview

## 1. Project Purpose

This application is a personal calorie, activity and weight-management platform designed to support both short-term and long-term health goals.

The application should provide:

* visibility over daily calorie intake
* visibility over daily movement energy
* visibility over body-weight progress
* simple accountability against daily and weekly targets
* historical progress across weeks, months and goal periods
* a clear indication of whether current behaviour is broadly aligned with the user's active goal

The initial implementation is intended primarily for personal use, but the application should be architected so that additional users can independently create accounts and track their own goals without requiring a significant redesign.

The MVP should prioritise:

1. useful daily tracking
2. clarity of feedback
3. maintainable foundations
4. distinctive user experience
5. rapid implementation

---

## 2. Core Product Idea

The application centres on a simple loop:

**Set Goal → Log → Observe → Adjust → Review**

A user defines an active health goal such as:

* reduce body weight
* maintain current body weight
* track calorie intake consistently
* maintain an activity target

For an active goal, the user may define:

* starting weight
* target weight
* target date
* target calorie intake
* target Move energy

The user then records:

* meals and calories consumed
* Apple Fitness Move energy
* body weight

The application aggregates these inputs and presents:

* daily progress
* weekly progress
* longer-term trends
* estimated energy deficit or surplus
* progress against the active goal
* an overall status indicating whether the user is broadly on track

---

## 3. MVP Objective

The MVP is successful when a user can create an account, configure a goal and begin using the application as a reliable personal tracking dashboard.

The application should allow the user to:

1. register and authenticate
2. configure a personal profile
3. establish an active tracking goal
4. log meals throughout the day
5. record daily Apple Fitness Move energy
6. periodically record body weight
7. review daily calorie and movement progress
8. review weekly totals and averages
9. observe weight and behavioural trends over time
10. receive simple On Track / Partial / Off Track feedback
11. understand the basis of estimated calorie deficit or surplus values
12. continue using the application after an initial goal is completed

The MVP should remain small enough for rapid implementation while avoiding architectural decisions that make continued use or additional users unnecessarily difficult.

---

## 4. Users and Authentication

The application supports multiple independent user accounts.

Each user has:

* authentication credentials
* a personal profile
* personal goals
* meal entries
* daily activity entries
* weight entries

All health and tracking information must be scoped to the authenticated user.

A user must never be able to access another user's records.

The initial implementation does not require:

* social profiles
* user discovery
* following
* sharing
* administrator functionality
* coach/client relationships

Authentication exists to provide ownership, portability and future scalability.

---

## 5. Goal Lifecycle

The application should not assume that tracking exists for only one short-term initiative.

A user should be able to create a goal representing a defined period or objective.

Example:

**September Weight Cut**

* Starting weight: 82 kg
* Target weight: 76 kg
* Calorie target: 1,800 kcal/day
* Move target: 1,800 kJ/day
* Target date: 1 October

After that goal ends, the same user may create another goal such as:

**Weight Maintenance**

or:

**Summer Fitness Goal**

Historical goals and their associated progress should remain available.

For the MVP, only one goal needs to be active at a time.

---

## 6. Primary Inputs

### Account Inputs

* name
* email
* password

### Profile Inputs

* height
* preferred units
* optional baseline energy expenditure estimate

### Goal Inputs

* goal name
* starting weight
* target weight
* start date
* optional target date
* daily calorie target
* daily Move target
* goal status

### Meal Inputs

* date
* meal name
* meal type
* calories
* optional protein
* optional notes

### Daily Activity Inputs

* date
* Move energy in kilojoules

### Weight Inputs

* date
* body weight in kilograms

---

## 7. Primary Outputs

### Daily

* calories consumed
* calories remaining against target
* Move energy achieved
* Move energy remaining
* estimated daily calorie deficit or surplus
* daily adherence status
* meals consumed

### Weekly

* total calories
* average daily calories
* total Move energy
* average daily Move energy
* estimated weekly energy balance
* weight change
* days meeting targets
* weekly adherence status

### Goal Progress

* starting weight
* current weight
* target weight
* total change
* remaining change
* percentage progress
* elapsed goal duration
* days remaining where a target date exists
* recent rate of progress

### Long-Term

* historical weight trend
* calorie trend
* movement trend
* completed goal history
* comparison of previous goal periods

---

# 8. Product Principles

## 8.1 Fast to Use

Daily entry should require minimal interaction.

Logging a meal or Move value should feel lightweight enough to do repeatedly.

---

## 8.2 Transparent

The application should explain calculated values.

Estimated calorie deficit, expenditure and projected progress must be clearly identified as estimates.

---

## 8.3 Trends Over Individual Days

The application should favour:

* weekly behaviour
* moving trends
* longer-term progress

over judging success from a single day.

---

## 8.4 Manual First

Manual input is acceptable in the MVP.

Automation should only be introduced where it creates meaningful value without destabilising the core product.

---

## 8.5 Built for Continued Use

The application's architecture and data model should support:

* weeks of tracking
* months or years of historical entries
* multiple consecutive goals
* weight-loss goals
* maintenance periods
* future goal types

without requiring migration away from the core domain model.

---

## 8.6 Multi-User by Design

Although initially used by one person, every persisted health record must belong to a user.

No global single-user data assumptions should exist in application logic.

---

## 8.7 Distinctive but Functional

The application should have a recognisable visual identity.

It should not look like a generic administrative dashboard assembled entirely from stock cards.

Visual design should support understanding of progress and motivation.

---

## 8.8 Motion Has Meaning

Animations should communicate:

* progress
* change
* completion
* transitions between states
* emergence of newly logged data

Animations should not exist merely as decoration.

Motion must remain subtle enough that frequent daily use does not become distracting.

---

## 9. Visual Direction

The application should explore a distinctive visual language based around the idea of:

**energy, movement and progression**

Possible characteristics:

* layered progress surfaces rather than plain progress bars
* radial or arc-based goal indicators
* animated graph lines that grow into position
* weight trajectories that reveal progressively
* numerical values that smoothly count between states
* cards that subtly react when a target is reached
* compact visual summaries that expand when selected
* transitions between daily and weekly context

The exact visual theme should be defined separately before final UI implementation.

---

## 10. Proposed Technical Direction

### Frontend

* React
* TypeScript
* Vite
* React Router
* component library where useful
* custom UI components for core tracking widgets
* charting library
* lightweight animation library where justified

### Backend

* Node.js
* Express
* TypeScript
* MongoDB
* Mongoose

### Authentication

* email/password registration
* secure password hashing
* JWT or equivalent token-based authentication
* authenticated API routes
* user-scoped persistence

The application should use a client/server REST architecture.

---

## 11. MVP Screens

Primary screens:

1. Login
2. Register
3. Dashboard
4. Daily Log
5. Progress
6. Goals
7. Settings / Profile

The Dashboard remains the primary application surface.

---

## 12. MVP Non-Goals

The following remain outside initial scope:

* Apple Health integration
* automatic exercise import
* barcode scanning
* commercial food database integration
* AI food recognition
* image-based calorie estimation
* automated nutritional advice
* micronutrient tracking
* detailed macro tracking beyond optional protein
* social feeds
* friend systems
* coach/client relationships
* push notifications
* native mobile application
* subscriptions
* billing
* medical advice
* diagnostic functionality
* advanced metabolic modelling

Cloud deployment is not required for the initial build, but the architecture should not prevent later deployment.

---

## 13. Definition of MVP Success

The MVP is complete when a new user can:

1. register
2. log in
3. create a personal goal
4. view the Dashboard
5. log a meal
6. immediately see calorie progress update
7. enter Move energy
8. enter body weight
9. see current progress against their goal
10. review weekly statistics
11. view historical charts
12. return later and access only their own persisted information
13. complete one goal and continue into another without losing historical data

At this point, the application should be genuinely useful for both a short-term initiative and continued long-term tracking.
