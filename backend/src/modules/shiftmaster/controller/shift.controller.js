// src/modules/shift/shift.controller.js
import Shift from "../models/shift.model.js";
import services from "../../../services/service.js";

const shiftService = new services(Shift);

// POST  /api/shift/createShift
export const createShift = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || "system",
    };

    const newShift = await shiftService.create(payload);

    return res.status(201).json({
      message: "Shift added successfully",
      data: newShift,
    });
  } catch (error) {
    console.error("❌ Error in createShift:", error);
    return res.status(500).json({
      message: "Failed to create shift",
      error: error.message,
    });
  }
};

// GET /api/shift/getAllShifts
// supports: includeInactive, search, page, pageSize, orderBy, order
export const getAllShifts = async (req, res) => {
  try {
    const { page = 1, pageSize = 10, search = '', status } = req.query;
    
    const options = {
      search,
      page: parseInt(page),
      limit: parseInt(pageSize),
      searchFields: ["shift_name", "shift_type"],
      includeInactive: status ? false : true, // if status filter is provided, don't filter by is_active
    };

    const result = await shiftService.getAll(options);

    return res.status(200).json({
      message: "Shifts fetched successfully",
      data: result.rows,
      meta: {
        total: result.count,
        page: result.page,
        pageSize: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error) {
    console.error("❌ Error in getAllShifts:", error);
    return res.status(500).json({
      message: "Failed to fetch shifts",
      error: error.message,
    });
  }
};

// GET /api/shift/getShift/:id
export const getShiftById= async (req, res) => {
  try {
    const { id } = req.params;
    const shift = await shiftService.getById(id);

    if (!shift) {
      return res.status(404).json({ message: "Shift not found" });
    }

    return res.status(200).json({
      message: "Shift fetched successfully",
      data: shift,
    });
  } catch (error) {
    console.error("❌ Error in getShift:", error);
    return res.status(500).json({
      message: "Failed to fetch shift",
      error: error.message,
    });
  }
};

// PUT /api/shift/updateShift/:id
export const updateShift = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      updated_by: req.user?.id || "system",
    };

    const updated = await shiftService.update(id, payload);

    if (!updated) {
      return res.status(404).json({ message: "Shift not found" });
    }

    return res.status(200).json({
      message: "Shift updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error in updateShift:", error);
    return res.status(500).json({
      message: "Failed to update shift",
      error: error.message,
    });
  }
};

// DELETE /api/shift/deleteShift/:id
// service.delete should respect paranoid soft-delete if model configured
export const deleteShift = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await shiftService.delete(id);

    if (!result) {
      return res.status(404).json({ message: "Shift not found or already deleted" });
    }

    return res.status(200).json({
      message: "Shift deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in deleteShift:", error);
    return res.status(500).json({
      message: "Failed to delete shift",
      error: error.message,
    });
  }
};
 export default {
  createShift,
  getAllShifts,
  getShiftById,
  updateShift,
  deleteShift,
};
