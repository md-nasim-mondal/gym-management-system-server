import express from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  AuthController.register
);

router.post(
  "/login",
  validateRequest(loginValidationSchema),
  AuthController.credentialsLogin
);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
