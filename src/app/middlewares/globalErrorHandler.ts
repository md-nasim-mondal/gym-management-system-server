import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handleCastError } from "../helpers/handleCastError";
import { handlerDuplicateError } from "../helpers/handleDuplicateError";
import { handlerValidationError } from "../helpers/handlerValidationError";
import { handlerZodError } from "../helpers/handlerZodError";
import { TErrorSources } from "../interfaces/error.types";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log(err);
  }

  let errorSources: TErrorSources[] = [];
  let statusCode = 500;
  let message = "Something Went Wrong!!";
  let errorDetails: any = null;

  // Unauthorized Access Error
  if (err.statusCode === 401 || err.message?.includes("Unauthorized")) {
    statusCode = 401;
    message = "Unauthorized access.";
    errorDetails = err.message?.includes("Unauthorized") 
      ? err.message 
      : "You must be authenticated to perform this action.";
  }
  // Forbidden Access Error
  else if (err.statusCode === 403 || err.message?.includes("not permitted")) {
    statusCode = 403;
    message = "Unauthorized access.";
    errorDetails = err.message?.includes("not permitted") 
      ? err.message 
      : "You must be an admin to perform this action.";
  }
  // Class Booking Limit Exceeded
  else if (err.message?.includes("Maximum 10 trainees") || err.message?.includes("schedule is full")) {
    statusCode = 400;
    message = "Class schedule is full. Maximum 10 trainees allowed per schedule.";
  }
  // Schedule Limit Error
  else if (err.message?.includes("more than 5 schedules")) {
    statusCode = 400;
    message = "Schedule limit exceeded. Maximum 5 schedules per day allowed.";
  }
  // Duplicate error
  else if (err.code === 11000) {
    const simplifiedError = handlerDuplicateError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
  }
  // Object ID error / Cast Error
  else if (err.name === "CastError") {
    const simplifiedError = handleCastError(err);
    statusCode = simplifiedError.statusCode as number;
    message = simplifiedError.message;
  } 
  // Zod Validation Error
  else if (err.name === "ZodError") {
    const simplifiedError = handlerZodError(err);
    statusCode = simplifiedError.statusCode as number;
    message = "Validation error occurred.";
    errorSources = simplifiedError.errorSources as TErrorSources[];
    if (errorSources.length > 0) {
      errorDetails = {
        field: errorSources[0].path,
        message: errorSources[0].message
      };
    }
  }
  // Mongoose Validation Error
  else if (err.name === "ValidationError") {
    const simplifiedError = handlerValidationError(err);
    statusCode = simplifiedError.statusCode as number;
    errorSources = simplifiedError.errorSources as TErrorSources[];
    message = "Validation error occurred.";
    if (errorSources.length > 0) {
      errorDetails = {
        field: errorSources[0].path,
        message: errorSources[0].message
      };
    }
  } 
  // Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } 
  // Generic Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  // Format response according to requirements
  const responseBody: any = {
    success: false,
    message
  };

  // Add errorDetails if available
  if (errorDetails) {
    responseBody.errorDetails = errorDetails;
  } 
  // Add errorSources for development environment
  else if (errorSources.length > 0 && envVars.NODE_ENV === "development") {
    responseBody.errorSources = errorSources;
  }

  // Add stack trace and original error in development environment
  if (envVars.NODE_ENV === "development") {
    responseBody.err = err;
    responseBody.stack = err.stack;
  }

  res.status(statusCode).json(responseBody);
};