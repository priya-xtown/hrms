import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";


const Attendance = sequelize.define(
  "attendance",
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
        model: "employees", // or Employee if you prefer (see note)
        key: "emp_id",
      },
    },
    emp_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    time_in: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    time_out: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Present", "Absent", "Leave", "Half-Day",'Casual','Sick','Permission','Other'),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    // If you want to explicitly declare deletedAt, use DATE:
    // deletedAt: {
    //   type: DataTypes.DATE,
    //   allowNull: true,
    // },
  },
  {
    tableName: "attendances", // set to actual DB table name; change to "attendance" if that's the table
    timestamps: true,         // <-- move here (options)
    paranoid: true,           // <-- move here (options)
    underscored: false,       // optional: if you use snake_case columns
  }
);


export default Attendance;
