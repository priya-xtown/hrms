import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";
import { sequelize } from "../../../db/index.js"; // ✅ Correct import

const payrollSlip = sequelize.define(
  "payroll_slip",
  { 
    payroll_slip_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // ✅ Sequelize handles UUID automatically
        primaryKey: true,
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "employees", // name of Target model
        key: "employee_id", // key in Target model that we're referencing
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    employee_name: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "employees", // name of Target model
        key: "employee_name", // key in Target model that we're referencing
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    basic_salary: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    allowances: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deductions: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    bonus: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,    
    },
    net_salary: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    actions:{
        type: DataTypes.JSON,
        allowNull: true,
    },
    },
    {   
        tableName: "payroll_slips",
        timestamps: true,
        paranoid: true,

    }
);

export default payrollSlip;