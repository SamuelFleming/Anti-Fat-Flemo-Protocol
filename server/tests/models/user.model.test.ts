import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { User } from "../../src/models/User.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

describe("User model", () => {
  it("persists a valid user", async () => {
    const user = await User.create({
      name: "Sam",
      email: "sam@example.com",
      passwordHash: "hashed",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toBe("sam@example.com");
  });

  it("rejects a duplicate email", async () => {
    await User.create({ name: "Sam", email: "dup@example.com", passwordHash: "hashed" });

    await expect(
      User.create({ name: "Other Sam", email: "dup@example.com", passwordHash: "hashed" }),
    ).rejects.toThrow();
  });

  it("rejects a user missing required fields", async () => {
    await expect(User.create({ email: "missing-name@example.com" })).rejects.toThrow();
  });

  it("never exposes passwordHash via JSON serialisation", async () => {
    const user = await User.create({
      name: "Sam",
      email: "hidden@example.com",
      passwordHash: "hashed",
    });

    expect(user.toJSON()).not.toHaveProperty("passwordHash");
    expect(user.toJSON()).not.toHaveProperty("_id");
    expect(user.toJSON()).toHaveProperty("id");
  });

  it("excludes passwordHash from default queries", async () => {
    await User.create({ name: "Sam", email: "select@example.com", passwordHash: "hashed" });

    const found = await User.findOne({ email: "select@example.com" });
    expect(found?.passwordHash).toBeUndefined();

    const foundWithHash = await User.findOne({ email: "select@example.com" }).select(
      "+passwordHash",
    );
    expect(foundWithHash?.passwordHash).toBe("hashed");
  });
});
