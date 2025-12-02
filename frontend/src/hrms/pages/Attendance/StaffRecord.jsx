import React, { useMemo, useState } from "react";
import { Input, Select, Space } from "antd";
import attendanceService from "../Attendance/service/StaffRecord";

const { Search } = Input;

export default function StaffMonthlyTable({ staffData = [] }) {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const [month, setMonth] = useState(monthNames[new Date().getMonth()]);
  const [year, setYear] = useState(currentYear);
  const [query, setQuery] = useState("");

  const statusBadge = (status) => {
    const base =
      "inline-flex items-center justify-center text-xs font-semibold px-2 py-1 rounded-full";
    switch (status) {
      case "P":
        return `${base} bg-green-600 text-white`;
      case "OD":
        return `${base} bg-yellow-400 text-white`;
      case "PR":
        return `${base} bg-gray-400 text-white`;
      case "A":
        return `${base} bg-red-600 text-white`;
      case "L":
        return `${base} bg-orange-500 text-white`;
      case "CL":
        return `${base} bg-blue-600 text-white`;
      case "SL":
        return `${base} bg-purple-600 text-white`;
      default:
        return `${base} bg-gray-300 text-gray-800`;
    }
  };

  const calculateTotals = (attendance) => {
    const totals = {
      presentDays: 0,
      absentDays: 0,
      leaveDays: 0,
      lateMinutes: 0,
      overtime: 0,
    };
    Object.values(attendance || {}).forEach((status) => {
      switch (status) {
        case "P":
        case "OD":
        case "PR":
          totals.presentDays += 1;
          if (status === "OD") totals.overtime += Math.floor(Math.random() * 3);
          break;
        case "A":
          totals.absentDays += 1;
          break;
        case "CL":
        case "SL":
        case "L":
          totals.leaveDays += 1;
          if (status === "L") totals.lateMinutes += 15;
          break;
        default:
          break;
      }
    });
    totals.totalHours =
      (totals.presentDays + totals.leaveDays) * 8 +
      totals.overtime -
      totals.lateMinutes / 60;
    return totals;
  };

  const filteredStaff = useMemo(() => {
    if (!query?.trim()) return staffData;
    const q = query.toLowerCase();
    return staffData.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.employeeId?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q) ||
        s.designation?.toLowerCase().includes(q)
    );
  }, [query, staffData]);

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <div className="w-full flex flex-wrap items-start justify-between gap-4 mb-6">
        <h1 className="font-semibold text-xl">Staff Monthly Record</h1>

        {/* === New Search + Month + Year Bar === */}
        <Space size="middle">
          <Search
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
            style={{ width: 100 }}
            options={years.map((y) => ({ label: y, value: y }))}
          />
        </Space>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
          <thead>
            <tr className="bg-gray-50 text-gray-600">
              <th className="border border-gray-100 p-4 text-left">#</th>
              <th className="border border-gray-100 p-4 text-left">Employee ID</th>
              <th className="border border-gray-100 p-4 text-left">Employee Name</th>
              <th className="border border-gray-100 p-4 text-left">Department</th>
              <th className="border border-gray-100 p-4 text-left">Designation</th>
              {days.map((d) => (
                <th key={d} className="px-2 py-3 text-l font-semibold text-center">
                  {d}
                </th>
              ))}
              <th className="border border-gray-100 p-4 text-center">Present</th>
              <th className="border border-gray-100 p-4 text-center">Absent</th>
              <th className="border border-gray-100 p-4 text-center">Leave</th>
              <th className="border border-gray-100 p-4 text-center">Late min</th>
              <th className="border border-gray-100 p-4 text-center">Overtime</th>
              <th className="border border-gray-100 p-4 text-center">Total hrs</th>
            </tr>
          </thead>

          <tbody className="bg-white/70 backdrop-blur-md">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((staff, index) => {
                const totals = calculateTotals(staff.attendance);
                return (
                  <tr
                    key={staff.id || index}
                    className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-[#408CFF]/10 hover:to-[#EF4CFF]/10 border-b border-gray-100"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {staff.employeeId}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                      {staff.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {staff.department}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {staff.designation}
                    </td>
                    {days.map((day) => (
                      <td key={day} className="px-2 py-3 text-center">
                        <span className={statusBadge(staff.attendance?.[day])}>
                          {staff.attendance?.[day]}
                        </span>
                      </td>
                    ))}
                    <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
                      {totals.presentDays}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
                      {totals.absentDays}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 font-semibold">
                      {totals.leaveDays}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">
                      {totals.lateMinutes}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-800">
                      {totals.overtime}
                    </td>
                    <td className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      {totals.totalHours.toFixed(1)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={days.length + 12}
                  className="px-6 py-10 text-center text-gray-400"
                >
                  No staff data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Legend ===== */}
      <div className="w-full flex justify-end mt-6">
        <div className="bg-white/80 backdrop-blur-md shadow-md border border-gray-200 rounded-md p-3 text-sm flex gap-3 flex-wrap justify-end">
          {[
            ["P", "Present", "bg-green-600"],
            ["A", "Absent", "bg-red-600"],
            ["CL", "Casual Leave", "bg-blue-600"],
            ["SL", "Sick Leave", "bg-purple-600"],
            ["L", "Leave", "bg-orange-500"],
            ["OD", "On Duty", "bg-yellow-400"],
            ["PR", "Permission", "bg-gray-400"],
          ].map(([code, label, color]) => (
            <div key={code} className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full ${color} text-white font-semibold`}
              >
                {code}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
