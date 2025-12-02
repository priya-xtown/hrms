import attendance from "../models/attendance.model.js";
import Employee from "../../employee/models/employee.model.js";
import IClockTransaction from "../models/iclock_transaction.model.js";
import { Op } from "sequelize";

// ✅ Get all attendance (from both HRMS + ATT databases)
export const getAllrecords = async (req, res) => {
  try {
    // 1️⃣ Fetch attendance from HRMS database
    const hrmsAttendance = await attendance.findAll({
      include: [
        {
          model: Employee,
          attributes: ["emp_id", "first_name", "last_name", "shift_type"],
        },
      ],
      order: [["date", "DESC"]],
    });

    // 2️⃣ Fetch attendance (punch logs) from ATT (biometric) database
    const iclockData = await IClockTransaction.findAll({
      attributes: [
        "emp_code",
        "punch_time",
        "punch_state",
        "verify_type",
        "is_attendance",
      ],
      order: [["punch_time", "DESC"]],
      limit: 100, // optional
    });

    // 3️⃣ Merge both datasets
    const combined = hrmsAttendance.map((att) => {
      const punchLogs = iclockData.filter(
        (log) => log.emp_code === att.Employee.emp_id
      );

      return {
        emp_id: att.Employee.emp_id,
        employee_name: `${att.Employee.first_name} ${att.Employee.last_name}`,
        date: att.date,
        status: att.status,
        remarks: att.remarks,
        shift_type: att.Employee.shift_type,
        punch_logs: punchLogs.map((p) => ({
          punch_time: p.punch_time,
          punch_state: p.punch_state,
        })),
      };
    });

    res.status(200).json({
      message: "Combined attendance data fetched successfully",
      count: combined.length,
      data: combined,
    });
  } catch (error) {
    console.error("❌ Error fetching attendance:", error);
    res.status(500).json({
      message: "Failed to fetch attendance data",
      error: error.message,
    });
  }
};
