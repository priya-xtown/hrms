import { Op } from "sequelize";
import AnnualPayroll from "../models/annualpayroll.js";
import BaseService from "../../../services/service.js";

const annualPayrollService = new BaseService(AnnualPayroll);

// ✅ Create Annual Payroll
export const createAnnualPayroll = async (req, res) => {
  try {
    const data = req.body;
    const newRecord = await annualPayrollService.create(data);

    return res.status(201).json({
      message: "Annual payroll created successfully",
      data: newRecord,
    });
  } catch (error) {
    console.error("Error creating annual payroll:", error);
    return res.status(500).json({
      message: "Failed to create annual payroll",
      error: error.message,
    });
  }
};

// ✅ Get All Annual Payrolls
export const getAllAnnualPayrolls = async (req, res) => {
  try {
    const result = await annualPayrollService.getAll({
      searchFields: ["employee_name", "employee_id", "department_name", "branch_name"],
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching annual payrolls:", error);
    return res.status(500).json({
      message: "Failed to fetch annual payrolls",
      error: error.message,
    });
  }
};

// ✅ Get Annual Payroll by ID
export const getAnnualPayrollById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await annualPayrollService.getById(id);

    if (!record) {
      return res.status(404).json({ message: "Annual payroll not found" });
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching annual payroll by id:", error);
    return res.status(500).json({
      message: "Failed to fetch annual payroll",
      error: error.message,
    });
  }
};

// ✅ Get Annual Payrolls by Employee ID
export const getAnnualPayrollsByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const records = await AnnualPayroll.findAll({
      where: { employee_id: employeeId },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Annual payrolls fetched successfully",
      data: records,
    });
  } catch (error) {
    console.error("Error fetching annual payrolls by employee id:", error);
    return res.status(500).json({
      message: "Failed to fetch annual payrolls",
      error: error.message,
    });
  }
};

// ✅ Update Annual Payroll
export const updateAnnualPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await annualPayrollService.update(id, data);

    return res.status(200).json({
      message: "Annual payroll updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating annual payroll:", error);
    return res.status(500).json({
      message: "Failed to update annual payroll",
      error: error.message,
    });
  }
};

// ✅ Delete Annual Payroll
export const deleteAnnualPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await annualPayrollService.delete(id);

    return res.status(200).json({
      message: "Annual payroll deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error deleting annual payroll:", error);
    return res.status(500).json({
      message: "Failed to delete annual payroll",
      error: error.message,
    });
  }
};
