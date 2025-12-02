import { Router } from "express";
import departmentController from "../controller/department.controllers.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import { validate } from "../../../middleware/validate.js";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  idSchema,
} from "../dto/department.zod.js";

const router = Router();

// CREATE
router.post(
  "/createDepartment",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  validate(createDepartmentSchema),
  departmentController.createDepartment
);

// GET ALL
router.get(
  "/getAllDepartments",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  departmentController.getAllDepartments
);

// GET BY ID
router.get(
  "/getDepartmentById/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  validate(idSchema, "params"),
  departmentController.getDepartmentById
);

// UPDATE
router.put(
  "/updateDepartment/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  validate(updateDepartmentSchema),
  departmentController.updateDepartment
);

// DELETE
router.delete(
  "/deleteDepartment/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  departmentController.deleteDepartment
);

// RESTORE (soft-deleted)
router.put(
  "/restoreDepartment/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  departmentController.restoreDepartment
);

export default router;
