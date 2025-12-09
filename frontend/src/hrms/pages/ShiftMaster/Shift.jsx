// import { useState, useEffect } from "react";
// import {
//   Table,
//   Input,
//   Button,
//   message,
//   Tag,
//   Space,
//   Popconfirm,
//   Popover,
// } from "antd";

// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
// } from "@ant-design/icons";

// import { useTheme } from "../../../context/ThemeContext";
// import { useNavigate } from "react-router-dom";
// import { shiftService } from "./ShiftApi";

// export default function Shift() {
//   const [shiftData, setShiftData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [pagination, setPagination] = useState({
//     current: 1,
//     pageSize: 10,
//     total: 0,
//   });

//   const [searchText, setSearchText] = useState("");
//   const [filters, setFilters] = useState({});
//   const navigate = useNavigate();
//   const [messageApi, contextHolder] = message.useMessage();
//   const { showCustomButton } = useTheme();

//   // ======================== FETCH SHIFTS (BACKEND PAGINATION) ==========================
//   const fetchShift = async (page = 1) => {
//     try {
//       setLoading(true);

//       const res = await shiftService.getAllShifts(page, pagination.pageSize);

//       const rows = res?.data?.data || [];
//       const count = res?.data?.meta?.total || rows.length;

//       setShiftData(rows);

//       setPagination((p) => ({
//         ...p,
//         current: page,
//         total: count,
//       }));
//     } catch (err) {
//       console.error("❌ Shift fetch error:", err);
//       messageApi.error("Failed to fetch shifts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShift(pagination.current);
//   }, [pagination.current]);

//   // ========================= TABLE PAGINATION CHANGE ==========================
//   const handleTableChange = (newPagination) => {
//     setPagination((prev) => ({
//       ...prev,
//       current: newPagination.current,
//       pageSize: newPagination.pageSize,
//     }));
//   };

//   // ========================= SEARCH ==========================
//   const handleSearchChange = (e) => {
//     const value = e.target.value;
//     setSearchText(value);

//     setPagination((p) => ({ ...p, current: 1 }));

//     fetchShift(1);
//   };

//   // ========================= EDIT SHIFT ==========================
//   const handleEdit = async (record) => {
//     try {
//       const id = record.shift_id;
//       const res = await shiftService.getShiftById(id);

//       navigate("/hrms/pages/createshift", {
//         state: { isEdit: true, initialValues: res.data.data },
//       });
//     } catch {
//       messageApi.error("Failed to load shift");
//     }
//   };

//   // ========================= DELETE SHIFT ==========================
//   const handleDelete = async (record) => {
//     try {
//       const id = record.shift_id;
//       await shiftService.deleteShift(id);

//       messageApi.success("Shift deleted");

//       const newTotal = Math.max(0, pagination.total - 1);
//       const maxPage = Math.max(1, Math.ceil(newTotal / pagination.pageSize));

//       const nextPage =
//         pagination.current > maxPage ? maxPage : pagination.current;

//       setPagination((p) => ({
//         ...p,
//         total: newTotal,
//         current: nextPage,
//       }));

//       fetchShift(nextPage);
//     } catch {
//       messageApi.error("Delete failed");
//     }
//   };

//   // ============================= COLUMNS =============================
//   const columns = [
//     {
//       title: "S.No",
//       render: (_, __, index) =>
//         (pagination.current - 1) * pagination.pageSize + index + 1,
//     },
//     {
//       title: "Shift Name",
//       dataIndex: "shift_name",
//       render: (t) => t?.charAt(0).toUpperCase() + t.slice(1),
//     },
//     {
//       title: "Start Time",
//       dataIndex: "start_time",
//       render: (t) => (t ? t.slice(0, 5) : "--"),
//     },
//     {
//       title: "End Time",
//       dataIndex: "end_time",
//       render: (t) => (t ? t.slice(0, 5) : "--"),
//     },
//     {
//       title: "Status",
//       dataIndex: "status",
//       render: (t) => (
//         <Tag color={t === "active" ? "green" : "red"}>
//           {t?.toUpperCase()}
//         </Tag>
//       ),
//     },
//     {
//       title: "Actions",
//       render: (_, rec) => (
//         <Space>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(rec)} />

