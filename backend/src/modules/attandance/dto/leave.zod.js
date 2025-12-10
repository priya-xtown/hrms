import { z } from "zod";

// ✅ 1️⃣ Create Leave Schema
export const createLeaveSchema = z.object({
//   emp_id: z.string().min(1, "Employee ID is required"),
//   leave_type: z.enum(["Casual", "Sick", "Permission", "Other"], {
//     required_error: "Leave type is required",
//   }),
//   from_date: z
//     .string()
//     .refine((val) => !isNaN(Date.parse(val)), "Invalid from date"),
//   to_date: z
//     .string()
//     .refine((val) => !isNaN(Date.parse(val)), "Invalid to date"),
//   from_time: z
//     .string()
//     .optional()
//     .nullable()
//     .refine(
//       (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
//       "Invalid time format (use HH:mm)"
//     ),
//   to_time: z
//     .string()
//     .optional()
//     .nullable()
//     .refine(
//       (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
//       "Invalid time format (use HH:mm)"
//     ),
//   reason: z.string().optional().nullable(),



// });



  emp_id: z.string(),
  leave_type: z.enum(["Casual", "Sick", "Permission", "Other"]),
  from_date: z.string(),
  to_date: z.string(),
  from_time: z.string().nullable().optional(),
  to_time: z.string().nullable().optional(),
  reason: z.string().optional(),

  // 🔥 THIS WAS MISSING
  status: z.enum(["Pending", "Approved", "Denied"]).optional(),
});

// ✅ 2️⃣ Update Leave Schema
export const updateLeaveSchema = z.object({
  leave_type: z.enum(["Casual", "Sick", "Permission", "Other"]).optional(),
  from_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid from date"),
  to_date: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), "Invalid to date"),
  from_time: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
      "Invalid time format (use HH:mm)"
    ),
  to_time: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || /^([01]\d|2[0-3]):([0-5]\d)$/.test(val),
      "Invalid time format (use HH:mm)"
    ),
  reason: z.string().optional().nullable(),
  status: z.enum(["Pending", "Approved", "Denied"]).optional(),
  remarks: z.string().optional().nullable(),
});

// ✅ 3️⃣ Update Leave Status (Approve/Deny)
export const updateLeaveStatusSchema = z.object({
  status: z.enum(["Approved", "Denied", "Pending"], {
    required_error: "Status is required",
  }),
  remarks: z.string().optional().nullable(),
});

// ✅ 4️⃣ Get All Leaves (Filters + Pagination)
export const getAllLeaveQuerySchema = z.object({
  status: z.enum(["Pending", "Approved", "Denied"]).optional(),
  leave_type: z.enum(["Casual", "Sick", "Permission", "Other"]).optional(),
  emp_id: z.string().optional(),
  search: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be a positive number"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val > 0 && val <= 100, "Limit must be between 1 and 100"),
});

// ✅ 5️⃣ Delete Leave Schema (by ID)
export const deleteLeaveSchema = z.object({
  id: z.string().uuid("Invalid Leave ID format"),
});
