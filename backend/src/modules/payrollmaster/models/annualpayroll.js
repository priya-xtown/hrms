import { DataTypes } from "sequelize";
import {sequelize} from "../../../db/index.js";
import Employee from "../../employee/models/employee.model.js";

const AnnualPayroll = sequelize.define(
    "annual_payroll",
    {
        annual_payroll_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4, // Sequelize handles UUID automatically
            primaryKey: true,
        },
        employee_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "employees", // name of Target model
                key: "emp_id", // key in Target model that we're referencing
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        employee_name: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: "employees", // name of Target model
                key: "first_name", // key in Target model that we're referencing
            },
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
        },
        department_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        branch_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        total_annual_salary: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: false,
        },
        increment:{
            type: DataTypes.ENUM("percentage","digit"),
            allowNull: false,
        },  
        esi_pf:{
            type: DataTypes.ENUM("yes","no"),
            allowNull: false,
            field: "esi & pf",
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false,
        },
        created_by: {
            type: DataTypes.UUID,
            allowNull: false,
            references : {
                model: "endusers",
                key: "id"
            }
        },
        updated_by: {
            type: DataTypes.UUID,
            allowNull: true,
            references : {
                model: "endusers",
                key: "id"
            }
        }
    },
    {
        tableName: "annual_payrolls",
        timestamps: true,
        paranoid: true,
        deletedAt: "deleted_at",
    }
);
Employee.hasMany(AnnualPayroll, { foreignKey: "emp_id", sourceKey: "emp_id" });
AnnualPayroll.belongsTo(Employee, { foreignKey: "emp_id", targetKey: "emp_id" });


export default AnnualPayroll;
