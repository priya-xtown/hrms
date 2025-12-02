import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";

const Division = sequelize.define(
  "Division",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
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
      references : {
        model : "endusers",
        key : "id"
      }

    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references : {
        model : "endusers",
        key : "id"
      }
    },
  },
  {
    tableName: "divisions",
    timestamps: true,
    paranoid: true,
    deletedAt: "deleted_at",
  }
);

export default Division;
