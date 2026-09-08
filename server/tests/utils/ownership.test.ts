import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import { Types } from "mongoose";
import { WeightEntry } from "../../src/models/WeightEntry.js";
import {
  deleteOwnedById,
  findOwnedById,
  listOwned,
  parseObjectId,
  updateOwnedById,
} from "../../src/utils/ownership.js";
import { AppError } from "../../src/utils/AppError.js";
import { clearCollections, connectTestDb, disconnectTestDb } from "../helpers/testDb.js";
import { createTestUser } from "../helpers/fixtures.js";

beforeAll(connectTestDb);
afterEach(clearCollections);
afterAll(disconnectTestDb);

describe("parseObjectId", () => {
  it("parses a valid 24-char hex id", () => {
    const id = new Types.ObjectId().toString();
    expect(parseObjectId(id)?.toString()).toBe(id);
  });

  it("returns null for a malformed id", () => {
    expect(parseObjectId("not-an-object-id")).toBeNull();
  });
});

describe("listOwned", () => {
  it("only returns the querying user's records", async () => {
    const userA = await createTestUser();
    const userB = await createTestUser();

    await WeightEntry.create({ userId: userA._id, date: "2026-09-01", weightKg: 80 });
    await WeightEntry.create({ userId: userA._id, date: "2026-09-02", weightKg: 79.5 });
    await WeightEntry.create({ userId: userB._id, date: "2026-09-01", weightKg: 70 });

    const results = await listOwned(WeightEntry, userA.id);
    expect(results).toHaveLength(2);
    expect(results.every((entry) => entry.userId.toString() === userA.id)).toBe(true);
  });
});

describe("findOwnedById", () => {
  it("returns the record when it belongs to the requesting user", async () => {
    const user = await createTestUser();
    const entry = await WeightEntry.create({ userId: user._id, date: "2026-09-08", weightKg: 81.4 });

    const found = await findOwnedById(WeightEntry, entry.id, user.id);
    expect(found.id).toBe(entry.id);
  });

  it("throws not-found when the record belongs to another user", async () => {
    const owner = await createTestUser();
    const attacker = await createTestUser();
    const entry = await WeightEntry.create({ userId: owner._id, date: "2026-09-08", weightKg: 81.4 });

    await expect(findOwnedById(WeightEntry, entry.id, attacker.id)).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it("throws the identical not-found error for a well-formed but nonexistent id", async () => {
    const user = await createTestUser();
    const nonexistentId = new Types.ObjectId().toString();

    await expect(findOwnedById(WeightEntry, nonexistentId, user.id)).rejects.toMatchObject({
      statusCode: 404,
      message: "Resource not found",
    });
  });

  it("throws the identical not-found error for a malformed id", async () => {
    const user = await createTestUser();

    await expect(findOwnedById(WeightEntry, "not-a-valid-id", user.id)).rejects.toMatchObject({
      statusCode: 404,
      message: "Resource not found",
    });
  });

  it("cannot be bypassed by any client-supplied ownership value other than the authenticated user id", async () => {
    const owner = await createTestUser();
    const entry = await WeightEntry.create({ userId: owner._id, date: "2026-09-08", weightKg: 81.4 });

    // Even a syntactically valid ObjectId that happens to equal no real user
    // must not unlock someone else's record.
    const spoofedUserId = new Types.ObjectId().toString();
    await expect(findOwnedById(WeightEntry, entry.id, spoofedUserId)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});

describe("updateOwnedById", () => {
  it("updates a record owned by the requesting user", async () => {
    const user = await createTestUser();
    const entry = await WeightEntry.create({ userId: user._id, date: "2026-09-08", weightKg: 81.4 });

    const updated = await updateOwnedById(WeightEntry, entry.id, user.id, { weightKg: 80.9 });
    expect(updated.weightKg).toBe(80.9);
  });

  it("refuses to update a record owned by another user", async () => {
    const owner = await createTestUser();
    const attacker = await createTestUser();
    const entry = await WeightEntry.create({ userId: owner._id, date: "2026-09-08", weightKg: 81.4 });

    await expect(
      updateOwnedById(WeightEntry, entry.id, attacker.id, { weightKg: 1 }),
    ).rejects.toMatchObject({ statusCode: 404 });

    const stillOriginal = await WeightEntry.findById(entry.id);
    expect(stillOriginal?.weightKg).toBe(81.4);
  });
});

describe("deleteOwnedById", () => {
  it("deletes a record owned by the requesting user", async () => {
    const user = await createTestUser();
    const entry = await WeightEntry.create({ userId: user._id, date: "2026-09-08", weightKg: 81.4 });

    await deleteOwnedById(WeightEntry, entry.id, user.id);
    expect(await WeightEntry.findById(entry.id)).toBeNull();
  });

  it("refuses to delete a record owned by another user, leaving it intact", async () => {
    const owner = await createTestUser();
    const attacker = await createTestUser();
    const entry = await WeightEntry.create({ userId: owner._id, date: "2026-09-08", weightKg: 81.4 });

    await expect(deleteOwnedById(WeightEntry, entry.id, attacker.id)).rejects.toMatchObject({
      statusCode: 404,
    });

    expect(await WeightEntry.findById(entry.id)).not.toBeNull();
  });
});
