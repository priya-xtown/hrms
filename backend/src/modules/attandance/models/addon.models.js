// src/modules/addondutty/models/addondutty.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";
import Employee from "../../employee/models/employee.model.js";

const Addondutty = sequelize.define(
  "Addondutty",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    emp_id: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: Employee,
        key: "emp_id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    total_hours: {
      type: DataTypes.FLOAT, // store in hours (decimal)
      allowNull: true,
    },

    reason: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("approve", "denied", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    tableName: "addondutty",
    timestamps: true,

    hooks: {
      beforeCreate: (record) => {
        if (record.start_time && record.end_time) {
          const start = new Date(`1970-01-01T${record.start_time}Z`);
          const end = new Date(`1970-01-01T${record.end_time}Z`);
          const diffMs = end - start;
          const diffHours = diffMs / (1000 * 60 * 60);
          record.total_hours = diffHours > 0 ? diffHours : 0;
        }
      },
      beforeUpdate: (record) => {
        if (record.start_time && record.end_time) {
          const start = new Date(`1970-01-01T${record.start_time}Z`);
          const end = new Date(`1970-01-01T${record.end_time}Z`);
          const diffMs = end - start;
          const diffHours = diffMs / (1000 * 60 * 60);
          record.total_hours = diffHours > 0 ? diffHours : 0;
        }
      },
    },
  }
);

export default Addondutty;
