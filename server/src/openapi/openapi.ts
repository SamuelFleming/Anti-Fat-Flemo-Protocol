/**
 * Implemented OpenAPI mirror. See ./README.md — keep in sync with actual behaviour only.
 */
export const openApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Anti-Fat-Flemo API",
    version: "0.1.0",
    description: "Implemented HTTP surface. Mirrors real behaviour only.",
  },
  servers: [{ url: "/api" }],
  paths: {
    "/health": {
      get: {
        summary: "Service and database connectivity check",
        responses: {
          "200": {
            description: "Service is up",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", enum: ["ok"] },
                    mongo: { type: "string", enum: ["connected", "disconnected"] },
                  },
                  required: ["status", "mongo"],
                },
              },
            },
          },
        },
      },
    },
    "/auth/register": {
      post: {
        summary: "Create a new user account and profile",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Account created", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "409": { description: "Email already registered", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/auth/login": {
      post: {
        summary: "Authenticate an existing user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/AuthResponse" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/auth/me": {
      get: {
        summary: "Return the authenticated user and their profile",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": {
            description: "Current user context",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                    profile: {},
                  },
                  required: ["user", "profile"],
                },
              },
            },
          },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/auth/logout": {
      post: {
        summary: "Sign out (stateless JWT; no server-side session to invalidate)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Logged out" },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/profile": {
      get: {
        summary: "Return the authenticated user's profile (created on first access if missing)",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Profile", content: { "application/json": { schema: { $ref: "#/components/schemas/Profile" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      put: {
        summary: "Create or update the authenticated user's profile",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  heightCm: { type: "number" },
                  estimatedBaselineTdee: { type: "number" },
                },
              },
            },
          },
        },
        responses: {
          "200": { description: "Updated profile", content: { "application/json": { schema: { $ref: "#/components/schemas/Profile" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/goals": {
      get: {
        summary: "List the authenticated user's goals",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "status",
            in: "query",
            required: false,
            schema: { type: "string", enum: ["active", "completed", "archived"] },
          },
        ],
        responses: {
          "200": {
            description: "Goals",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { items: { type: "array", items: { $ref: "#/components/schemas/Goal" } } },
                  required: ["items"],
                },
              },
            },
          },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        summary: "Create a new active goal (fails if one is already active)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GoalInput" } } },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Goal" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "409": { description: "An active goal already exists", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/goals/active": {
      get: {
        summary: "Return the current active goal, or null if none",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Active goal or null", content: { "application/json": { schema: { $ref: "#/components/schemas/Goal" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/goals/{id}": {
      get: {
        summary: "Return one owned goal",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Goal", content: { "application/json": { schema: { $ref: "#/components/schemas/Goal" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      put: {
        summary: "Update an owned goal (name/dates/targets only; status is not editable here)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/GoalInput" } } },
        },
        responses: {
          "200": { description: "Updated goal", content: { "application/json": { schema: { $ref: "#/components/schemas/Goal" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/goals/{id}/complete": {
      post: {
        summary: "Mark an owned active goal as completed",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "Completed goal", content: { "application/json": { schema: { $ref: "#/components/schemas/Goal" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "409": { description: "Goal is not active", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/meals": {
      get: {
        summary: "List the authenticated user's meal entries",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "date", in: "query", required: false, schema: { type: "string", format: "date" } },
          { name: "startDate", in: "query", required: false, schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", required: false, schema: { type: "string", format: "date" } },
        ],
        responses: {
          "200": {
            description: "Meal entries",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { items: { type: "array", items: { $ref: "#/components/schemas/MealEntry" } } },
                  required: ["items"],
                },
              },
            },
          },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        summary: "Create a new meal entry",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/MealEntryInput" } } },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/MealEntry" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/meals/{id}": {
      put: {
        summary: "Update an owned meal entry",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/MealEntryInput" } } },
        },
        responses: {
          "200": { description: "Updated meal", content: { "application/json": { schema: { $ref: "#/components/schemas/MealEntry" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        summary: "Delete an owned meal entry",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Deleted" },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/daily-logs": {
      get: {
        summary: "List the authenticated user's daily logs",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "date", in: "query", required: false, schema: { type: "string", format: "date" } },
          { name: "startDate", in: "query", required: false, schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", required: false, schema: { type: "string", format: "date" } },
        ],
        responses: {
          "200": {
            description: "Daily logs",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { items: { type: "array", items: { $ref: "#/components/schemas/DailyLog" } } },
                  required: ["items"],
                },
              },
            },
          },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/daily-logs/{date}": {
      put: {
        summary: "Create or update the daily log for one calendar date (upsert)",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "date", in: "path", required: true, schema: { type: "string", format: "date" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/DailyLogInput" } } },
        },
        responses: {
          "200": { description: "Upserted daily log", content: { "application/json": { schema: { $ref: "#/components/schemas/DailyLog" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/weights": {
      get: {
        summary: "List the authenticated user's weight entries",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "date", in: "query", required: false, schema: { type: "string", format: "date" } },
          { name: "startDate", in: "query", required: false, schema: { type: "string", format: "date" } },
          { name: "endDate", in: "query", required: false, schema: { type: "string", format: "date" } },
        ],
        responses: {
          "200": {
            description: "Weight entries",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { items: { type: "array", items: { $ref: "#/components/schemas/WeightEntry" } } },
                  required: ["items"],
                },
              },
            },
          },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      post: {
        summary: "Create a new weight entry (one per calendar date)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/WeightEntryInput" } } },
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/WeightEntry" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "409": { description: "A weight entry already exists for that date", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
    "/weights/{id}": {
      put: {
        summary: "Update an owned weight entry",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/WeightEntryInput" } } },
        },
        responses: {
          "200": { description: "Updated weight entry", content: { "application/json": { schema: { $ref: "#/components/schemas/WeightEntry" } } } },
          "400": { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "409": { description: "Another entry already exists for that date", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
      delete: {
        summary: "Delete an owned weight entry",
        security: [{ bearerAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          "204": { description: "Deleted" },
          "401": { description: "Not authenticated", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
          "404": { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/Error" } } } },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              details: {},
            },
            required: ["message"],
          },
        },
        required: ["error"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "email"],
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/User" },
          token: { type: "string" },
        },
        required: ["user", "token"],
      },
      Profile: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          heightCm: { type: "number" },
          preferredWeightUnit: { type: "string", enum: ["kg"] },
          preferredEnergyUnit: { type: "string", enum: ["kJ"] },
          estimatedBaselineTdee: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "userId", "preferredWeightUnit", "preferredEnergyUnit"],
      },
      GoalInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          startDate: { type: "string", format: "date" },
          targetDate: { type: "string", format: "date" },
          startingWeightKg: { type: "number" },
          targetWeightKg: { type: "number" },
          targetCalories: { type: "number" },
          targetMoveKj: { type: "number" },
        },
        required: [
          "name",
          "startDate",
          "startingWeightKg",
          "targetWeightKg",
          "targetCalories",
          "targetMoveKj",
        ],
      },
      Goal: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          name: { type: "string" },
          startDate: { type: "string", format: "date" },
          targetDate: { type: "string", format: "date" },
          startingWeightKg: { type: "number" },
          targetWeightKg: { type: "number" },
          targetCalories: { type: "number" },
          targetMoveKj: { type: "number" },
          status: { type: "string", enum: ["active", "completed", "archived"] },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: [
          "id",
          "userId",
          "name",
          "startDate",
          "startingWeightKg",
          "targetWeightKg",
          "targetCalories",
          "targetMoveKj",
          "status",
        ],
      },
      MealEntryInput: {
        type: "object",
        properties: {
          date: { type: "string", format: "date" },
          name: { type: "string" },
          mealType: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack", "other"] },
          calories: { type: "number" },
          proteinGrams: { type: "number" },
          notes: { type: "string" },
        },
        required: ["date", "name", "mealType", "calories"],
      },
      MealEntry: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          date: { type: "string", format: "date" },
          name: { type: "string" },
          mealType: { type: "string", enum: ["breakfast", "lunch", "dinner", "snack", "other"] },
          calories: { type: "number" },
          proteinGrams: { type: "number" },
          notes: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "userId", "date", "name", "mealType", "calories"],
      },
      DailyLogInput: {
        type: "object",
        properties: {
          moveKj: { type: "number" },
          notes: { type: "string" },
        },
      },
      DailyLog: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          date: { type: "string", format: "date" },
          moveKj: { type: "number" },
          notes: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "userId", "date"],
      },
      WeightEntryInput: {
        type: "object",
        properties: {
          date: { type: "string", format: "date" },
          weightKg: { type: "number" },
        },
        required: ["date", "weightKg"],
      },
      WeightEntry: {
        type: "object",
        properties: {
          id: { type: "string" },
          userId: { type: "string" },
          date: { type: "string", format: "date" },
          weightKg: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "userId", "date", "weightKg"],
      },
    },
  },
} as const;
