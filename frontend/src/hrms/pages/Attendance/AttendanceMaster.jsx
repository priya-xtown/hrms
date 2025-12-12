import React, { useMemo, useState, useEffect } from "react";
import { Input, Select, Space, Table, Tag } from "antd";
import staffRecordService from "../Attendance/service/StaffRecord";

export default function AttendanceRecordsTable({ staffData = [] }) {
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
      const res = await staffRecordService.getAttendanceReport({
        year,
        month: monthIndex,
      });
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

  // -------------------------------------
  // 📌 COLUMNS WITHOUT 31 DAYS
  // -------------------------------------
  // const columns = [
  //   {
  //     title: "Employee ID",
  //     dataIndex: rows.length ? "emp_id" : "employeeId",
  //     fixed: "left",
  //     width: 120,
  //   },
  //   {
  //     title: "Name",
  //     dataIndex: rows.length ? "first_name" : "name",
  //     fixed: "left",
  //     width: 150,
  //   },
  //   {
  //     title: "Department",
  //     dataIndex: "department_name",
  //     width: 120,
  //   },
  //   {
  //     title: "Designation",
  //     dataIndex: "designation_name",
  //     width: 120,
  //   },
  //   {
  //     title: "Branch",
  //     dataIndex: "branch_name",
  //     width: 120,
  //   },

  //   // ✔ Summary Columns (no daily columns)
  //   {
  //     title: "Present",
  //     width: 90,
  //     align: "center",
  //     dataIndex: rows.length ? "PresentDays" : "presentDays",
  //   },
  //   {
  //     title: "Absent",
  //     width: 90,
  //     align: "center",
  //     dataIndex: rows.length ? "AbsentDays" : "absentDays",
  //   },
  //   {
  //     title: "Leave",
  //     width: 90,
  //     align: "center",
  //     dataIndex: rows.length ? "LeaveDays" : "leaveDays",
  //   },
  //   {
  //     title: "Late (min)",
  //     width: 100,
  //     align: "center",
  //     render: () => "-",
  //   },
  //   {
  //     title: "OT",
  //     width: 70,
  //     align: "center",
  //     dataIndex: rows.length ? "TotalOvertimeHours" : "overtime",
  //   },
  //   {
  //   title: "OD",
  //   width: 70,
  //   align: "center",
  //   dataIndex: rows.length ? "TotalODDays" : "odDays",
  // },
  //   {
  //     title: "Total Hrs",
  //     width: 120,
  //     align: "center",
  //     dataIndex: rows.length ? "TotalWorkedHours" : "totalHours",
  //   },
  // ];

  
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
    {
      title: "Total Hrs",
      width: 120,
      align: "center",
      dataIndex: "total_hours",
    },
  ];
  
  return (
    <div className="p-6 bg-white shadow-lg rounded-xl">
      {/* HEADER BAR */}
      <div className="flex justify-between flex-wrap gap-4 mb-6">
        <h1 className="text-xl font-semibold">Attendance Records</h1>

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
    </div>
  );
}
