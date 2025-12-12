import React, { useMemo, useState, useEffect } from "react";
import { Input, Select, Space, Table, Tag } from "antd";
import staffRecordService from "../Attendance/service/StaffRecord";

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
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const monthIndex = monthNames.indexOf(month) + 1;
      const res = await staffRecordService.getAttendanceReport({ year, month: monthIndex });
      setRows(res.data?.data || []);
    } catch (err) {
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [month, year]);

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
    if (!query.trim()) return rows.length ? rows : staffData;
    const q = query.toLowerCase();
    const base = rows.length ? rows : staffData;
    return base.filter(
      (s) =>
        String(s.first_name || s.name || "").toLowerCase().includes(q) ||
        String(s.emp_id || s.employeeId || "").toLowerCase().includes(q) ||
        String(s.department_name || s.department || "").toLowerCase().includes(q) ||
        String(s.designation_name || s.designation || "").toLowerCase().includes(q)
    );
  }, [query, rows, staffData]);

  // -------------------------------
  // 📌 Create AntD Columns
  // -------------------------------
//   const columns = [
//     // {
//     //   title: "#",
//     //   dataIndex: "index",
//     //   width: 50,
//     //   render: (_, __, i) => i + 1,
//     // },
//     {
//       title: "Employee ID",
//       dataIndex: rows.length ? "emp_id" : "employeeId",
//       fixed: "left",
//       width: 120,
//     },
//     {
//       title: "Name",
//       dataIndex: rows.length ? "first_name" : "name",
//       fixed: "left",
//       width: 150,
//     },

//     {
//       title: "Department",
//       dataIndex: rows.length ? "department_name" : "department_name",
//       width: 120,
//     },
//     {
//       title: "Designation",
//        dataIndex: rows.length ? "designation_name" : "designation_name",
//       width: 120,
//     },
//     {
//       title: "Branch",
//        dataIndex: rows.length ? "branch_name" : "branch_name",
//       width: 120,
//     },

//     // 🟦 Dynamically generate day headers
//     // ...days.map((d) => ({
//     //   title: d.toString(),
//     //   width: 60,
//     //   align: "center",
//     //   render: () => "-",
//     // })),

// ...days.map((d) => ({
//   title: d.toString(),
//   width: 60,
//   align: "center",

//   render: (_, row) => {
//     // Convert day number to "01", "02", ...
//     const key = d.toString().padStart(2, "0");

//     const status =
//       row?.attendance?.[key] ||
//       row?.dailyStatus?.[key] ||
//       row?.attendanceData?.[key] ||
//       "-";

//     const colors = {
//       P: "#0A8A2A",
//       A: "#B91C1C",
//       CL: "#1E40AF",
//       SL: "#6D28D9",
//       L: "#C2410C",
//       OD: "#B8860B",
//       PR: "#4B5563",
//     };

//     if (status === "-") return "-";

//     return (
//       <Tag
//         style={{
//           backgroundColor: colors[status] || "#999",
//           color: "white",
//           fontWeight: 600,
//           padding: "4px 8px",
//           borderRadius: "20px",
//         }}
//       >
//         {status}
//       </Tag>
//     );
//   },
// })),


//     {
//       title: "Present",
//       width: 90,
//       align: "center",
//       dataIndex: rows.length ? "PresentDays" : "presentDays",
//     },
//     {
//       title: "Absent",
//       width: 90,
//       align: "center",
//       dataIndex: rows.length ? "AbsentDays" : "absentDays",
//     },
//     {
//       title: "Leave",
//       width: 90,
//       align: "center",
//       dataIndex: rows.length ? "LeaveDays" : "leaveDays",
//     },
//     {
//       title: "Late (min)",
//       width: 100,
//       align: "center",
//       render: () => "-",
//     },
//     {
//       title: "OT",
//       width: 70,
//       align: "center",
//       dataIndex: rows.length ? "TotalOvertimeHours" : "overtime",
//     },
//     {
//       title: "Total Hrs",
//       width: 120,
//       align: "center",
//       dataIndex: rows.length ? "TotalWorkedHours" : "totalHours",
//     },
//   ];

const columns = [
  {
    title: "Employee ID",
    dataIndex: rows.length ? "emp_id" : "employeeId",
    fixed: "left",
    width: 120,
  },
  {
    title: "Name",
    dataIndex: rows.length ? "first_name" : "name",
    fixed: "left",
    width: 150,
  },
  {
    title: "Department",
    dataIndex: "department_name",
    width: 120,
  },
  {
    title: "Designation",
    dataIndex: "designation_name",
    width: 120,
  },
  {
    title: "Branch",
    dataIndex: "branch_name",
    width: 120,
  },

  // 🟦 Daily status columns
  ...days.map((d) => ({
    title: d.toString(),
    width: 60,
    align: "center",
    render: (_, row) => {
      const key = d.toString().padStart(2, "0");
      const status =
        row?.attendance?.[key] ||
        row?.dailyStatus?.[key] ||
        row?.attendanceData?.[key] ||
        "-";

      const colors = {
        P: "#0A8A2A",
        A: "#B91C1C",
        CL: "#1E40AF",
        SL: "#6D28D9",
        L: "#C2410C",
        OD: "#B8860B",
        PR: "#4B5563",
      };

      if (status === "-") return "-";

      return (
        <Tag
          style={{
            backgroundColor: colors[status] || "#999",
            color: "white",
            fontWeight: 600,
            padding: "4px 8px",
            borderRadius: "20px",
          }}
        >
          {status}
        </Tag>
      );
    },
  })),

  // 🟩 Summary Columns
  {
    title: "Present",
    width: 90,
    align: "center",
    dataIndex: "present",
  },
  {
    title: "Absent",
    width: 90,
    align: "center",
    dataIndex: "absent",
  },
  {
    title: "Leave",
    width: 90,
    align: "center",
    dataIndex: "leave",
  },
  {
    title: "Late (min)",
    width: 100,
    align: "center",
    dataIndex: "late_min",
  },
  {
    title: "OT",
    width: 70,
    align: "center",
    dataIndex: "overtime",
  },
  {
    title: "OD",
    width: 70,
    align: "center",
    dataIndex: rows.length ? "TotalODDays" : "odDays",
  },
  // {
  //   title: "Total Hrs",
  //   width: 120,
  //   align: "center",
  //   dataIndex: "total_hours",
  // },
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
        loading={loading}
        columns={columns}
        dataSource={filteredStaff}
        rowKey={(row) => row.emp_id || row.id || row.employeeId}
        scroll={{ x: "max-content" }}
        pagination={{ pageSize: 10 }}
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
