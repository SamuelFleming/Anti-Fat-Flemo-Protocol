import type { Express } from "express";
import supertest from "supertest";

let counter = 0;

/** Registers a fresh user through the real HTTP API and returns their bearer token. */
export async function registerAndLogin(app: Express): Promise<{ token: string; userId: string }> {
  counter += 1;
  const response = await supertest(app)
    .post("/api/auth/register")
    .send({
      name: `Test User ${counter}`,
      email: `owner-test-${counter}@example.com`,
      password: "correct-horse-battery-staple",
    });

  return { token: response.body.token as string, userId: response.body.user.id as string };
}
