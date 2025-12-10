import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Select,
  message,
  Popconfirm,
  Table,
  Space,
  Button,
  Tag,
  Input,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import AttenOtService from "../Attendance/service/AttenOt";

const { Option } = Select;

export default function AttenOt() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [otRecords, setOtRecords] = useState([]);
  const [employees, setEmployees] = useState([]);

  // ---------------------------------------------------------
  // Fetch Employees
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await AttenOtService.getEmployees();
        setEmployees(res.data?.data || []);
      } catch {
        message.error("Failed to load employees");
      }
    };
    fetchEmployees();
  }, []);

  // ---------------------------------------------------------
  // Fetch OT Records
  // ---------------------------------------------------------
  useEffect(() => {
    const fetchOtRecords = async () => {
      try {
        const res = await AttenOtService.getAll();
        setOtRecords(res.data?.data || []);
      } catch {
        message.error("Failed to load OT records");
      }
    };
    fetchOtRecords();
  }, []);

  // ---------------------------------------------------------
  // OPEN MODAL (ADD / EDIT)
  // ---------------------------------------------------------
  const showModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);

    // EDIT MODE
    if (record) {
      const emp = employees.find((e) => e.emp_id === record.emp_id);

      form.setFieldsValue({
        employeeId: record.emp_id,
        employeeName: emp ? emp.name : record.emp_name || "",
        date: dayjs(record.date),
        startTime: dayjs(record.start_time, "HH:mm"),
        endTime: dayjs(record.end_time, "HH:mm"),
        status: record.status,
      });
    }

    // ADD MODE
    else {
      form.resetFields();
      form.setFieldsValue({ status: "Pending" });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  // ---------------------------------------------------------
  // CALCULATE OT HOURS
  // ---------------------------------------------------------
  const calculateOtHours = (start, end) => {
    let diff = end.diff(start, "minute");
    if (diff < 0) diff += 24 * 60;
    return (diff / 60).toFixed(2);
  };

  // ---------------------------------------------------------
  // SUBMIT (ADD / UPDATE)
  // ---------------------------------------------------------
  const handleSubmit = async (values) => {
    try {
      const start = values.startTime;
      const end = values.endTime;

      const otHours = calculateOtHours(start, end);

      const payloadBase = {
        date: values.date.format("YYYY-MM-DD"),
        start_time: start.format("HH:mm"),
        end_time: end.format("HH:mm"),
        ot_hours: otHours,
        status: values.status || "Pending",
      };

      // ADD MODE (MULTIPLE EMPLOYEES)
      if (!editingRecord && Array.isArray(values.employeeId)) {
        for (const empId of values.employeeId) {
          const emp = employees.find((e) => e.emp_id === empId);

          await AttenOtService.create({
            emp_id: empId,
            emp_name: emp?.name,
            ...payloadBase,
          });
        }
        message.success("OT records added successfully");
      }

      // EDIT MODE (SINGLE EMPLOYEE)
      else {
        const emp = employees.find((e) => e.emp_id === values.employeeId);

        const updatePayload = {
          emp_id: values.employeeId,
          emp_name: emp?.name,
          ...payloadBase,
        };

        await AttenOtService.update(editingRecord.id, updatePayload);
        message.success("OT record updated successfully");
      }

      // Refresh List
      const res = await AttenOtService.getAll();
      setOtRecords(res.data?.data || []);

      handleCancel();
    } catch (error) {
      console.log(error);
      message.error("Failed to save OT record");
    }
  };

  // ---------------------------------------------------------
  // DELETE RECORD
  // ---------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      await AttenOtService.delete(id);
      setOtRecords((prev) => prev.filter((e) => e.id !== id));
      message.success("OT record deleted");
    } catch {
      message.error("Delete failed");
    }
  };

  // ---------------------------------------------------------
  // TABLE COLUMNS
  // ---------------------------------------------------------
  const columns = [
    {
      title: "Employee ID",
      dataIndex: "emp_id",
      render: (id) => <span className="font-semibold text-blue-600">{id}</span>,
    },
    { title: "Name", dataIndex: "emp_name" },
    {
      title: "Date",
      dataIndex: "date",
      render: (d) => dayjs(d).format("DD-MM-YYYY"),
    },
    { title: "Start Time", dataIndex: "start_time" },
    { title: "End Time", dataIndex: "end_time" },
    {
      title: "OT Hours",
      dataIndex: "ot_hours",
      render: (hrs) => <b>{hrs} Hrs</b>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "Approved" ? "green" : s === "Rejected" ? "red" : "gold"}>
          {s}
        </Tag>
      ),
    },
    {
  title: "Actions",
  render: (_, record) => (
    <Space>
      <Button
        icon={<EditOutlined />}
        onClick={() => showModal(record)}   // ✅ FIXED
      />

      <Popconfirm
        title="Delete?"
        onConfirm={() => handleDelete(record.id)}   // ✅ FIXED
        okText="Yes"
        cancelText="No"
      >
        <Button danger icon={<DeleteOutlined />} />
      </Popconfirm>
    </Space>
  )
}

  ];

  return (
    <div className="p-8 bg-white rounded-xl shadow-xl">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold">Overtime Management</h1>

        <button
          onClick={() => showModal()}
          className="px-6 py-2 bg-purple-600 text-white rounded shadow hover:scale-105 transition"
        >
          Add OT
        </button>
      </div>

      <Table
        columns={columns}
        dataSource={otRecords}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      {/* MODAL */}
      <Modal
        title={editingRecord ? "Edit OT Record" : "Add OT Record"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ status: "Pending" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* EMPLOYEE ID DROPDOWN */}
            <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
              <Select
                mode={editingRecord ? undefined : "multiple"}
                placeholder="Select Employee"
                showSearch
                optionFilterProp="children"
                onChange={(value) => {
                  const empId = Array.isArray(value) ? value[0] : value;
                  const emp = employees.find((x) => x.emp_id === empId);
                  form.setFieldsValue({ employeeName: emp?.name || "" });
                }}
              >
                {employees.map((emp) => (
                  <Option key={emp.emp_id} value={emp.emp_id}>
                    {emp.emp_id}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            {/* EMPLOYEE NAME AUTO-FILLED */}
            <Form.Item name="employeeName" label="Employee Name">
              <Input disabled />
            </Form.Item>

            <Form.Item name="date" label="Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>

            <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>

            <Form.Item name="endTime" label="End Time" rules={[{ required: true }]}>
              <TimePicker className="w-full" format="HH:mm" />
            </Form.Item>

            <Form.Item name="status" label="Status">
              <Select>
                <Option value="Pending">Pending</Option>
                <Option value="Approved">Approved</Option>
                <Option value="Rejected">Rejected</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
