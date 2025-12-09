// src/modules/addondutty/routes/addondutty.route.js
import express from "express";
import { verifyToken } from "../../../middleware/auth.js";
import { authorizeRole } from "../../../middleware/authenticateRole.js";
import { validate } from "../../../middleware/validate.js";
import { createAddonduttySchema, updateAddonduttySchema } from "../dto/ondutty.zod.js";
import { createAddondutty, deleteAddondutty, getAddonduttyById, getAllAddondutty, updateAddondutty } from "../controllers/addondutty.controllers.js";

const router = express.Router();

// ✅ Route name changed to match your Postman URL
router.post(
  "/createAddondutty",
  verifyToken,
  authorizeRole(["admin", "superadmin", "user"]),
  validate(createAddonduttySchema),
  createAddondutty
);
router.get("/getAllAddondutty",verifyToken,authorizeRole(["admin", "superadmin", "user"]),getAllAddondutty)
router.get("/getAddonduttyById/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]),getAddonduttyById)
router.put("/updateAddondutty/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]),updateAddondutty)
router.delete("/deleteAddondutty/:id",verifyToken,authorizeRole(["admin", "superadmin", "user"]),deleteAddondutty)

export default router;
