import { Router } from "express";
import roleController from "../controller/role.controller.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import { validate } from "../../../middleware/validate.js";
import {
  createRoleSchema,
  updateRoleSchema,
  idSchema,
} from "../dto/role.zod.js";
import { upload } from "../../../middleware/upload.js";


const router = Router();

// ✅ Create Role
router.post(
  "/createRole",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(createRoleSchema),
  roleController.createRole
);

// ✅ Get All Roles
router.get(
  "/getAllRoles",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  roleController.getAllRoles
);

// ✅ Get Role by ID
router.get(
  "/getRoleById/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  validate(idSchema, "params"),
  roleController.getRoleById
);

// ✅ Update Role
router.put(
  "/updateRole/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(updateRoleSchema),
  roleController.updateRole
);

// ✅ Delete Role
router.delete(
  "/deleteRole/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  roleController.deleteRole
);

// ✅ Restore Role
// router.put(
//   "/restoreRole/:id",
//   verifyToken,
//   authorizeRole(["admin", "superadmin"]),
//   validate(idSchema, "params"),
//   roleController.restoreRole
// );

router.get(
  "/getRolebyDepId/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  roleController.getDeptByRoleId
);



export default router;
