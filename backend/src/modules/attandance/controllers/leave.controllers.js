import { createLeaveSchema, updateLeaveSchema, updateLeaveStatusSchema, getAllLeaveQuerySchema, deleteLeaveSchema } from "../dto/leave.zod.js";
import Leave from "../models/leave.models.js"
import Employee from "../../employee/models/employee.model.js";
import BaseService from "../../../services/service.js"

const leaveService = new BaseService(Leave);

// ✅ 1️⃣ Create Leave
export const createLeave = async (req, res) => {
  try {
    const validatedData = await createLeaveSchema.parseAsync(req.body);

    // check employee existence
    const employee = await Employee.findOne({ where: { emp_id: validatedData.emp_id } });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // include emp_name automatically
    const leaveData = {
      ...validatedData,
      emp_name: `${employee.first_name} ${employee.last_name}`,
    };

    const leave = await leaveService.create(leaveData);

    return res.status(201).json({
      message: "Leave request submitted successfully",
      data: leave,
    });
  } catch (error) {
    console.error("❌ Create Leave Error:", error);
    return res.status(400).json({
      message: "Failed to create leave",
      error: error.errors || error.message,
    });
  }
};

// ✅ 2️⃣ Get All Leaves (with filters)
export const getAllLeaves = async (req, res) => {
  try {
    const filters = await getAllLeaveQuerySchema.parseAsync(req.query);
    const { status, leave_type, emp_id, search, page, limit } = filters;

    const where = {};
    if (status) where.status = status;
    if (leave_type) where.leave_type = leave_type;
    if (emp_id) where.emp_id = emp_id;

    // Search fields supported
    const searchFields = ["emp_id", "emp_name", "reason"];

    const result = await leaveService.getAll({
      search,
      page,
      limit,
      orderBy: "createdAt",
      order: "DESC",
      searchFields,
    });

    return res.status(200).json({
      message: "Leave records fetched successfully",
      total: result.count,
      totalPages: result.totalPages,
      currentPage: result.page,
      data: result.rows,
    });
  } catch (error) {
    console.error("❌ Fetch Leave Error:", error);
    return res.status(500).json({
      message: "Failed to fetch leave records",
      error: error.errors || error.message,
    });
  }
};

// ✅ 3️⃣ Get Single Leave
export const getLeaveById = async (req, res) => {
  try {
    const { id } = req.params;
    const leave = await leaveService.getById(id);

    return res.status(200).json({
      message: "Leave fetched successfully",
      data: leave,
    });
  } catch (error) {
    console.error("❌ Get Leave Error:", error);
    return res.status(404).json({
      message: "Leave not found",
      error: error.message,
    });
  }
};

// ✅ 4️⃣ Update Leave (edit fields)
export const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const validated = await updateLeaveSchema.parseAsync(req.body);

    const updated = await leaveService.update(id, validated);

    return res.status(200).json({
      message: "Leave updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("❌ Update Leave Error:", error);
    return res.status(400).json({
      message: "Failed to update leave",
      error: error.errors || error.message,
    });
  }
};

// ✅ 5️⃣ Update Leave Status (Approve/Deny)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const validated = await updateLeaveStatusSchema.parseAsync(req.body);

    const updated = await leaveService.update(id, {
      status: validated.status,
      remarks: validated.remarks || null,
    });

    return res.status(200).json({
      message: `Leave ${validated.status.toLowerCase()} successfully`,
      data: updated,
    });
  } catch (error) {
    console.error("❌ Update Leave Status Error:", error);
    return res.status(400).json({
      message: "Failed to update leave status",
      error: error.errors || error.message,
    });
  }
};

// ✅ 6️⃣ Delete Leave
export const deleteLeave = async (req, res) => {
  try {
    const { id } = await deleteLeaveSchema.parseAsync(req.params);
    const result = await leaveService.delete(id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Delete Leave Error:", error);
    return res.status(400).json({
      message: "Failed to delete leave",
      error: error.errors || error.message,
    });
  }
};
