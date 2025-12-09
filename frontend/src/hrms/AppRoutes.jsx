// import { Routes, Route } from "react-router-dom";
// import EmployeeList from "./pages/EmployeeList";
// import { TeamOutlined } from "@ant-design/icons";

// // import Shiftconfiguration from "./pages/ShiftConfig/ShiftConfiguration";
// import RoleMaster from "./pages/Rolemaster/RoleMasters";
// import HrmsDashboard from "./pages/Dashboard";
// import AttendanceMaster from "./pages/Attendance/AttendanceMaster";
// import Shift from "./pages/ShiftMaster/Shift.jsx";
// import Shiftform from "./pages/ShiftMaster/Shiftform.jsx";
// // import Employee from "./pages/EmployeeMaster/Employee";
// // import EmployeeForm from "./pages/EmployeeMaster/Employeeform";
// import Employee from "./pages/EmployeeMaster/Employee/Employee.jsx";
// import EmployeeDetails from "./pages/EmployeeMaster/Employee/EmployeeDetails";
// import Department from "./pages/EmployeeMaster/Department/Department.jsx";
// import Designation from "./pages/EmployeeMaster/Designation/Designation.jsx";
// import EmployeePersonal from "./pages/EmployeeMaster/Employee/EmployeePersonal.jsx";

// // import Shiftconfigform from "./pages/ShiftConfig/ShiftConfigform";
// import {
//   UsergroupDeleteOutlined,
//   HistoryOutlined,
//   FileDoneOutlined,
//   ContactsOutlined,
//   UserSwitchOutlined,
// } from "@ant-design/icons";
// import Asset from "./pages/AssetAllocation/Asset"; 
// import Payroll from "./pages/PayRoll/PayRoll";
// import { Children } from "react";
// import AttenOt from "./pages/Attendance/AttenOt";
// import AttenOd from "./pages/Attendance/AttenOd";
// import StaffRecord from "./pages/Attendance/StaffRecord"; 
// import EditRecord from "./pages/Attendance/EditRecord";
// import Leave from "./pages/Attendance/Leave";

// export const hrmsMenuItems = [
//   {
//     icon: <TeamOutlined />,
//     key: "employees",
//     label: "Employees", 
//     children: [
//       { key: "/hrms/pages/employee", label: "Employee List" },
//       { key: "/hrms/pages/employeedetails", label: "Employee Details" },
//       { key: "/hrms/pages/Department", label: "Department" },
//       { key: "/hrms/pages/Designation", label: "Designation" }
     
//     ],

//   },

//   {
//     icon: <ContactsOutlined />,
//     key: "/hrms/pages/Rolemaster",
//     label: "Role Master",
//   },

//   {
//     icon: <HistoryOutlined />,
//     key: "/hrms/pages/shift",
//     label: "Shift",
//   },
//   // {
//   //   icon: <UserSwitchOutlined />,
//   //   key: "/hrms/pages/shiftconfiguration",
//   //   label: "Shiftconfiguration",
//   // },

//   {
//     icon: <FileDoneOutlined />,
//     key: "/hrms/pages/AttendanceMaster",
//     label: "Attendance",

//     children: [
//        { key: "/hrms/pages/AttendanceMaster",
//        label: "Attendance",
//       },
//       { key: "/hrms/pages/AttenOt",
//        label: "Over time",
//       },
//       { key: "/hrms/pages/AttenOd",
//         label: "On duty",
//       },
//       { key: "/hrms/pages/StaffRecord",
//         label: "Staff Record",
//       },
//        { key: "/hrms/pages/EditRecord",
//         label: "Edit Record",
//       },
//       { key: "/hrms/pages/Leave",
//         label: "Leave Form"
//       }
//     ]  },
//   {
//     icon: <FileDoneOutlined />,
//     key: "/hrms/pages/asset",
//     label: "Asset",  
//   },
//   {
//     icon: <FileDoneOutlined />,
//     key: "/hrms/pages/PayRoll",
//     label: "PayRoll",
//   },

