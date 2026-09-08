import { WeightEntry, type WeightEntryDocument } from "../../models/WeightEntry.js";
import { deleteOwnedById, listOwned, updateOwnedById } from "../../utils/ownership.js";
import { buildDateRangeFilter } from "../../utils/dateFilter.js";
import type { DateFilterQuery } from "../../utils/validation.js";
import type { CreateWeightInput, UpdateWeightInput } from "./weight.validation.js";

const NOT_FOUND_MESSAGE = "Weight entry not found";

export async function listWeights(
  userId: string,
  query: DateFilterQuery,
): Promise<WeightEntryDocument[]> {
  return listOwned(WeightEntry, userId, buildDateRangeFilter(query)).sort({ date: 1 });
}

export async function createWeight(
  userId: string,
  input: CreateWeightInput,
): Promise<WeightEntryDocument> {
  return WeightEntry.create({ ...input, userId });
}

export async function updateWeight(
  userId: string,
  id: string,
  input: UpdateWeightInput,
): Promise<WeightEntryDocument> {
  return updateOwnedById(WeightEntry, id, userId, input, NOT_FOUND_MESSAGE);
}

export async function deleteWeight(userId: string, id: string): Promise<void> {
  return deleteOwnedById(WeightEntry, id, userId, NOT_FOUND_MESSAGE);
}
