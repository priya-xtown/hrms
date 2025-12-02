import { z } from "zod";

// ✅ Create Division Schema
export const createDivisionSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Division name is required" })
      .min(1, "Division name cannot be empty"),

    phone: z
      .string({ required_error: "Phone number is required" })
      .min(5, "Phone number must be at least 5 characters"),

    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email format"),

    is_active: z
      .boolean({ invalid_type_error: "is_active must be a boolean" })
      .default(true),

    created_by: z
      .string({ required_error: "created_by (user id) is required" })
      .uuid("created_by must be a valid UUID"),
  }),
});

// ✅ Update Division Schema
export const updateDivisionSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email format").optional(),
    is_active: z.boolean().optional(),
    updated_by: z.string().uuid("updated_by must be a valid UUID").optional(),
  }),
});

// ✅ ID Validation (for params)
export const idSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid division ID"),
  }),
});
