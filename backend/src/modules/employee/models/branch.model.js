import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";

const Branch = sequelize.define(
  "Branch",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    branch_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pincode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
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
    tableName: "branches",
    timestamps: true,
    paranoid: true, // Soft delete
    deletedAt: "deleted_at",
  }
);

export default Branch;
