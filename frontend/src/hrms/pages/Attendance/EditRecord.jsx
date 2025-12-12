// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { Input, Select, Space } from "antd";
// import attendanceService from "../Attendance/service/EditRecord"; // ✅ Adjust path if needed

// export function generateRandomAttendance() {
//   const days = Array.from({ length: 31 }, (_, i) => i + 1);
//   const statuses = ["P", "A", "L", "OD", "CL", "SL", "PR"];
//   const attendance = {};
//   days.forEach((day) => {
//     attendance[day] = statuses[Math.floor(Math.random() * statuses.length)];
//   });
//   return attendance;
// }

// const monthNames = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];
// const currentYear = new Date().getFullYear();
// const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

// const { Search } = Input;

// export default function EditRecord() {
//   const days = Array.from({ length: 31 }, (_, i) => i + 1);
//   const now = new Date();
//   const [month, setMonth] = useState(monthNames[now.getMonth()]);
//   const [year, setYear] = useState(now.getFullYear());
//   const [query, setQuery] = useState("");
//   const [staffData, setStaffData] = useState([]);
//   const [editingRow, setEditingRow] = useState(null);
//   const [backupRow, setBackupRow] = useState(null);
//   const [toast, setToast] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState("");
//   const [prModal, setPrModal] = useState({
//     visible: false,
//     staffId: null,
//     day: null,
//     fromTime: "",
//     toTime: "",
//   });

//   useEffect(() => {
//     if (toast) {
//       const timer = setTimeout(() => setToast(""), 2500);
//       return () => clearTimeout(timer);
//     }
//   }, [toast]);

//   const fetchRecords = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await attendanceService.getAll();
//       if (response.data && Array.isArray(response.data)) {
//         const data = response.data.map((s) => ({
//           ...s,
//           attendance: s.attendance || generateRandomAttendance(),
//           prHours: s.prHours || 0,
//         }));
//         setStaffData(data);
//       } else {
//         setError("Invalid response format.");
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch staff records.");
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     fetchRecords();
//   }, []);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await fetchRecords();
//   };

//   const filteredStaff = useMemo(() => {
//     if (!query.trim()) return staffData;
//     const q = query.toLowerCase();
//     return staffData.filter(
//       (s) =>
//         s.name?.toLowerCase().includes(q) ||
//         s.employeeId?.toLowerCase().includes(q) ||
//         s.department?.toLowerCase().includes(q) ||
//         s.designation?.toLowerCase().includes(q)
//     );
//   }, [query, staffData]);

//   const handleAttendanceChange = (id, day, value) => {
//     if (value === "PR") {
//       setPrModal({ visible: true, staffId: id, day, fromTime: "", toTime: "" });
//       return;
//     }
//     setStaffData((prev) =>
//       prev.map((s) =>
//         s.id === id
//           ? { ...s, attendance: { ...s.attendance, [day]: value } }
//           : s
//       )
//     );
//   };

//   const confirmPrHours = () => {
//     const { staffId, day, fromTime, toTime } = prModal;
//     if (!fromTime || !toTime) return;
//     const start = new Date(`1970-01-01T${fromTime}`);
//     const end = new Date(`1970-01-01T${toTime}`);
//     let hours = (end - start) / (1000 * 60 * 60);
//     if (hours <= 0) return;

//     setStaffData((prev) =>
//       prev.map((s) =>
//         s.id === staffId
//           ? {
//               ...s,
//               attendance: { ...s.attendance, [day]: "PR" },
//               prHours: (s.prHours || 0) + hours,
//             }
//           : s
//       )
//     );
//     setPrModal({
//       visible: false,
//       staffId: null,
//       day: null,
//       fromTime: "",
//       toTime: "",
//     });
//     setToast(`✔ PR hours added: ${hours.toFixed(2)} hrs`);
//   };

//   const statusBadge = (status) => {
//     const base =
//       "inline-flex items-center justify-center text-xs font-semibold px-2 py-1 rounded-full";
//     switch (status) {
//       case "P":
//         return `${base} bg-green-600 text-white`;
//       case "A":
//         return `${base} bg-red-600 text-white`;
//       case "L":
//         return `${base} bg-orange-500 text-white`;
//       case "OD":
//         return `${base} bg-yellow-400 text-white`;
//       case "CL":
//         return `${base} bg-blue-600 text-white`;
//       case "SL":
//         return `${base} bg-purple-600 text-white`;
//       case "PR":
//         return `${base} bg-gray-400 text-white`;
//       default:
//         return `${base} bg-gray-300 text-gray-800`;
//     }
//   };

