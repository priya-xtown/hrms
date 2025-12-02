import { z } from "zod";

export const overtimeSchema = z.object({
  emp_id: z.string().min(1, "Employee ID is required"),
  emp_name: z.string().min(1, "Employee name is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  start_time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid start time (HH:MM)"),
  end_time: z
    .string()
    .regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, "Invalid end time (HH:MM)"),
  remarks: z.string().optional(),
  status: z.enum(["Pending", "Approved", "Rejected"]).optional(),
});

export const statusUpdateSchema = z.object({
  status: z.enum(["Pending", "Approved", "Rejected"]),
});
