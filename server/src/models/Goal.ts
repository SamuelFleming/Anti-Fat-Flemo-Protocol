import { Schema, model, Types, type HydratedDocument } from "mongoose";
import { applyJsonTransform } from "../utils/mongooseJson.js";
import { toCalendarDate } from "../utils/date.js";

export const GOAL_STATUSES = ["active", "completed", "archived"] as const;
export type GoalStatus = (typeof GOAL_STATUSES)[number];

export interface IGoal {
  userId: Types.ObjectId;
  name: string;
  startDate: Date;
  targetDate?: Date;
  startingWeightKg: number;
  targetWeightKg: number;
  targetCalories: number;
  targetMoveKj: number;
  status: GoalStatus;
  createdAt: Date;
  updatedAt: Date;
}

const goalSchema = new Schema<IGoal>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true, set: toCalendarDate },
    targetDate: {
      type: Date,
      set: (value: string | Date | null | undefined) =>
        value == null ? value : toCalendarDate(value),
    },
    startingWeightKg: { type: Number, required: true, min: 0 },
    targetWeightKg: { type: Number, required: true, min: 0 },
    targetCalories: { type: Number, required: true, min: 0 },
    targetMoveKj: { type: Number, required: true, min: 0 },
    status: { type: String, enum: GOAL_STATUSES, default: "active", required: true },
  },
  { timestamps: true },
);

goalSchema.index({ userId: 1 });
goalSchema.index({ userId: 1, status: 1 });
goalSchema.index({ userId: 1, startDate: 1 });

applyJsonTransform(goalSchema);

export type GoalDocument = HydratedDocument<IGoal>;
export const Goal = model<IGoal>("Goal", goalSchema);
