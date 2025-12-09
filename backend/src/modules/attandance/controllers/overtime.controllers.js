// // // src/modules/attandance/controllers/overtime.controllers.js
// // import Overtime from "../models/overtime.models.js";
// // import Employee from "../../employee/models/employee.model.js";
// // import Attendance from "../models/attandance.models.js";
// // import { Op } from "sequelize";

// // // 🧮 Helper function: calculate overtime hours
// // function calculateOtHours(start, end) {
// //   const [sh, sm] = start.split(":").map(Number);
// //   const [eh, em] = end.split(":").map(Number);

// //   const startMins = sh * 60 + sm;
// //   const endMins = eh * 60 + em;
// //   const diffMins = endMins - startMins;

// //   return diffMins > 0 ? diffMins / 60 : 0;
// // }

// // // ✅ POST /hrms_api/v1/overtime/createOvertime
// // export const createOvertime = async (req, res) => {
// //   try {
// //     const {
// //       emp_id,
// //       emp_name,
// //       date,
// //       start_time,
// //       end_time,
// //       remarks,
// //       status,
// //     } = req.body;

// //     // 🔹 1. Check employee exists
// //     const employee = await Employee.findOne({ where: { emp_id } });
// //     if (!employee) {
// //       return res.status(404).json({
// //         status: "error",
// //         message: "Employee not found",
// //       });
// //     }

// //     // 🔹 2. Check attendance record for employee on given date
// //     const attendance = await Attendance.findOne({
// //       where: { emp_id, date },
// //     });

// //     if (!attendance) {
// //       return res.status(400).json({
// //         status: "error",
// //         message: "Attendance not found for this employee on the selected date",
// //       });
// //     }

// //     // 🔹 3. Calculate OT hours
// //     const ot_hours = calculateOtHours(start_time, end_time);
// //     if (ot_hours <= 0) {
// //       return res.status(400).json({
// //         status: "error",
// //         message: "End time must be after start time",
// //       });
// //     }

// //     // 🔹 4. Prevent duplicate overtime for same date
// //     const existing = await Overtime.findOne({
// //       where: { emp_id, date },
// //     });

// //     let overtime;
// //     if (existing) {
// //       overtime = await existing.update({
// //         start_time,
// //         end_time,
// //         ot_hours,
// //         remarks,
// //         status: status || existing.status,
// //       });
// //       return res.status(200).json({
// //         status: "success",
// //         message: "Overtime record updated successfully",
// //         data: overtime,
// //       });
// //     }

// //     // 🔹 5. Create new overtime record
// //     overtime = await Overtime.create({
// //       attendance_id: attendance.id,
// //       emp_id,
// //       emp_name,
// //       date,
// //       start_time,
// //       end_time,
// //       ot_hours,
// //       remarks,
// //       status: status || "Pending",
// //     });

// //     return res.status(201).json({
// //       status: "success",
// //       message: "Overtime record created successfully",
// //       data: overtime,
// //     });
// //   } catch (error) {
// //     console.error("Overtime Create Error:", error);
// //     return res.status(500).json({
// //       status: "error",
// //       message: "Failed to create overtime record",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ✅ GET /hrms_api/v1/overtime/getAllOvertime
// // export const getAllOvertime = async (req, res) => {
// //   try {
// //     const records = await Overtime.findAll({});

// //     return res.status(200).json({
// //       status: "success",
// //       message: "Fetched all overtime records successfully",
// //       data: records,
// //     });
// //   } catch (error) {
// //     console.error("GetAllOvertime Error:", error);
// //     return res.status(500).json({
// //       status: "error",
// //       message: "Failed to fetch overtime records",
// //       error: error.message,
// //     });
// //   }
// // };

// // // ✅ PATCH /hrms_api/v1/overtime/updateOvertime/:id
// // export const updateOvertimeStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { status } = req.body;

