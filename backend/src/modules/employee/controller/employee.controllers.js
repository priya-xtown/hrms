// src/modules/employee/controller/employee.controller.js
import path from "path";

import { Op } from "sequelize";

import { sequelize } from "../../../db/index.js";

import Employee from "../models/employee.model.js";
import EmployeeDetails from "../models/employeeDetails.model.js";
import EmployeeDocuments from "../models/employeeDocument.model.js";
import EmployeeEmergency from "../models/employeeEmergency.model.js";

import Branch from "../models/branch.model.js";
import Department from "../models/department.model.js";
import Role from "../models/role.model.js";

import PersonnelEmployee from "../../attandance/models/personnel_employee.models.js";
import BaseService from "../../../services/service.js";

const employeeService = new BaseService(Employee);


// ============================================================
// 🔹 Create Employee
// ============================================================

export const getEmpCodeByName = async (req, res) => {
  try {
    const { first_name } = req.query;

    if (!first_name) {
      return res.status(400).json({
        message: "Employee name is required",
      });
    }

    // 🔍 Find employee by name (case-insensitive)
    const employee = await PersonnelEmployee.findOne({
      where: { first_name },
      attributes: ["emp_code"],
    });

    if (!employee) {
      return res.status(404).json({
        message: `Employee with name "${first_name}" not found`,
      });
    }

    return res.status(200).json({
      message: "Employee found",
      data: {
        emp_code: employee.emp_code,
      },
    });
  } catch (error) {
    console.error("❌ Error in getEmpCodeByName:", error);
    return res.status(500).json({
      message: "Failed to fetch employee code",
      error: error.message,
    });
  }
};


