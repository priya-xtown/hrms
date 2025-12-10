// import Department from "../modules/employee/models/department.model.js";
// import Role from "../modules/employee/models/role.model.js";
// import PersonnelEmployee from '../modules/attandance/models/personalempolye.models.js';
// import Employee from '../modules/employee/models/employeeDetails.model.js';
// import EmployeeDetails from '../modules/employee/models/employee.model.js';
// import Attendance from '../modules/attandance/models/attandance.models.js';
// import Addondutty from '../modules/attandance/models/addon.models.js';
// import Leave from '../modules/attandance/models/leave.models.js';
// import Overtime from '../modules/attandance/models/overtime.models.js';
// import Branch from "../modules/employee/models/branch.model.js";





// // Employee → EmployeeDetails
// Employee.hasOne(EmployeeDetails, {
//   foreignKey: "employee_id", // EmployeeDetails.emp_id
//   sourceKey: "id",       // Employee.id
//   as: "details",
// });

// EmployeeDetails.belongsTo(Employee, {
//   foreignKey: "employee_id", // EmployeeDetails.emp_id
//   targetKey: "id",       // Employee.id
//   as: "employee",
// });

// // Each detail belongs to one branch
// EmployeeDetails.belongsTo(Branch, {
//   foreignKey: "branchId",
//   as: "branch",
// });

// // Each detail belongs to one department
// EmployeeDetails.belongsTo(Department, {
//   foreignKey: "departmentId",
//   as: "department",
// });

// // Each detail belongs to one role (designation)
// EmployeeDetails.belongsTo(Role, {
//   foreignKey: "designationId",
//   as: "designation",
// });


// Department.hasMany(Role, { foreignKey: "department_id", as: "roles" });
// Role.belongsTo(Department, { foreignKey: "department_id", as: "department" });

// Employee.belongsTo(PersonnelEmployee, { foreignKey: "attendance_id", as: "attendance", targetKey: "emp_code"});

// Employee.hasMany(Attendance, { foreignKey: "emp_id", sourceKey: "emp_id" });
// Attendance.belongsTo(Employee, { foreignKey: "emp_id", targetKey: "emp_id" });

// Employee.hasMany(Addondutty, {foreignKey: "emp_id", sourceKey: "emp_id", as: "addon_duties",});

// Addondutty.belongsTo(Employee, { foreignKey: "emp_id", targetKey: "emp_id", as: "employee",});

// Employee.hasMany(Leave, { foreignKey: "emp_id", sourceKey: "emp_id" });
// Leave.belongsTo(Employee, { foreignKey: "emp_id", targetKey: "emp_id" });

// Employee.hasMany(Overtime, { foreignKey: "emp_id", sourceKey: "emp_id" });
// Overtime.belongsTo(Employee, { foreignKey: "emp_id", targetKey: "emp_id" });

// Attendance.hasMany(Overtime, { foreignKey: "attendance_id" });
// Overtime.belongsTo(Attendance, { foreignKey: "attendance_id" });

// export { Department, Role };


import Department from "../modules/employee/models/department.model.js";
import Role from "../modules/employee/models/role.model.js";

import Employee from "../modules/employee/models/employee.model.js"; // ✔ correct
import EmployeeDetails from "../modules/employee/models/employeeDetails.model.js"; // ✔ correct
import EmployeeDocuments from "../modules/employee/models/employeeDocument.model.js"; // ✔ correct
import EmployeeEmergency from "../modules/employee/models/employeeEmergency.model.js"; // ✔ correct
import Attendance from "../modules/attandance/models/attandance.models.js";
import Addondutty from "../modules/attandance/models/addon.models.js";
import Leave from "../modules/attandance/models/leave.models.js";
import Overtime from "../modules/attandance/models/overtime.models.js";

import Branch from "../modules/employee/models/branch.model.js";
import PersonnelEmployee from "../modules/attandance/models/personnel_employee.models.js";


// // --------------------------------------------------------
// //  Employee → EmployeeDetails  (1 : 1)
// // --------------------------------------------------------
// Employee.hasOne(EmployeeDetails, {
//   foreignKey: "employee_id",  // FK inside EmployeeDetails
//   sourceKey: "id",            // PK inside Employee
//   as: "details",
// });

// EmployeeDetails.belongsTo(Employee, {
//   foreignKey: "employee_id",
//   targetKey: "id",
//   as: "employee",
// });


// Employee.hasOne(EmployeeDocuments, {
//   foreignKey: "employee_id", // EmployeeDocuments.emp_id
//   sourceKey: "id",       // Employee.id
//   as: "documents",
// });

// EmployeeDocuments.belongsTo(Employee, {
//   foreignKey: "employee_id", // EmployeeDocuments.emp_id
//   targetKey: "id",       // Employee.id
//   as: "employee",
// });

// Employee.hasMany(EmployeeEmergency, {
//   foreignKey: "employee_id", // EmployeeEmergency.emp_id
//   sourceKey: "id",       // Employee.id
//   as: "emergencies",
// });

// EmployeeEmergency.belongsTo(Employee, {
//   foreignKey: "employee_id", // EmployeeEmergency.emp_id
//   targetKey: "id",       // Employee.id
//   as: "employee",
// });


// --------------------------------------------------------
//  Employee  →  EmployeeDetails   (1 : 1)
// --------------------------------------------------------
Employee.hasOne(EmployeeDetails, {
  foreignKey: "employee_id",   // FK inside EmployeeDetails
  sourceKey: "id",
  as: "details",
});

