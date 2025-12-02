import Branch from "../models/branch.model.js";
import BaseService from "../../../services/service.js";

const branchService = new BaseService(Branch);

// CREATE
export const createBranch = async (req, res) => {
  try {
    const { branch_name } = req.body;

    // 🔍 Check if branch name already exists
    const existingBranch = await Branch.findOne({ where: { branch_name } });
    if (existingBranch) {
      return res.status(400).json({
        message: `Branch "${branch_name}" already exists`,
      });
    }

    // ✅ Create branch if name is unique
    const payload = {
      ...req.body,
      created_by: req.user?.id || "system",
    };

    const newBranch = await Branch.create(payload);

    return res.status(201).json({
      message: "Branch created successfully",
      data: newBranch,
    });
  } catch (error) {
    console.error("❌ Error in createBranch:", error);
    return res.status(500).json({
      message: "Failed to create branch",
      error: error.message,
    });
  }
};

// GET ALL
export const getAllBranches = async (req, res) => {
  try {
    const options = {
      includeInactive: req.query.includeInactive === "true" || false,
      search: req.query.search || "",
      page: req.query.page || 1,
      limit: req.query.limit || 10,
      orderBy: req.query.orderBy || "createdAt",
      order: req.query.order || "ASC",
      searchFields: ["branch_name", "email", "phone", "city", "state"],
    };

    const result = await branchService.getAll(options);
    return res.status(200).json({
      message: "Branches fetched successfully",
      ...result,
    });
  } catch (error) {
    console.error("❌ Error in getAllBranches:", error);
    return res.status(500).json({
      message: "Failed to fetch branches",
      error: error.message,
    });
  }
};

// GET BY ID
export const getBranchById = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await branchService.getById(id);
    return res.status(200).json({
      message: "Branch fetched successfully",
      data: branch,
    });
  } catch (error) {
    console.error("❌ Error in getBranchById:", error);
    return res.status(500).json({
      message: "Failed to fetch branch",
      error: error.message,
    });
  }
};

// UPDATE
export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      updated_by: req.user?.id || "system",
    };

    const updatedBranch = await branchService.update(id, payload);
    return res.status(200).json({
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    console.error("❌ Error in updateBranch:", error);
    return res.status(500).json({
      message: "Failed to update branch",
      error: error.message,
    });
  }
};

// DELETE
export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔍 Check if branch exists
    const branch = await Branch.findByPk(id);
    if (!branch) {
      return res.status(404).json({
        message: "Branch not found",
      });
    }

    // ✅ Soft delete — set is_active = false
    await branch.update({
      is_active: false,
      updated_by: req.user?.id || "system",
    });

    return res.status(200).json({
      message: "Branch deactivated successfully",
      data: { id: branch.id, is_active: branch.is_active },
    });
  } catch (error) {
    console.error("❌ Error in deleteBranch:", error);
    return res.status(500).json({
      message: "Failed to deactivate branch",
      error: error.message,
    });
  }
};
// RESTORE
export const restoreBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await Branch.findOne({
      where: { id },
      paranoid: false,
    });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    await branch.restore();
    await branch.update({ is_active: true });

    return res.status(200).json({
      message: "Branch restored successfully",
      data: branch,
    });
  } catch (error) {
    console.error("❌ Error in restoreBranch:", error);
    return res.status(500).json({
      message: "Failed to restore branch",
      error: error.message,
    });
  }
};

export default {
  createBranch,
  getAllBranches,
  getBranchById,
  updateBranch,
  deleteBranch,
  restoreBranch,
};
