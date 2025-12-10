// src/modules/employee/routes/employee.routes.js
import { Router } from "express";
import employeeController from "../controller/employee.controllers.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
import { validate } from "../../../middleware/validate.js";
import { upload  , uploadEmployeeDoc} from "../../../middleware/upload.js";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  idSchema,
} from "../dto/employee.zod.js";

const router = Router();

router.get(
  "/getEmpCodeByName",
  verifyToken,
  authorizeRole(["admin", "superadmin", "users"]),
  employeeController.getEmpCodeByName
);

router.get(
  "/getEmployees",
  verifyToken,
  authorizeRole(["admin", "superadmin", "users"]),
  employeeController.getEmployees
);

// CREATE
router.post(
  "/createEmployee",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  upload.single("profile_picture"),
  validate(createEmployeeSchema),
  employeeController.createEmployee
);

// GET ALL
router.get(
  "/getAllEmployees",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  employeeController.getAllEmployees
);

// GET BY ID
router.get(
  "/getEmployeeById/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr", "manager"]),
  validate(idSchema, "params"),
  employeeController.getEmployeeById
);

// UPDATE
router.put(
  "/updateEmployee/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin", "hr"]),
  upload.single("profile_picture"),
  validate(updateEmployeeSchema),
  employeeController.updateEmployee
);

// DELETE
router.delete(
  "/deleteEmployee/:id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  validate(idSchema, "params"),
  employeeController.deleteEmployee
);

// router.put(
//   "/restore/:id",
//   verifyToken,
//   authorizeRole(["admin", "superadmin"]),
//   validate(idSchema, "params"),
//   employeeController.restoreEmployee
// );


// router.post(
//   "/addEmployeeFullInfo",
//   verifyToken,
//   authorizeRole(["admin", "superadmin"]),
//   // validate(idSchema, "params"),
//   employeeController.addEmployeeFullInfo
// );

router.post(
  "/addEmployeeFullInfo",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  uploadEmployeeDoc.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "relieving", maxCount: 1 },
    { name: "experience", maxCount: 1 },
    { name: "offer", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "driving", maxCount: 1 },
    { name: "addressproof", maxCount: 1 },
    { name: "bankproof", maxCount: 1 },
  ]),
  employeeController.addEmployeeFullInfo
);

// router.put(
//   "/updateEmployeeInfo/:id",
//   verifyToken,
//   authorizeRole(["admin", "superadmin", "hr"]),
//   upload.fields([
//     { name: "aadhar", maxCount: 1 },
//     { name: "pan", maxCount: 1 },
//     { name: "resume", maxCount: 1 },
//     { name: "degree", maxCount: 1 },
//     { name: "marksheet", maxCount: 1 },
//     { name: "relieving", maxCount: 1 },
//     { name: "experience", maxCount: 1 },
//     { name: "offer", maxCount: 1 },
//     { name: "passport", maxCount: 1 },
//     { name: "driving", maxCount: 1 },
//     { name: "addressproof", maxCount: 1 },
//     { name: "bankproof", maxCount: 1 },
//   ]),
//   validate(idSchema, "params"),
//   employeeController.updateEmployeeFullInfo
// );

// 🟢 PUT - Update Employee Full Info
router.put(
  "/updateEmployeeFullInfo/:employee_id",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  uploadEmployeeDoc.fields([
    { name: "aadhar", maxCount: 1 },
    { name: "pan", maxCount: 1 },
    { name: "resume", maxCount: 1 },
    { name: "degree", maxCount: 1 },
    { name: "marksheet", maxCount: 1 },
    { name: "relieving", maxCount: 1 },
    { name: "experience", maxCount: 1 },
    { name: "offer", maxCount: 1 },
    { name: "passport", maxCount: 1 },
    { name: "driving", maxCount: 1 },
    { name: "addressproof", maxCount: 1 },
    { name: "bankproof", maxCount: 1 },
  ]),
  employeeController.updateEmployeeFullInfo
);


router.get("/getEmployeeDetById/:emp_id", verifyToken,
  authorizeRole(["admin", "superadmin"]),
   employeeController.getEmployeeDetById);

router.get(
  "/getRegisteredEmployees",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  employeeController.getRegisteredEmployees
);
router.get(
  "/getUnregisteredEmployees",
  verifyToken,
  authorizeRole(["admin", "superadmin"]),
  employeeController.getUnregisteredEmployees
);


export default router;
