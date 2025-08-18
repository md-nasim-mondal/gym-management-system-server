import { Booking } from "./booking.model";
import { Schedule } from "../schedule/schedule.model";
import { User } from "../user/user.model";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import mongoose from "mongoose";

const bookClass = async (scheduleId: string, traineeId: string) => {
  // Check schedule exists
  const schedule = await Schedule.findById(scheduleId);
  if (!schedule) {
    throw new AppError(httpStatus.NOT_FOUND, "Schedule not found");
  }

  // Check trainee exists
  const trainee = await User.findById(traineeId);
  if (!trainee || trainee.role !== "trainee") {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid trainee");
  }

  // Check class capacity
  if (schedule.trainees.length >= schedule.maxTrainees) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Class schedule is full. Maximum 10 trainees allowed per schedule."
    );
  }

  // Check if already booked
  const existingBooking = await Booking.findOne({
    schedule: scheduleId,
    trainee: traineeId,
    status: { $ne: "cancelled" },
  });

  if (existingBooking) {
    throw new AppError(httpStatus.BAD_REQUEST, "Already booked this class");
  }

  // Check if trainee has another booking at the same time
  const scheduleDate = new Date(schedule.date);
  const startTime = schedule.startTime;
  const endTime = schedule.endTime;

  const overlappingSchedules = await Schedule.find({
    date: scheduleDate,
    $or: [
      {
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      },
    ],
  });

  const overlappingScheduleIds = overlappingSchedules.map((s) => s._id);

  const conflictingBooking = await Booking.findOne({
    trainee: traineeId,
    schedule: { $in: overlappingScheduleIds },
    status: "confirmed",
  });

  if (conflictingBooking) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "You already have a booking during this time slot"
    );
  }

  // Create booking using transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create booking
    const booking = await Booking.create(
      [
        {
          schedule: scheduleId,
          trainee: traineeId,
          status: "confirmed",
          bookedAt: new Date(),
        },
      ],
      { session }
    );

    // Add trainee to schedule
    await Schedule.findByIdAndUpdate(
      scheduleId,
      { $addToSet: { trainees: traineeId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return booking[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const cancelBooking = async (bookingId: string, userId: string) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  // Check if the booking belongs to the user or user is admin
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User not found");
  }

  if (booking.trainee.toString() !== userId && user.role !== "admin") {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      "You are not authorized to cancel this booking"
    );
  }

  // Use transaction to update booking and schedule
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Update booking status
    booking.status = "cancelled";
    await booking.save({ session });

    // Remove trainee from schedule
    await Schedule.findByIdAndUpdate(
      booking.schedule,
      { $pull: { trainees: booking.trainee } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return booking;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const getTraineeBookings = async (traineeId: string) => {
  return await Booking.find({ trainee: traineeId }).populate({
    path: "schedule",
    populate: { path: "trainer", select: "name" },
  });
};

export const BookingService = {
  bookClass,
  cancelBooking,
  getTraineeBookings,
};
