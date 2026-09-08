import { describe, expect, it } from "vitest";
import jwt from "jsonwebtoken";
import { signAccessToken, verifyAccessToken } from "../../src/utils/jwt.js";

describe("access tokens", () => {
  it("signs and verifies a round trip", () => {
    const token = signAccessToken({ sub: "abc123" });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe("abc123");
  });

  it("rejects a token signed with a different secret", () => {
    const badToken = jwt.sign({ sub: "abc123" }, "some-other-secret");
    expect(() => verifyAccessToken(badToken)).toThrow();
  });

  it("rejects an expired token", () => {
    const expiredToken = jwt.sign({ sub: "abc123" }, process.env.JWT_SECRET as string, {
      expiresIn: -10,
    });
    expect(() => verifyAccessToken(expiredToken)).toThrow();
  });

  it("rejects a malformed token", () => {
    expect(() => verifyAccessToken("not-a-real-token")).toThrow();
  });
});