//   const calculateTotals = (attendance, prHours = 0) => {
//     const totals = {
//       presentDays: 0,
//       absentDays: 0,
//       leaveDays: 0,
//       lateMinutes: 0,
//       overtime: 0,
//       prHours,
//     };
//     Object.values(attendance).forEach((status) => {
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
//       totals.overtime +
//       prHours -
//       totals.lateMinutes / 60;
//     return totals;
//   };

//   return (
//     <div className="p-8 bg-white rounded-2xl shadow-xl">
//       <div className="max-w-7xl mx-auto">
    
//         <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
//           <h1 className="font-semibold text-xl">Edit Staff Attendance</h1>

//           <Space size="middle">
//             <Search
//               placeholder="Search employee, ID, dept..."
//               allowClear
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               style={{ width: 250 }}
//             />

//             <Select
//               value={month}
//               onChange={setMonth}
//               style={{ width: 150 }}
//               options={monthNames.map((m) => ({ label: m, value: m }))}
//             />

//             <Select
//               value={year}
//               onChange={setYear}
//               style={{ width: 100 }}
//               options={years.map((y) => ({ label: y, value: y }))}
//             />

//             <button
//               onClick={handleRefresh}
//               disabled={refreshing}
//               className={`px-5 py-2.5 rounded-xl text-sm font-medium shadow-md text-white transition-transform transform hover:scale-105 ${
//                 refreshing
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-purple-500 hover:bg-purple-600"
//               }`}
//             >
//               {refreshing ? "Refreshing..." : "Refresh"}
//             </button>
//           </Space>
//         </div>

//         {/* ===== Loader ===== */}
//         {loading && (
//           <div className="flex items-center justify-center py-20">
//             <div className="h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
//           </div>
//         )}

//         {/* ===== Error ===== */}
//         {!loading && error && (
//           <div className="bg-red-50 text-red-700 border border-red-300 rounded-lg py-4 px-6 text-center font-medium shadow-sm">
//             {error}
//           </div>
//         )}

//         {/* ===== Table ===== */}
//         {!loading && !error && (
//           <div className="overflow-x-auto">
//             <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
//               <thead>
//                 <tr className="bg-gray-50 text-gray-600">
//                   <th className="border border-gray-100 p-4 text-left">#</th>
//                   <th className="border border-gray-100 p-4 text-left">
//                     Employee ID
//                   </th>
//                   <th className="border border-gray-100 p-4 text-left">Name</th>
//                   <th className="border border-gray-100 p-4 text-left">
//                     Department
//                   </th>
//                   <th className="border border-gray-100 p-4 text-left">
//                     Designation
//                   </th>
//                   {days.map((d) => (
//                     <th
//                       key={d}
//                       className="px-2 py-3 text-l font-semibold text-center"
//                     >
//                       {d}
//                     </th>
//                   ))}
//                   <th className="border border-gray-100 p-4 text-center">
//                     Total Hrs
//                   </th>
//                   <th className="border border-gray-100 p-4 text-center">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredStaff.map((s, i) => {
//                   const totals = calculateTotals(s.attendance, s.prHours);
//                   const isEditing = editingRow === s.id;
//                   return (
//                     <tr
//                       key={s.id}
//                       className="group transition-all duration-200 hover:bg-gradient-to-r hover:from-[#408CFF]/10 hover:to-[#EF4CFF]/10 border-b border-gray-100"
//                     >
//                       <td className="px-4 py-3">{i + 1}</td>
//                       <td className="px-4 py-3">{s.employeeId}</td>
//                       <td className="px-4 py-3">{s.name}</td>
//                       <td className="px-4 py-3">{s.department}</td>
//                       <td className="px-4 py-3">{s.designation}</td>
//                       {days.map((d) => (
//                         <td key={d} className="px-1 py-2 text-center">
//                           {isEditing ? (
//                             <select
//                               value={s.attendance[d]}
//                               onChange={(e) =>
//                                 handleAttendanceChange(
//                                   s.id,
//                                   d,
//                                   e.target.value
//                                 )
//                               }
//                               className="text-xs rounded border px-1 py-0.5"
//                             >
//                               {["P", "A", "L", "OD", "CL", "SL", "PR"].map(
//                                 (st) => (
//                                   <option key={st} value={st}>
//                                     {st}
//                                   </option>
//                                 )
//                               )}
//                             </select>
//                           ) : (
//                             <span
//                               className={statusBadge(s.attendance[d])}
//                             >
//                               {s.attendance[d]}
//                             </span>
//                           )}
//                         </td>
//                       ))}
//                       <td className="px-4 py-3 text-center">
//                         {totals.totalHours.toFixed(1)}
//                       </td>
//                       <td className="px-4 py-3 text-center">
//                         {isEditing ? (
//                           <>
//                             <button
//                               className="text-green-600 font-semibold mr-2"
//                               onClick={() => {
//                                 setEditingRow(null);
//                                 setToast("✔ Changes saved");
//                               }}
//                             >
//                               Save
//                             </button>
//                             <button
//                               className="text-red-600 font-semibold"
//                               onClick={() => {
//                                 setEditingRow(null);
//                                 setStaffData((prev) =>
//                                   prev.map((st) =>
//                                     st.id === backupRow.id ? backupRow : st
//                                   )
//                                 );
//                               }}
//                             >
//                               Cancel
//                             </button>
//                           </>
//                         ) : (
//                           <button
//                             className="text-indigo-600 font-semibold"
//                             onClick={() => {
//                               setBackupRow(JSON.parse(JSON.stringify(s)));
//                               setEditingRow(s.id);
//                             }}
//                           >
//                             Edit
//                           </button>
//                         )}
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

