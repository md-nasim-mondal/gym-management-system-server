import express from "express";
import { ScheduleController } from "./schedule.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";

const router = express.Router();

router.post(
  "/create",
  checkAuth(Role.ADMIN),
  ScheduleController.createSchedule
);

router.get("/", ScheduleController.getAllSchedules);

router.get("/trainer/:trainerId", ScheduleController.getSchedulesByTrainer);

router.get("/:id", ScheduleController.getScheduleById);

export const ScheduleRoutes = router;