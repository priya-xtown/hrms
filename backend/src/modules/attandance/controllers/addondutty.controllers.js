// src/modules/addondutty/controllers/addondutty.controller.js
import BaseService from "../../../services/service.js";
import Addondutty from "../models/addon.models.js";
import Employee from "../../employee/models/employee.model.js";

const addonduttyService = new BaseService(Addondutty);

// ✅ Create new add-on duty
export const createAddondutty = async (req, res) => {
  try {
    const data = req.body;
    const record = await addonduttyService.create(data);
    res.status(201).json({
      message: "Add-on duty created successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create add-on duty",
      error: error.message,
    });
  }
};

// ✅ Get all add-on duties
export const getAllAddondutty = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const result = await addonduttyService.getAll({
      page,
      limit,
      search,
      searchFields: ["emp_id", "reason", "status"],
    });

    res.status(200).json({
      message: "Add-on duty records fetched successfully",
      ...result,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get by ID
export const getAddonduttyById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Addondutty.findByPk(id, {
      include: [{ model: Employee, as: "employee" }],
    });

    if (!record)
      return res.status(404).json({ message: "Add-on duty not found" });

    res.status(200).json({
      message: "Add-on duty record fetched successfully",
      data: record,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update
export const updateAddondutty = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await addonduttyService.update(id, data);
    res.status(200).json({
      message: "Add-on duty updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete
export const deleteAddondutty = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await addonduttyService.delete(id);
    res.status(200).json({
      message: "Add-on duty deleted successfully",
      data: deleted,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
