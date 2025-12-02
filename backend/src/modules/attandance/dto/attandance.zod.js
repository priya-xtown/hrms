// ✅ src/modules/attendance/dto/attendance.zod.js
import { z } from "zod";
import Employee from "../../employee/models/employee.model.js";

export const createAttendanceSchema = z
  .object({
    emp_id: z.string().min(1, "Employee ID is required"),
    date: z
      .string({
        required_error: "Date is required",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format (expected YYYY-MM-DD)",
      }),
    status: z.enum(["Present", "Absent", "Leave", "Half-Day"], {
      errorMap: () => ({ message: "Invalid status value" }),
    }),
    remarks: z.string().optional(),
  })
  export const getattendanceSchema = z.object({
    emp_id: z.string().min(1, "Employee ID is required"),
    date: z
      .string({
        required_error: "Date is required",
      })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format (expected YYYY-MM-DD)",
      }),
  });

  
  
  

export const getAttendanceByIdSchema = z.object({
  id: z.string().uuid("Invalid attendance ID format"),
});
