// import React, { useMemo, useState } from "react";
// import { Input, Select, Space } from "antd";
// import attendanceService from "../Attendance/service/StaffRecord";

// const { Search } = Input;

// export default function StaffMonthlyTable({ staffData = [] }) {
//   const days = Array.from({ length: 31 }, (_, i) => i + 1);
//   const monthNames = [
//     "January", "February", "March", "April", "May", "June",
//     "July", "August", "September", "October", "November", "December",
//   ];

//   const currentYear = new Date().getFullYear();
//   const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

//   const [month, setMonth] = useState(monthNames[new Date().getMonth()]);
//   const [year, setYear] = useState(currentYear);
//   const [query, setQuery] = useState("");

//   const statusBadge = (status) => {
//     const base =
//       "inline-flex items-center justify-center text-xs font-semibold px-2 py-1 rounded-full";
//     switch (status) {
//       case "P":
//         return `${base} bg-green-600 text-white`;
//       case "OD":
//         return `${base} bg-yellow-400 text-white`;
//       case "PR":
//         return `${base} bg-gray-400 text-white`;
//       case "A":
//         return `${base} bg-red-600 text-white`;
//       case "L":
//         return `${base} bg-orange-500 text-white`;
//       case "CL":
//         return `${base} bg-blue-600 text-white`;
//       case "SL":
//         return `${base} bg-purple-600 text-white`;
//       default:
//         return `${base} bg-gray-300 text-gray-800`;
//     }
//   };

//   const calculateTotals = (attendance) => {
//     const totals = {
//       presentDays: 0,
//       absentDays: 0,
//       leaveDays: 0,
//       lateMinutes: 0,
//       overtime: 0,
//     };
//     Object.values(attendance || {}).forEach((status) => {
//       switch (status) {
//         case "P":
//         case "OD":
//         case "PR":
//           totals.presentDays += 1;
//           if (status === "OD") totals.overtime += Math.floor(Math.random() * 3);
//           break;
//         case "A":
//           totals.absentDays += 1;
//           break;
//         case "CL":
//         case "SL":
//         case "L":
//           totals.leaveDays += 1;
//           if (status === "L") totals.lateMinutes += 15;
//           break;
//         default:
//           break;
//       }
//     });
//     totals.totalHours =
//       (totals.presentDays + totals.leaveDays) * 8 +
//       totals.overtime -
//       totals.lateMinutes / 60;
//     return totals;
//   };

//   const filteredStaff = useMemo(() => {
//     if (!query?.trim()) return staffData;
//     const q = query.toLowerCase();
//     return staffData.filter(
//       (s) =>
//         s.name?.toLowerCase().includes(q) ||
//         s.employeeId?.toLowerCase().includes(q) ||
//         s.department?.toLowerCase().includes(q) ||
//         s.designation?.toLowerCase().includes(q)
//     );
//   }, [query, staffData]);

//   return (
//     <div className="p-8 bg-white rounded-2xl shadow-xl">
//       <div className="w-full flex flex-wrap items-start justify-between gap-4 mb-6">
//         <h1 className="font-semibold text-xl">Staff Monthly Record</h1>

//         {/* === New Search + Month + Year Bar === */}
//         <Space size="middle">
//           <Search
//             placeholder="Search employee, ID, dept..."
//             allowClear
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             style={{ width: 250 }}
//           />

//           <Select
//             value={month}
//             onChange={setMonth}
//             style={{ width: 150 }}
//             options={monthNames.map((m) => ({ label: m, value: m }))}
//           />

//           <Select
//             value={year}
//             onChange={setYear}
//             style={{ width: 100 }}
//             options={years.map((y) => ({ label: y, value: y }))}
//           />
//         </Space>
//       </div>

