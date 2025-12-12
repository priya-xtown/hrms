// import Attendance from "../models/attandance.models.js";
// import Employee from "../../employee/models/employee.model.js";
// import { createAttendanceSchema } from "../dto/attandance.zod.js";

// export const createAttendance = async (req, res) => {
//  try {
//     // Validate input
//     const validatedData = await createAttendanceSchema.parseAsync(req.body);

//     // Check if employee exists
//     const employee = await Employee.findOne({
//       where: { emp_id: validatedData.emp_id },
//     });

//     if (!employee) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     // Insert attendance
//     const attendance = await Attendance.create({
//       emp_id: validatedData.emp_id,
//       emp_name: `${employee.first_name} ${employee.last_name || ""}`.trim(),
//       date: validatedData.date,
//       time_in: validatedData.time_in || null,
//       time_out: validatedData.time_out || null,
//       status: validatedData.status || "Present",
//       remarks: validatedData.remarks || "",
//     });

//     res.status(201).json({
//       message: "Attendance recorded successfully",
//       data: attendance,
//     });
//   } catch (error) {
//     console.error("❌ Failed to create attendance:", error);
//     res.status(400).json({
//       message: "Failed to add attendance",
//       error: error.message,
//     });
//   }
// };

// export const getAllAttendance = async (req, res) => {
//  try {
//     const attendances = await Attendance.findAll({
//       include: [
//         {
//           model: Employee,
//           attributes: ["emp_id", "first_name", "last_name"], 
//         },
//       ],
//       order: [["date", "DESC"]],
//     });
//     return res.status(200).json(attendances);
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to fetch attendance",
//       error: error.message,
//     });
//   }
// };




import Attendance from "../models/attandance.models.js";
import Employee from "../../employee/models/employee.model.js";
import AttendanceService from "../../../services/service.js";
import { createAttendanceSchema } from "../dto/attandance.zod.js";
import { Op } from "sequelize";


// ===========================
// CREATE ATTENDANCE
// ===========================
export const createAttendance = async (req, res) => {
 try {
    const validatedData = await createAttendanceSchema.parseAsync(req.body);

    // Check if employee exists
    const employee = await Employee.findOne({
      where: { emp_id: validatedData.emp_id },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const data = {
      emp_id: validatedData.emp_id,
      emp_name: `${employee.first_name} ${employee.last_name || ""}`.trim(),
      date: validatedData.date,
      time_in: validatedData.time_in || null,
      time_out: validatedData.time_out || null,
      status: validatedData.status || "Present",
      remarks: validatedData.remarks || null,
    };

    // 🔥 FIX: DIRECTLY CREATE USING SEQUELIZE
    const attendance = await Attendance.create(data);

    return res.status(201).json({
      message: "Attendance recorded successfully",
      data: attendance,
    });

  } catch (error) {
    console.error("❌ Create attendance error:", error);
    return res.status(400).json({
      message: "Failed to add attendance",
      error: error.message,
    });
  }
};


// ===========================
// GET ALL ATTENDANCE (WITH ALIAS FIX)
// ===========================
export const getAllAttendance = async (req, res) => {
  try {

    const attendances = await Attendance.findAll({
      include: [
        {
          model: Employee,
          as: "employee",                   // 🔥 REQUIRED alias fix
          attributes: ["emp_id", "first_name", "last_name"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.status(200).json(attendances);

  } catch (error) {
    console.error("❌ Fetch attendance error:", error);

    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};


// ===========================
// UPDATE ATTENDANCE + UPDATE EMPLOYEE LEAVE
// ===========================
export const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;   // attendance ID
    const updatedData = req.body;

    // Fetch existing attendance
    const attendance = await Attendance.findOne({ where: { id } });
    if (!attendance) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    // Find employee
    const employee = await Employee.findOne({
      where: { emp_id: attendance.emp_id }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ===========================
    // LEAVE UPDATE LOGIC
    // ===========================
    const previousStatus = attendance.status;
    const newStatus = updatedData.status;

    // Only reduce leave if new status is a leave type
    const leaveTypes = ["Leave", "Casual", "Sick", "Permission"];

    // If OLD is not leave but NEW is leave → deduct leave
    if (!leaveTypes.includes(previousStatus) && leaveTypes.includes(newStatus)) {

      if (newStatus === "Casual") {
        employee.casual_leave = (employee.casual_leave || 0) - 1;
      }

      if (newStatus === "Sick") {
        employee.sick_leave = (employee.sick_leave || 0) - 1;
      }

      if (newStatus === "Leave") {
        employee.annual_leave = (employee.annual_leave || 0) - 1;
      }

      if (newStatus === "Permission") {
        employee.permission_count = (employee.permission_count || 0) - 1;
      }

      await employee.save();
    }

    // If OLD is a leave but NEW is not → restore leave
    if (leaveTypes.includes(previousStatus) && !leaveTypes.includes(newStatus)) {

      if (previousStatus === "Casual") {
        employee.casual_leave += 1;
      }

      if (previousStatus === "Sick") {
        employee.sick_leave += 1;
      }

      if (previousStatus === "Leave") {
        employee.annual_leave += 1;
      }

      if (previousStatus === "Permission") {
        employee.permission_count += 1;
      }

      await employee.save();
    }

    // ===========================
    // UPDATE ATTENDANCE RECORD
    // ===========================
    await attendance.update({
      time_in: updatedData.time_in ?? attendance.time_in,
      time_out: updatedData.time_out ?? attendance.time_out,
      status: newStatus ?? attendance.status,
      remarks: updatedData.remarks ?? attendance.remarks,
    });

    return res.status(200).json({
      message: "Attendance updated successfully",
      data: attendance,
    });

  } catch (error) {
    console.error("❌ Update attendance error:", error);
    res.status(500).json({
      message: "Failed to update attendance",
      error: error.message,
    });
  }
};

