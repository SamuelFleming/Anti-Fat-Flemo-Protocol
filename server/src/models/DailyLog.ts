import { Schema, model, Types, type HydratedDocument } from "mongoose";
import { applyJsonTransform } from "../utils/mongooseJson.js";
import { toCalendarDate } from "../utils/date.js";

export interface IDailyLog {
  userId: Types.ObjectId;
  date: Date;
  moveKj?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const dailyLogSchema = new Schema<IDailyLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true, set: toCalendarDate },
    moveKj: { type: Number, min: 0 },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

dailyLogSchema.index({ userId: 1, date: 1 }, { unique: true });

applyJsonTransform(dailyLogSchema);

export type DailyLogDocument = HydratedDocument<IDailyLog>;
export const DailyLog = model<IDailyLog>("DailyLog", dailyLogSchema);