//       {/* ===== TABLE ===== */}
//       <div className="overflow-x-auto">
//         <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
//           <thead>
//             <tr className="bg-gray-50 text-gray-600">
//               <th className="border border-gray-100 p-4 text-left">#</th>
//               <th className="border border-gray-100 p-4 text-left">Employee ID</th>
//               <th className="border border-gray-100 p-4 text-left">Employee Name</th>
//               <th className="border border-gray-100 p-4 text-left">Department</th>
//               <th className="border border-gray-100 p-4 text-left">Designation</th>
//               {days.map((d) => (
//                 <th key={d} className="px-2 py-3 text-l font-semibold text-center">
//                   {d}
//                 </th>
//               ))}
//               <th className="border border-gray-100 p-4 text-center">Present</th>
//               <th className="border border-gray-100 p-4 text-center">Absent</th>
//               <th className="border border-gray-100 p-4 text-center">Leave</th>
//               <th className="border border-gray-100 p-4 text-center">Late min</th>
//               <th className="border border-gray-100 p-4 text-center">Overtime</th>
//               <th className="border border-gray-100 p-4 text-center">Total hrs</th>
//             </tr>
//           </thead>

//           <tbody className="bg-white/70 backdrop-blur-md">
//             {filteredStaff.length > 0 ? (
//               filteredStaff.map((staff, index) => {
//                 const totals = calculateTotals(staff.attendance);
//                 return (
//                   <tr
//                     key={staff.id || index}
//                     className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-[#408CFF]/10 hover:to-[#EF4CFF]/10 border-b border-gray-100"
//                   >
//                     <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
//                       {staff.employeeId}
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
//                       {staff.name}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {staff.department}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-700">
//                       {staff.designation}
//                     </td>
//                     {days.map((day) => (
//                       <td key={day} className="px-2 py-3 text-center">
//                         <span className={statusBadge(staff.attendance?.[day])}>
//                           {staff.attendance?.[day]}
//                         </span>
//                       </td>
//                     ))}
//                     <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
//                       {totals.presentDays}
//                     </td>
//                     <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
//                       {totals.absentDays}
//                     </td>
//                     <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
//                       {totals.leaveDays}
//                     </td>
//                     <td className="px-6 py-4 text-center text-sm text-gray-800">
//                       {totals.lateMinutes}
//                     </td>
//                     <td className="px-6 py-4 text-center text-sm text-gray-800">
//                       {totals.overtime}
//                     </td>
//                     <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
//                       {totals.totalHours.toFixed(1)}
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td
//                   colSpan={days.length + 12}
//                   className="px-6 py-10 text-center text-gray-400"
//                 >
//                   No staff data available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* ===== Legend ===== */}
//       <div className="w-full flex justify-end mt-6">
//         <div className="bg-white/80 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-3 text-sm flex gap-3 flex-wrap justify-end">
//           {[
//             ["P", "Present", "bg-green-600"],
//             ["A", "Absent", "bg-red-600"],
//             ["CL", "Casual Leave", "bg-blue-600"],
//             ["SL", "Sick Leave", "bg-purple-600"],
//             ["L", "Leave", "bg-orange-500"],
//             ["OD", "On Duty", "bg-yellow-400"],
//             ["PR", "Permission", "bg-gray-400"],
//           ].map(([code, label, color]) => (
//             <div key={code} className="flex items-center gap-2">
//               <span
//                 className={`px-3 py-1 rounded-full ${color} text-white font-semibold`}
//               >
//                 {code}
//               </span>
//               {label}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useMemo, useState } from "react";
import { Input, Select, Space, Table, Tag } from "antd";

