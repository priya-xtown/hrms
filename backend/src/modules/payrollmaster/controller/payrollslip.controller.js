import { Op } from "sequelize";
import PayrollSlip from "../models/payrollslip.js";
import BaseService from "../../../services/service.js";

const payrollSlipService = new BaseService(PayrollSlip);

// Create Payroll Slip
export const createPayrollSlip = async (req, res) => {
  try {
    const data = req.body;
    const newPayrollSlip = await payrollSlipService.create(data);

    return res.status(201).json({
      message: "Payroll Slip created successfully",
      data: newPayrollSlip,
    });
  } catch (error) {
    console.error("Error creating payroll slip:", error);
    return res.status(500).json({
      message: "Failed to create payroll slip",
      error: error.message,
    });
  }
};

// Get All Payroll Slips
export const getAllPayrollSlips = async (req, res) => {
  try {
    const result = await payrollSlipService.getAll({
      searchFields: ["employee_name", "employee_id"],
    });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching payroll slips:", error);
    return res.status(500).json({
      message: "Failed to fetch payroll slips",
      error: error.message,
    });
  }
};

// Get Payroll Slip by ID
export const getPayrollSlipById = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await payrollSlipService.getById(id);

    if (!record) {
      return res.status(404).json({ message: "Payroll Slip not found" });
    }

    return res.status(200).json(record);
  } catch (error) {
    console.error("Error fetching payroll slip by id:", error);
    return res.status(500).json({ message: "Failed to fetch payroll slip", error: error.message });
  }
};

// Update Payroll Slip
export const updatePayrollSlip = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedPayrollSlip = await payrollSlipService.update(id, data);

    return res.status(200).json({
      message: "Payroll Slip updated successfully",
      data: updatedPayrollSlip,
    });
  } catch (error) {
    console.error("Error updating payroll slip:", error);
    return res.status(500).json({
      message: "Failed to update payroll slip",
      error: error.message,
    });
  }
};

// Delete Payroll Slip
export const deletePayrollSlip = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await payrollSlipService.delete(id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting payroll slip:", error);
    return res.status(500).json({
      message: "Failed to delete payroll slip",
      error: error.message,
    });
  }
};

// Download Payroll Slip as PDF
export const downloadPayrollSlip = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await payrollSlipService.getById(id);

    if (!record) {
      return res.status(404).json({ message: "Payroll Slip not found" });
    }

    // Template path (relative to utils/exportToPdf's views dir)
    const templatePath = "payrollSlipTemplate.ejs";

    const pdfBuffer = await exportToPdf(templatePath, { payroll: record });

    // safer filename: use encodeURIComponent to avoid weird chars
    const baseName = record.employee_name ? String(record.employee_name).trim() : id;
    const safeName = encodeURIComponent(baseName).replace(/%20/g, "_");

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="payroll-slip-${safeName}.pdf"`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating payroll slip PDF:", error);
    return res.status(500).json({ message: "Failed to generate PDF", error: error.message });
  }
};

export default {
  createPayrollSlip,
  getAllPayrollSlips,
  getPayrollSlipById,
  updatePayrollSlip,
  deletePayrollSlip,
  downloadPayrollSlip,
};

