// shift.zod.js
// 
import { z } from "zod";

// Time regex HH:mm:ss
const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

// ✅ Create Shift Schema
export const createShiftSchema = z.object({
  body: z.object({
    shift_name: z.string().min(3, "Shift name must be at least 3 characters"),
    shift_type: z.string().optional(),
    start_time: z.string().regex(timeRegex, "Invalid start time (HH:mm:ss)"),
    end_time: z.string().regex(timeRegex, "Invalid end time (HH:mm:ss)"),
    break_start_time: z.string().regex(timeRegex, "Invalid break start time (HH:mm:ss)").optional().nullable(),
    break_end_time: z.string().regex(timeRegex, "Invalid break end time (HH:mm:ss)").optional().nullable(),
    total_hours: z
      .number()
      .min(0, "Working hours must be >= 0")
      .max(24, "Working hours must be <= 24")
      .optional()
      .nullable(),
    min_in_time: z.string().regex(timeRegex, "Invalid minimum in time (HH:mm:ss)"),
    max_out_time: z.string().regex(timeRegex, "Invalid maximum out time (HH:mm:ss)"),
    is_night_shift: z.boolean().optional().default(false),
    status: z.enum(['active', 'inactive']).optional().default('active'),
    created_by: z.string().optional(),
    updated_by: z.string().optional(),
  }),
});

// ✅ Update Shift Schema (all fields optional)
export const updateShiftSchema = z.object({
  body: z.object({
    shift_name: z.string().min(3).optional(),
    shift_type: z.string().optional(),
    start_time: z.string().regex(timeRegex).optional(),
    end_time: z.string().regex(timeRegex).optional(),
    break_start_time: z.string().regex(timeRegex).optional().nullable(),
    break_end_time: z.string().regex(timeRegex).optional().nullable(),
    total_hours: z.number().min(0).max(24).optional().nullable(),
    min_in_time: z.string().regex(timeRegex).optional(),
    max_out_time: z.string().regex(timeRegex).optional(),
    is_night_shift: z.boolean().optional(),
    status: z.enum(['active', 'inactive']).optional(),
    created_by: z.string().optional(),
    updated_by: z.string().optional(),
  }),
});

// ✅ Validate Shift ID
export const idScheme = z.object({
  id: z.string().uuid("Invalid ID format"),
});

export const idSchema = z.object({
  params: idScheme,
});

// ✅ Delete Shift Schema
export const deleteShiftSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid ID format"),
  }),
});
