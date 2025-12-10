// src/modules/attandance/routes/overtime.route.js
import express from "express";
import { validate } from "../../../middleware/validate.js";
import { overtimeSchema, statusUpdateSchema } from "../dto/overtime.zod.js";
import {
  createOvertime,
  deleteOvertime,
  getAllOvertime,
  getOvertimeById,
  updateOvertime,

  // updateOvertimeStatus,
} from "../controllers/overtime.controllers.js";
import { verifyToken } from "../../../middleware/auth.js";
import { authorizeRole } from "../../../middleware/authenticateRole.js";

const router = express.Router();

// ✅ Create new overtime record
router.post("/createOvertime",verifyToken,authorizeRole(["admin", "superadmin", "user"]), validate(overtimeSchema),  createOvertime);

// ✅ Get all overtime records
router.get("/getAllOvertime",verifyToken,authorizeRole(["admin", "superadmin", "user"]), getAllOvertime);

//  getbyid
router.get("/getOvertimeById/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]),getOvertimeById);
router.put("/updateOvertime/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]),updateOvertime);
router.delete("/deleteOvertime/:id",verifyToken,authorizeRole (["admin", "superadmin", "user"]),deleteOvertime);

export default router;



