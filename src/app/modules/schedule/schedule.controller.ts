import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ScheduleService } from "./schedule.service";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.createSchedule(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Schedule created successfully",
    data: result,
  });
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
  const result = await ScheduleService.getAllSchedules();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Schedules retrieved successfully",
    data: result,
  });
});

const getSchedulesByTrainer = catchAsync(async (req: Request, res: Response) => {
  const { trainerId } = req.params;
  const result = await ScheduleService.getSchedulesByTrainer(trainerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Trainer schedules retrieved successfully",
    data: result,
  });
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ScheduleService.getScheduleById(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Schedule retrieved successfully",
    data: result,
  });
});

export const ScheduleController = {
  createSchedule,
  getAllSchedules,
  getSchedulesByTrainer,
  getScheduleById,
};