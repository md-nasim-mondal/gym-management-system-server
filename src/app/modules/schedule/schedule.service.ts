import { Schedule } from "./schedule.model";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ISchedule } from "./schedule.interface";

const createSchedule = async (payload: any) => {
  // Check if trainer exists
  const trainer = await User.findById(payload.trainer);
  if (!trainer || trainer.role !== "trainer") {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid trainer");
  }

  // Check max 5 classes per day
  const date = new Date(payload.date);
  date.setHours(0, 0, 0, 0); // Set to start of day
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999); // Set to end of day
  
  const schedulesCount = await Schedule.countDocuments({
    date: { $gte: date, $lte: endOfDay }
  });
  
  if (schedulesCount >= 5) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Maximum 5 classes per day allowed"
    );
  }

  // Ensure class duration is 2 hours
  const start = new Date(`1970-01-01T${payload.startTime}:00`);
  const end = new Date(`1970-01-01T${payload.endTime}:00`);
  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);

  if (duration !== 2) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Class duration must be exactly 2 hours"
    );
  }

  // Check for overlapping schedules with the same trainer
  const overlappingSchedule = await Schedule.findOne({
    trainer: payload.trainer,
    date: { $gte: date, $lte: endOfDay },
    $or: [
      {
        startTime: { $lt: payload.endTime },
        endTime: { $gt: payload.startTime }
      }
    ]
  });

  if (overlappingSchedule) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Trainer already has a class scheduled during this time"
    );
  }

  return await Schedule.create(payload);
};

const getAllSchedules = async () => {
  return await Schedule.find().populate("trainer", "name").populate("trainees", "name");
};

const getSchedulesByTrainer = async (trainerId: string) => {
  return await Schedule.find({ trainer: trainerId }).populate(
    "trainer",
    "name"
  ).populate("trainees", "name");
};

const getScheduleById = async (id: string) => {
  const schedule = await Schedule.findById(id)
    .populate("trainer", "name")
    .populate("trainees", "name");
  
  if (!schedule) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }
  
  return schedule;
};

export const ScheduleService = {
  createSchedule,
  getAllSchedules,
  getSchedulesByTrainer,
  getScheduleById,
};
