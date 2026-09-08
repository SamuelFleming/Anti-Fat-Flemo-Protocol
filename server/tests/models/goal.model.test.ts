import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import type { Types } from "mongoose";
import { Goal } from "../../src/models/Goal.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { createTestUser } from "../helpers/fixtures.js";
import { formatCalendarDate } from "../../src/utils/date.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

function validGoalInput(userId: Types.ObjectId) {
  return {
    userId,
    name: "September Weight Cut",
    startDate: "2026-09-01",
    startingWeightKg: 82,
    targetWeightKg: 76,
    targetCalories: 1800,
    targetMoveKj: 1800,
  };
}

describe("Goal model", () => {
  it("persists a valid goal defaulting to active status", async () => {
    const user = await createTestUser();
    const goal = await Goal.create(validGoalInput(user._id));

    expect(goal.status).toBe("active");
    expect(formatCalendarDate(goal.startDate)).toBe("2026-09-01");
  });

  it("normalises startDate to a UTC calendar day regardless of time-of-day input", async () => {
    const user = await createTestUser();
    const goal = await Goal.create({
      ...validGoalInput(user._id),
      startDate: new Date("2026-09-01T23:30:00-05:00"),
    });

    expect(formatCalendarDate(goal.startDate)).toBe("2026-09-02");
  });

  it("rejects an invalid status", async () => {
    const user = await createTestUser();
    await expect(
      Goal.create({ ...validGoalInput(user._id), status: "not-a-status" } as never),
    ).rejects.toThrow();
  });

  it("rejects a goal missing required fields", async () => {
    const user = await createTestUser();
    await expect(Goal.create({ userId: user._id, name: "Incomplete" })).rejects.toThrow();
  });

  it("allows multiple goals per user across statuses", async () => {
    const user = await createTestUser();
    await Goal.create(validGoalInput(user._id));
    await Goal.create({
      ...validGoalInput(user._id),
      name: "Next goal",
      status: "completed",
    });

    const goals = await Goal.find({ userId: user._id });
    expect(goals).toHaveLength(2);
  });

  it("keeps goals independent between users", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();

    await Goal.create(validGoalInput(userA._id));

    const userBGoals = await Goal.find({ userId: userB._id });
    expect(userBGoals).toHaveLength(0);
  });
});