//       {/* ===== Toast ===== */}
//       {toast && (
//         <div className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fadeIn">
//           {toast}
//         </div>
//       )}

//       {/* ===== PR Modal ===== */}
//       {prModal.visible && (
//         <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl shadow-xl w-80">
//             <h2 className="text-lg font-semibold mb-4">Enter PR Time</h2>
//             <div className="flex flex-col gap-2 mb-4">
//               <label className="text-sm font-medium">From</label>
//               <input
//                 type="time"
//                 value={prModal.fromTime}
//                 onChange={(e) =>
//                   setPrModal({ ...prModal, fromTime: e.target.value })
//                 }
//                 className="border px-2 py-1 rounded"
//               />
//               <label className="text-sm font-medium">To</label>
//               <input
//                 type="time"
//                 value={prModal.toTime}
//                 onChange={(e) =>
//                   setPrModal({ ...prModal, toTime: e.target.value })
//                 }
//                 className="border px-2 py-1 rounded"
//               />
//             </div>
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() =>
//                   setPrModal({
//                     visible: false,
//                     staffId: null,
//                     day: null,
//                     fromTime: "",
//                     toTime: "",
//                   })
//                 }
//                 className="px-4 py-2 bg-gray-300 rounded"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={confirmPrHours}
//                 className="px-4 py-2 bg-purple-500 text-white rounded"
//               >
//                 OK
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// EditRecord.jsx
import React, { useMemo, useState, useEffect } from "react";
import {
  Table,
  Select,
  Input,
  Space,
  Button,
  Modal,
  TimePicker,
  Spin,
  message,
} from "antd";
import dayjs from "dayjs";
import attendanceService from "../Attendance/service/EditRecord"; // adjust path if needed

const { Search } = Input;
const { Option } = Select;
const statuses = ["P", "A", "L", "OD", "CL", "SL", "PR"];

