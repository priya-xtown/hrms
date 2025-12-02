// src/modules/employee/dto/employee.zod.js
import { z } from "zod";

export const createEmployeeSchema = z.object({
  body: z.object({
    emp_id: z.string().min(1, "Employee ID is required"),
    attendance_id: z.number().min(1, "Attendance ID is required"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    date_of_joining: z.string().min(1, "Date of joining is required"),
    reporting_manager: z.string().min(1, "Reporting Manager is required"),
    employee_type: z.enum(["Permanent", "Contract", "Intern", "Other"]),
    status: z
      .enum(["Active", "Inactive", "On Leave", "Terminated"])
      .default("Active"),
    shift_type: z.string().min(1, "Shift Type is required"),
  }),
});

export const updateEmployeeSchema = z.object({
  body: z.object({
    attendance_id: z.string().optional(),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    date_of_joining: z.string().optional(),
    reporting_manager: z.string().optional(),
    employee_type: z
      .enum(["Permanent", "Contract", "Intern", "Other"])
      .optional(),
    status: z
      .enum(["Active", "Inactive", "On Leave", "Terminated"])
      .optional(),
    shift_type: z.string().optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid employee ID"),
  }),
});
