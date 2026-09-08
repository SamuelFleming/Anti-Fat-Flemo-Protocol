import { MongoMemoryServer } from "mongodb-memory-server";

/**
 * Runs once for the whole Vitest run (before any test file's module graph
 * loads), so `env.ts`'s eager MONGODB_URI validation always sees a real,
 * ephemeral database. Test files run sequentially (see vitest.config.ts)
 * so it is safe for them to share this single in-memory instance.
 */
export default async function setup(): Promise<() => Promise<void>> {
  process.env.NODE_ENV = "test";
  process.env.CLIENT_ORIGIN ??= "http://localhost:5173";
  process.env.JWT_SECRET ??= "test-only-jwt-secret";
  process.env.JWT_EXPIRES_IN ??= "1h";

  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();

  return async () => {
    await mongod.stop();
  };
}