//           <Popconfirm
//             title="Delete?"
//             onConfirm={() => handleDelete(rec)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <>
//       {contextHolder}

//       <Input.Search
//         placeholder="Search..."
//         allowClear
//         value={searchText}
//         onChange={(e) => setSearchText(e.target.value)}
//         style={{ width: 300, maxWidth: "100%" }}
//       />
//       <Popover
//         content={<FiltersPopover onApply={(values) => setFilters(values)} />}
//         trigger="click"
//         placement="bottomLeft"
//       >
//         <Button icon={<FilterOutlined />}>Filters</Button>
//       </Popover>
//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={() => navigate("/hrms/pages/createshift")}
//         className="mb-3"
//       >
//         Add Shift
//       </Button>

//       {/* ---------- FINAL WORKING PAGINATED TABLE ---------- */}
//       <Table
//         columns={columns}
//         dataSource={shiftData}
//         loading={loading}
//         rowKey="shift_id"
//         pagination={{
//           current: pagination.current,
//           pageSize: pagination.pageSize,
//           total: pagination.total,
//           showSizeChanger: false,
//           showTotal: (t) => `Total ${t} items`,
//         }}
//         onChange={handleTableChange}
//       />
//       <div className="flex justify-center items-center mt-4 gap-3">
//         <Button
//           onClick={() =>
//             setPagination((p) => ({
//               ...p,
//               current: Math.max(1, p.current - 1),
//             }))
//           }
//           disabled={pagination.current === 1}
//         >
//           Previous
//         </Button>

//         <span>
//           Page {pagination.current} of{" "}
//           {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
//         </span>

//         <Button
//           onClick={() =>
//             setPagination((p) => ({
//               ...p,
//               current:
//                 p.current < Math.ceil(p.total / p.pageSize)
//                   ? p.current + 1
//                   : p.current,
//             }))
//           }
//           disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
//         >
//           Next
//         </Button>
//       </div>

//     </>
//   );
// }



import { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  message,
  Tag,
  Space,
  Popconfirm,
  Popover,
  Form,
  Select,
} from "antd";

import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";

import { useTheme } from "../../../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { shiftService } from "./ShiftApi";

/**
 * Simple FiltersPopover component
 * - onApply(filters) will be called when user clicks Apply
 * - initialFilters can be passed (optional)
 */
