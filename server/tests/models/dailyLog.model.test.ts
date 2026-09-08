import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { DailyLog } from "../../src/models/DailyLog.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { createTestUser } from "../helpers/fixtures.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

describe("DailyLog model", () => {
  it("persists a valid daily log", async () => {
    const user = await createTestUser();
    const log = await DailyLog.create({ userId: user._id, date: "2026-09-08", moveKj: 1840 });

    expect(log.moveKj).toBe(1840);
  });

  it("allows a daily log with no moveKj recorded yet", async () => {
    const user = await createTestUser();
    const log = await DailyLog.create({ userId: user._id, date: "2026-09-08" });

    expect(log.moveKj).toBeUndefined();
  });

  it("rejects a second daily log for the same user and date", async () => {
    const user = await createTestUser();
    await DailyLog.create({ userId: user._id, date: "2026-09-08", moveKj: 1000 });

    await expect(
      DailyLog.create({ userId: user._id, date: "2026-09-08", moveKj: 2000 }),
    ).rejects.toThrow();
  });

  it("allows two different users to each log the same date", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();

    await DailyLog.create({ userId: userA._id, date: "2026-09-08", moveKj: 1000 });
    await DailyLog.create({ userId: userB._id, date: "2026-09-08", moveKj: 1500 });

    expect(await DailyLog.countDocuments()).toBe(2);
  });
});