export default function StaffMonthlyTable({ staffData = [] }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [month, setMonth] = useState(monthNames[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);
  const [query, setQuery] = useState("");

  const statusColors = {
    P: "green",
    OD: "gold",
    PR: "grey",
    A: "red",
    L: "orange",
    CL: "blue",
    SL: "purple",
  };

  const totals = (attendance) => {
    const t = { present: 0, absent: 0, leave: 0, late: 0, overtime: 0 };

    Object.values(attendance || {}).forEach((s) => {
      if (["P", "OD", "PR"].includes(s)) t.present++;
      if (s === "OD") t.overtime += Math.floor(Math.random() * 3);

      if (s === "A") t.absent++;

      if (["CL", "SL", "L"].includes(s)) {
        t.leave++;
        if (s === "L") t.late += 15;
      }
    });

    t.totalHours =
      (t.present + t.leave) * 8 + t.overtime - t.late / 60;

    return t;
  };

  const filteredStaff = useMemo(() => {
    if (!query.trim()) return staffData;
    const q = query.toLowerCase();

    return staffData.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.employeeId?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q) ||
        s.designation?.toLowerCase().includes(q)
    );
  }, [query, staffData]);

  // -------------------------------
  // 📌 Create AntD Columns
  // -------------------------------
  const columns = [
    {
      title: "#",
      dataIndex: "index",
      width: 50,
      render: (_, __, i) => i + 1,
    },
    {
      title: "Employee ID",
      dataIndex: "employeeId",
      fixed: "left",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      fixed: "left",
      width: 150,
    },
    {
      title: "Department",
      dataIndex: "department",
      width: 120,
    },
    {
      title: "Designation",
      dataIndex: "designation",
      width: 120,
    },

    // 🟦 Dynamically generate day headers
    ...days.map((d) => ({
      title: d.toString(),
      dataIndex: ["attendance", d],
      width: 60,
      align: "center",
      render: (value) =>
        value ? (
          <Tag
            color={statusColors[value] || "default"}
            className="font-semibold rounded-full px-2 py-1"
          >
            {value}
          </Tag>
        ) : (
          "-"
        ),
    })),

    {
      title: "Present",
      width: 90,
      align: "center",
      render: (_, record) => totals(record.attendance).present,
    },
    {
      title: "Absent",
      width: 90,
      align: "center",
      render: (_, record) => totals(record.attendance).absent,
    },
    {
      title: "Leave",
      width: 90,
      align: "center",
      render: (_, record) => totals(record.attendance).leave,
    },
    {
      title: "Late (min)",
      width: 100,
      align: "center",
      render: (_, record) => totals(record.attendance).late,
    },
    {
      title: "OT",
      width: 70,
      align: "center",
      render: (_, record) => totals(record.attendance).overtime,
    },
    {
      title: "Total Hrs",
      width: 120,
      align: "center",
      render: (_, record) => totals(record.attendance).totalHours.toFixed(1),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      {/* HEADER BAR */}
      <div className="flex justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-xl font-semibold">Staff Monthly Record</h1>

        <Space>
          <Input.Search
            placeholder="Search employee, ID, dept..."
            allowClear
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: 250 }}
          />

          <Select
            value={month}
            onChange={setMonth}
            style={{ width: 150 }}
            options={monthNames.map((m) => ({ label: m, value: m }))}
          />

          <Select
            value={year}
            onChange={setYear}
            style={{ width: 120 }}
            options={years.map((y) => ({ label: y, value: y }))}
          />
        </Space>
      </div>

      {/* ANT DESIGN TABLE */}
      <Table
        columns={columns}
        dataSource={filteredStaff}
        rowKey={(row) => row.id || row.employeeId}
        scroll={{ x: "max-content" }}
        pagination={false}
        className="rounded-lg"
      />

      {/* LEGEND */}
      <div className="flex justify-end mt-6">
        <div className="flex flex-wrap gap-4 p-4 bg-white border rounded-lg shadow-sm">
  {[
    ["P", "Present", "#0A8A2A"],      // Dark Green
    ["A", "Absent", "#B91C1C"],      // Dark Red
    ["CL", "Casual Leave", "#1E40AF"], // Dark Blue
    ["SL", "Sick Leave", "#6D28D9"], // Deep Purple
    ["L", "Leave", "#C2410C"],       // Dark Orange
    ["OD", "On Duty", "#B8860B"],    // Dark Golden
    ["PR", "Permission", "#4B5563"], // Dark Gray
  ].map(([code, label, color]) => (
    <div key={code} className="flex items-center gap-2">
      <Tag
        style={{
          backgroundColor: color,
          color: "white",
          fontWeight: 600,
          padding: "6px 12px",
          borderRadius: "20px",
        }}
      >
        {code}
      </Tag>
      <span className="text-gray-700 font-medium">{label}</span>
    </div>
  ))}
</div>

      </div>
    </div>
  );
}
