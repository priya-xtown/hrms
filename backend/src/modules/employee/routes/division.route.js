import { Router } from "express";
import divisionController from "../controller/division.controllers.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import { validate } from "../../../middleware/validate.js";
import {
  createDivisionSchema,
  updateDivisionSchema,
  idSchema,
} from "../dto/division.zod.js";

const router = Router();

// CREATE
router.post(
  "/createDivision",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  validate(createDivisionSchema),
  divisionController.createDivision
);

// GET ALL
router.get(
  "/getAllDivisions",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  divisionController.getAllDivisions
);

// GET BY ID
router.get(
  "/getDivisionById/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  validate(idSchema, "params"),
  divisionController.getDivisionById
);

// UPDATE
router.put(
  "/updateDivision/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  validate(updateDivisionSchema),
  divisionController.updateDivision
);

// DELETE
router.delete(
  "/deleteDivision/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  divisionController.deleteDivision
);

export default router;
