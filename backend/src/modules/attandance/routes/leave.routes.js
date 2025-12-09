import express from "express";

import { verifyToken } from "../../../middleware/auth.js";
import { authorizeRole } from "../../../middleware/authenticateRole.js";
import { validate } from "../../../middleware/validate.js";

import { createLeaveSchema, updateLeaveStatusSchema } from "../dto/leave.zod.js";      
import { createLeave, deleteLeave, getAllLeaves, getLeaveById, updateLeave, updateLeaveStatus } from "../controllers/leave.controllers.js";

const router = express.Router();

router.post(
  "/createLeave",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  validate(createLeaveSchema),
  createLeave
);
router.get("/getAllLeaves",verifyToken, authorizeRole(["admin", "superadmin", "user"]), getAllLeaves);
;
router.get("/getleave/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]), getLeaveById);
router.delete("/deleteLeave/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]),deleteLeave);
router.put("/updateLeave/:id",verifyToken,authorizeRole(["admin","superadmin","user"]),validate(createLeaveSchema),updateLeave);
router.patch("/updateLeavestatus/:id",verifyToken,authorizeRole(["admin", "superadmin","user"]),validate(updateLeaveStatusSchema),updateLeaveStatus);

export default router;
