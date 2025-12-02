import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";
// import Employee from "./employee.model.js"; // main Employee model
// import Branch from "./branch.model.js";
// import Department from "./department.model.js";
// import Role from "./role.model.js";

const EmployeeDetails = sequelize.define(
  "EmployeeDetails",
  {
    // ========================================================
    // 🔹 PRIMARY KEY
    // ========================================================
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    // ========================================================
    // 🔹 FOREIGN KEY REFERENCE
    // ========================================================
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    // ========================================================
    // 🔹 PERSONAL INFORMATION
    // ========================================================
    dob: { type: DataTypes.DATEONLY, allowNull: true },
    gender: { type: DataTypes.ENUM("Male", "Female", "Other"), allowNull: true },
    marital_status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    blood_group: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nationality: { type: DataTypes.STRING(50), allowNull: true },

    // ========================================================
    // 🔹 CONTACT INFORMATION
    // ========================================================
    permanent_address: { type: DataTypes.TEXT, allowNull: true },
    current_address: { type: DataTypes.TEXT, allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(100), allowNull: true },
    zip_code: { type: DataTypes.STRING(20), allowNull: true },
    mobile_number: { type: DataTypes.STRING(15), allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: true },

    // ========================================================
    // 🔹 JOB & EMPLOYMENT DETAILS
    // ========================================================
    designationId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "roles", key: "id" },
    },
    departmentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "departments", key: "id" },
    },
    branchId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "branches", key: "id" },
    },
    
    // ========================================================
    // 🔹 COMPENSATION & PAYROLL DETAILS
    // ========================================================
    basic_salary: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    allowance: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    bonus: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    deductions: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
    net_salary: { type: DataTypes.DECIMAL(10, 2), allowNull: true },

    // ========================================================
    // 🔹 Bank DETAILS
    // ========================================================
    bank_name: { type: DataTypes.STRING(100), allowNull: true },
    bank_account_number: { type: DataTypes.STRING(30), allowNull: true },
    ifsc_code: { type: DataTypes.STRING(20), allowNull: true },
    branch_name: { type: DataTypes.STRING(100), allowNull: true },

    // ========================================================
    // 🔹 GOVERNMENT & LEGAL DETAILS
    // ========================================================
    pan_number: { type: DataTypes.STRING(20), allowNull: true },
    aadhar_number: { type: DataTypes.STRING(20), allowNull: true },
    pf_number: { type: DataTypes.STRING(30), allowNull: true },
    tax_no: { type: DataTypes.STRING(50), allowNull: true },
   
   
    // ========================================================
    // 🔹 EXPERIENCE DETAILS
    // ========================================================
    company_name: { type: DataTypes.STRING(150), allowNull: true },
    previous_designation: { type: DataTypes.STRING(100), allowNull: true },
    previous_department: { type: DataTypes.STRING(100), allowNull: true },
    exp_start_date: { type: DataTypes.DATEONLY, allowNull: true },
    exp_end_date: { type: DataTypes.DATEONLY, allowNull: true },
    exp_location: { type: DataTypes.STRING(100), allowNull: true },
    responsibilities: { type: DataTypes.TEXT, allowNull: true },

     // ========================================================
    // 🔹 EDUCATION DETAILS
    // ========================================================
    qualification: { type: DataTypes.STRING(100), allowNull: true },
    specialization: { type: DataTypes.STRING(100), allowNull: true },
    institution_name: { type: DataTypes.STRING(150), allowNull: true },
    university_name: { type: DataTypes.STRING(150), allowNull: true },
    edu_start_date: { type: DataTypes.DATEONLY, allowNull: true },
    edu_end_date: { type: DataTypes.DATEONLY, allowNull: true },
    percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    certifications: { type: DataTypes.TEXT, allowNull: true },

    // ========================================================
    // 🔹 ASSET DETAILS
    // ========================================================
    asset_type: { type: DataTypes.STRING(255), allowNull: true },
    model: { type: DataTypes.STRING(255), allowNull: true },
    issued_date: { type: DataTypes.DATEONLY, allowNull: true },
    return_date: { type: DataTypes.DATEONLY, allowNull: true },

    // ========================================================
    // 🔹 CONTROL FIELDS
    // ========================================================
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "endusers", key: "id" },
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "endusers", key: "id" },
    },
  },
  {
    tableName: "employee_details",
    timestamps: true,
    paranoid: true,
  }
);

// ========================================================
// 🔹 ASSOCIATIONS
// ========================================================
// Employee.hasOne(EmployeeDetails, {
//   foreignKey: "emp_id",
//   sourceKey: "emp_id",
//   as: "details",
// });

// EmployeeDetails.belongsTo(Employee, {
//   foreignKey: "emp_id",
//   targetKey: "emp_id",
//   as: "employee",
// });

// // Each detail belongs to one branch
// EmployeeDetails.belongsTo(Branch, {
//   foreignKey: "branchId",
//   as: "branch",
// });

// // Each detail belongs to one department
// EmployeeDetails.belongsTo(Department, {
//   foreignKey: "departmentId",
//   as: "department",
// });

// // Each detail belongs to one role (designation)
// EmployeeDetails.belongsTo(Role, {
//   foreignKey: "designationId",
//   as: "designation",
// });


export default EmployeeDetails;
