import { z } from "zod";

export const createDepartmentSchema = z.object({
  body: z.object({
    department_name: z.string().min(1, "Department name is required")
  }),
});

export const updateDepartmentSchema = z.object({
  body: z.object({
    department_name: z.string().optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({
    id: z.uuid("Invalid department ID"),
  }),
});