function FiltersPopover({ initialFilters = {}, onApply, onClose }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialFilters);
  }, [initialFilters, form]);

  const handleApply = () => {
    const values = form.getFieldsValue();
    onApply?.(values);
    onClose?.();
  };

  const handleClear = () => {
    form.resetFields();
    onApply?.({});
    onClose?.();
  };

  return (
    <div style={{ minWidth: 260, padding: 12 }}>
      <Form form={form} layout="vertical">
        <Form.Item name="status" label="Status">
          <Select allowClear placeholder="Select status">
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="shift_name" label="Shift name contains">
          <Input placeholder="e.g. morning" />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Button onClick={handleClear}>Clear</Button>
          <Button type="primary" onClick={handleApply}>
            Apply
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default function Shift() {
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [searchText, setSearchText] = useState("");
  const [filters, setFilters] = useState({});

  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { showCustomButton } = useTheme();

  // fetch shifts
  const fetchShift = async (page = 1) => {
    try {
      setLoading(true);
      // pass search + filters to API as needed; here we send page and pageSize
      // const res = await shiftService.getAllShifts(page, pagination.pageSize, {
      //   search: searchText,
      //   ...filters,
      // });
const res = await shiftService.getAllShifts(page, pagination.pageSize, {
  search: searchText || "",
  status: filters.status || "",
  shift_name: filters.shift_name || "",
});

      const rows = res?.data?.data || [];
      const count = res?.data?.meta?.total ?? rows.length;

      setShiftData(rows);

      setPagination((p) => ({
        ...p,
        current: page,
        total: count,
      }));
    } catch (err) {
      console.error("❌ Shift fetch error:", err);
      messageApi.error("Failed to fetch shifts");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchShift(pagination.current);
}, [pagination.current, pagination.pageSize, filters, searchText]);

  // handle table pagination (AntD)
  const handleTableChange = (newPagination) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
  };

  // search (debounce would be nice but keeping simple)
  const handleSearchChange = (e) => {
    const value = e.target.value;
   setSearchText(value);
setPagination((p) => ({ ...p, current: 1 }));
  };

  const handleEdit = async (record) => {
    try {
      const id = record.shift_id;
      const res = await shiftService.getShiftById(id);

      navigate("/hrms/pages/createshift", {
        state: { isEdit: true, initialValues: res.data.data },
      });
    } catch {
      messageApi.error("Failed to load shift");
    }
  };

  const handleDelete = async (record) => {
    try {
      const id = record.shift_id;
      await shiftService.deleteShift(id);

      messageApi.success("Shift deleted");

      const newTotal = Math.max(0, pagination.total - 1);
      const maxPage = Math.max(1, Math.ceil(newTotal / pagination.pageSize));

      const nextPage =
        pagination.current > maxPage ? maxPage : pagination.current;

      setPagination((p) => ({
        ...p,
        total: newTotal,
        current: nextPage,
      }));

      fetchShift(nextPage);
    } catch {
      messageApi.error("Delete failed");
    }
  };

  const columns = [
    {
      title: "S.No",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Shift Name",
      dataIndex: "shift_name",
      render: (t) => (t ? t.charAt(0).toUpperCase() + t.slice(1) : "--"),
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      render: (t) => (t ? t.slice(0, 5) : "--"),
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      render: (t) => (t ? t.slice(0, 5) : "--"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (t) => (
        <Tag color={t === "active" ? "green" : "red"}>{t?.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, rec) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(rec)} />

          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(rec)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      {contextHolder}

      <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
    gap: 12,
  }}
>
  {/* LEFT SIDE - SHIFT TITLE */}
  <h2 className="font-semibold text-xl">Shift</h2>

  {/* RIGHT SIDE - SEARCH, FILTER, ADD BUTTON */}
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    <Input.Search
      placeholder="Search..."
      allowClear
      value={searchText}
      onChange={handleSearchChange}
      style={{ width: 300, maxWidth: "100%" }}
    />

    <Popover
      content={
        <FiltersPopover
          initialFilters={filters}
          onApply={(values) => {
            setFilters(values || {});
            setPagination((p) => ({ ...p, current: 1 }));
          }}
          onClose={() => {}}
        />
      }
      trigger="click"
      placement="bottomLeft"
    >
      <Button icon={<FilterOutlined />}>Filters</Button>
    </Popover>

    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={() => navigate("/hrms/pages/createshift")}
    >
      Add Shift
    </Button>
  </div>
</div>


      <Table
        columns={columns}
        dataSource={shiftData}
        loading={loading}
        rowKey="shift_id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: false,
          showTotal: (t) => `Total ${t} items`,
        }}
        onChange={handleTableChange}
      />

      <div className="flex justify-center items-center mt-4 gap-3">
        <Button
          onClick={() =>
            setPagination((p) => ({
              ...p,
              current: Math.max(1, p.current - 1),
            }))
          }
          disabled={pagination.current === 1}
        >
          Previous
        </Button>

        <span>
          Page {pagination.current} of{" "}
          {Math.max(1, Math.ceil(pagination.total / pagination.pageSize))}
        </span>

        <Button
          onClick={() =>
            setPagination((p) => ({
              ...p,
              current:
                p.current < Math.ceil(p.total / p.pageSize) ? p.current + 1 : p.current,
            }))
          }
          disabled={
            pagination.current >= Math.ceil(pagination.total / pagination.pageSize)
          }
        >
          Next
        </Button>
      </div>
    </>
  );
}
