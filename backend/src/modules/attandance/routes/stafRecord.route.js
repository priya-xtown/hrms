import express from "express";
import { getMonthlyAttendance } from "../controllers/stafRecord.controller.js";

const router = express.Router();

// GET API: /api/getAttendanceReport?year=2025&month=10
router.get("/getAttendanceReport", getMonthlyAttendance);

// ✅ GET attendance report by month & year
// Example: GET /api/attendance/getAttendanceSummary?year=2025&month=10
//router.get("/getAttendanceSummary", getAttendanceSummary);

export default router;
