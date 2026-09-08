import type {
  HydratedDocument,
  Model,
  Query,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";
import { Types } from "mongoose";
import { AppError } from "./AppError.js";

/**
 * Reusable, ownership-scoped data-access helpers.
 *
 * Every controller/service for a user-owned resource (Goal, MealEntry,
 * DailyLog, WeightEntry, ...) must derive `userId` from `req.user.id`
 * (set by `requireAuth` from a verified JWT) and use these helpers rather
 * than trusting any client-supplied ownership field.
 *
 * Security invariant: whether an id is malformed, does not exist, or
 * belongs to a different user, the caller always receives the exact same
 * `AppError.notFound` — the response must never let a client distinguish
 * "not yours" from "doesn't exist" (see `07-API-Specification.md` §10.8).
 *
 * Pattern for the four operation shapes:
 *   - list:   `listOwned(Model, userId, extraFilter).sort(...)`
 *   - detail: `await findOwnedById(Model, id, userId)`
 *   - update: `await updateOwnedById(Model, id, userId, update)`
 *   - delete: `await deleteOwnedById(Model, id, userId)`
 */

const DEFAULT_NOT_FOUND_MESSAGE = "Resource not found";

export function parseObjectId(id: string): Types.ObjectId | null {
  return Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : null;
}

export function listOwned<TSchema>(
  model: Model<TSchema>,
  userId: string,
  extraFilter: Record<string, unknown> = {},
): Query<HydratedDocument<TSchema>[], HydratedDocument<TSchema>> {
  return model.find({ userId, ...extraFilter } as QueryFilter<TSchema>);
}

export async function findOwnedById<TSchema>(
  model: Model<TSchema>,
  id: string,
  userId: string,
  notFoundMessage: string = DEFAULT_NOT_FOUND_MESSAGE,
): Promise<HydratedDocument<TSchema>> {
  const objectId = parseObjectId(id);
  if (!objectId) {
    throw AppError.notFound(notFoundMessage);
  }

  const doc = await model.findOne({ _id: objectId, userId } as QueryFilter<TSchema>);
  if (!doc) {
    throw AppError.notFound(notFoundMessage);
  }

  return doc;
}

export async function updateOwnedById<TSchema>(
  model: Model<TSchema>,
  id: string,
  userId: string,
  update: UpdateQuery<TSchema>,
  notFoundMessage: string = DEFAULT_NOT_FOUND_MESSAGE,
  options: QueryOptions = {},
): Promise<HydratedDocument<TSchema>> {
  const objectId = parseObjectId(id);
  if (!objectId) {
    throw AppError.notFound(notFoundMessage);
  }

  const doc = await model.findOneAndUpdate(
    { _id: objectId, userId } as QueryFilter<TSchema>,
    update,
    { returnDocument: "after", runValidators: true, ...options },
  );

  if (!doc) {
    throw AppError.notFound(notFoundMessage);
  }

  return doc;
}

export async function deleteOwnedById<TSchema>(
  model: Model<TSchema>,
  id: string,
  userId: string,
  notFoundMessage: string = DEFAULT_NOT_FOUND_MESSAGE,
): Promise<void> {
  const objectId = parseObjectId(id);
  if (!objectId) {
    throw AppError.notFound(notFoundMessage);
  }

  const result = await model.deleteOne({ _id: objectId, userId } as QueryFilter<TSchema>);
  if (result.deletedCount === 0) {
    throw AppError.notFound(notFoundMessage);
  }
}
