// models/user.model.js
import { DataTypes } from "sequelize";
import { sequelize } from "../../../db/index.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM("user", "admin", "superadmin"),
      allowNull: false,
      defaultValue: "user",
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(60),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        is: /^[0-9]{10,15}$/,
      },
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: true,
    },
    otp_expires_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    otp_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_by_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_by_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_by_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_by_email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "endusers",
    timestamps: true,
  }
);

export default User;
