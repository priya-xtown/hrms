import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";
import Employee from "../../employee/models/employee.model.js";

const Leave = sequelize.define(
  "Leave",
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
        model: "employees",
        key: "emp_id",
      },
    },
    emp_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    leave_type: {
      type: DataTypes.ENUM("Casual", "Sick", "Permission", "Other"),
      allowNull: false,
    },
    from_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    to_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    from_time: {
      type: DataTypes.TIME,
      allowNull: true, // for permissions
    },
    to_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Pending", "Approved", "Denied"),
      defaultValue: "Pending",

    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "leaves",
    timestamps: true,
    paranoid: true,
    // deletedAt: "deleted_at",
  }
);


export default Leave;
