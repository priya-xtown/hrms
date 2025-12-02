import { z } from "zod";

export const createBranchSchema = z.object({
  body: z.object({
    branch_name: z.string().min(1, "Branch name is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address"),
    description: z.string().optional(),
    address_line1: z.string().min(1, "Address Line 1 is required"),
    address_line2: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    pincode: z.string().min(1, "Pincode is required"),
  }),
});

export const updateBranchSchema = z.object({
  body: z.object({
    branch_name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email("Invalid email").optional(),
    description: z.string().optional(),
    address_line1: z.string().optional(),
    address_line2: z.string().optional(),
    country: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    pincode: z.string().optional(),
    status: z.enum(["Active", "Inactive"]).optional(),
  }),
});

export const idSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid branch ID"),
  }),
});
