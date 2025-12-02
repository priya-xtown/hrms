// export default Employee;
import { DataTypes, Op } from "sequelize";
import { sequelize } from "../../../db/index.js";

const Employee = sequelize.define(
  "Employee",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false, 
    },
    emp_id: {
      // emp_id is a formatted string like "XT-25-001" — keep it STRING
      type: DataTypes.STRING,
      allowNull: true,   // allow null because hook will generate if not provided
      allowNull: true,
      unique: true,
    },
    attendance_id: {
      type: DataTypes.STRING,
      allowNull: false,   // allow null to avoid insert failures (controller sets it)
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date_of_joining: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    reporting_manager: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employee_type: {
      type: DataTypes.ENUM("Permanent", "Contract", "Intern"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },
    shift_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true, // made nullable to allow "system" or missing user during development
      references: {
        model: "endusers",
        key: "id",
      },
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "endusers",
        key: "id",
      },
    },
  },
  {
    tableName: "employees",
    timestamps: true,
    paranoid: true, 
    deletedAt: "deleted_at",

    hooks: {
  beforeCreate: async (employee) => {
    if (!employee.emp_id) {
      const year = new Date().getFullYear().toString().slice(-2);
      const prefix = `XT-${year}-`;

      // Fetch all emp_ids for the current year
      const lastEmployee = await Employee.findOne({
        where: { emp_id: { [Op.like]: `${prefix}%` } },
        order: [["emp_id", "DESC"]],
        paranoid: false, // include soft-deleted
      });

      let sequence = 1;
      if (lastEmployee && lastEmployee.emp_id) {
        const parts = lastEmployee.emp_id.split("-");
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }

      const paddedSeq = String(sequence).padStart(3, "0");
      employee.emp_id = `${prefix}${paddedSeq}`;
    }
  },
}

  }
);


export default Employee;

