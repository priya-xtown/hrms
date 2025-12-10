// src/modules/attandance/controllers/overtime.controllers.js

import Overtime from "../models/overtime.models.js";
import Employee from "../../employee/models/employee.model.js";
import dayjs from "dayjs";

/* ============================================================
   TIME PARSING & OT-HOURS CALCULATION
============================================================ */
function parseTimeToHM(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;

  let t = timeStr.trim().toLowerCase();
  t = t.replace(/:(\d{2}):\d{2}/, ":$1");

  const re12 = /^(\d{1,2}):(\d{2})\s*(am|pm)$/; // 12hr format
  const re24 = /^(\d{1,2}):(\d{2})$/;           // 24hr format

  let m;

  if ((m = t.match(re12))) {
    let hh = parseInt(m[1]);
    const mm = parseInt(m[2]);
    const ampm = m[3];

    if (ampm === "pm" && hh !== 12) hh += 12;
    if (ampm === "am" && hh === 12) hh = 0;

    return { h: hh, m: mm };
  }

  if ((m = t.match(re24))) {
    return { h: parseInt(m[1]), m: parseInt(m[2]) };
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
  if (diff <= 0) diff += 24 * 60;

  return Math.round((diff / 60) * 100) / 100;
}

/* ============================================================
   CREATE OVERTIME
============================================================ */
export const createOvertime = async (req, res) => {
  try {
    const { emp_id, date, start_time, end_time, remarks, status } = req.body;

    if (!emp_id || !date || !start_time || !end_time) {
      return res.status(400).json({
        status: "error",
        message: "emp_id, date, start_time, end_time are required",
      });
    }

    const employee = await Employee.findOne({ where: { emp_id } });
    if (!employee) {
      return res.status(404).json({
        status: "error",
        message: "Employee not found",
      });
    }

    const emp_name = `${employee.first_name} ${employee.last_name}`;
    const normalizedDate = dayjs(date).format("YYYY-MM-DD");

    const existing = await Overtime.findOne({
      where: { emp_id, date: normalizedDate },
    });

    const ot_hours = calculateOtHours(start_time, end_time);
    if (ot_hours <= 0) {
      return res.status(400).json({
        status: "error",
        message: "Invalid OT hours. Check start_time & end_time.",
      });
    }

    // If OT already exists for the same date, update instead of create
    if (existing) {
      const updated = await existing.update({
        start_time,
        end_time,
        ot_hours,
        remarks,
        status: status || existing.status,
      });

      return res.status(200).json({
        status: "success",
        message: "Overtime updated (duplicate date)",
        data: updated,
      });
    }

    const overtime = await Overtime.create({
      emp_id,
      emp_name,
      date: normalizedDate,
      start_time,
      end_time,
      ot_hours,
      remarks,
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
      message: error.message,
    });
  }
};

/* ============================================================
   GET ALL OVERTIME
============================================================ */
export const getAllOvertime = async (req, res) => {
  try {
    const { emp_id, status, date } = req.query;

    const where = {};
    if (emp_id) where.emp_id = emp_id;
    if (status) where.status = status;
    if (date) where.date = dayjs(date).format("YYYY-MM-DD");

    const data = await Overtime.findAll({
      where,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: "success",
      message: "Overtime records fetched",
      data,
    });
  } catch (error) {
    console.error("getAllOvertime error:", error);
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ============================================================
   UPDATE OVERTIME
============================================================ */
export const updateOvertime = async (req, res) => {
  try {
    const overtime = await Overtime.findByPk(req.params.id);

    if (!overtime) {
      return res.status(404).json({
        status: "error",
        message: "Overtime not found",
      });
    }

    const start_time = req.body.start_time || overtime.start_time;
    const end_time = req.body.end_time || overtime.end_time;

    const ot_hours = calculateOtHours(start_time, end_time);

    const updated = await overtime.update({
      ...req.body,
      start_time,
      end_time,
      ot_hours,
    });

    return res.status(200).json({
      status: "success",
      message: "Overtime updated",
      data: updated,
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

/* ============================================================
   DELETE OVERTIME
============================================================ */
export const deleteOvertime = async (req, res) => {
  try {
    const overtime = await Overtime.findByPk(req.params.id);

    if (!overtime) {
      return res.status(404).json({
        status: "error",
        message: "Overtime not found",
      });
    }

    await overtime.destroy();

    return res.status(200).json({
      status: "success",
      message: "Overtime deleted",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};


/* ============================================================
   GET OVERTIME BY ID
============================================================ */
export const getOvertimeById = async (req, res) => {
  try {
    const { id } = req.params;

    const overtime = await Overtime.findByPk(id);

    if (!overtime) {
      return res.status(404).json({
        status: "error",
        message: "Overtime record not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Overtime record fetched",
      data: overtime,
    });

  } catch (error) {
    console.error("getOvertimeById error:", error);

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

