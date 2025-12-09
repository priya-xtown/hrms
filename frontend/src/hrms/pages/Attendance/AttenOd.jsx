
import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Popconfirm,
  TimePicker,
  message,
  Table,
  Tag,
  Button,
  Space,
} from "antd";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import dayjs from "dayjs";
import AttenOdService from "../Attendance/service/AttenOd";

export default function AttenOd() {
  const [odRecords, setOdRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  /* ---------------- Fetch Records ---------------- */
  useEffect(() => {
    fetchOdRecords();
  }, []);

  const fetchOdRecords = async () => {
    try {
      const res = await AttenOdService.getAll();
      const rows = res.data?.rows || res.data?.data || res.data || [];
      setOdRecords(rows);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch OD records");
    }
  };

  /* ---------------- Modal Handling ---------------- */
  const showModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);

    if (record) {
      form.setFieldsValue({
        id: record.id,
        emp_id: record.emp_id,
        attendance_id: record.attendance_id,
        date: dayjs(record.date, "YYYY-MM-DD"),
        start_time: dayjs(record.start_time, "HH:mm"),
        end_time: dayjs(record.end_time, "HH:mm"),
        total_hours: record.total_hours,
        reason: record.reason,
        status: record.status,
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ status: "pending" });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  /* ---------------- Time Calculation ---------------- */
  const calculateTotalHours = (start, end) => {
    let diff = end.diff(start, "minute");
    if (diff < 0) diff += 24 * 60;
    return (diff / 60).toFixed(2);
  };

  /* ---------------- Add / Update ---------------- */
  const handleSubmit = async (values) => {
    const start = values.start_time;
    const end = values.end_time;
    const totalHours = calculateTotalHours(start, end);

    const payload = {
      emp_id: String(values.emp_id).trim(),
      attendance_id: String(values.attendance_id).trim(),
      date: values.date.format("YYYY-MM-DD"),
      start_time: start.format("HH:mm"),
      end_time: end.format("HH:mm"),
      total_hours: Number(values.total_hours) || Number(totalHours),
      reason: values.reason,
      status: values.status,
    };

    try {
      if (editingRecord?.id) {
        const res = await AttenOdService.update(editingRecord.id, payload);
        if (res?.status >= 200 && res?.status < 300) {
          message.success("OD record updated successfully");
        } else {
          message.error(res?.data?.message || "Failed to update OD record");
        }
      } else {
        const res = await AttenOdService.create(payload);
        if (res?.status >= 200 && res?.status < 300) {
          message.success("OD record added successfully");
        } else {
          message.error(res?.data?.message || "Failed to add OD record");
        }
      }
      await fetchOdRecords();
      handleCancel();
    } catch (err) {
      console.error(err);
      message.error("Failed to save OD record");
    }
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    try {
      const res = await AttenOdService.delete(id);
      if (res?.status >= 200 && res?.status < 300) {
        message.success("OD record deleted successfully");
        setOdRecords((prev) => prev.filter((r) => r.id !== id));
      } else {
        message.error(res?.data?.message || "Failed to delete OD record");
      }
    } catch (err) {
      console.error(err);
      message.error("Failed to delete OD record");
    }
  };

  /* ---------------- Table Columns ---------------- */
  const odColumns = [
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
      title: "Attendance ID",
      dataIndex: "attendance_id",
    },
    {
      title: "Date",
      dataIndex: "date",
      align: "center",
    },
    {
      title: "Start Time",
      dataIndex: "start_time",
      align: "center",
    },
    {
      title: "End Time",
      dataIndex: "end_time",
      align: "center",
    },
    {
      title: "Total Hours",
      dataIndex: "total_hours",
      align: "center",
      render: (h) => <span className="font-bold">{h} Hrs</span>,
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      align: "center",
      render: (status) => (
        <Tag
          color={
            status === "approve"
              ? "green"
              : status === "denied"
              ? "red"
              : "blue"
          }
        >
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<FaPencilAlt />}
            onClick={() => showModal(record)}
          />

          <Popconfirm
            title="Are you sure to delete this record?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<FaTrash />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl mb-4">On Duty Management</h1>

      {/* Add Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => showModal()}
          className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
        >
          Add OD
        </button>
      </div>

      {/* OD Table */}
      <Table
        columns={odColumns}
        dataSource={odRecords}
        rowKey="id"
        pagination={{ pageSize: 10 }}
        className="shadow"
        scroll={{ x: 1000 }}
      />

      {/* Modal Form */}
      <Modal
        title={editingRecord ? "Edit OD Record" : "Add OD Record"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "pending" }}
        >
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
          <Form.Item label="Employee ID" name="emp_id" rules={[{ required: true }]}> 
            <Input style={{ width: 220 }} placeholder="Enter Employee ID" disabled={!!editingRecord} />
          </Form.Item>

          <Form.Item label="Attendance ID" name="attendance_id" > 
            <Input style={{ width: 220 }} placeholder="Enter Attendance ID" />
          </Form.Item>

          <Form.Item label="Date" name="date" rules={[{ required: true }]}> 
            <DatePicker style={{ width: 220 }} format="YYYY-MM-DD" className="w-full" />
          </Form.Item>

          <Form.Item label="Start Time" name="start_time" rules={[{ required: true }]}> 
            <TimePicker style={{ width: 220 }} format="HH:mm" className="w-full" />
          </Form.Item>

          <Form.Item label="End Time" name="end_time" rules={[{ required: true }]}> 
            <TimePicker style={{ width: 220 }} format="HH:mm" className="w-full" />
          </Form.Item>

            <Form.Item name="total_hours" label="Total Hours"> 
              <Input style={{ width: 220 }} type="number" placeholder="Example: 8.5" />
            </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true }]}
          >
            <Input style={{ width: 220 }} placeholder="Enter Reason for OD" />
          </Form.Item>

          <Form.Item label="Status" name="status">
            <Select style={{ width: 220 }}>
              <Select.Option value="pending">pending</Select.Option>
              <Select.Option value="approve">approve</Select.Option>
              <Select.Option value="denied">denied</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition"
            >
              {editingRecord ? "Update OD" : "Add OD"}
            </button>
          </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
