import { Model, Types } from "mongoose";

export interface ISchedule {
  date: Date;
  startTime: string;
  endTime: string;
  trainer: Types.ObjectId;
  maxTrainees: number;
  trainees: Types.ObjectId[];
  classType: string;
  status: "upcoming" | "completed" | "cancelled";
}

export type ScheduleModel = Model<ISchedule>;
