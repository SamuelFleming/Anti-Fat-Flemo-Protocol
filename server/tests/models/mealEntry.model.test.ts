import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { MealEntry } from "../../src/models/MealEntry.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { createTestUser } from "../helpers/fixtures.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

describe("MealEntry model", () => {
  it("persists a valid meal entry", async () => {
    const user = await createTestUser();
    const meal = await MealEntry.create({
      userId: user._id,
      date: "2026-09-08",
      name: "Chicken wrap",
      mealType: "lunch",
      calories: 520,
      proteinGrams: 38,
    });

    expect(meal.calories).toBe(520);
    expect(meal.mealType).toBe("lunch");
  });

  it("rejects an invalid mealType", async () => {
    const user = await createTestUser();
    await expect(
      MealEntry.create({
        userId: user._id,
        date: "2026-09-08",
        name: "Mystery meal",
        mealType: "brunch",
        calories: 300,
      } as never),
    ).rejects.toThrow();
  });

  it("rejects a meal entry missing required fields", async () => {
    const user = await createTestUser();
    await expect(MealEntry.create({ userId: user._id, name: "No calories" })).rejects.toThrow();
  });

  it("allows multiple meals per user per day", async () => {
    const user = await createTestUser();
    await MealEntry.create({
      userId: user._id,
      date: "2026-09-08",
      name: "Breakfast",
      mealType: "breakfast",
      calories: 400,
    });
    await MealEntry.create({
      userId: user._id,
      date: "2026-09-08",
      name: "Lunch",
      mealType: "lunch",
      calories: 500,
    });

    const meals = await MealEntry.find({ userId: user._id });
    expect(meals).toHaveLength(2);
  });

  it("keeps meal entries independent between users on the same date", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();

    await MealEntry.create({
      userId: userA._id,
      date: "2026-09-08",
      name: "A's lunch",
      mealType: "lunch",
      calories: 500,
    });
    await MealEntry.create({
      userId: userB._id,
      date: "2026-09-08",
      name: "B's lunch",
      mealType: "lunch",
      calories: 600,
    });

    expect(await MealEntry.countDocuments({ userId: userA._id })).toBe(1);
    expect(await MealEntry.countDocuments({ userId: userB._id })).toBe(1);
  });
});