// //     const overtime = await Overtime.findByPk(id);
// //     if (!overtime) {
// //       return res.status(404).json({
// //         status: "error",
// //         message: "Overtime record not found",
// //       });
// //     }

// //     await overtime.update({ status });

// //     return res.status(200).json({
// //       status: "success",
// //       message: `Overtime status updated to ${status}`,
// //       data: overtime,
// //     });
// //   } catch (error) {
// //     console.error("UpdateOvertimeStatus Error:", error);
// //     return res.status(500).json({
// //       status: "error",
// //       message: "Failed to update overtime status",
// //       error: error.message,
// //     });
// //   }
// // };


// // src/modules/attandance/controllers/overtime.controllers.js

// import Attendance from "../models/attandance.models.js";
// import Overtime from "../models/overtime.models.js";
// import Employee from "../../employee/models/employee.model.js";
// import { Op } from "sequelize";

// /* ---------------------- TIME PARSER ---------------------- */
// /**
//  * Convert a time string into {h, m}
//  * Supports:
//  * - "06:30 am"
//  * - "6:30 pm"
//  * - "06:30:00 am"
//  * - "18:30"
//  */
// function parseTimeToHM(timeStr) {
//   if (!timeStr || typeof timeStr !== "string") return null;

//   let t = timeStr.trim().toLowerCase();
//   t = t.replace(/:(\d{2}):\d{2}/, ":$1");

//   const re12 = /^(\d{1,2}):(\d{2})\s*(am|pm)$/;
//   const re24 = /^(\d{1,2}):(\d{2})$/;

//   let m;

//   if ((m = t.match(re12))) {
//     let hh = parseInt(m[1], 10);
//     const mm = parseInt(m[2], 10);
//     const ampm = m[3];

//     if (ampm === "pm" && hh !== 12) hh += 12;
//     if (ampm === "am" && hh === 12) hh = 0;

//     return { h: hh, m: mm };
//   }

//   if ((m = t.match(re24))) {
//     return { h: parseInt(m[1], 10), m: parseInt(m[2], 10) };
//   }

//   return null;
// }

// /* ---------------------- OT HOURS CALCULATOR ---------------------- */
// function calculateOtHours(startStr, endStr) {
//   const s = parseTimeToHM(startStr);
//   const e = parseTimeToHM(endStr);

//   if (!s || !e) return 0;

//   const startMins = s.h * 60 + s.m;
//   const endMins = e.h * 60 + e.m;

//   const diff = endMins - startMins;
//   if (diff <= 0) return 0;

//   return Math.round((diff / 60) * 100) / 100;
// }

// /* ================================================================
//    CREATE OVERTIME
// ================================================================ */
// // Create OT Record
// export const createOvertime = async (req, res) => {
//   try {
//     const { emp_id, emp_name, date, start_time, end_time, ot_hours, remarks } = req.body;

//     // 1️⃣ Check attendance exists
//     const attendance = await Attendance.findOne({
//       where: { emp_id, date }
//     });

//     if (!attendance) {
//       return res.status(404).json({
//         status: "error",
//         message: "Attendance not found for this employee on the selected date"
//       });
//     }

//     // 2️⃣ Create OT with attendance ID
//     const overtime = await Overtime.create({
//       attendance_id: attendance.id,
//       emp_id,
//       emp_name,
//       date,
//       start_time,
//       end_time,
//       ot_hours,
//       remarks
//     });

//     return res.status(200).json({
//       status: "success",
//       message: "Overtime created successfully",
//       data: overtime
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: error.message
//     });
//   }
// };


// /* ================================================================
//    GET ALL OVERTIME
// ================================================================ */
// export const getAllOvertime = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page || "1");
//     const limit = parseInt(req.query.limit || "10");
//     const offset = (page - 1) * limit;
//     const search = req.query.search || "";

