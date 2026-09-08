import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../../src/app.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { registerAndLogin } from "../helpers/auth.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

const app = createApp();

function validWeightBody(overrides: Record<string, unknown> = {}) {
  return { date: "2026-09-01", weightKg: 81.5, ...overrides };
}

async function auth(token: string) {
  return { Authorization: `Bearer ${token}` } as const;
}

describe("POST /api/weights", () => {
  it("creates a weight entry", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .post("/api/weights")
      .set(await auth(token))
      .send(validWeightBody());

    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ weightKg: 81.5 });
  });

  it("rejects a second entry for the same date", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/weights").set(await auth(token)).send(validWeightBody());

    const response = await supertest(app)
      .post("/api/weights")
      .set(await auth(token))
      .send(validWeightBody({ weightKg: 80 }));

    expect(response.status).toBe(409);
  });

  it("allows two different users to log a weight on the same date", async () => {
    const userA = await registerAndLogin(app);
    const userB = await registerAndLogin(app);
    await supertest(app).post("/api/weights").set(await auth(userA.token)).send(validWeightBody());

    const responseB = await supertest(app)
      .post("/api/weights")
      .set(await auth(userB.token))
      .send(validWeightBody());

    expect(responseB.status).toBe(201);
  });

  it("rejects a non-positive weight", async () => {
    const { token } = await registerAndLogin(app);
    const response = await supertest(app)
      .post("/api/weights")
      .set(await auth(token))
      .send(validWeightBody({ weightKg: -5 }));

    expect(response.status).toBe(400);
  });
});

describe("GET /api/weights", () => {
  it("lists only the requesting user's weights, filterable by date range", async () => {
    const userA = await registerAndLogin(app);
    const userB = await registerAndLogin(app);
    await supertest(app).post("/api/weights").set(await auth(userA.token)).send(validWeightBody({ date: "2026-09-01" }));
    await supertest(app).post("/api/weights").set(await auth(userA.token)).send(validWeightBody({ date: "2026-09-10" }));
    await supertest(app).post("/api/weights").set(await auth(userB.token)).send(validWeightBody({ date: "2026-09-01" }));

    const responseA = await supertest(app).get("/api/weights").set(await auth(userA.token));
    expect(responseA.body.items).toHaveLength(2);

    const rangeA = await supertest(app)
      .get("/api/weights?startDate=2026-09-01&endDate=2026-09-05")
      .set(await auth(userA.token));
    expect(rangeA.body.items).toHaveLength(1);
  });
});

describe("PUT /api/weights/:id", () => {
  it("updates an owned weight entry", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/weights").set(await auth(token)).send(validWeightBody());

    const response = await supertest(app)
      .put(`/api/weights/${created.body.id}`)
      .set(await auth(token))
      .send({ weightKg: 80 });

    expect(response.status).toBe(200);
    expect(response.body.weightKg).toBe(80);
  });

  it("refuses to update another user's weight entry", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const created = await supertest(app).post("/api/weights").set(await auth(owner.token)).send(validWeightBody());

    const response = await supertest(app)
      .put(`/api/weights/${created.body.id}`)
      .set(await auth(attacker.token))
      .send({ weightKg: 1 });

    expect(response.status).toBe(404);
  });

  it("returns a conflict when updating into a date that already has an entry", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).post("/api/weights").set(await auth(token)).send(validWeightBody({ date: "2026-09-01" }));
    const second = await supertest(app)
      .post("/api/weights")
      .set(await auth(token))
      .send(validWeightBody({ date: "2026-09-02" }));

    const response = await supertest(app)
      .put(`/api/weights/${second.body.id}`)
      .set(await auth(token))
      .send({ date: "2026-09-01" });

    expect(response.status).toBe(409);
  });
});

describe("DELETE /api/weights/:id", () => {
  it("deletes an owned weight entry", async () => {
    const { token } = await registerAndLogin(app);
    const created = await supertest(app).post("/api/weights").set(await auth(token)).send(validWeightBody());

    const response = await supertest(app).delete(`/api/weights/${created.body.id}`).set(await auth(token));
    expect(response.status).toBe(204);

    const listed = await supertest(app).get("/api/weights").set(await auth(token));
    expect(listed.body.items).toHaveLength(0);
  });

  it("refuses to delete another user's weight entry", async () => {
    const owner = await registerAndLogin(app);
    const attacker = await registerAndLogin(app);
    const created = await supertest(app).post("/api/weights").set(await auth(owner.token)).send(validWeightBody());

    const response = await supertest(app).delete(`/api/weights/${created.body.id}`).set(await auth(attacker.token));
    expect(response.status).toBe(404);
  });
});
