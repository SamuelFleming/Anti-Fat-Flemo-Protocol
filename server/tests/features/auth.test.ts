import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import supertest from "supertest";
import { createApp } from "../../src/app.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

const app = createApp();

function validRegisterBody(overrides: Partial<Record<string, string>> = {}) {
  return {
    name: "Sam",
    email: "sam@example.com",
    password: "correct-horse-battery-staple",
    ...overrides,
  };
}

describe("POST /api/auth/register", () => {
  it("creates a user, hashes the password, and returns a token", async () => {
    const response = await supertest(app).post("/api/auth/register").send(validRegisterBody());

    expect(response.status).toBe(201);
    expect(response.body.user).toMatchObject({ name: "Sam", email: "sam@example.com" });
    expect(response.body.user).not.toHaveProperty("passwordHash");
    expect(typeof response.body.token).toBe("string");
  });

  it("rejects a duplicate email", async () => {
    await supertest(app).post("/api/auth/register").send(validRegisterBody());

    const response = await supertest(app)
      .post("/api/auth/register")
      .send(validRegisterBody({ name: "Someone Else" }));

    expect(response.status).toBe(409);
  });

  it("rejects an invalid email", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .send(validRegisterBody({ email: "not-an-email" }));

    expect(response.status).toBe(400);
  });

  it("rejects a password shorter than 8 characters", async () => {
    const response = await supertest(app)
      .post("/api/auth/register")
      .send(validRegisterBody({ password: "short" }));

    expect(response.status).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("authenticates with correct credentials", async () => {
    await supertest(app).post("/api/auth/register").send(validRegisterBody());

    const response = await supertest(app)
      .post("/api/auth/login")
      .send({ email: "sam@example.com", password: "correct-horse-battery-staple" });

    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe("string");
  });

  it("rejects an incorrect password without leaking account existence", async () => {
    await supertest(app).post("/api/auth/register").send(validRegisterBody());

    const response = await supertest(app)
      .post("/api/auth/login")
      .send({ email: "sam@example.com", password: "wrong-password" });

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe("Invalid email or password");
  });

  it("rejects an unknown email with the same generic message", async () => {
    const response = await supertest(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "whatever12345" });

    expect(response.status).toBe(401);
    expect(response.body.error.message).toBe("Invalid email or password");
  });
});

describe("GET /api/auth/me", () => {
  it("returns the current user and profile when authenticated", async () => {
    const registerResponse = await supertest(app)
      .post("/api/auth/register")
      .send(validRegisterBody());
    const { token } = registerResponse.body;

    const response = await supertest(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.user).toMatchObject({ email: "sam@example.com" });
    expect(response.body.profile).toMatchObject({ preferredWeightUnit: "kg" });
  });

  it("rejects a request with no token", async () => {
    const response = await supertest(app).get("/api/auth/me");
    expect(response.status).toBe(401);
  });

  it("rejects a request with an invalid token", async () => {
    const response = await supertest(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer not-a-real-token");

    expect(response.status).toBe(401);
  });
});

describe("POST /api/auth/logout", () => {
  it("succeeds for an authenticated user", async () => {
    const registerResponse = await supertest(app)
      .post("/api/auth/register")
      .send(validRegisterBody());
    const { token } = registerResponse.body;

    const response = await supertest(app)
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
  });

  it("rejects an unauthenticated request", async () => {
    const response = await supertest(app).post("/api/auth/logout");
    expect(response.status).toBe(401);
  });
});
