// src/modules/shiftmaster/models/shift.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js"; // ✅ same style as CompanyAsset

const Shift = sequelize.define(
  "Shift",
  {
    shift_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shift_name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    break_start_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    break_end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    total_hours: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        min: 0,
        max: 24,
      },
    },
    min_in_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    max_out_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "shifts",
    timestamps: true,
    paranoid: true, // ✅ enables soft delete
  }
);

export default Shift;
