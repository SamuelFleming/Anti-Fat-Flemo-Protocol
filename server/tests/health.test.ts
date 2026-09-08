import { describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../src/app.js";
import { connectTestDb, disconnectTestDb } from "./helpers/testDb.js";

describe("app bootstrap", () => {
  it("responds on the root route without opening a network listener or DB connection", async () => {
    const app = createApp();
    const response = await supertest(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ status: "ok" });
  });
});

describe("GET /api/health", () => {
  it("reports mongo as disconnected before a connection is established", async () => {
    const app = createApp();
    const response = await supertest(app).get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok", mongo: "disconnected" });
  });

  it("reports mongo as connected once the database is connected", async () => {
    await connectTestDb();
    const app = createApp();

    const response = await supertest(app).get("/api/health");

    expect(response.body).toEqual({ status: "ok", mongo: "connected" });

    await disconnectTestDb();
  });
});

describe("GET /api/openapi.json", () => {
  it("serves the implemented OpenAPI mirror", async () => {
    const app = createApp();
    const response = await supertest(app).get("/api/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body.paths).toHaveProperty("/health");
  });
});
