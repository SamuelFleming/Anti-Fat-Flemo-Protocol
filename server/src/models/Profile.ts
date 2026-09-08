import { Schema, model, Types, type HydratedDocument } from "mongoose";
import { applyJsonTransform } from "../utils/mongooseJson.js";

export interface IProfile {
  userId: Types.ObjectId;
  heightCm?: number;
  preferredWeightUnit: "kg";
  preferredEnergyUnit: "kJ";
  estimatedBaselineTdee?: number;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema = new Schema<IProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    heightCm: { type: Number, min: 0 },
    preferredWeightUnit: { type: String, enum: ["kg"], default: "kg", required: true },
    preferredEnergyUnit: { type: String, enum: ["kJ"], default: "kJ", required: true },
    estimatedBaselineTdee: { type: Number, min: 0 },
  },
  { timestamps: true },
);

applyJsonTransform(profileSchema);

export type ProfileDocument = HydratedDocument<IProfile>;
export const Profile = model<IProfile>("Profile", profileSchema);