EmployeeDetails.belongsTo(Employee, {
  foreignKey: "employee_id",
  targetKey: "id",
  as: "employee",
});


// --------------------------------------------------------
//  Employee  →  EmployeeDocuments   (1 : 1)
// --------------------------------------------------------
Employee.hasOne(EmployeeDocuments, {
  foreignKey: "employee_id",   // FK inside EmployeeDocuments
  sourceKey: "id",
  as: "documents",
});

EmployeeDocuments.belongsTo(Employee, {
  foreignKey: "employee_id",
  targetKey: "id",
  as: "employee",
});


// --------------------------------------------------------
//  Employee  →  EmployeeEmergency   (1 : Many)
// --------------------------------------------------------
Employee.hasMany(EmployeeEmergency, {
  foreignKey: "employee_id",   // FK inside EmployeeEmergency
  sourceKey: "id",
  as: "emergencies",
});

EmployeeEmergency.belongsTo(Employee, {
  foreignKey: "employee_id",
  targetKey: "id",
  as: "employee",
});


// --------------------------------------------------------
//  EmployeeDetails  →  EmployeeDocuments   (1 : 1)
// --------------------------------------------------------
EmployeeDetails.hasOne(EmployeeDocuments, {
  foreignKey: "personalDetId",
  sourceKey: "id",
  as: "documents",
});

EmployeeDocuments.belongsTo(EmployeeDetails, {
  foreignKey: "personalDetId",
  targetKey: "id",
  as: "details",
});


// --------------------------------------------------------
//  EmployeeDetails  →  EmployeeEmergency   (1 : Many)
// --------------------------------------------------------
EmployeeDetails.hasMany(EmployeeEmergency, {
  foreignKey: "personalDetId",
  sourceKey: "id",
  as: "emergencies",
});

EmployeeEmergency.belongsTo(EmployeeDetails, {
  foreignKey: "personalDetId",
  targetKey: "id",
  as: "details",
});

// --------------------------------------------------------
// EmployeeDetails → Branch / Department / Role
// --------------------------------------------------------
EmployeeDetails.belongsTo(Branch, {
  foreignKey: "branchId",
  as: "branch",
});

EmployeeDetails.belongsTo(Department, {
  foreignKey: "departmentId",
  as: "department",
});

EmployeeDetails.belongsTo(Role, {
  foreignKey: "designationId",
  as: "designation",
});

// --------------------------------------------------------
// Department → Roles  (1 : many)
// --------------------------------------------------------
Department.hasMany(Role, {
  foreignKey: "department_id",
  as: "roles",
});

Role.belongsTo(Department, {
  foreignKey: "department_id",
  as: "department",
});

// --------------------------------------------------------
// Employee ↔ PersonnelEmployee  (1 : 1 or 1 : Many)  
// Employee.emp_id  <->  PersonnelEmployee.emp_code
// --------------------------------------------------------
Employee.hasOne(PersonnelEmployee, {
  foreignKey: "emp_code",
  sourceKey: "emp_id",
  as: "attendance",
});

PersonnelEmployee.belongsTo(Employee, {
  foreignKey: "emp_code",
  targetKey: "emp_id",
  as: "employee",
});



// --------------------------------------------------------
// Employee → PersonnelEmployee   (attendance profile)
// --------------------------------------------------------
// Employee.belongsTo(PersonnelEmployee, {
//   foreignKey: "attendance_id",
//   as: "attendance",
//   targetKey: "emp_code",
// });

// --------------------------------------------------------
// Attendance relationships
// Employee.emp_id → Attendance.emp_id
// --------------------------------------------------------
Employee.hasMany(Attendance, {
  foreignKey: "emp_id",
  sourceKey: "emp_id",
  as: "attendances",
});

Attendance.belongsTo(Employee, {
  foreignKey: "emp_id",
  targetKey: "emp_id",
  as: "employee",
});

// --------------------------------------------------------
// Addon Duty (Addondutty)
// Employee.emp_id → Addondutty.emp_id
// --------------------------------------------------------
Employee.hasMany(Addondutty, {
  foreignKey: "emp_id",
  sourceKey: "emp_id",
  as: "addon_duties",
});

Addondutty.belongsTo(Employee, {
  foreignKey: "emp_id",
  targetKey: "emp_id",
  as: "employee",
});

// --------------------------------------------------------
// Leaves
// Employee.emp_id → Leave.emp_id
// --------------------------------------------------------
Employee.hasMany(Leave, {
  foreignKey: "emp_id",
  sourceKey: "emp_id",
  as: "leaves",
});

Leave.belongsTo(Employee, {
  foreignKey: "emp_id",
  targetKey: "emp_id",
  as: "employee",
});

// --------------------------------------------------------
// Overtime
// Employee.emp_id → Overtime.emp_id
// --------------------------------------------------------
Employee.hasMany(Overtime, {
  foreignKey: "emp_id",
  sourceKey: "emp_id",
  as: "overtimes",
});

Overtime.belongsTo(Employee, {
  foreignKey: "emp_id",
  targetKey: "emp_id",
  as: "employee",
});

// --------------------------------------------------------
// Attendance → Overtime
// attendance.id → overtime.attendance_id
// --------------------------------------------------------
Attendance.hasMany(Overtime, {
  foreignKey: "attendance_id",
  as: "overtimes",
});

Overtime.belongsTo(Attendance, {
  foreignKey: "attendance_id",
  as: "attendance",
});


export {
  Employee,
  EmployeeDetails,
  Department,
  Role,
  Branch,
  PersonnelEmployee,
  Attendance,
  Addondutty,
  Leave,
  Overtime,
};