// ];

// const HRMSRoutes = () => {
//   return (
//    <Routes>
//   <Route path="pages/employee" element={<Employee />} />
//   <Route path="pages/Employeedetails" element={<EmployeeDetails />} />
//   <Route path="pages/employee/:id" element={<EmployeePersonal />} /> 

//   <Route path="pages/Department" element={<Department />} />
//   <Route path="pages/Designation" element={<Designation />} />
//   <Route path="pages/dashboard" element={<HrmsDashboard />} />
//   <Route path="pages/attendance" element={<AttendanceMaster />} />

//   {/* ✔ FIXED THIS LINE */}
//   <Route path="pages/shift" element={<Shift />} />

//   <Route path="pages/createshift" element={<Shiftform />} />
//   <Route path="pages/rolemaster" element={<RoleMaster />} />
//   <Route path="pages/asset" element={<Asset />} />
//   <Route path="pages/payroll" element={<Payroll />} />
//   <Route path="pages/AttendanceMaster" element={<AttendanceMaster />} />
//   <Route path="pages/AttenOt" element={<AttenOt />} />
//   <Route path="pages/AttenOd" element={<AttenOd />} />
//   <Route path="pages/StaffRecord" element={<StaffRecord />} />
//   <Route path="pages/EditRecord" element={<EditRecord />} />
//   <Route path="pages/Leave" element={<Leave />} />
// </Routes>

//   );
// };

// export default HRMSRoutes;




// const HRMSRoutes = () => {
//   return (
//    <Routes>
//       <Route path="pages/employee" element={<Employee />} />
//       <Route path="pages/employeedetails" element={<EmployeeDetails />} />
//       <Route path="pages/employee/:id" element={<EmployeePersonal />} /> 

//       <Route path="pages/department" element={<Department />} />
//       <Route path="pages/designation" element={<Designation />} />
//       <Route path="pages/dashboard" element={<HrmsDashboard />} />
//       <Route path="pages/attendance" element={<AttendanceMaster />} />

//       {/* Shift route — correct now */}
//       <Route path="pages/shift" element={<Shift />} />

//       <Route path="pages/createshift" element={<Shiftform />} />
//       <Route path="pages/rolemaster" element={<RoleMaster />} />
//       <Route path="pages/asset" element={<Asset />} />
//       <Route path="pages/payroll" element={<Payroll />} />
//       <Route path="pages/AttendanceMaster" element={<AttendanceMaster />} />
//       <Route path="pages/AttenOt" element={<AttenOt />} />
//       <Route path="pages/AttenOd" element={<AttenOd />} />
//       <Route path="pages/StaffRecord" element={<StaffRecord />} />
//       <Route path="pages/EditRecord" element={<EditRecord />} />
//       <Route path="pages/Leave" element={<Leave />} />
//    </Routes>
//   );
// };

// export default HRMSRoutes;



import { Routes, Route } from "react-router-dom";

import Employee from "./pages/EmployeeMaster/Employee/Employee.jsx";
import EmployeeDetails from "./pages/EmployeeMaster/Employee/EmployeeDetails";
import EmployeePersonal from "./pages/EmployeeMaster/Employee/EmployeePersonal.jsx";
import Department from "./pages/EmployeeMaster/Department/Department.jsx";
import Designation from "./pages/EmployeeMaster/Designation/Designation.jsx";
import HrmsDashboard from "./pages/Dashboard.jsx";
import AttendanceMaster from "./pages/Attendance/AttendanceMaster.jsx";
import Shift from "./pages/ShiftMaster/Shift.jsx";
import Shiftform from "./pages/ShiftMaster/Shiftform.jsx";
// import RoleMaster from "./pages/Rolemaster/RoleMasters.jsx";
import Asset from "./pages/AssetAllocation/Asset.jsx";
import Payroll from "./pages/PayRoll/PayRoll.jsx";
import EmployeeCalculation from "./pages/PayRoll/EmployeeCalculation";
import AnnualPayroll from "./pages/PayRoll/AnnualPayroll.jsx";
import AttenOt from "./pages/Attendance/AttenOt.jsx";
import AttenOd from "./pages/Attendance/AttenOd.jsx";
import StaffRecord from "./pages/Attendance/StaffRecord.jsx";
import EditRecord from "./pages/Attendance/EditRecord.jsx";
import Leave from "./pages/Attendance/Leave.jsx";
import { TeamOutlined,
   ContactsOutlined,
   HistoryOutlined,
  FileDoneOutlined,
 } from "@ant-design/icons";
