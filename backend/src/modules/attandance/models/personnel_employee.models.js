
import { DataTypes } from "sequelize";
import { att } from "../../../db/xtown.js";

const PersonnelEmployee = att.define(
  "PersonnelEmployee",
  {
    id: {
      type: DataTypes.STRING(36),
      primaryKey: true,
      allowNull: false,
    },
    create_time: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    create_user: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    change_time: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    change_user: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
    },
    emp_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(25),
      allowNull: true,
    },
    nickname: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    passport: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    driver_license_automobile: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    driver_license_motorcycle: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    enable_outdoor_management: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    photo: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    self_password: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    device_password: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    dev_privilege: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    card_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    acc_group: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    acc_timezone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING(1),
      allowNull: true,
    },
    birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    postcode: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    office_tel: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    contact_tel: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    national: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    religion: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    enroll_sn: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    ssn: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    update_time: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    hire_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    verify_mode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    emp_type: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    enable_att: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    enable_payroll: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    enable_overtime: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    enable_holiday: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    enable_whatsapp: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    whatsapp_exception: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    whatsapp_punch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    reserved: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    del_tag: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    app_status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    app_role: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    enable_sms: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sms_exception: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    sms_punch: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    last_login: {
      type: DataTypes.DATE(6),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    company_id: {
      type: DataTypes.CHAR(32),
      allowNull: true,
    },
    otp: {
      type: DataTypes.STRING(8),
      allowNull: true,
    },
    verified_employee: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    app_punch_status: {
      type: DataTypes.SMALLINT,
      allowNull: true,
    },
    preferences: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "personnel_employee",
    timestamps: false,
    // indexes: [
    //   {
    //     unique: true,
    //     fields: ["emp_code", "company_id"],
    //   },
    //   {
    //     fields: ["department_id"],
    //   },
    //   {
    //     fields: ["location_id"],
    //   },
    //   {
    //     fields: ["position_id"],
    //   },
    //   {
    //     fields: ["company_id", "department_id", "emp_code"],
    //   },
    // ],
  }
);

export default PersonnelEmployee;