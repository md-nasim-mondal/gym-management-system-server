import { Schema, model } from "mongoose";
import { ISchedule, ScheduleModel } from "./schedule.interface";

const scheduleSchema = new Schema<ISchedule, ScheduleModel>(
  {
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    trainer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    maxTrainees: { type: Number, default: 10 },
    trainees: [{ type: Schema.Types.ObjectId, ref: "User" }],
    classType: { type: String, required: true },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
  },
  { timestamps: true }
);

// Index for enforcing max 5 classes per day
scheduleSchema.index({ date: 1 }, { unique: false });

export const Schedule = model<ISchedule, ScheduleModel>(
  "Schedule",
  scheduleSchema
);
