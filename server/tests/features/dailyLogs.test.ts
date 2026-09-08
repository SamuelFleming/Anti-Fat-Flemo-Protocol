import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../../src/app.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { registerAndLogin } from "../helpers/auth.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

const app = createApp();

async function auth(token: string) {
  return { Authorization: `Bearer ${token}` } as const;
}

describe("PUT /api/daily-logs/:date", () => {
  it("creates a daily log on first write (upsert)", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .put("/api/daily-logs/2026-09-01")
      .set(await auth(token))
      .send({ moveKj: 900, notes: "Long walk" });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ moveKj: 900, notes: "Long walk" });
    expect(response.body.date).toBe("2026-09-01T00:00:00.000Z");
  });

  it("updates the same log on a second write for the same date", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).put("/api/daily-logs/2026-09-01").set(await auth(token)).send({ moveKj: 900 });

    const response = await supertest(app)
      .put("/api/daily-logs/2026-09-01")
      .set(await auth(token))
      .send({ moveKj: 1200 });

    expect(response.status).toBe(200);
    expect(response.body.moveKj).toBe(1200);

    const listed = await supertest(app).get("/api/daily-logs").set(await auth(token));
    expect(listed.body.items).toHaveLength(1);
  });

  it("rejects a malformed date path parameter", async () => {
    const { token } = await registerAndLogin(app);
    const response = await supertest(app)
      .put("/api/daily-logs/not-a-date")
      .set(await auth(token))
      .send({ moveKj: 100 });

    expect(response.status).toBe(400);
  });

  it("rejects when unauthenticated", async () => {
    const response = await supertest(app).put("/api/daily-logs/2026-09-01").send({ moveKj: 100 });
    expect(response.status).toBe(401);
  });

  it("keeps each user's daily log independent for the same date", async () => {
    const userA = await registerAndLogin(app);
    const userB = await registerAndLogin(app);
    await supertest(app).put("/api/daily-logs/2026-09-01").set(await auth(userA.token)).send({ moveKj: 500 });
    await supertest(app).put("/api/daily-logs/2026-09-01").set(await auth(userB.token)).send({ moveKj: 800 });

    const listedA = await supertest(app).get("/api/daily-logs").set(await auth(userA.token));
    expect(listedA.body.items).toHaveLength(1);
    expect(listedA.body.items[0].moveKj).toBe(500);
  });
});

describe("GET /api/daily-logs", () => {
  it("filters by date range", async () => {
    const { token } = await registerAndLogin(app);
    await supertest(app).put("/api/daily-logs/2026-09-01").set(await auth(token)).send({ moveKj: 100 });
    await supertest(app).put("/api/daily-logs/2026-09-05").set(await auth(token)).send({ moveKj: 200 });
    await supertest(app).put("/api/daily-logs/2026-09-10").set(await auth(token)).send({ moveKj: 300 });

    const response = await supertest(app)
      .get("/api/daily-logs?startDate=2026-09-02&endDate=2026-09-06")
      .set(await auth(token));

    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].moveKj).toBe(200);
  });
});
