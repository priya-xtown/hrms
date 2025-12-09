import React, { useMemo, useState, useEffect } from "react";
import { FaPencilAlt } from "react-icons/fa";
import {
  Modal,
  Input,
  Select,
  Form,
  Button,
  DatePicker,
  TimePicker,
  App,
  Space,
  Table,
  Tag,
} from "antd";
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

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecordId, setEditRecordId] = useState(null);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: null,
    fromDate: null,
    toDate: null,
    fromTime: null,
    toTime: null,
    status: null,
  });

  const matchesSearch = (record, q) => {
    if (!q) return true;
    const s = q.trim().toLowerCase();
    return (
      String(record.emp_id || record.employeeId || "").toLowerCase().includes(s) ||
      String(record.emp_name || record.employeeName || "").toLowerCase().includes(s)
    );
  };

  // get all
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        status: statusFilter !== "All" ? statusFilter : undefined,
        page: currentPage,
        limit: rowsPerPage,
      };
      const res = await leaveService.getAll(params);
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
  }, [search, statusFilter, currentPage]);

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((r) => {
      if (!matchesSearch(r, search)) return false;
      if (statusFilter !== "All" && r.permission !== statusFilter) return false;
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
  const currentRecords = filteredRecords.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const openFormForNew = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      leaveType: null,
      fromDate: null,
      toDate: null,
      fromTime: null,
      toTime: null,
      status: null,
    });
    setEditRecordId(null);
    setModalOpen(true);
  };

  // put
  const openFormForEdit = (record) => {
    if (!record) return;
    setFormData({
      employeeId: record.emp_id || record.employeeId || "",
      employeeName: record.emp_name || record.employeeName || "",
      leaveType: record.leave_type || null,
      fromDate: record.from_date ? dayjs(record.from_date, "YYYY-MM-DD") : null,
      toDate: record.to_date ? dayjs(record.to_date, "YYYY-MM-DD") : null,
      fromTime: record.from_time ? dayjs(record.from_time, "HH:mm") : null,
      toTime: record.to_time ? dayjs(record.to_time, "HH:mm") : null,
      status: record.status || null,
    });
    setEditRecordId(record.id || null);
    setModalOpen(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // create
  const handleFormSubmit = async () => {
  try {
    // Validate
    if (
  !formData.employeeId ||
  !formData.leaveType ||
  !formData.fromDate ||
  !formData.toDate
) {

      message.warning("Please fill all required fields");
      return;
    }

    // Construct payload
    const baseData = {
      leave_type: formData.leaveType,
      from_date: dayjs(formData.fromDate).format("YYYY-MM-DD"),
      to_date: dayjs(formData.toDate).format("YYYY-MM-DD"),
      from_time: formData.fromTime ? dayjs(formData.fromTime).format("HH:mm") : null,
      to_time: formData.toTime ? dayjs(formData.toTime).format("HH:mm") : null,
    };

    if (!editRecordId) {
      const createPayload = {
        emp_id: String(formData.employeeId).trim(),
        ...baseData,
      };
      const res = await leaveService.create(createPayload);
      if (res?.status >= 200 && res?.status < 300) {
        message.success("Leave created successfully");
        setModalOpen(false);
        setFormData({
          employeeId: "",
          employeeName: "",
          leaveType: null,
          fromDate: null,
          toDate: null,
          fromTime: null,
          toTime: null,
          status: null,
        });
        await fetchLeaves();
      } else {
        message.error(res?.data?.message || "Failed to create leave");
      }
    } else {
      const updateData = {
        ...baseData,
        status: formData.status || undefined,
      };
      const res = await leaveService.update(editRecordId, updateData);
      if (res?.status >= 200 && res?.status < 300) {
        message.success("Leave updated successfully");
        setModalOpen(false);
        setEditRecordId(null);
        await fetchLeaves();
      } else {
        message.error(res?.data?.message || "Failed to update leave");
      }
    }
  } catch (err) {
    console.error(err);
    message.error("Operation failed");
  }
};

// delete
  const deleteLeave = async (id) => {
    try {
      const res = await leaveService.delete(id);
      if (res?.status >= 200 && res?.status < 300) {
        message.success("Leave deleted");
        await fetchLeaves();
      } else {
        message.error(res?.data?.message || "Failed to delete leave");
      }
    } catch (err) {
      console.error(err);
      message.error("Error deleting leave");
    }
  };

  // ======================
  // TABLE COLUMNS
  // ======================
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "emp_id",
      render: (id) => (
        <span className="font-semibold text-[#408CFF] underline cursor-pointer">
          {id}
        </span>
      ),
    },
    {
      title: "Employee Name",
      dataIndex: "emp_name",
    },
    {
      title: "Leave Type",
      dataIndex: "leave_type",
      align: "center",
    },
    {
      title: "From Date",
      dataIndex: "from_date",
      align: "center",
    },
    {
      title: "To Date",
      dataIndex: "to_date",
      align: "center",
    },
    {
      title: "From Time",
      dataIndex: "from_time",
      align: "center",
      render: (t) => formatTimeForDisplay(t),
    },
    {
      title: "To Time",
      dataIndex: "to_time",
      align: "center",
      render: (t) => formatTimeForDisplay(t),
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (permission) => (
        <Tag color={permission === "Approved" ? "green" : permission === "Pending" ? "blue" : "red"}>
          {permission}
        </Tag>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => openFormForEdit(record)} icon={<FaPencilAlt />} />
          <Button danger onClick={() => deleteLeave(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      {/* HEADER */}
      <div className="w-full flex flex-wrap items-start justify-between gap-4 mb-6">
        <h1 className="font-semibold text-xl">Leave Management</h1>

        <Space size="middle">
          <Search
            placeholder="Search by Employee ID or Name..."
            allowClear
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            style={{ width: 250 }}
          />

          <Select
            value={statusFilter}
            onChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
            style={{ width: 180 }}
            options={[
              { label: "All Permissions", value: "All" },
              { label: "Approved", value: "Approved" },
              { label: "Denied", value: "Denied" },
            ]}
          />

          <Button type="primary" onClick={openFormForNew}>
            Add Leave
          </Button>
        </Space>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={currentRecords}
        rowKey={(r) => r.id}
      />

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing {filteredRecords.length === 0 ? 0 : startIndex + 1} -{" "}
          {Math.min(startIndex + rowsPerPage, filteredRecords.length)} of{" "}
          {filteredRecords.length}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage === 1}
          >
            Prev
          </button>

          <div className="px-4 py-2 border rounded">
            {currentPage} / {totalPages}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 border rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL */}
     <Modal
  title={editRecordId !== null ? "Edit Leave" : "Add Leave"}
  open={modalOpen}
  onCancel={() => setModalOpen(false)}
  footer={null}
  width={900}
>

        <Form layout="vertical" onFinish={handleFormSubmit}>
          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label="Employee ID"
              name="employeeId"
              rules={[{ required: true, message: "Employee ID is required" }]}
            >
              <Input
                size="large"
                value={formData.employeeId}
                onChange={(e) => handleFormChange("employeeId", e.target.value)}
              />
            </Form.Item>

            <Form.Item
              label="Employee Name"
              name="employeeName"

            >
              <Input
                size="large"
                value={formData.employeeName}
                onChange={(e) =>
                  handleFormChange("employeeName", e.target.value)
                }
              />
            </Form.Item>

            <Form.Item
              label="Leave Type"
              name="leaveType"
              rules={[{ required: true, message: "Select leave type" }]}
            >
              <Select
                size="large"
                value={formData.leaveType}
                onChange={(value) => handleFormChange("leaveType", value)}
                options={[
                  { label: "Casual", value: "Casual" },
                  { label: "Sick", value: "Sick" },
                  { label: "Permission", value: "Permission" },
                  { label: "Other", value: "Other" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Form.Item
              label="From Date"
              name="fromDate"
              rules={[{ required: true, message: "Select From Date" }]}
            >
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                size="large"
                value={formData.fromDate}
                onChange={(date) => handleFormChange("fromDate", date)}
              />
            </Form.Item>

            <Form.Item
              label="To Date"
              name="toDate"
              rules={[{ required: true, message: "Select To Date" }]}
            >
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                size="large"
                value={formData.toDate}
                onChange={(date) => handleFormChange("toDate", date)}
              />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select
                size="large"
                value={formData.status}
                onChange={(value) => handleFormChange("status", value)}
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Approved", value: "Approved" },
                  { label: "Denied", value: "Denied" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <Form.Item label="From Time" name="fromTime">
              <TimePicker
                className="w-full"
                format="HH:mm"
                size="large"
                value={formData.fromTime}
                onChange={(time) => handleFormChange("fromTime", time)}
              />
            </Form.Item>

            <Form.Item label="To Time" name="toTime">
              <TimePicker
                className="w-full"
                format="HH:mm"
                size="large"
                value={formData.toTime}
                onChange={(time) => handleFormChange("toTime", time)}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
