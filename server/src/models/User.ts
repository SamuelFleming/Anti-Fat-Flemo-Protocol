import { Schema, model, type HydratedDocument } from "mongoose";
import { applyJsonTransform } from "../utils/mongooseJson.js";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

applyJsonTransform(userSchema, ["passwordHash"]);

export type UserDocument = HydratedDocument<IUser>;
export const User = model<IUser>("User", userSchema);
