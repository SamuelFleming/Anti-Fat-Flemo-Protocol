import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../../src/app.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { registerAndLogin } from "../helpers/auth.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

const app = createApp();

function validGoalBody(overrides: Record<string, unknown> = {}) {
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

async function auth(token: string) {
  return { "Authorization": `Bearer ${token}` } as const;
}

describe("POST /api/goals", () => {
  it("creates an active goal", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .post("/api/goals")
      .set(await auth(token))
      .send(validGoalBody());

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: "September Weight Cut", status: "active" });
  });

  it("rejects a second active goal for the same user", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/goals").set(await auth(token)).send(validGoalBody());

    const response = await supertest(app)
      .post("/api/goals")
      .set(await auth(token))
      .send(validGoalBody({ name: "Second goal" }));

    expect(response.status).toBe(409);
  });

  it("rejects an invalid date format", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .post("/api/goals")
      .set(await auth(token))
      .send(validGoalBody({ startDate: "09-01-2026" }));

    expect(response.status).toBe(400);
  });

  it("rejects a missing required field", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .post("/api/goals")
      .set(await auth(token))
      .send({ name: "Incomplete" });

    expect(response.status).toBe(400);
  });

  it("allows two different users to each have their own active goal", async () => {
    const userA = await registerAndLogin(app);
    const userB = await registerAndLogin(app);

    await supertest(app).post("/api/goals").set(await auth(userA.token)).send(validGoalBody());
    const responseB = await supertest(app)
      .post("/api/goals")
      .set(await auth(userB.token))
      .send(validGoalBody({ name: "B's goal" }));

    expect(responseB.status).toBe(201);
  });
});

describe("GET /api/goals and /api/goals/active", () => {
  it("lists only the requesting user's goals, optionally filtered by status", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/goals").set(await auth(token)).send(validGoalBody());
    await supertest(app)
      .post(`/api/goals/${created.body.id}/complete`)
      .set(await auth(token));

    const all = await supertest(app).get("/api/goals").set(await auth(token));
    expect(all.body.items).toHaveLength(1);

    const activeOnly = await supertest(app).get("/api/goals?status=active").set(await auth(token));
    expect(activeOnly.body.items).toHaveLength(0);

    const completedOnly = await supertest(app)
      .get("/api/goals?status=completed")
      .set(await auth(token));
    expect(completedOnly.body.items).toHaveLength(1);
  });

  it("excludes other users' goals from the list", async () => {
    const userA = await registerAndLogin(app);
    const userB = await registerAndLogin(app);
    await supertest(app).post("/api/goals").set(await auth(userA.token)).send(validGoalBody());

    const responseB = await supertest(app).get("/api/goals").set(await auth(userB.token));
    expect(responseB.body.items).toHaveLength(0);
  });

  it("returns null from /active when there is no active goal", async () => {
    const { token } = await registerAndLogin(app);
    const response = await supertest(app).get("/api/goals/active").set(await auth(token));

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });

  it("returns the active goal from /active", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/goals").set(await auth(token)).send(validGoalBody());

    const response = await supertest(app).get("/api/goals/active").set(await auth(token));
    expect(response.body).toMatchObject({ status: "active" });
  });
});

describe("GET /api/goals/:id", () => {
  it("returns an owned goal", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/goals").set(await auth(token)).send(validGoalBody());

    const response = await supertest(app)
      .get(`/api/goals/${created.body.id}`)
      .set(await auth(token));

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });

  it("returns 404 for another user's goal", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const created = await supertest(app)
      .post("/api/goals")
      .set(await auth(owner.token))
      .send(validGoalBody());

    const response = await supertest(app)
      .get(`/api/goals/${created.body.id}`)
      .set(await auth(attacker.token));

    expect(response.status).toBe(404);
  });

  it("returns 404 for a malformed id", async () => {
    const { token } = await registerAndLogin(app);
    const response = await supertest(app).get("/api/goals/not-an-id").set(await auth(token));
    expect(response.status).toBe(404);
  });
});

describe("PUT /api/goals/:id", () => {
  it("updates an owned goal's fields", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/goals").set(await auth(token)).send(validGoalBody());

    const response = await supertest(app)
      .put(`/api/goals/${created.body.id}`)
      .set(await auth(token))
      .send({ targetCalories: 1700 });

    expect(response.status).toBe(200);
    expect(response.body.targetCalories).toBe(1700);
  });

  it("refuses to update another user's goal", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const created = await supertest(app)
      .post("/api/goals")
      .set(await auth(owner.token))
      .send(validGoalBody());

    const response = await supertest(app)
      .put(`/api/goals/${created.body.id}`)
      .set(await auth(attacker.token))
      .send({ targetCalories: 1 });

    expect(response.status).toBe(404);
  });
});

describe("POST /api/goals/:id/complete", () => {
  it("marks an active goal completed and allows starting a new one", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/goals").set(await auth(token)).send(validGoalBody());

    const completed = await supertest(app)
      .post(`/api/goals/${created.body.id}/complete`)
      .set(await auth(token));
    expect(completed.status).toBe(200);
    expect(completed.body.status).toBe("completed");

    const nextGoal = await supertest(app)
      .post("/api/goals")
      .set(await auth(token))
      .send(validGoalBody({ name: "Next goal" }));
    expect(nextGoal.status).toBe(201);
  });

  it("rejects completing an already-completed goal", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/goals").set(await auth(token)).send(validGoalBody());
    await supertest(app).post(`/api/goals/${created.body.id}/complete`).set(await auth(token));

    const response = await supertest(app)
      .post(`/api/goals/${created.body.id}/complete`)
      .set(await auth(token));

    expect(response.status).toBe(409);
  });

  it("refuses to complete another user's goal", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const created = await supertest(app)
      .post("/api/goals")
      .set(await auth(owner.token))
      .send(validGoalBody());

    const response = await supertest(app)
      .post(`/api/goals/${created.body.id}/complete`)
      .set(await auth(attacker.token));

    expect(response.status).toBe(404);
  });
});
