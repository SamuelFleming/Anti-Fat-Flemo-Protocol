import { describe, expect, it } from "vitest";
import { comparePassword, hashPassword } from "../../src/utils/password.js";

describe("password hashing", () => {
  it("produces a hash different from the plain text", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    expect(hash).not.toBe("correct-horse-battery-staple");
    expect(hash.length).toBeGreaterThan(10);
  });

  it("verifies a matching password", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    await expect(comparePassword("correct-horse-battery-staple", hash)).resolves.toBe(true);
  });

  it("rejects a non-matching password", async () => {
    const hash = await hashPassword("correct-horse-battery-staple");
    await expect(comparePassword("wrong-password", hash)).resolves.toBe(false);
  });
});
