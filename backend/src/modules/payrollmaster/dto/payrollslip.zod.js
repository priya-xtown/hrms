import { z } from "zod";

// Common numeric field (two decimal precision)
const decimalField = z
  .union([z.number(), z.string()])
  .refine(
    (val) => !isNaN(Number(val)),
    { message: "Must be a valid number" }
  )
  .transform((val) => Number(val));

export const createPayrollSlipSchema = {
  body: z.object({
    employee_id: z
      .string({ required_error: "Employee ID is required" })
      .uuid("Invalid UUID format for employee_id"),

    employee_name: z
      .string({ required_error: "Employee name is required" })
      .min(2, "Employee name must have at least 2 characters"),

    basic_salary: decimalField,
    allowances: decimalField,
    deductions: decimalField,
    bonus: decimalField.optional(),
    net_salary: decimalField,

    actions: z
      .array(
        z.object({
          action: z.string(),
          timestamp: z.string().optional(),
          performed_by: z.string().optional(),
        })
      )
      .optional(),
  }),
};

// For updating an existing payroll slip (partial allowed)
export const updatePayrollSlipSchema = {
  body: z
    .object({
      employee_id: z.string().uuid().optional(),
      employee_name: z.string().min(2).optional(),
      basic_salary: decimalField.optional(),
      allowances: decimalField.optional(),
      deductions: decimalField.optional(),
      bonus: decimalField.optional(),
      net_salary: decimalField.optional(),
      actions: z
        .array(
          z.object({
            action: z.string(),
            timestamp: z.string().optional(),
            performed_by: z.string().optional(),
          })
        )
        .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided to update",
    }),
};

// Optional: for param ID validation in routes
export const payrollSlipIdSchema = {
  params: z.object({
    id: z.string().uuid("Invalid payroll slip ID format"),
  }),
};
