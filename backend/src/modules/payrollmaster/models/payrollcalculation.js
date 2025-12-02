import { DataTypes } from "sequelize";
import sequelize from "../../../db/index.js"; // Corrected import statement

const PayrollCalculation = sequelize.define(
    "payroll_calculation",
    {
        calculation_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Sequelize handles UUID automatically
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
        TotalWorking_Days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        present_Days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        absent_Days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        leave_Days: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total_salary: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
    {
        timestamps: true,
    }
);

export default PayrollCalculation;
        
