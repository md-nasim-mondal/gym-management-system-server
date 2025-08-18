import { Schema, model } from "mongoose";
import { IBooking, BookingModel } from "./booking.interface";

const bookingSchema = new Schema<IBooking, BookingModel>(
  {
    schedule: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
    trainee: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["confirmed", "cancelled", "completed"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// Prevent duplicate bookings
bookingSchema.index({ schedule: 1, trainee: 1 }, { unique: true });

export const Booking = model<IBooking, BookingModel>("Booking", bookingSchema);
