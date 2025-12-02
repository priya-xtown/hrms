import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";
import Employee from "./employee.model.js"; // main Employee model

const EmployeeEmergency = sequelize.define(
  "EmployeeEmergency",
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
    // 🔹 EMERGENCY CONTACT DETAILS
    // ========================================================
    emergency_contact_name: { type: DataTypes.STRING(100), allowNull: true },
    emergency_contact_relation: { type: DataTypes.STRING(50), allowNull: true },
    emergency_contact_phone: { type: DataTypes.STRING(15), allowNull: true },
    emergency_contact_address: { type: DataTypes.TEXT, allowNull: true },

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
    tableName: "employee_emergency",
    timestamps: true,
    paranoid: true, // enables soft delete
  }
);

// ========================================================
// 🔹 ASSOCIATIONS
// ========================================================
// Employee.hasMany(EmployeeEmergency, {
//   foreignKey: "emp_id",
//   sourceKey: "emp_id",
//   as: "emergencies",
// });

// EmployeeEmergency.belongsTo(Employee, {
//   foreignKey: "emp_id",
//   targetKey: "emp_id",
//   as: "employee",
// });

// Employee.hasOne(EmployeeDocuments, {
//   foreignKey: "employee_id", // EmployeeDocuments.emp_id
//   sourceKey: "id",       // Employee.id
//   as: "documents",
// });

// EmployeeDocuments.belongsTo(Employee, {
//   foreignKey: "employee_id", // EmployeeDocuments.emp_id
//   targetKey: "id",       // Employee.id
//   as: "employee",
// });

// Employee.hasMany(EmployeeEmergency, {
//   foreignKey: "employee_id", // EmployeeEmergency.emp_id
//   sourceKey: "id",       // Employee.id
//   as: "emergencies",
// });

// EmployeeEmergency.belongsTo(Employee, {
//   foreignKey: "employee_id", // EmployeeEmergency.emp_id
//   targetKey: "id",       // Employee.id
//   as: "employee",
// });


export default EmployeeEmergency;
