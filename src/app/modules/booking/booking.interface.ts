// server/src/app/modules/booking/booking.interface.ts
import { Model, Types } from 'mongoose';

export interface IBooking {
  schedule: Types.ObjectId;
  trainee: Types.ObjectId;
  bookedAt: Date;
  status: 'confirmed' | 'cancelled' | 'completed';
}

export type BookingModel = Model<IBooking>;