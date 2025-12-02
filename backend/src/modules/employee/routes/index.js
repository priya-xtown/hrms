// src/modules/index.js
import express from "express";
import employeeRoutes from "./employee.route.js";
import departmentRoute from "./department.route.js";
import divisionRoute from "./division.route.js";
import branchRoute from "./branch.route.js";
import roleRoute from "./role.routes.js";

const router = express.Router();

router.use("/employee", employeeRoutes);
router.use("/department", departmentRoute);
router.use("/division", divisionRoute);
router.use("/branch", branchRoute);
router.use("/role", roleRoute);

export default router;
