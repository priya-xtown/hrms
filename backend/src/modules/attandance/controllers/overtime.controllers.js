// src/modules/attandance/controllers/overtime.controllers.js
import Overtime from "../models/overtime.models.js";
import Employee from "../../employee/models/employee.model.js";
import Attendance from "../models/attandance.models.js";
import { Op } from "sequelize";

// 🧮 Helper function: calculate overtime hours
function calculateOtHours(start, end) {
  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startMins = sh * 60 + sm;
  const endMins = eh * 60 + em;
  const diffMins = endMins - startMins;

  return diffMins > 0 ? diffMins / 60 : 0;
}

// ✅ POST /hrms_api/v1/overtime/createOvertime
export const createOvertime = async (req, res) => {
  try {
    const {
      emp_id,
      emp_name,
      date,
      start_time,
      end_time,
      remarks,
      status,
    } = req.body;

    // 🔹 1. Check employee exists
    const employee = await Employee.findOne({ where: { emp_id } });
    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    // 🔹 2. Check attendance record for employee on given date
    const attendance = await Attendance.findOne({
      where: { emp_id, date },
    });

    if (!attendance) {
      return res.status(400).json({
        status: "error",
        message: "Attendance not found for this employee on the selected date",
      });
    }

    // 🔹 3. Calculate OT hours
    const ot_hours = calculateOtHours(start_time, end_time);
    if (ot_hours <= 0) {
      return res.status(400).json({
        status: "error",
        message: "End time must be after start time",
      });
    }

    // 🔹 4. Prevent duplicate overtime for same date
    const existing = await Overtime.findOne({
      where: { emp_id, date },
    });

    let overtime;
    if (existing) {
      overtime = await existing.update({
        start_time,
        end_time,
        ot_hours,
        remarks,
        status: status || existing.status,
      });
      return res.status(200).json({
        status: "success",
        message: "Overtime record updated successfully",
        data: overtime,
      });
    }

    // 🔹 5. Create new overtime record
    overtime = await Overtime.create({
      attendance_id: attendance.id,
      emp_id,
      emp_name,
      date,
      start_time,
      end_time,
      ot_hours,
      remarks,
      status: status || "Pending",
    });

    return res.status(201).json({
      status: "success",
      message: "Overtime record created successfully",
      data: overtime,
    });
  } catch (error) {
    console.error("Overtime Create Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create overtime record",
      error: error.message,
    });
  }
};

// ✅ GET /hrms_api/v1/overtime/getAllOvertime
export const getAllOvertime = async (req, res) => {
  try {
    const records = await Overtime.findAll({});

    return res.status(200).json({
      status: "success",
      message: "Fetched all overtime records successfully",
      data: records,
    });
  } catch (error) {
    console.error("GetAllOvertime Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to fetch overtime records",
      error: error.message,
    });
  }
};

// ✅ PATCH /hrms_api/v1/overtime/updateOvertime/:id
export const updateOvertimeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const overtime = await Overtime.findByPk(id);
    if (!overtime) {
      return res.status(404).json({
        status: "error",
        message: "Overtime record not found",
      });
    }

    await overtime.update({ status });

    return res.status(200).json({
      status: "success",
      message: `Overtime status updated to ${status}`,
      data: overtime,
    });
  } catch (error) {
    console.error("UpdateOvertimeStatus Error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update overtime status",
      error: error.message,
    });
  }
};