export const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      attributes: [
        "id",
        "emp_id",
        "attendance_id",
        [
          sequelize.fn(
            "CONCAT",
            sequelize.col("first_name"),
            " ",
            sequelize.col("last_name")
          ),
          "name",
        ],
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.error("GET employees error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const createEmployee = async (req, res) => {
  try {
    const { first_name, attendance_id, emp_id, ...otherFields } = req.body;

    if (!first_name) {
      return res.status(400).json({
        message: "First name is required",
      });
    }

    const emp_code = attendance_id;
    if (!emp_code) {
      return res.status(400).json({
        message: "Attendance ID is required",
      });
    }

    // Normalize name
    const inputFirst = first_name.trim().toLowerCase();

    // ============================================================
    // 1️⃣ ATT DB — Find by emp_code
    // ============================================================
    const attByCode = await PersonnelEmployee.findOne({
      where: { emp_code },
    });

    // ============================================================
    // 2️⃣ ATT DB — Find by first_name ONLY
    // ============================================================
    const attByFirstName = await PersonnelEmployee.findOne({
      where: {
        first_name,
      },
    });

    // ============================================================
    // CASE A — emp_code NOT found
    // ============================================================
    if (!attByCode) {
      if (attByFirstName) {
        return res.status(400).json({
          message:
            "Employee name already exists in ATT database with a different Attendance ID.",
          existing_emp_code: attByFirstName.emp_code,
        });
      }
      // Allowed → new name + new emp_code
    }

    // ============================================================
    // CASE B — emp_code EXISTS → validate first_name
    // ============================================================
    if (attByCode) {
      const dbFirst = (attByCode.first_name || "").trim().toLowerCase();

      if (dbFirst !== inputFirst) {
        return res.status(400).json({
          message:
            "Attendance ID already exists but belongs to another employee.",
          att_db_name: attByCode.first_name,
          input_name: first_name,
        });
      }
      // Allowed → same first_name + same emp_code
    }

    // ============================================================
    // 3️⃣ HRMS DB CHECK
    // ============================================================
    const hrmsRecord = await Employee.findOne({
      where: { attendance_id: emp_code },
    });

    if (hrmsRecord) {
      return res.status(400).json({
        message: "Attendance ID already exists in HRMS database",
      });
    }

    // ============================================================
    // 4️⃣ CREATE EMPLOYEE
    // ============================================================
    const payload = {
      first_name,
      emp_id,
      attendance_id: emp_code,
      ...otherFields,
      profile_picture: req.file ? req.file.filename : null,
      created_by: req.user?.id || "system",
    };

    const newEmployee = await employeeService.create(payload);

    return res.status(201).json({
      message: "Employee added successfully",
      data: newEmployee,
    });

  } catch (error) {
    console.error("❌ Error in createEmployee:", error);
    return res.status(500).json({
      message: "Failed to create employee",
      error: error.message,
    });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = {
      ...req.body,
      updated_by: req.user?.id || "system",
    };

    if (req.file) {
      payload.profile_picture = `/uploads/employees/${req.file.filename}`;
    }

    const updatedEmployee = await employeeService.update(id, payload);

    return res.status(200).json({
      message: "Employee updated successfully",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("❌ Error in updateEmployee:", error);
    return res.status(500).json({
      message: "Failed to update employee",
      error: error.message,
    });
  }
};

// ============================================================
// 🔹 Get All Employees
// ============================================================
// export const getAllEmployees = async (req, res) => {
//   try {
//     const options = {
//       includeInactive: req.query.includeInactive === "true",
//       search: req.query.search || "",
//       page: parseInt(req.query.page) || 1,
//       limit: parseInt(req.query.limit) || 10,
//       orderBy: req.query.orderBy || "createdAt",
//       order: req.query.order || "ASC",
//       searchFields: ["first_name", "last_name", "emp_id", "attendance_id"],
//     };

//     const result = await employeeService.getAll(options);
   
//     // If you need to format employee pictures:
//     result.rows  = result.rows.map(emp => ({
//       ...emp,
//       profile_picture: formatProfilePic(req, emp.profile_picture),
//     }));


//     return res.status(200).json({
//       message: "Employees fetched successfully",
//       ...result,
//     });
//   } catch (error) {
//     console.error("❌ Error in getAllEmployees:", error);
//     return res.status(500).json({
//       message: "Failed to fetch employees",
//       error: error.message,
//     });
//   }
// };

const formatProfilePic = (req, picture) => {
  if (!picture) return null;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  return `${baseUrl}/uploads/employees/${picture}`;
};

export const getAllEmployees = async (req, res) => {
  try {
    const options = {
      includeInactive: req.query.includeInactive === "true",
      search: req.query.search || "",
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      orderBy: req.query.orderBy || "createdAt",
      order: req.query.order || "ASC",
      searchFields: ["first_name", "last_name", "emp_id", "attendance_id"],
    };

    const result = await employeeService.getAll(options);

    // Clean rows & format pic
    const cleanRows = result.rows.map((emp) => {
      const plain = emp.get({ plain: true });

      return {
        ...plain,
        profile_picture: formatProfilePic(req, plain.profile_picture),
      };
    });

    return res.status(200).json({
      message: "Employees fetched successfully",
      rows: cleanRows,
      count: result.count,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("❌ Error in getAllEmployees:", error);
    return res.status(500).json({
      message: "Failed to fetch employees",
      error: error.message,
    });
  }
};

// ============================================================
// 🔹 Get Employee by ID
// ============================================================
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { id },
      include: [
        {
          model: EmployeeDetails,
          as: "details",
          include: [
            { model: Branch, as: "branch", attributes: ["id", "branch_name", "city", "state"] },
            { model: Department, as: "department", attributes: ["id", "department_name"] },
            { model: Role, as: "designation", attributes: ["id", "role_name"] },
          ],
        },
        {
          model: EmployeeDocuments,
          as: "documents",
          attributes: { exclude: ["created_by", "updated_by", "deletedAt"] },
        },
        {
          model: EmployeeEmergency,
          as: "emergencies",
          attributes: { exclude: ["created_by", "updated_by", "deletedAt"] },
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.status(200).json({
      message: "Employee fetched successfully",
      data: employee,
    });
  } catch (error) {
    console.error("❌ Error in getEmployeeById:", error);
    return res.status(500).json({
      message: "Failed to fetch employee",
      error: error.message,
    });
  }
};

// ============================================================
// 🔹 Delete Employee
// ============================================================
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await employeeService.delete(id);

    return res.status(200).json({
      message: "Employee deleted successfully",
      data: result,
    });
  } catch (error) {
    console.error("❌ Error in deleteEmployee:", error);
    return res.status(500).json({
      message: "Failed to delete employee",
      error: error.message,
    });
  }
};

export const addEmployeeFullInfo = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { employee_id } = req.body;

    if (!employee_id) {
      return res.status(400).json({ message: "employee_id is required" });
    }

    // 🔥 FIX: Validate employee exists
    const employeeExists = await Employee.findByPk(employee_id);
    if (!employeeExists) {
      return res.status(404).json({
        message: "Employee not found for given employee_id"
      });
    }

    const detailsData = req.body.details ? JSON.parse(req.body.details) : {};
    const emergencyData = req.body.emergency ? JSON.parse(req.body.emergency) : [];
    const userId = req.user.id;

    // -----------------------------
    // CREATE EMPLOYEE DETAILS
    // -----------------------------
    const employeeDetails = await EmployeeDetails.create(
      {
        ...detailsData,
        employee_id,
        created_by: userId,
        updated_by: userId
      },
      { transaction }
    );

    const personalDetId = employeeDetails.id;

    // -----------------------------
    // UPLOAD DOCUMENTS
    // -----------------------------
    const docFields = [
      "resume","aadhar","pan","degree","marksheet",
      "relieving","experience","offer","passport",
      "driving","addressproof","bankproof"
    ];

    const uploadedDocs = {};
    docFields.forEach((field) => {
      if (req.files && req.files[field]) {
        try {
          uploadedDocs[field] = path.basename(req.files[field][0].path);
        } catch (e) {
          console.warn("⚠ failed to read file for", field, e.message);
        }
      }
    });

    const employeeDocuments = await EmployeeDocuments.create(
      {
        employee_id,
        personalDetId,
        ...uploadedDocs,
        created_by: userId,
        updated_by: userId
      },
      { transaction }
    );

    // -----------------------------
    // EMERGENCY CONTACTS
    // -----------------------------
    const employeeEmergencies = await Promise.all(
      emergencyData.map((contact) =>
        EmployeeEmergency.create(
          {
            ...contact,
            employee_id,
            personalDetId,
            created_by: userId,
            updated_by: userId
          },
          { transaction }
        )
      )
    );

    await transaction.commit();

    return res.status(201).json({
      message: "Employee full info added successfully",
      data: {
        details: employeeDetails,
        documents: employeeDocuments,
        emergencies: employeeEmergencies
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error adding employee info:", error);
    return res.status(500).json({
      message: "Error adding employee information",
      error: error.message
    });
  }
};

export const updateEmployeeFullInfo = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { employee_id } = req.params; // employee id from URL
    if (!employee_id) {
      return res.status(400).json({ message: "employee_id is required" });
    }

    const userId = req.user.id;

    // 🔥 0️⃣ Validate Employee Exists
    const employeeExists = await Employee.findByPk(employee_id);
    if (!employeeExists) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // ------------------------------------------
    // 🟢 Parse DETAILS JSON (Safe parsing)
    // ------------------------------------------
    let detailsData = {};
    try {
      if (req.body.details && req.body.details.trim() !== "") {
        detailsData = JSON.parse(req.body.details);
      }
    } catch (err) {
      console.warn("⚠ Invalid details JSON:", err.message);
    }

    // ------------------------------------------
    // 🟢 1️⃣ Handle EmployeeDetails
    // ------------------------------------------
    let existingDetails = await EmployeeDetails.findOne({
      where: { employee_id },
      transaction
    });

    if (existingDetails) {
      // update only if changes exist
      if (Object.keys(detailsData).length > 0) {
        const hasChanges = Object.keys(detailsData).some(
          (key) => detailsData[key] != existingDetails[key]
        );

        if (hasChanges) {
          await existingDetails.update(
            { ...detailsData, updated_by: userId },
            { transaction }
          );
          console.log("🟢 Employee details updated.");
        } else {
          console.log("⏩ No changes in employee details.");
        }
      }
    } else {
      // create a fresh details record
      existingDetails = await EmployeeDetails.create(
        { ...detailsData, employee_id, created_by: userId, updated_by: userId },
        { transaction }
      );
      console.log("🟢 Employee details created.");
    }

    const personalDetId = existingDetails.id; // 🔥 IMPORTANT FK

    // ------------------------------------------
    // 🟢 2️⃣ Handle EmployeeDocuments
    // ------------------------------------------
    const docFields = [
      "resume", "aadhar", "pan", "degree", "marksheet",
      "relieving", "experience", "offer", "passport",
      "driving", "addressproof", "bankproof"
    ];

    const uploadedDocs = {};
    docFields.forEach((field) => {
      if (req.files && req.files[field]) {
        uploadedDocs[field] = path.basename(req.files[field][0].path);
      }
    });

    let existingDocs = await EmployeeDocuments.findOne({
      where: { employee_id, personalDetId },
      transaction
    });

    if (existingDocs) {
      if (Object.keys(uploadedDocs).length > 0) {
        const hasDocChanges = Object.keys(uploadedDocs).some(
          (key) => uploadedDocs[key] != existingDocs[key]
        );

        if (hasDocChanges) {
          await existingDocs.update(
            { ...uploadedDocs, updated_by: userId },
            { transaction }
          );
          console.log("🟢 Employee documents updated.");
        } else {
          console.log("⏩ No document changes.");
        }
      }
    } else {
      await EmployeeDocuments.create(
        {
          employee_id,
          personalDetId,
          ...uploadedDocs,
          created_by: userId,
          updated_by: userId
        },
        { transaction }
      );
      console.log("🟢 Employee documents created.");
    }

    // ------------------------------------------
    // 🟢 3️⃣ Handle Emergency Contacts (Clean)
    // ------------------------------------------
    let emergencyData = [];
    try {
      if (req.body.emergency && req.body.emergency.trim() !== "") {
        emergencyData = JSON.parse(req.body.emergency);
      }
    } catch (err) {
      console.warn("⚠ Invalid emergency JSON:", err.message);
    }

    const existingContacts = await EmployeeEmergency.findAll({
      where: { employee_id, personalDetId },
      transaction
    });

    const updatedOrCreatedIds = [];

    for (const contact of emergencyData) {
      if (contact.id) {
        // find existing by id
        const existing = existingContacts.find((c) => c.id === contact.id);

        if (existing) {
          const hasChanges = Object.keys(contact).some(
            (key) => contact[key] != existing[key]
          );
          if (hasChanges) {
            await existing.update(
              { ...contact, updated_by: userId },
              { transaction }
            );
            console.log(`🟢 Updated emergency contact: ${contact.id}`);
          }
          updatedOrCreatedIds.push(contact.id);
        } else {
          const newC = await EmployeeEmergency.create(
            {
              ...contact,
              employee_id,
              personalDetId,
              created_by: userId,
              updated_by: userId
            },
            { transaction }
          );
          updatedOrCreatedIds.push(newC.id);
          console.log(`🟢 Created new contact (id mismatch): ${newC.id}`);
        }
      } else {
        // new contact
        const newC = await EmployeeEmergency.create(
          {
            ...contact,
            employee_id,
            personalDetId,
            created_by: userId,
            updated_by: userId
          },
          { transaction }
        );
        updatedOrCreatedIds.push(newC.id);
        console.log("🟢 Created new emergency contact.");
      }
    }

    // delete removed contacts
    for (const old of existingContacts) {
      if (!updatedOrCreatedIds.includes(old.id)) {
        await old.destroy({ transaction });
        console.log(`🗑 Deleted emergency contact: ${old.id}`);
      }
    }

    // ------------------------------------------
    // 🟢 Commit
    // ------------------------------------------
    await transaction.commit();

    return res.status(200).json({
      message: "Employee full info updated successfully",
    });

  } catch (error) {
    await transaction.rollback();
    console.error("❌ Error updating employee info:", error);
    return res.status(500).json({
      message: "Error updating employee information",
      error: error.message,
    });
  }
};


// =======================================================
// 🔹 Get Employee full info by emp_id (formatted output)
// =======================================================
export const getEmployeeDetById = async (req, res) => {
  try {
    const { emp_id } = req.params;

    // Try to find by either UUID or formatted emp_id
    const employee = await Employee.findOne({
      where: {
        [Op.or]: [{ id: emp_id }, { emp_id }],
      },
      include: [
        {
          model: EmployeeDetails,
          as: "details",
          include: [
            { model: Branch, as: "branch", attributes: ["id", "branch_name"] },
            { model: Department, as: "department", attributes: ["id", "department_name"] },
            { model: Role, as: "designation", attributes: ["id", "role_name"] },
          ],
        },
        {
          model: EmployeeDocuments,
          as: "documents",
          attributes: [
            "resume",
            "aadhar",
            "pan",
            "degree",
            "marksheet",
            "relieving",
            "experience",
            "offer",
            "passport",
            "driving",
            "addressproof",
            "bankproof",
          ],
        },
        {
          model: EmployeeEmergency,
          as: "emergencies",
          attributes: [
            "emergency_contact_name",
            "emergency_contact_relation",
            "emergency_contact_phone",
            "emergency_contact_address",
          ],
        },
      ],
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // 🧩 Format the response output
    const formattedData = {
      id: employee.id,
      emp_id: employee.emp_id,
      first_name: employee.first_name,
      last_name: employee.last_name,
      status: employee.status,
      details: employee.details
        ? {
            dob: employee.details.dob,
            branch_name: employee.details.branch?.branch_name || null,
            branch_id: employee.details.branch?.id || null,
            department_name: employee.details.department?.department_name || null,
            department_id: employee.details.department?.id || null,
            role_name: employee.details.designation?.role_name || null,
            role_id: employee.details.designation?.id || null,
          }
        : null,
      documents: employee.documents || null,
      emergencies: employee.emergencies || [],
    };

    return res.status(200).json({
      message: "Employee details fetched successfully",
      data: formattedData,
    });
  } catch (error) {
    console.error("❌ Error fetching employee:", error);
    return res.status(500).json({
      message: "Server error while fetching employee details",
      error: error.message,
    });
  }
};


// // ✅ 1. Registered Employees

export const getRegisteredEmployees = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const orderBy = req.query.orderBy || "createdAt";
    const order = req.query.order || "ASC";

    const employees = await Employee.findAndCountAll({
      where: {
        deleted_at: null,
        ...(search && {
          [Op.or]: [
            { first_name: { [Op.like]: `%${search}%` } },
            { last_name: { [Op.like]: `%${search}%` } },
            { emp_id: { [Op.like]: `%${search}%` } },
            { attendance_id: { [Op.like]: `%${search}%` } },
          ],
        }),
      },
      include: [
        {
          model: EmployeeDetails,
          as: "details",
          required: true, // inner join => registered only
        },
      ],
      order: [[orderBy, order]],
      limit,
      offset,
    });

    return res.status(200).json({
      message: "Registered employees fetched successfully",
      rows: employees.rows,
      count: employees.count,
      page,
      limit,
      totalPages: Math.ceil(employees.count / limit),
    });
  } catch (error) {
    console.error("❌ Error in getRegisteredEmployees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Unregistered Employees (Paginated + Search + Sorting)

export const getUnregisteredEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const service = new BaseService(Employee);

    const response = await service.getAll({
      page: Number(page),
      limit: Number(limit),
      extraOptions: {
        include: [
          {
            model: EmployeeDetails,
            as: "details",
            required: false,
          },
        ],
        having: sequelize.literal(`details.id IS NULL`),
        subQuery: false,
      },
    });

    res.status(200).json({
      message: "Unregistered employees fetched successfully",
      ...response,
    });

  } catch (error) {
    console.error("❌ Error in getUnregisteredEmployees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




export default {
  createEmployee,
  getEmployees,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  addEmployeeFullInfo,
  updateEmployeeFullInfo,
  getEmpCodeByName,
  getEmployeeDetById,
  getRegisteredEmployees,
  getUnregisteredEmployees,
  getEmployees
};
