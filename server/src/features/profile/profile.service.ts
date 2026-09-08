import { Profile, type ProfileDocument } from "../../models/Profile.js";
import type { UpdateProfileInput } from "./profile.validation.js";

export async function getOrCreateProfile(userId: string): Promise<ProfileDocument> {
  const existing = await Profile.findOne({ userId });
  if (existing) {
    return existing;
  }

  return Profile.create({ userId });
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<ProfileDocument> {
  const profile = await getOrCreateProfile(userId);
  profile.set(input);
  await profile.save();
  return profile;
}
