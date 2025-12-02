import Attendance from "../models/attandance.models.js";
import Employee from "../../employee/models/employee.model.js";
import { createAttendanceSchema } from "../dto/attandance.zod.js";

export const createAttendance = async (req, res) => {
 try {
    // Validate input
    const validatedData = await createAttendanceSchema.parseAsync(req.body);

    // Check if employee exists
    const employee = await Employee.findOne({
      where: { emp_id: validatedData.emp_id },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Insert attendance
    const attendance = await Attendance.create({
      emp_id: validatedData.emp_id,
      emp_name: `${employee.first_name} ${employee.last_name || ""}`.trim(),
      date: validatedData.date,
      time_in: validatedData.time_in || null,
      time_out: validatedData.time_out || null,
      status: validatedData.status || "Present",
      remarks: validatedData.remarks || "",
    });

    res.status(201).json({
      message: "Attendance recorded successfully",
      data: attendance,
    });
  } catch (error) {
    console.error("❌ Failed to create attendance:", error);
    res.status(400).json({
      message: "Failed to add attendance",
      error: error.message,
    });
  }
};

export const getAllAttendance = async (req, res) => {
 try {
    const attendances = await Attendance.findAll({
      include: [
        {
          model: Employee,
          attributes: ["emp_id", "first_name", "last_name"], 
        },
      ],
      order: [["date", "DESC"]],
    });
    return res.status(200).json(attendances);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};