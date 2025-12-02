// routes/annualpayroll.routes.js
import { Router } from "express";
import {
  createAnnualPayroll,
  getAllAnnualPayrolls,
  getAnnualPayrollById,
  updateAnnualPayroll,
  deleteAnnualPayroll,
} from "../controller/annualpayroll.controller.js";

import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import {
  createAnnualPayrollSchema,
  updateAnnualPayrollSchema,
  idschema,
} from "../dto/annualpayroll.zod.js"; // kept import in case you use elsewhere

const router = Router();

// Create Annual Payroll
router.post(
  "/annualpayroll/create",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  createAnnualPayroll
);

// Get All Annual Payrolls
router.get(
  "/annualpayroll/all",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  getAllAnnualPayrolls
);

// Get Annual Payroll by ID
router.get(
  "/annualpayroll/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  getAnnualPayrollById
);

// Update Annual Payroll
router.put(
  "/annualpayroll/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  updateAnnualPayroll
);

// Delete Annual Payroll
router.delete(
  "/annualpayroll/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  deleteAnnualPayroll
);

export default router;

