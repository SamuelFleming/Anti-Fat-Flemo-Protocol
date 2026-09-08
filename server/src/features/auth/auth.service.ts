import { User, type UserDocument } from "../../models/User.js";
import { Profile, type ProfileDocument } from "../../models/Profile.js";
import { AppError } from "../../utils/AppError.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import type { LoginInput, RegisterInput } from "./auth.validation.js";

const GENERIC_LOGIN_FAILURE = "Invalid email or password";

export async function registerUser(input: RegisterInput): Promise<UserDocument> {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw AppError.conflict("An account with this email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await User.create({
    name: input.name,
    email: input.email,
    passwordHash,
  });

  await Profile.create({ userId: user._id });

  return user;
}

export async function authenticateUser(input: LoginInput): Promise<UserDocument> {
  const user = await User.findOne({ email: input.email }).select("+passwordHash");

  if (!user) {
    throw AppError.unauthorized(GENERIC_LOGIN_FAILURE);
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw AppError.unauthorized(GENERIC_LOGIN_FAILURE);
  }

  return user;
}

export async function getCurrentUserContext(
  userId: string,
): Promise<{ user: UserDocument; profile: ProfileDocument | null }> {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.unauthorized("Invalid session");
  }

  const profile = await Profile.findOne({ userId: user._id });

  return { user, profile };
}
