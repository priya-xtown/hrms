import { Router } from "express";
import shiftController from "../controller/shift.controller.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import { validate } from "../../../middleware/validate.js";
import {
  createShiftSchema,
  updateShiftSchema,
  idSchema,
} from "../dto/shift.zod.js";

const router = Router();

// 🔓 Public Routes
router.post(
  "/shift/create",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  validate(createShiftSchema),
  shiftController.createShift
);

router.get(
  "/shift/all",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  shiftController.getAllShifts
);

// 🔒 Protected Routes
router.get(
  "/shift/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  validate(idSchema, "params"),
  shiftController.getShiftById
);

router.put(
  "/updateshift/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate(updateShiftSchema),
  shiftController.updateShift
);

router.delete(
  "/shift/:id",
  verifyToken,
  authorizeRole(["admin"]),
  validate(idSchema, "params"),
  shiftController.deleteShift
);

export default router;

