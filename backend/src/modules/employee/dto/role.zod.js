import { z } from "zod";

// ✅ Create Role Schema
export const createRoleSchema = z.object({
  body: z.object({
  role_name: z.string().min(3, "Role name must be at least 3 characters"),
  role_description: z.string().min(5, "Description must be at least 5 characters"),
  is_active: z.boolean().optional().default(true),
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
}),
});
// ✅ Update Role Schema (all fields optional)
export const updateRoleSchema = z.object({
  body: z.object({
  role_name: z.string().min(3).optional(),
  role_description: z.string().min(5).optional(),
  is_active: z.boolean().optional(),
  created_by: z.string().optional(),
  updated_by: z.string().optional(),
}),
});

// ✅ Validate Role ID (UUID)
export const idSchema = z.object({
  params: z.object({
  id: z.string().uuid("Invalid ID format"),
}),
});

