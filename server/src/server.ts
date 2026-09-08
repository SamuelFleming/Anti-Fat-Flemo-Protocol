import { createApp } from "./app.js";
import { connectDb, disconnectDb } from "./db/connect.js";
import { env } from "./config/env.js";

async function main(): Promise<void> {
  try {
    await connectDb();
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }

  const app = createApp();

  const server = app.listen(env.PORT, () => {
    console.log(`Anti-Fat-Flemo API listening on port ${env.PORT}`);
  });

  const shutdown = (signal: string): void => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      disconnectDb()
        .catch((error: unknown) => console.error("Error disconnecting MongoDB:", error))
        .finally(() => process.exit(0));
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

main().catch((error: unknown) => {
  console.error("Fatal startup error:", error);
  process.exit(1);
});
