// src/modules/addondutty/routes/addondutty.route.js
import express from "express";
import { verifyToken } from "../../../middleware/auth.js";
import { authorizeRole } from "../../../middleware/authenticateRole.js";
import { validate } from "../../../middleware/validate.js";
import { createAddonduttySchema } from "../dto/ondutty.zod.js";
import { createAddondutty, getAllAddondutty } from "../controllers/addondutty.controllers.js";

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

export default router;