//     const where =
//       search.trim() !== ""
//         ? {
//             [Op.or]: [
//               { emp_id: { [Op.like]: `%${search}%` } },
//               { emp_name: { [Op.like]: `%${search}%` } },
//               { status: { [Op.like]: `%${search}%` } },
//             ],
//           }
//         : {};

//     const result = await Overtime.findAndCountAll({
//       where,
//       limit,
//       offset,
//       order: [["createdAt", "DESC"]],
//     });

//     return res.status(200).json({
//       status: "success",
//       message: "Overtime records fetched",
//       data: {
//         total: result.count,
//         page,
//         limit,
//         records: result.rows,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: "Failed to fetch overtime",
//       error: error.message,
//     });
//   }
// };

// /* ================================================================
//    GET OVERTIME BY ID
// ================================================================ */
// export const getOvertimeById = async (req, res) => {
//   try {
//     const overtime = await Overtime.findByPk(req.params.id);
//     if (!overtime) {
//       return res.status(404).json({
//         status: "error",
//         message: "Overtime not found",
//       });
//     }
//     return res.status(200).json({
//       status: "success",
//       data: overtime,
//     });
//   } catch (error) {
//     return res.status(500).json({
//       status: "error",
//       message: "Error fetching overtime",
//       error: error.message,
//     });
//   }
// };

// /* ================================================================
//    UPDATE OVERTIME
// ================================================================ */
// export const updateOvertime = async (req, res) => {
//   try {
//     const overtime = await Overtime.findByPk(req.params.id);
//     if (!overtime) {
//       return res.status(404).json({
//         status: "error",
//         message: "Overtime record not found",
//       });
//     }

//     const sTime = req.body.start_time || req.body.time_in || overtime.start_time;
//     const eTime = req.body.end_time || req.body.time_out || overtime.end_time;

//     const ot_hours = calculateOtHours(sTime, eTime);

//     const updated = await overtime.update({
//       ...req.body,
//       start_time: sTime,
//       end_time: eTime,
//       ot_hours: ot_hours > 0 ? ot_hours : overtime.ot_hours,
//     });

//     return res.status(200).json({
//       status: "success",
//       message: "Overtime updated successfully",
//       data: updated,
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: "error",
//       message: "Failed to update overtime",
//       error: error.message,
//     });
//   }
// };

// /* ================================================================
//    DELETE OVERTIME
// ================================================================ */
// export const deleteOvertime = async (req, res) => {
//   try {
//     const overtime = await Overtime.findByPk(req.params.id);
//     if (!overtime) {
//       return res.status(404).json({
//         status: "error",
//         message: "Overtime record not found",
//       });
//     }

//     await overtime.destroy();

//     return res.status(200).json({
//       status: "success",
//       message: "Overtime deleted successfully",
//     });
//   } catch (error) {
//     return res.status(400).json({
//       status: "error",
//       message: "Failed to delete overtime",
//       error: error.message,
//     });
//   }
// };


// src/modules/attandance/controllers/overtime.controllers.js
import Attendance from "../models/attandance.models.js";
import Overtime from "../models/overtime.models.js";
import Employee from "../../employee/models/employee.model.js";
import dayjs from "dayjs";

/* ------------------ time parsing + OT calc ------------------ */
function parseTimeToHM(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  let t = timeStr.trim().toLowerCase();
  // normalize seconds if present: "06:30:00 am" -> "06:30 am"
  t = t.replace(/:(\d{2}):\d{2}/, ":$1");
  const re12 = /^(\d{1,2}):(\d{2})\s*(am|pm)$/;
  const re24 = /^(\d{1,2}):(\d{2})$/;
  let m;
  if ((m = t.match(re12))) {
    let hh = parseInt(m[1], 10);
    const mm = parseInt(m[2], 10);
    const ampm = m[3];
    if (ampm === "pm" && hh !== 12) hh += 12;
    if (ampm === "am" && hh === 12) hh = 0;
    return { h: hh, m: mm };
  }
  if ((m = t.match(re24))) {
    return { h: parseInt(m[1], 10), m: parseInt(m[2], 10) };
  }
  return null;
}

