import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { Profile } from "../../src/models/Profile.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { createTestUser } from "../helpers/fixtures.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

describe("Profile model", () => {
  it("persists a valid profile with default units", async () => {
    const user = await createTestUser();
    const profile = await Profile.create({ userId: user._id, heightCm: 178 });

    expect(profile.preferredWeightUnit).toBe("kg");
    expect(profile.preferredEnergyUnit).toBe("kJ");
  });

  it("rejects a profile without a userId", async () => {
    await expect(Profile.create({ heightCm: 178 })).rejects.toThrow();
  });

  it("rejects an invalid preferredWeightUnit", async () => {
    const user = await createTestUser();
    await expect(
      Profile.create({ userId: user._id, preferredWeightUnit: "lb" } as never),
    ).rejects.toThrow();
  });

  it("rejects a second profile for the same user", async () => {
    const user = await createTestUser();
    await Profile.create({ userId: user._id });

    await expect(Profile.create({ userId: user._id })).rejects.toThrow();
  });

  it("allows two different users to each have their own profile", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();

    await Profile.create({ userId: userA._id, heightCm: 170 });
    await Profile.create({ userId: userB._id, heightCm: 190 });

    const count = await Profile.countDocuments();
    expect(count).toBe(2);
  });
});
