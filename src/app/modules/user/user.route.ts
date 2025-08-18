import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { updateProfileZodSchema, updateUserZodSchema } from "./user.validation";

const router = Router();

router.get(
  "/all-users",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN),
  UserControllers.getAllUsers
);

router.patch(
  "/update-profile",
  checkAuth(Role.TRAINEE, Role.TRAINER, Role.ADMIN),
  UserControllers.updateProfile
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);
// /api/v1/user/:id
export const UserRoutes = router;
