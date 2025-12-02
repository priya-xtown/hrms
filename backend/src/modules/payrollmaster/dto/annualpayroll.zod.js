// src/modules/payrollmaster/dto/annualpayroll.zod.js
import { z } from "zod";

/**
 * Helper to accept numbers or numeric strings (with commas) and convert to Number.
 * Ensures finite, non-negative values.
 */
const parseDecimal = z
  .union([z.number(), z.string()])
  .transform((val) => {
    if (typeof val === "number") return val;
    const cleaned = String(val).replace(/,/g, "").trim();
    const n = Number(cleaned);
    return n;
  })
  .refine((n) => Number.isFinite(n), { message: "Must be a valid number" })
  .refine((n) => n >= 0, { message: "Must be a non-negative number" });

/**
 * Create schema (POST)
 */
export const createAnnualPayrollSchema = z.object({
  body: z.object({
    // optional if you rely on DB-generated UUID, but validate if provided
    annual_payroll_id: z.string().uuid().optional(),

    employee_id: z.string().uuid({ message: "employee_id must be a valid UUID" }),

    employee_name: z
      .string({ required_error: "employee_name is required" })
      .min(1, "employee_name cannot be empty"),

    department_name: z
      .string({ required_error: "department_name is required" })
      .min(1, "department_name cannot be empty"),

    branch_name: z
      .string({ required_error: "branch_name is required" })
      .min(1, "branch_name cannot be empty"),

    total_annual_salary: parseDecimal,

    increment: z.enum(["percentage", "digit"], {
      errorMap: () => ({ message: "increment must be 'percentage' or 'digit'" }),
    }),

    // stored as DB column "esi & pf" but in JS we use esi_pf
    esi_pf: z.enum(["yes", "no"], {
      errorMap: () => ({ message: "esi_pf must be 'yes' or 'no'" }),
    }),

    is_active: z.boolean().optional().default(true),

    created_by: z.string().uuid({ message: "created_by must be a valid UUID" }),

    updated_by: z.string().uuid().optional(),
  }),
});

/**
 * Update schema (PATCH/PUT) - all fields optional but validated when present.
 * At least one field must be present.
 */
export const updateAnnualPayrollSchema = z.object({
  body: z
    .object({
      // not usually required (id comes from params) but validated if present
      annual_payroll_id: z.string().uuid().optional(),

      employee_id: z.string().uuid().optional(),

      employee_name: z.string().min(1).optional(),

      department_name: z.string().min(1).optional(),

      branch_name: z.string().min(1).optional(),

      total_annual_salary: parseDecimal.optional(),

      increment: z.enum(["percentage", "digit"]).optional(),

      esi_pf: z.enum(["yes", "no"]).optional(),

      is_active: z.boolean().optional(),

      created_by: z.string().uuid().optional(),

      updated_by: z.string().uuid().optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, {
      message: "At least one field must be provided to update",
    }),
});

/**
 * IDschema for validating route params (/:id)
 */
export const idschema = z.object({
  params: z.object({
    id: z.string().uuid({ message: "Invalid ID format" }),
  }),
});

/**
 * Optional: export TypeScript types if you ever move to TS:
 * export type CreateAnnualPayroll = z.infer<typeof createAnnualPayrollSchema>;
 */

export default {
  createAnnualPayrollSchema,
  updateAnnualPayrollSchema,
  idschema,
};
