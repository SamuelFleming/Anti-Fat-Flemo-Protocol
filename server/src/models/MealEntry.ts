import { Schema, model, Types, type HydratedDocument } from "mongoose";
import { applyJsonTransform } from "../utils/mongooseJson.js";
import { toCalendarDate } from "../utils/date.js";

export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack", "other"] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export interface IMealEntry {
  userId: Types.ObjectId;
  date: Date;
  name: string;
  mealType: MealType;
  calories: number;
  proteinGrams?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const mealEntrySchema = new Schema<IMealEntry>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, set: toCalendarDate },
    name: { type: String, required: true, trim: true },
    mealType: { type: String, enum: MEAL_TYPES, required: true },
    calories: { type: Number, required: true, min: 0 },
    proteinGrams: { type: Number, min: 0 },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

mealEntrySchema.index({ userId: 1, date: 1 });

applyJsonTransform(mealEntrySchema);

export type MealEntryDocument = HydratedDocument<IMealEntry>;
export const MealEntry = model<IMealEntry>("MealEntry", mealEntrySchema);
