import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../../src/app.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { registerAndLogin } from "../helpers/auth.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

const app = createApp();

function validMealBody(overrides: Record<string, unknown> = {}) {
  return {
    date: "2026-09-01",
    name: "Oats and berries",
    mealType: "breakfast",
    calories: 420,
    ...overrides,
  };
}

async function auth(token: string) {
  return { Authorization: `Bearer ${token}` } as const;
}

describe("POST /api/meals", () => {
  it("creates a meal entry", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .post("/api/meals")
      .set(await auth(token))
      .send(validMealBody());

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ name: "Oats and berries", mealType: "breakfast", calories: 420 });
  });

  it("rejects an invalid mealType", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .post("/api/meals")
      .set(await auth(token))
      .send(validMealBody({ mealType: "brunch" }));

    expect(response.status).toBe(400);
  });

  it("rejects a missing required field", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .post("/api/meals")
      .set(await auth(token))
      .send({ name: "Incomplete" });

    expect(response.status).toBe(400);
  });

  it("rejects when unauthenticated", async () => {
    const response = await supertest(app).post("/api/meals").send(validMealBody());
    expect(response.status).toBe(401);
  });
});

describe("GET /api/meals", () => {
  it("lists only the requesting user's meals", async () => {
    const userA = await registerAndLogin(app);
    const userB = await registerAndLogin(app);
    await supertest(app).post("/api/meals").set(await auth(userA.token)).send(validMealBody());
    await supertest(app).post("/api/meals").set(await auth(userA.token)).send(validMealBody({ mealType: "lunch" }));
    await supertest(app).post("/api/meals").set(await auth(userB.token)).send(validMealBody());

    const responseA = await supertest(app).get("/api/meals").set(await auth(userA.token));
    expect(responseA.body.items).toHaveLength(2);

    const responseB = await supertest(app).get("/api/meals").set(await auth(userB.token));
    expect(responseB.body.items).toHaveLength(1);
  });

  it("filters by an exact date", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/meals").set(await auth(token)).send(validMealBody({ date: "2026-09-01" }));
    await supertest(app).post("/api/meals").set(await auth(token)).send(validMealBody({ date: "2026-09-02" }));

    const response = await supertest(app).get("/api/meals?date=2026-09-01").set(await auth(token));
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].date).toBe("2026-09-01T00:00:00.000Z");
  });

  it("filters by a startDate/endDate range", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/meals").set(await auth(token)).send(validMealBody({ date: "2026-09-01" }));
    await supertest(app).post("/api/meals").set(await auth(token)).send(validMealBody({ date: "2026-09-05" }));
    await supertest(app).post("/api/meals").set(await auth(token)).send(validMealBody({ date: "2026-09-10" }));

    const response = await supertest(app)
      .get("/api/meals?startDate=2026-09-02&endDate=2026-09-06")
      .set(await auth(token));
    expect(response.body.items).toHaveLength(1);
  });

  it("rejects a startDate without a matching endDate", async () => {
    const { token } = await registerAndLogin(app);
    const response = await supertest(app).get("/api/meals?startDate=2026-09-02").set(await auth(token));
    expect(response.status).toBe(400);
  });
});

describe("PUT /api/meals/:id", () => {
  it("updates an owned meal entry", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/meals").set(await auth(token)).send(validMealBody());

    const response = await supertest(app)
      .put(`/api/meals/${created.body.id}`)
      .set(await auth(token))
      .send({ calories: 500 });

    expect(response.status).toBe(200);
    expect(response.body.calories).toBe(500);
  });

  it("refuses to update another user's meal", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const created = await supertest(app).post("/api/meals").set(await auth(owner.token)).send(validMealBody());

    const response = await supertest(app)
      .put(`/api/meals/${created.body.id}`)
      .set(await auth(attacker.token))
      .send({ calories: 1 });

    expect(response.status).toBe(404);
  });
});

describe("DELETE /api/meals/:id", () => {
  it("deletes an owned meal entry", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/meals").set(await auth(token)).send(validMealBody());

    const response = await supertest(app).delete(`/api/meals/${created.body.id}`).set(await auth(token));
    expect(response.status).toBe(204);

    const listed = await supertest(app).get("/api/meals").set(await auth(token));
    expect(listed.body.items).toHaveLength(0);
  });

  it("refuses to delete another user's meal", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const created = await supertest(app).post("/api/meals").set(await auth(owner.token)).send(validMealBody());

    const response = await supertest(app).delete(`/api/meals/${created.body.id}`).set(await auth(attacker.token));
    expect(response.status).toBe(404);
  });
});
