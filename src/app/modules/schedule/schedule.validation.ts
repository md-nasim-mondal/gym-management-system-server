import { z } from "zod";

export const createScheduleValidationSchema = z.object({
  body: z.object({
    date: z.string({
      error: "Date is required",
    }),
    startTime: z.string({
      error: "Start time is required",
    }),
    endTime: z.string({
      error: "End time is required",
    }),
    trainer: z.string({
      error: "Trainer ID is required",
    }),
    classType: z.string({
      error: "Class type is required",
    }),
    maxTrainees: z.number().default(10),
  }),
});