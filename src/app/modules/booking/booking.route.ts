import express from "express";
import { BookingController } from "./booking.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/book",
  checkAuth(Role.TRAINEE),
  BookingController.bookClass
);

router.patch(
  "/cancel/:bookingId",
  checkAuth(Role.TRAINEE, Role.ADMIN),
  BookingController.cancelBooking
);

router.get(
  "/my-bookings",
  checkAuth(Role.TRAINEE),
  BookingController.getTraineeBookings
);

export const BookingRoutes = router;