import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingService } from "./booking.service";

const bookClass = catchAsync(async (req: Request, res: Response) => {
  const { scheduleId } = req.body;
  const traineeId = (req.user as { _id: string })?._id;

  const result = await BookingService.bookClass(scheduleId, traineeId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Class booked successfully",
    data: result,
  });
});

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
  const { bookingId } = req.params;
  const userId = (req.user as { _id: string })?._id;

  const result = await BookingService.cancelBooking(bookingId, userId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking cancelled successfully",
    data: result,
  });
});

const getTraineeBookings = catchAsync(async (req: Request, res: Response) => {
  const traineeId = (req.user as { _id: string })?._id;

  const result = await BookingService.getTraineeBookings(traineeId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Trainee bookings retrieved successfully",
    data: result,
  });
});

export const BookingController = {
  bookClass,
  cancelBooking,
  getTraineeBookings,
};
