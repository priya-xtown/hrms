import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  TimePicker,
  Button,
  Table,
  Space,
  Tag,
  Popconfirm,
  App,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import AttenOdService from "../Attendance/service/AttenOd";

export default function AttenOd() {
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

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await AttenOdService.getEmployees();
      setEmployees(res.data?.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to load employees");
    }
  };

  // Fetch OD records
  const fetchOdRecords = async () => {
    try {
      setLoading(true);
      const params = { search: search || undefined, status: statusFilter !== "All" ? statusFilter : undefined };
      const res = await AttenOdService.getAll(params);
      setRecords(res.data?.rows || res.data?.data || res.data || []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch OD records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchOdRecords();
  }, [search, statusFilter, currentPage]);

  const openFormForNew = () => {
    setEditRecordId(null);
    form.resetFields();
    form.setFieldsValue({ status: "pending" });
    setModalOpen(true);
  };

  const openFormForEdit = (record) => {
    form.setFieldsValue({
      emp_id: record.emp_id,
      employeeName: record.employeeName || "",
      attendance_id: record.attendance_id,
      date: record.date ? dayjs(record.date) : null,
      start_time: record.start_time ? dayjs(record.start_time, "HH:mm") : null,
      end_time: record.end_time ? dayjs(record.end_time, "HH:mm") : null,
      total_hours: record.total_hours,
      reason: record.reason,
      status: record.status || "pending",
    });
    setEditRecordId(record.id || record._id);
    setModalOpen(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      if (!values.emp_id || !values.date || !values.start_time || !values.end_time) {
        message.warning("Please fill all required fields");
        return;
      }

      // Calculate total minutes
      let diffMinutes = values.end_time.diff(values.start_time, "minute");
      if (diffMinutes < 0) diffMinutes += 24 * 60;

      const totalHours =
        values.total_hours ||
        (diffMinutes >= 60 ? (diffMinutes / 60).toFixed(2) : diffMinutes);

      const payload = {
        emp_id: String(values.emp_id),
        attendance_id: values.attendance_id ? String(values.attendance_id) : "",
        date: dayjs(values.date).format("YYYY-MM-DD"),
        start_time: values.start_time.format("HH:mm"),
        end_time: values.end_time.format("HH:mm"),
        total_hours: Number(totalHours),
        reason: values.reason,
        status: values.status,
      };

      if (!editRecordId) {
        await AttenOdService.create(payload);
        message.success("OD record added successfully");
      } else {
        await AttenOdService.update(editRecordId, payload);
        message.success("OD record updated successfully");
      }

      setModalOpen(false);
      fetchOdRecords();
    } catch (err) {
      console.error(err);
      message.error("Operation failed");
    }
  };

  const deleteOd = async (id) => {
    try {
      await AttenOdService.delete(id);
      message.success("OD record deleted successfully");
      fetchOdRecords();
    } catch {
      message.error("Delete failed");
    }
  };

  // Format total hours for display
  const formatTotalHours = (record) => {
    const start = dayjs(record.start_time, "HH:mm");
    const end = dayjs(record.end_time, "HH:mm");
    let diff = end.diff(start, "minute");
    if (diff < 0) diff += 24 * 60;
    return diff >= 60 ? (diff / 60).toFixed(2) + " Hrs" : diff + " Min";
  };

  const columns = [
    { title: "Employee ID", dataIndex: "emp_id", render: (id) => <span className="text-blue-600 font-semibold">{id}</span> },
    { title: "Date", dataIndex: "date", align: "center" },
    { title: "Start Time", dataIndex: "start_time", align: "center" },
    { title: "End Time", dataIndex: "end_time", align: "center" },
    { title: "Total Hours", dataIndex: "total_hours", align: "center", render: (_, record) => formatTotalHours(record) },
    { title: "Reason", dataIndex: "reason" },
    { title: "Status", dataIndex: "status", align: "center", render: (status) => <Tag color={status === "approve" ? "green" : status === "denied" ? "red" : "blue"}>{status}</Tag> },
    {
      title: "Actions", render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openFormForEdit(record)} />
          <Popconfirm title="Delete?" onConfirm={() => deleteOd(record.id || record._id)} okText="Yes" cancelText="No">
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">On Duty Management</h1>
        <Space>
          <Input.Search placeholder="Search..." allowClear value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: 250 }} />
          <Select value={statusFilter} onChange={(v) => setStatusFilter(v)} style={{ width: 180 }} options={[
            { label: "All", value: "All" },
            { label: "Pending", value: "pending" },
            { label: "Approved", value: "approved" },
            { label: "Denied", value: "denied" },
          ]} />
          <Button type="primary" onClick={openFormForNew}>Add OD</Button>
        </Space>
      </div>

      <Table loading={loading} columns={columns} dataSource={records} rowKey={(r) => r.id || r._id} pagination={{ pageSize: rowsPerPage }} />

      <Modal title={editRecordId ? "Edit OD Record" : "Add OD Record"} open={modalOpen} onCancel={() => setModalOpen(false)} footer={null} width={900}>
        <Form form={form} 
        layout="vertical"
         onFinish={handleFormSubmit} 
         initialValues={{ status: "pending" }}
         >
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item label="Employee ID" name="emp_id" rules={[{ required: true }]}>
              <Select
                showSearch
                placeholder="Select Employee"
                optionFilterProp="label"
                onChange={(value) => {
                  const emp = employees.find(e => e.emp_id === value);
                  if (emp) form.setFieldsValue({ employeeName: `${emp.first_name || ""} ${emp.last_name || ""}`.trim() });
                  else form.setFieldsValue({ employeeName: "" });
                }}
                filterOption={(input, option) => (option?.label || "").toLowerCase().includes(input.toLowerCase())}
                options={employees.filter(e => e.emp_id).map(e => ({ label: e.emp_id, value: e.emp_id }))}
              />
            </Form.Item>

            <Form.Item label="Employee Name" name="employeeName">
              <Input disabled />
            </Form.Item>

            {/* <Form.Item label="Attendance ID" name="attendance_id">
              <Input placeholder="Enter Attendance ID" />
            </Form.Item> */}

            <Form.Item label="Date" name="date" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" className="w-full" />
            </Form.Item>

            <Form.Item label="Start Time" name="start_time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>

            <Form.Item label="End Time" name="end_time" rules={[{ required: true }]}>
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>

            <Form.Item label="Total Hours" name="total_hours">
              <Input type="number" placeholder="Auto-calculated if empty" />
            </Form.Item>

            <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
              <Input placeholder="Enter reason for OD" />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select>
                <Select.Option value="pending">Pending</Select.Option>
                <Select.Option value="approve">Approved</Select.Option>
                <Select.Option value="denied">Denied</Select.Option>
              </Select>
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
