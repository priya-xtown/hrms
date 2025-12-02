import { Router } from "express";
import payrollSlipController from "../controller/payrollslip.controller.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";

const router = Router();

// Get All Payroll Slips
router.get(
  "/payrollslip/all",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  payrollSlipController.getAllPayrollSlips
);

// Download single payroll slip as PDF
router.get(
  "/payrollslip/:id/download",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  payrollSlipController.downloadPayrollSlip
);

export default router;
