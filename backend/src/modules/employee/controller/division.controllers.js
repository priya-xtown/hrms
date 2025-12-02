import Division from "../models/division.model.js";
import BaseService from "../../../services/service.js";

const divisionService = new BaseService(Division);

// ✅ Create Division
export const createDivision = async (req, res) => {
  try {
    const payload = {
      ...req.body,
      created_by: req.user?.id || "system",
    };
    const newDivision = await divisionService.create(payload);
    return res.status(201).json({
      message: "Division created successfully",
      data: newDivision,
    });
  } catch (error) {
    console.error("❌ Error creating division:", error);
    return res.status(500).json({
      message: "Failed to create division",
      error: error.message,
    });
  }
};

// ✅ Get All Divisions
export const getAllDivisions = async (req, res) => {
  try {
    const options = {
      includeInactive: req.query.includeInactive === "true",
      search: req.query.search || "",
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      orderBy: req.query.orderBy || "createdAt",
      order: req.query.order || "ASC",
      searchFields: ["name", "email", "phone"],
    };

    const result = await divisionService.getAll(options);
    return res.status(200).json({
      message: "Divisions fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("❌ Error fetching divisions:", error);
    return res.status(500).json({
      message: "Failed to fetch divisions",
      error: error.message,
    });
  }
};

// ✅ Get by ID
export const getDivisionById = async (req, res) => {
  try {
    const { id } = req.params;
    const division = await divisionService.getById(id);
    return res.status(200).json({
      message: "Division fetched successfully",
      data: division,
    });
  } catch (error) {
    console.error("❌ Error fetching division:", error);
    return res.status(500).json({
      message: "Failed to fetch division",
      error: error.message,
    });
  }
};

// ✅ Update
export const updateDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      updated_by: req.user?.id || "system",
    };
    const updatedDivision = await divisionService.update(id, payload);
    return res.status(200).json({
      message: "Division updated successfully",
      data: updatedDivision,
    });
  } catch (error) {
    console.error("❌ Error updating division:", error);
    return res.status(500).json({
      message: "Failed to update division",
      error: error.message,
    });
  }
};

// ✅ Delete (Soft)
export const deleteDivision = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await divisionService.delete(id);
    return res.status(200).json({
      message: "Division deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error deleting division:", error);
    return res.status(500).json({
      message: "Failed to delete division",
      error: error.message,
    });
  }
};

export default {
  createDivision,
  getAllDivisions,
  getDivisionById,
  updateDivision,
  deleteDivision,
};