function calculateOtHours(startStr, endStr) {
  const s = parseTimeToHM(startStr);
  const e = parseTimeToHM(endStr);
  if (!s || !e) return 0;
  const startMins = s.h * 60 + s.m;
  const endMins = e.h * 60 + e.m;
  let diff = endMins - startMins;
  // If end is before start assume next-day OT (optional, change if not desired)
  if (diff <= 0) diff += 24 * 60;
  return Math.round((diff / 60) * 100) / 100; // two decimals
}

/* ------------------ CREATE OVERTIME ------------------ */
export const createOvertime = async (req, res) => {
  try {
    const {
      attendance_id, // optional: prefer this if provided
      emp_id: rawEmpId,
      emp_name,
      date: rawDate,
      start_time,
      end_time,
      ot_hours: suppliedOtHours,
      remarks,
      status,
    } = req.body;

    // Validate required inputs (at least emp_id+date or attendance_id, and start/end time)
    if (!attendance_id && (!rawEmpId || !rawDate)) {
      return res.status(400).json({
        status: "error",
        message: "Provide either attendance_id or both emp_id and date.",
      });
    }

    // Normalize emp_id and date
    const emp_id = rawEmpId ? String(rawEmpId).trim() : null;
    // Normalize date to YYYY-MM-DD (dayjs will handle many formats)
    const date = rawDate ? dayjs(rawDate).format("YYYY-MM-DD") : null;

    // 1) Find attendance either by attendance_id or by emp_id + date
    let attendance = null;
    if (attendance_id) {
      attendance = await Attendance.findOne({ where: { id: attendance_id } });
    } else {
      attendance = await Attendance.findOne({ where: { emp_id, date } });
    }

    if (!attendance) {
      return res.status(404).json({
        status: "error",
        message: "Attendance not found for this employee on the selected date",
      });
    }

    // 2) Optionally validate employee exists (recommended)
    if (emp_id) {
      const employee = await Employee.findOne({ where: { emp_id } });
      if (!employee) {
        return res.status(404).json({ status: "error", message: "Employee not found" });
      }
    }

    // 3) Compute ot_hours if not supplied
    let ot_hours = suppliedOtHours;
    if ((!ot_hours || Number(ot_hours) === 0) && start_time && end_time) {
      ot_hours = calculateOtHours(start_time, end_time);
    }
    // ensure numeric
    ot_hours = Number(ot_hours) || 0;

    if (ot_hours <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Calculated OT hours is 0. Provide valid start_time and end_time.",
      });
    }

    // 4) Prevent duplicate OT for same attendance (use attendance_id which is required by model)
    const existing = await Overtime.findOne({ where: { attendance_id: attendance.id } });
    if (existing) {
      // If you want to update instead of error, you can update. Here we update.
      const updated = await existing.update({
        emp_id: emp_id || existing.emp_id,
        emp_name: emp_name || existing.emp_name,
        date: date || existing.date,
        start_time: start_time || existing.start_time,
        end_time: end_time || existing.end_time,
        ot_hours,
        remarks: remarks || existing.remarks,
        status: status || existing.status,
      });
      return res.status(200).json({
        status: "success",
        message: "Overtime record updated (existing attendance)",
        data: updated,
      });
    }

    // 5) Create new overtime record
    const overtime = await Overtime.create({
      attendance_id: attendance.id,
      emp_id: emp_id || attendance.emp_id,
      emp_name: emp_name || attendance.emp_name,
      date: date || attendance.date,
      start_time: start_time || null,
      end_time: end_time || null,
      ot_hours,
      remarks: remarks || null,
      status: status || "Pending",
    });

    return res.status(201).json({
      status: "success",
      message: "Overtime created successfully",
      data: overtime,
    });
  } catch (error) {
    console.error("createOvertime error:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create overtime",
      error: error.message,
    });
  }
};




