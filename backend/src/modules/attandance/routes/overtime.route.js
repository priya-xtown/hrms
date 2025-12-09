// src/modules/attandance/routes/overtime.route.js
import express from "express";
import { validate } from "../../../middleware/validate.js";
import { overtimeSchema, statusUpdateSchema } from "../dto/overtime.zod.js";
import {
  createOvertime,
  // getAllOvertime,
  // updateOvertimeStatus,
} from "../controllers/overtime.controllers.js";
import { verifyToken } from "../../../middleware/auth.js";
import { authorizeRole } from "../../../middleware/authenticateRole.js";

const router = express.Router();

// ✅ Create new overtime record
router.post("/createOvertime",verifyToken,authorizeRole(["admin", "superadmin", "user"]), validate(overtimeSchema),  createOvertime);

// ✅ Get all overtime records
// router.get("/getAllOvertime",verifyToken,authorizeRole(["admin", "superadmin", "user"]), getAllOvertime);

// ✅ Update overtime status (Approved / Rejected)
// router.patch("/updateOvertime/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]), validate(statusUpdateSchema), updateOvertimeStatus);

export default router;



