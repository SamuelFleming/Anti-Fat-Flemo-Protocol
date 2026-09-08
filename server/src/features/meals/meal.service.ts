import { MealEntry, type MealEntryDocument } from "../../models/MealEntry.js";
import { deleteOwnedById, listOwned, updateOwnedById } from "../../utils/ownership.js";
import { buildDateRangeFilter } from "../../utils/dateFilter.js";
import type { DateFilterQuery } from "../../utils/validation.js";
import type { CreateMealInput, UpdateMealInput } from "./meal.validation.js";

const NOT_FOUND_MESSAGE = "Meal not found";

export async function listMeals(
  userId: string,
  query: DateFilterQuery,
): Promise<MealEntryDocument[]> {
  return listOwned(MealEntry, userId, buildDateRangeFilter(query)).sort({
    date: 1,
    createdAt: 1,
  });
}

export async function createMeal(
  userId: string,
  input: CreateMealInput,
): Promise<MealEntryDocument> {
  return MealEntry.create({ ...input, userId });
}

export async function updateMeal(
  userId: string,
  id: string,
  input: UpdateMealInput,
): Promise<MealEntryDocument> {
  return updateOwnedById(MealEntry, id, userId, input, NOT_FOUND_MESSAGE);
}

export async function deleteMeal(userId: string, id: string): Promise<void> {
  return deleteOwnedById(MealEntry, id, userId, NOT_FOUND_MESSAGE);
}
