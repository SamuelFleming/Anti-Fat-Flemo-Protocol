import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../../src/app.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { registerAndLogin } from "../helpers/auth.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

const app = createApp();

function auth(token: string) {
  return { Authorization: `Bearer ${token}` } as const;
}

function goalBody(overrides: Record<string, unknown> = {}) {
  return {
    name: "September Weight Cut",
    startDate: "2026-09-01",
    startingWeightKg: 82,
    targetWeightKg: 76,
    targetCalories: 1800,
    targetMoveKj: 1800,
    ...overrides,
  };
}

describe("GET /api/dashboard", () => {
  it("returns a no-goal shape when the user has not set up a goal yet", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app).get("/api/dashboard").set(auth(token));

    expect(response.status).toBe(200);
    expect(response.body.activeGoal).toBeNull();
    expect(response.body.today.status).toBeNull();
    expect(response.body.today.caloriesConsumed).toBe(0);
    expect(response.body.weight.currentWeightKg).toBeNull();
  });

  it("composes today's totals, status and weekly aggregation from owned records", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/goals").set(auth(token)).send(goalBody());

    await supertest(app)
      .post("/api/meals")
      .set(auth(token))
      .send({ date: "2026-09-08", name: "Lunch", mealType: "lunch", calories: 900 });
    await supertest(app)
      .put("/api/daily-logs/2026-09-08")
      .set(auth(token))
      .send({ moveKj: 1800 });
    await supertest(app)
      .post("/api/weights")
      .set(auth(token))
      .send({ date: "2026-09-08", weightKg: 80.7 });

    const response = await supertest(app).get("/api/dashboard?date=2026-09-08").set(auth(token));

    expect(response.status).toBe(200);
    expect(response.body.today).toMatchObject({
      date: "2026-09-08",
      caloriesConsumed: 900,
      targetCalories: 1800,
      caloriesRemaining: 900,
      moveKj: 1800,
      status: "on-track",
    });
    expect(response.body.weight.currentWeightKg).toBe(80.7);
    expect(response.body.week.days).toHaveLength(7);
    const selectedDay = response.body.week.days.find((day: { isSelected: boolean }) => day.isSelected);
    expect(selectedDay.date).toBe("2026-09-08");
  });

  it("does not leak another day's meals into a historically selected day", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/goals").set(auth(token)).send(goalBody());
    await supertest(app)
      .post("/api/meals")
      .set(auth(token))
      .send({ date: "2026-09-08", name: "Today meal", mealType: "lunch", calories: 900 });
    await supertest(app)
      .post("/api/meals")
      .set(auth(token))
      .send({ date: "2026-09-02", name: "Historical meal", mealType: "breakfast", calories: 300 });

    const response = await supertest(app).get("/api/dashboard?date=2026-09-02").set(auth(token));

    expect(response.body.today.caloriesConsumed).toBe(300);
    expect(response.body.today.meals).toHaveLength(1);
  });

  it("excludes another user's data", async () => {
    const owner = await registerAndLogin(app);
    const other = await registerAndLogin(app);
    await supertest(app).post("/api/goals").set(auth(owner.token)).send(goalBody());

    const response = await supertest(app).get("/api/dashboard").set(auth(other.token));
    expect(response.body.activeGoal).toBeNull();
  });
});
