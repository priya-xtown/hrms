import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";
import Employee from "./employee.model.js"; // main Employee model

const EmployeeDocuments = sequelize.define(
  "EmployeeDocuments",
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

    // in your EmployeeDocuments model definition
personalDetId: {
  type: DataTypes.UUID,
  allowNull: false,
  references: {
    model: "employee_details",
    key: "id",
  },
  onDelete: "CASCADE",
  onUpdate: "CASCADE"
},

    // ========================================================
    // 🔹 DOCUMENT UPLOADS
    // ========================================================
    resume: { type: DataTypes.STRING(255), allowNull: true },
    aadhar: { type: DataTypes.STRING(255), allowNull: true },
    pan: { type: DataTypes.STRING(255), allowNull: true },
    degree: { type: DataTypes.STRING(255), allowNull: true },
    marksheet: { type: DataTypes.STRING(255), allowNull: true },
    relieving: { type: DataTypes.STRING(255), allowNull: true },
    experience: { type: DataTypes.STRING(255), allowNull: true },
    offer: { type: DataTypes.STRING(255), allowNull: true },
    passport: { type: DataTypes.STRING(255), allowNull: true },
    driving: { type: DataTypes.STRING(255), allowNull: true },
    addressproof: { type: DataTypes.STRING(255), allowNull: true },
    bankproof: { type: DataTypes.STRING(255), allowNull: true },

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
    tableName: "employee_documents",
    timestamps: true,
    paranoid: true, // soft delete enabled
  }
);

// ========================================================
// 🔹 ASSOCIATIONS
// ========================================================
// Employee.hasOne(EmployeeDocuments, {
//   foreignKey: "emp_id",
//   sourceKey: "emp_id",
//   as: "documents",
// });

// EmployeeDocuments.belongsTo(Employee, {
//   foreignKey: "emp_id",
//   targetKey: "emp_id",
//   as: "employee",
// });


export default EmployeeDocuments;