export const hrmsMenuItems = [
  {
    icon: <TeamOutlined />,
    key: "employees",
    label: "Employees", 
    children: [
      { key: "/hrms/pages/employee", label: "Employee List" },
      { key: "/hrms/pages/employeedetails", label: "Employee Details" },
      { key: "/hrms/pages/Department", label: "Department" },
      { key: "/hrms/pages/Designation", label: "Designation" }
     
    ],

  },

  // {
  //   icon: <ContactsOutlined />,
  //   key: "/hrms/pages/Rolemaster",
  //   label: "Role Master",
  // },

  {
    icon: <HistoryOutlined />,
    key: "/hrms/pages/shift",
    label: "Shift",
  },

  {
    icon: <FileDoneOutlined />,
    key: "/hrms/pages/AttendanceMaster",
    label: "Attendance",

    children: [
       { key: "/hrms/pages/AttendanceMaster",
       label: "Attendance",
      },
      { key: "/hrms/pages/AttenOt",
       label: "Over time",
      },
      { key: "/hrms/pages/AttenOd",
        label: "On duty",
      },
      { key: "/hrms/pages/StaffRecord",
        label: "Staff Record",
      },
       { key: "/hrms/pages/EditRecord",
        label: "Edit Record",
      },
      { key: "/hrms/pages/Leave",
        label: "Leave Form"
      }
    ]  },
  {
    icon: <FileDoneOutlined />,
    key: "/hrms/pages/asset",
    label: "Asset",  
  },
  {
    icon: <FileDoneOutlined />,
    key: "/hrms/pages/PayRoll",
    label: "Payroll",
    children: [
      { key: "/hrms/pages/payroll", 
        label: "Pay Slip"
      },
      { key: "/hrms/pages/EmployeeCalculation",
         label: "Employee Calculation"
      },
      { key: "/hrms/pages/AnnualPayroll", 
        label: "Annual Payroll"
      }
    ]
  }

];

const HRMSRoutes = () => {
  return (
    <Routes>
      <Route path="pages/dashboard" element={<HrmsDashboard />} />

      <Route path="pages/employee" element={<Employee />} />
      <Route path="pages/employeedetails" element={<EmployeeDetails />} />
      <Route path="pages/employee/:id" element={<EmployeePersonal />} />

      <Route path="pages/department" element={<Department />} />
      <Route path="pages/designation" element={<Designation />} />

      <Route path="pages/shift" element={<Shift />} />
      <Route path="pages/createshift" element={<Shiftform />} />

      {/* <Route path="pages/rolemaster" element={<RoleMaster />} /> */}
      <Route path="pages/attendance" element={<AttendanceMaster />} />

      <Route path="pages/AttendanceMaster" element={<AttendanceMaster />} />
      <Route path="pages/AttenOt" element={<AttenOt />} />
      <Route path="pages/AttenOd" element={<AttenOd />} />
      <Route path="pages/StaffRecord" element={<StaffRecord />} />
      <Route path="pages/EditRecord" element={<EditRecord />} />
      <Route path="pages/Leave" element={<Leave />} />

      <Route path="pages/asset" element={<Asset />} />
      <Route path="pages/payroll" element={<Payroll />} />
      <Route path="pages/EmployeeCalculation" element={<EmployeeCalculation/>}/>
      <Route path="pages/AnnualPayroll" element={<AnnualPayroll/>}/>
    </Routes>
  );
};

export default HRMSRoutes;
