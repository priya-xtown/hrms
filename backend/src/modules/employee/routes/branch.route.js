import { Router } from "express";
import branchController from "../controller/branch.controllers.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import { validate } from "../../../middleware/validate.js";
import {
  createBranchSchema,
  updateBranchSchema,
  idSchema,
} from "../dto/branch.zod.js";

const router = Router();

router.post(
  "/createBranch",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  validate(createBranchSchema),
  branchController.createBranch
);

router.get(
  "/getAllBranches",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  branchController.getAllBranches
);

router.get(
  "/getBranchById/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  validate(idSchema, "params"),
  branchController.getBranchById
);

router.put(
  "/updateBranch/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  validate(updateBranchSchema),
  branchController.updateBranch
);

router.delete(
  "/deleteBranch/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  branchController.deleteBranch
);

router.put(
  "/restoreBranch/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  branchController.restoreBranch
);

export default router;
