import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../../src/app.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { registerAndLogin } from "../helpers/auth.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

const app = createApp();

describe("GET /api/profile", () => {
  it("returns the default profile created at registration", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app).get("/api/profile").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ preferredWeightUnit: "kg", preferredEnergyUnit: "kJ" });
  });

  it("rejects an unauthenticated request", async () => {
    const response = await supertest(app).get("/api/profile");
    expect(response.status).toBe(401);
  });
});

describe("PUT /api/profile", () => {
  it("updates height and baseline TDEE", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ heightCm: 178, estimatedBaselineTdee: 2200 });

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ heightCm: 178, estimatedBaselineTdee: 2200 });
  });

  it("rejects an unknown field", async () => {
    const { token } = await registerAndLogin(app);

    const response = await supertest(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${token}`)
      .send({ preferredWeightUnit: "lb" });

    expect(response.status).toBe(400);
  });

  it("keeps each user's profile independent", async () => {
    const userA = await registerAndLogin(app);
    const userB = await registerAndLogin(app);

    await supertest(app)
      .put("/api/profile")
      .set("Authorization", `Bearer ${userA.token}`)
      .send({ heightCm: 160 });

    const responseB = await supertest(app)
      .get("/api/profile")
      .set("Authorization", `Bearer ${userB.token}`);

    expect(responseB.body.heightCm).toBeUndefined();
  });
});
