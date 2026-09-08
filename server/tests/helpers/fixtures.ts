import { User, type UserDocument } from "../../src/models/User.js";

let counter = 0;

export async function createTestUser(overrides: Partial<{ name: string; email: string }> = {}): Promise<UserDocument> {
  counter += 1;
  return User.create({
    name: overrides.name ?? `Test User ${counter}`,
    email: overrides.email ?? `test-user-${counter}@example.com`,
    passwordHash: "hashed-password-placeholder",
  });
}