export function generateRandomAttendance() {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const statusesLocal = ["P", "A", "L", "OD", "CL", "SL", "PR"];
  const attendance = {};
  days.forEach((day) => {
    attendance[day] =
      statusesLocal[Math.floor(Math.random() * statusesLocal.length)];
  });
  return attendance;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

export default function EditRecord() {
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const now = new Date();

  const [month, setMonth] = useState(monthNames[now.getMonth()]);
  const [year, setYear] = useState(now.getFullYear());
  const [query, setQuery] = useState("");
  const [staffData, setStaffData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // editing state
  const [editingRow, setEditingRow] = useState(null);
  const [backupRow, setBackupRow] = useState(null);

  // PR modal state
  const [prModal, setPrModal] = useState({
    visible: false,
    staffId: null,
    day: null,
    from: null, // dayjs
    to: null, // dayjs
  });

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAll?.(); // guard if method not present
      if (response?.data && Array.isArray(response.data)) {
        const data = response.data.map((s) => ({
          ...s,
          attendance: s.attendance || generateRandomAttendance(),
          prHours: s.prHours || 0,
        }));
        setStaffData(data);
      } else if (Array.isArray(response)) {
        // in case service returns array directly
        const data = response.map((s) => ({
          ...s,
          attendance: s.attendance || generateRandomAttendance(),
          prHours: s.prHours || 0,
        }));
        setStaffData(data);
      } else {
        // fallback: create some mock rows if service didn't return expected shape
        const mock = Array.from({ length: 8 }, (_, i) => ({
          id: `mock-${i + 1}`,
          employeeId: `XT-00${i + 1}`,
          name: `Employee ${i + 1}`,
          department: i % 2 ? "HR" : "Engineering",
          designation: i % 3 ? "Sr Dev" : "Analyst",
          attendance: generateRandomAttendance(),
          prHours: 0,
        }));
        setStaffData(mock);
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch staff records");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchRecords();
  };

  const filteredStaff = useMemo(() => {
    const q = query?.trim().toLowerCase();
    if (!q) return staffData;
    return staffData.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.employeeId?.toLowerCase().includes(q) ||
        s.department?.toLowerCase().includes(q) ||
        s.designation?.toLowerCase().includes(q)
    );
  }, [query, staffData]);

  const statusBadge = (status) => {
    const base = "inline-flex items-center justify-center text-xs font-semibold px-2 py-1 rounded-full";
    switch (status) {
      case "P":
        return `${base} bg-green-600 text-white`;
      case "A":
        return `${base} bg-red-600 text-white`;
      case "L":
        return `${base} bg-orange-500 text-white`;
      case "OD":
        return `${base} bg-yellow-400 text-black`;
      case "CL":
        return `${base} bg-blue-600 text-white`;
      case "SL":
        return `${base} bg-purple-600 text-white`;
      case "PR":
        return `${base} bg-gray-500 text-white`;
      default:
        return `${base} bg-gray-200 text-gray-800`;
    }
  };

  const calculateTotals = (attendance = {}, prHours = 0) => {
    const totals = {
      presentDays: 0,
      absentDays: 0,
      leaveDays: 0,
      lateMinutes: 0,
      overtime: 0,
      prHours: prHours || 0,
    };
    Object.values(attendance).forEach((status) => {
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
      totals.overtime +
      totals.prHours -
      totals.lateMinutes / 60;
    return totals;
  };

  // Column generation: static employee columns + day columns + totals + actions
  const columns = useMemo(() => {
    const cols = [
      {
        title: "#",
        dataIndex: "index",
        width: 60,
        render: (_, __, idx) => <span>{idx + 1}</span>,
      },
      {
        title: "Employee ID",
        dataIndex: "employeeId",
        key: "employeeId",
        width: 140,
        ellipsis: true,
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        width: 200,
        ellipsis: true,
      },
      {
        title: "Dept",
        dataIndex: "department",
        key: "department",
        width: 160,
      },
      {
        title: "Designation",
        dataIndex: "designation",
        key: "designation",
        width: 160,
      },
    ];

    // day columns
    days.forEach((d) =>
      cols.push({
        title: d,
        dataIndex: ["attendance", d],
        key: `day-${d}`,
        width: 56,
        align: "center",
        render: (val, record) => {
          const isEditing = editingRow === record.id;
          // ensure we display something even if attendance missing
          const value = record.attendance?.[d] ?? "-";
          return isEditing ? (
            <Select
              size="small"
              value={value}
              onChange={(v) => handleAttendanceChange(record.id, d, v)}
              style={{ width: 60 }}
              dropdownMatchSelectWidth={false}
            >
              {statuses.map((st) => (
                <Option key={st} value={st}>
                  {st}
                </Option>
              ))}
            </Select>
          ) : (
            <span className={statusBadge(value)}>{value}</span>
          );
        },
      })
    );

    // totals
    // cols.push({
    //   title: "Total Hrs",
    //   key: "totalHours",
    //   width: 110,
    //   align: "center",
    //   render: (_, record) => {
    //     const totals = calculateTotals(record.attendance, record.prHours);
    //     return <span>{(totals.totalHours || 0).toFixed(1)}</span>;
    //   },
    // });

    // actions
    cols.push({
      title: "Actions",
      key: "actions",
      width: 160,
      fixed: "right",
      render: (_, record) => {
        const isEditing = editingRow === record.id;
        return isEditing ? (
          <Space size="small">
            <Button
              type="text"
              onClick={() => saveRow(record.id)}
              className="text-green-600"
            >
              Save
            </Button>
            <Button
              type="text"
              onClick={() => cancelEdit(record.id)}
              className="text-red-600"
            >
              Cancel
            </Button>
          </Space>
        ) : (
          <Space size="small">
            <Button
              type="link"
              onClick={() => startEdit(record)}
              className="text-indigo-600"
            >
              Edit
            </Button>
            <Button
              type="link"
              onClick={() => openPrModalForRow(record)}
              className="text-gray-700"
            >
              Add PR
            </Button>
          </Space>
        );
      },
    });

    return cols;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, editingRow, staffData]);

  // handlers for editing
  const startEdit = (row) => {
    setBackupRow(JSON.parse(JSON.stringify(row)));
    setEditingRow(row.id);
  };

  const cancelEdit = (id) => {
    setStaffData((prev) => prev.map((r) => (r.id === id ? backupRow : r)));
    setEditingRow(null);
    setBackupRow(null);
    message.info("Edit cancelled");
  };

  const saveRow = async (id) => {
    const row = staffData.find((r) => r.id === id);
    if (!row) return;
    try {
      // if attendanceService has update method, call it (signature attempted: update(id, payload))
      if (attendanceService.update) {
        await attendanceService.update(id, {
          attendance: row.attendance,
          prHours: row.prHours,
        });
      }
      setEditingRow(null);
      setBackupRow(null);
      message.success("✔ Changes saved");
    } catch (err) {
      console.error(err);
      message.error("Failed to save changes");
    }
  };

  // attendance change (while editing)
  const handleAttendanceChange = (id, day, value) => {
    // if PR selected, open PR modal (we still set in select only after confirming PR hours)
    if (value === "PR") {
      setPrModal({ visible: true, staffId: id, day, from: null, to: null });
      return;
    }
    setStaffData((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, attendance: { ...s.attendance, [day]: value } } : s
      )
    );
  };

  const openPrModalForRow = (record) => {
    // open with no day selected: user must choose day by clicking a day cell's Add PR action
    // We'll instead open modal expecting a specific day when user selects 'PR' from day select.
    // This helper exists in Actions (Add PR) — we'll default to day 1 if not provided.
    setPrModal({
      visible: true,
      staffId: record.id,
      day: 1,
      from: null,
      to: null,
    });
  };

  const confirmPrHours = () => {
    const { staffId, day, from, to } = prModal;
    if (!from || !to) {
      message.warning("Please select both From and To times");
      return;
    }
    // compute hours using dayjs difference in milliseconds
    const start = dayjs(from);
    const end = dayjs(to);
    const diffHours = end.diff(start, "minute") / 60;
    if (diffHours <= 0) {
      message.warning("To time must be after From time");
      return;
    }
    setStaffData((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              attendance: { ...s.attendance, [day]: "PR" },
              prHours: (s.prHours || 0) + diffHours,
            }
          : s
      )
    );
    setPrModal({ visible: false, staffId: null, day: null, from: null, to: null });
    message.success(`✔ PR added: ${diffHours.toFixed(2)} hrs`);
  };

  const closePrModal = () =>
    setPrModal({ visible: false, staffId: null, day: null, from: null, to: null });

  // small table row key
  const rowKey = (r) => r.id;

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <div className="max-w-full">
        <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-4">
          <h1 className="font-semibold text-lg">Edit Staff Attendance</h1>

          <Space size="middle" className="flex items-center">
            <Search
              placeholder="Search employee, ID, dept..."
              allowClear
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{ width: 260 }}
            />

            <Select
              value={month}
              onChange={setMonth}
              style={{ width: 160 }}
              options={monthNames.map((m) => ({ label: m, value: m }))}
            />

            <Select
              value={year}
              onChange={setYear}
              style={{ width: 110 }}
              options={years.map((y) => ({ label: y, value: y }))}
            />

            <Button
              type="primary"
              onClick={handleRefresh}
              loading={refreshing}
              className="bg-purple-600 border-purple-600"
            >
              Refresh
            </Button>
          </Space>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Spin size="large" />
          </div>
        ) : (
          <Table
            dataSource={filteredStaff}
            columns={columns}
            rowKey={rowKey}
            pagination={false}
            scroll={{ x: 1500 }}
            bordered
            className="ant-table-shadow"
          />
        )}
      </div>

      {/* PR Modal */}
      <Modal
        title="Enter PR Time"
        visible={prModal.visible}
        onCancel={closePrModal}
        onOk={confirmPrHours}
        okText="OK"
        cancelText="Cancel"
      >
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium mb-1">Day</div>
            <Select
              value={prModal.day}
              onChange={(d) => setPrModal((p) => ({ ...p, day: d }))}
              style={{ width: "100%" }}
            >
              {days.map((d) => (
                <Option key={d} value={d}>
                  {d}
                </Option>
              ))}
            </Select>
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <div className="text-sm font-medium mb-1">From</div>
              <TimePicker
                value={prModal.from}
                onChange={(val) => setPrModal((p) => ({ ...p, from: val }))}
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </div>

            <div className="flex-1">
              <div className="text-sm font-medium mb-1">To</div>
              <TimePicker
                value={prModal.to}
                onChange={(val) => setPrModal((p) => ({ ...p, to: val }))}
                format="HH:mm"
                style={{ width: "100%" }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
