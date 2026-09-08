import { Schema, model, Types, type HydratedDocument } from "mongoose";
import { applyJsonTransform } from "../utils/mongooseJson.js";
import { toCalendarDate } from "../utils/date.js";

export interface IWeightEntry {
  userId: Types.ObjectId;
  date: Date;
  weightKg: number;
  createdAt: Date;
  updatedAt: Date;
}

const weightEntrySchema = new Schema<IWeightEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, set: toCalendarDate },
    weightKg: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

weightEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

applyJsonTransform(weightEntrySchema);

export type WeightEntryDocument = HydratedDocument<IWeightEntry>;
export const WeightEntry = model<IWeightEntry>("WeightEntry", weightEntrySchema);
