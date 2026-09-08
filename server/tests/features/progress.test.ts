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
    startDate: "2026-08-01",
    startingWeightKg: 82,
    targetWeightKg: 76,
    targetCalories: 1800,
    targetMoveKj: 1800,
    ...overrides,
  };
}

describe("GET /api/progress", () => {
  it("defaults to a 30-day range and reports gaps for unrecorded days", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/goals").set(auth(token)).send(goalBody());
    await supertest(app)
      .post("/api/meals")
      .set(auth(token))
      .send({ date: "2026-09-08", name: "Lunch", mealType: "lunch", calories: 900 });

    const response = await supertest(app).get("/api/progress").set(auth(token));

    expect(response.status).toBe(200);
    expect(response.body.range.type).toBe("30d");
    expect(response.body.history.length).toBeGreaterThan(20);
    const loggedRow = response.body.history.find((row: { date: string }) => row.date === "2026-09-08");
    expect(loggedRow.caloriesConsumed).toBe(900);
    const unloggedRow = response.body.history.find((row: { date: string }) => row.date === "2026-09-07");
    expect(unloggedRow.caloriesConsumed).toBe(0);
    expect(unloggedRow.weightKg).toBeNull();
  });

  it("uses the historically applicable goal's targets rather than today's active goal", async () => {
    const { token } = await registerAndLogin(app);
    const firstGoal = await supertest(app)
      .post("/api/goals")
      .set(auth(token))
      .send(goalBody({ startDate: "2026-06-01", targetCalories: 2000, targetMoveKj: 1600 }));
    await supertest(app).post(`/api/goals/${firstGoal.body.id}/complete`).set(auth(token));
    await supertest(app)
      .post("/api/goals")
      .set(auth(token))
      .send(goalBody({ name: "Next goal", startDate: "2026-08-01", targetCalories: 1700, targetMoveKj: 2000 }));

    const response = await supertest(app)
      .get("/api/progress?startDate=2026-06-15&endDate=2026-06-15")
      .set(auth(token));

    expect(response.body.history[0]).toMatchObject({
      date: "2026-06-15",
      targetCalories: 2000,
      targetMoveKj: 1600,
    });
  });

  it("supports a goal-period range via goalId and rejects other users' goals", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const goal = await supertest(app).post("/api/goals").set(auth(owner.token)).send(goalBody());

    const ownerResponse = await supertest(app)
      .get(`/api/progress?goalId=${goal.body.id}`)
      .set(auth(owner.token));
    expect(ownerResponse.status).toBe(200);
    expect(ownerResponse.body.range.type).toBe("goal");
    expect(ownerResponse.body.range.startDate).toBe("2026-08-01");

    const attackerResponse = await supertest(app)
      .get(`/api/progress?goalId=${goal.body.id}`)
      .set(auth(attacker.token));
    expect(attackerResponse.status).toBe(404);
  });
});
