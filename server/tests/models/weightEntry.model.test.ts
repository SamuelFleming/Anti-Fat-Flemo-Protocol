import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { WeightEntry } from "../../src/models/WeightEntry.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { createTestUser } from "../helpers/fixtures.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

describe("WeightEntry model", () => {
  it("persists a valid weight entry", async () => {
    const user = await createTestUser();
    const entry = await WeightEntry.create({ userId: user._id, date: "2026-09-08", weightKg: 81.4 });

    expect(entry.weightKg).toBe(81.4);
  });

  it("rejects a weight entry missing weightKg", async () => {
    const user = await createTestUser();
    await expect(WeightEntry.create({ userId: user._id, date: "2026-09-08" })).rejects.toThrow();
  });

  it("rejects a second weight entry for the same user and date", async () => {
    const user = await createTestUser();
    await WeightEntry.create({ userId: user._id, date: "2026-09-08", weightKg: 81.4 });

    await expect(
      WeightEntry.create({ userId: user._id, date: "2026-09-08", weightKg: 81.0 }),
    ).rejects.toThrow();
  });

  it("allows two different users to each record a weight on the same date", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();

    await WeightEntry.create({ userId: userA._id, date: "2026-09-08", weightKg: 81.4 });
    await WeightEntry.create({ userId: userB._id, date: "2026-09-08", weightKg: 70.2 });

    expect(await WeightEntry.countDocuments()).toBe(2);
  });
});
