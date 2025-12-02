import { z } from "zod";

export const createAddonduttySchema = z.object({
  body: z.object({
    emp_id: z
      .string({ required_error: "Employee ID is required" })
      .min(1, "Employee ID cannot be empty"),

    attendance_id: z
      .string({ required_error: "Attendance ID is required" })
      .min(1, "Attendance ID cannot be empty"),

    date: z
      .string({ required_error: "Date is required" })
      .refine(
        (val) => /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Date must be in YYYY-MM-DD format"
      ),

    start_time: z
      .string({ required_error: "Start time is required" })
      .refine(
        (val) => /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(val),
        "Start time must be in HH:MM or HH:MM:SS format"
      ),

    end_time: z
      .string({ required_error: "End time is required" })
      .refine(
        (val) => /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(val),
        "End time must be in HH:MM or HH:MM:SS format"
      ),

    reason: z
      .string({ required_error: "Reason is required" })
      .min(3, "Reason must be at least 3 characters long"),

    status: z
      .enum(["approve", "denied", "pending"])
      .optional()
      .default("pending"),
  }),
});

export const updateAddonduttySchema = z.object({
  body: z.object({
    emp_id: z.string().optional(),
    attendance_id: z.string().optional(),
    date: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^\d{4}-\d{2}-\d{2}$/.test(val),
        "Invalid date format"
      ),
    start_time: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(val),
        "Invalid start time format"
      ),
    end_time: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/.test(val),
        "Invalid end time format"
      ),
    reason: z.string().optional(),
    status: z.enum(["approve", "denied", "pending"]).optional(),
  }),
});
