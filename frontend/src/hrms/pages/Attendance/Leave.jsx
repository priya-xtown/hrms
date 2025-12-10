import React, { useMemo, useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import {
  Modal,
  Input,
  Select,
  Form,
  Button,
  DatePicker,
  Popconfirm,
  TimePicker,
  App,
  Space,
  Table,
  Tag,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import leaveService from "./service/Leave";

const { Search } = Input;

const formatTimeForDisplay = (time) => {
  if (!time) return "--";
  if (typeof time === "string") return time;
  return dayjs(time).format("HH:mm");
};

export default function Leave() {
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecordId, setEditRecordId] = useState(null);

  /* ==========================================================
      ➤ FETCH EMPLOYEES
    ========================================================== */
  const fetchEmployees = async () => {
    try {
      const res = await leaveService.getEmployees();
      setEmployees(res.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load employees");
    }
  };

  /* ==========================================================
      ➤ FETCH LEAVES
    ========================================================== */
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        page: currentPage,
        limit: rowsPerPage,
      };
      const res = await leaveService.getAllLeaves(params);
      setRecords(res.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch leave records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
    fetchEmployees();
  }, [search, statusFilter, currentPage]);

  const matchesSearch = (record, q) => {
    if (!q) return true;
    const s = q.trim().toLowerCase();
    return (
      String(record.emp_id || "").toLowerCase().includes(s) ||
      String(record.emp_name || "").toLowerCase().includes(s)
    );
  };

  /* ==========================================================
      ➤ FILTERING & PAGINATION LOGIC
    ========================================================== */
  const filteredRecords = useMemo(() => {
    const filtered = records.filter((r) => {
      if (!matchesSearch(r, search)) return false;
      if (statusFilter !== "All" && r.status !== statusFilter) return false;
      return true;
    });

    setTimeout(() => {
      const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
      if (currentPage > totalPages) setCurrentPage(1);
    }, 0);

    return filtered;
  }, [search, statusFilter, records, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRecords = filteredRecords.slice(startIndex, startIndex + rowsPerPage);

  /* ==========================================================
      ➤ OPEN NEW FORM
    ========================================================== */
  const openFormForNew = () => {
    setEditRecordId(null);
    form.resetFields();
    form.setFieldsValue({ status: "" });
    setModalOpen(true);
  };

  /* ==========================================================
      ➤ OPEN EDIT FORM  (corrected & stable)
    ========================================================== */
  const openFormForEdit = (record) => {
    form.setFieldsValue({
      employeeId: record.emp_id || "",
      employeeName: record.emp_name || "",
      leaveType: record.leave_type || null,
      fromDate: record.from_date ? dayjs(record.from_date) : null,
      toDate: record.to_date ? dayjs(record.to_date) : null,
      fromTime: record.from_time ? dayjs(record.from_time, "HH:mm") : null,
      toTime: record.to_time ? dayjs(record.to_time, "HH:mm") : null,
      reason: record.reason || "",
      status: record.status || "",
    });

    setEditRecordId(record._id || record.id);
    setModalOpen(true);
  };

  /* ==========================================================
      ➤ CREATE / UPDATE LEAVE
    ========================================================== */
 const handleFormSubmit = async () => {
  try {
    const values = form.getFieldsValue();

    if (!values.employeeId || !values.leaveType || !values.fromDate || !values.toDate) {
      message.warning("Please fill all required fields");
      return;
    }

    const payload = {
      emp_id: String(values.employeeId),
      leave_type: values.leaveType,
      from_date: dayjs(values.fromDate).format("YYYY-MM-DD"),
      to_date: dayjs(values.toDate).format("YYYY-MM-DD"),
      from_time: values.fromTime ? dayjs(values.fromTime).format("HH:mm") : null,
      to_time: values.toTime ? dayjs(values.toTime).format("HH:mm") : null,
      reason: values.reason,
      status: values.status, // ✔ FIXED — now uses selected value
    };

    if (!editRecordId) {
      await leaveService.create(payload);
      message.success("Leave created successfully");
    } else {
      await leaveService.update(editRecordId, payload);
      message.success("Leave updated");
    }

    setModalOpen(false);
    fetchLeaves();
  } catch (err) {
    console.error(err);
    message.error("Operation failed");
  }
};


  /* ==========================================================
      ➤ DELETE LEAVE
    ========================================================== */
  const deleteLeave = async (id) => {
    try {
      await leaveService.delete(id);
      message.success("Leave deleted");
      fetchLeaves();
    } catch {
      message.error("Delete failed");
    }
  };

  /* ==========================================================
      ➤ TABLE COLUMNS
    ========================================================== */
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "emp_id",
      render: (id) => <span className="text-blue-600 font-semibold">{id}</span>,
    },
    { title: "Employee Name", dataIndex: "emp_name" },
    { title: "Leave Type", dataIndex: "leave_type", align: "center" },
    { title: "From Date", dataIndex: "from_date", align: "center" },
    { title: "To Date", dataIndex: "to_date", align: "center" },
    { title: "From Time", dataIndex: "from_time", align: "center", render: formatTimeForDisplay },
    { title: "To Time", dataIndex: "to_time", align: "center", render: formatTimeForDisplay },
    { title: "Reason", dataIndex: "reason" },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => (
        <Tag color={status === "Approved" ? "green" : status === "Pending" ? "blue" : "red"}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openFormForEdit(record)} />
          <Popconfirm
            title="Delete?"
            onConfirm={() => deleteLeave(record._id || record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ==========================================================
      ➤ UI
    ========================================================== */
  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-xl font-semibold">Leave Management</h1>

        <Space>
          <Search
            placeholder="Search..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 250 }}
          />

          <Select
            value={statusFilter}
            onChange={(value) => setStatusFilter(value)}
            style={{ width: 180 }}
            options={[
              { label: "All", value: "All" },
              { label: "Approved", value: "Approved" },
              { label: "Denied", value: "Denied" },
              { label: "Pending", value: "Pending" },
            ]}
          />

          <Button type="primary" onClick={openFormForNew}>Add Leave</Button>
        </Space>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={currentRecords}
        rowKey={(r) => r._id || r.id}
        pagination={false}
      />

      {/* Pagination */}
      <div className="flex justify-between mt-4 items-center">
        <p className="text-gray-500">
          Showing {filteredRecords.length === 0 ? 0 : startIndex + 1} –{" "}
          {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of{" "}
          {filteredRecords.length}
        </p>

        <div className="flex gap-3">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-4 py-2 border rounded bg-gray-50"
          >
            Prev
          </button>

          <span className="px-4 py-2 border rounded">
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-2 border rounded bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editRecordId ? "Edit Leave" : "Add Leave"}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={900}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <div className="grid grid-cols-3 gap-6">

            <Form.Item label="Employee ID" name="employeeId" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select Employee"
                onChange={(value) => {
                  const emp = employees.find(e => e.emp_id === value);
                  if (emp) {
                    form.setFieldsValue({
                      employeeName: `${emp.first_name || ""} ${emp.last_name || ""}`.trim(),
                    });
                  }
                }}
                options={employees
                  .filter(emp => emp.emp_id)
                  .map(emp => ({ label: emp.emp_id, value: emp.emp_id }))
                }
              />
            </Form.Item>

            <Form.Item label="Employee Name" name="employeeName">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Leave Type" name="leaveType" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: "Casual", value: "Casual" },
                  { label: "Sick", value: "Sick" },
                  { label: "Permission", value: "Permission" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </Form.Item>

            <Form.Item label="From Date" name="fromDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item label="To Date" name="toDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item label="From Time" name="fromTime">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>

            <Form.Item label="To Time" name="toTime">
              <TimePicker style={{ width: "100%" }} format="HH:mm" />
            </Form.Item>

            <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Status" name="status" initialValue="Pending">
              <Select
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Approved", value: "Approved" },
                  { label: "Denied", value: "Denied" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">Save</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}

