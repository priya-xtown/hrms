// 
import { z } from "zod";

// ✅ Create Asset Schema
export const createCompanyAssetSchema = z.object({
  body: z.object({
    asset_name: z
      .string()
      .min(3, "Asset name must be at least 3 characters"),

    model_type: z
      .string()
      .min(1, "Model type must be at least 1 character")
      .optional(),

    condition: z.enum(["new", "good", "under_maintenance"], {
      required_error: "Condition is required",
    }),

    status: z.enum(["active", "inactive"]).default("active"),

    is_active: z.boolean().optional().default(true),

    created_by: z.string().optional(),
    updated_by: z.string().optional(),
  }),
});

// ✅ Update Asset Schema (all fields optional)
export const updateCompanyAssetSchema = z.object({
  body: z.object({
    asset_name: z.string().min(3).optional(),
    model_type: z.string().min(1).optional(),
    condition: z.enum(["new", "good", "under_maintenance"]).optional(),
    status: z.enum(["active", "inactive"]).optional(),
    is_active: z.boolean().optional(),
    created_by: z.string().optional(),
    updated_by: z.string().optional(),
  }),
});

// ✅ Validate Asset ID (UUID)
export const idSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid ID format"),
  }),
});
