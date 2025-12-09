import Department from "../models/department.model.js";
import BaseService from "../../../services/service.js";
import { sequelize } from "../../../db/index.js"; // adjust path as per your project
import { Op } from "sequelize";
const departmentService = new BaseService(Department);

// POST /api/department/createDepartment
export const createDepartment = async (req, res) => {
  try {
    const { department_name } = req.body;

    if (!department_name || typeof department_name !== "string" || !department_name.trim()) {
      return res.status(400).json({
        message: "Department name is required",
      });
    }

    // ✅ Case-insensitive check using model
    const existingDept = await Department.findOne({
      where: sequelize.where(
        sequelize.fn("LOWER", sequelize.col("department_name")),
        department_name.toLowerCase().trim()
      ),
    });

    if (existingDept) {
      return res.status(400).json({
        message: "Department already exists",
      });
    }

    // ✅ Create new department
    const payload = {
      ...req.body,
      created_by: req.user?.id || "system",
    };

    const newDepartment = await Department.create(payload);

    return res.status(201).json({
      message: "Department created successfully",
      data: newDepartment,
    });
  } catch (error) {
    console.error("❌ Error in createDepartment:", error);
    return res.status(500).json({
      message: "Failed to create department",
      error: error.message,
    });
  }
};

// GET /api/department/getAllDepartments
export const getAllDepartments = async (req, res) => {
  try {
    const options = {
      includeInactive: req.query.includeInactive === "true" || false,
      search: req.query.search || "",
      // page: req.query.page || 1,
      // limit: req.query.limit || 10,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      orderBy: req.query.orderBy || "createdAt",
      order: req.query.order || "ASC",
      searchFields: ["department_name", "email", "phone"],
    };

    const result = await departmentService.getAll(options);
    return res.status(200).json({
      message: "Departments fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("❌ Error in getAllDepartments:", error);
    return res.status(500).json({
      message: "Failed to fetch departments",
      error: error.message,
    });
  }
};

// GET /api/department/getDepartmentById/:id
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await departmentService.getById(id);
    return res.status(200).json({
      message: "Department fetched successfully",
      data: department,
    });
  } catch (error) {
    console.error("❌ Error in getDepartmentById:", error);
    return res.status(500).json({
      message: "Failed to fetch department",
      error: error.message,
    });
  }
};

// PUT /api/department/updateDepartment/:id
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      updated_by: req.user?.id || "system",
    };

    const updatedDepartment = await departmentService.update(id, payload);
    return res.status(200).json({
      message: "Department updated successfully",
      data: updatedDepartment,
    });
  } catch (error) {
    console.error("❌ Error in updateDepartment:", error);
    return res.status(500).json({
      message: "Failed to update department",
      error: error.message,
    });
  }
};

// DELETE /api/department/deleteDepartment/:id
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // 🟡 Update the record instead of deleting it
    const department = await departmentService.update(id, { is_active: false });

    if (!department) {
      return res.status(404).json({
        message: "Department not found",
      });
    }

    return res.status(200).json({
      message: "Department deactivated successfully",
      // data: department,
    });
  } catch (error) {
    console.error("❌ Error in deleteDepartment:", error);
    return res.status(500).json({
      message: "Failed to deactivate department",
      error: error.message,
    });
  }
};


// PUT /api/department/restoreDepartment/:id
export const restoreDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findOne({
      where: { id },
      paranoid: false, // include soft-deleted records
    });

    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    await department.restore(); // restore the record
    await department.update({ status: "Active" });

    return res.status(200).json({
      message: "Department restored successfully",
      data: department,
    });
  } catch (error) {
    console.error("❌ Error in restoreDepartment:", error);
    return res.status(500).json({
      message: "Failed to restore department",
      error: error.message,
    });
  }
};

export default {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  restoreDepartment,
};
