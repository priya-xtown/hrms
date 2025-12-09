import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Spin,
  Space,
  Button,
} from "antd";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import { PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

export default function AnnualPayroll() {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [payrollRecords, setPayrollRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [incrementType, setIncrementType] = useState("%");

  const [departments] = useState([
    "Finance",
    "Application Development",
    "IT Department",
    "Web Development",
    "Sales",
    "UI / UX",
    "Account Management",
    "Marketing",
  ]);

  const esiPfOptions = ["Yes", "No"];

  // ✅ Mock Employee Directory
  const employeeDirectory = [
    { id: "EMP001", name: "Ravi Kumar" },
    { id: "EMP002", name: "Divya Sharma" },
    { id: "EMP003", name: "Arjun Patel" },
    { id: "EMP004", name: "Neha Reddy" },
    { id: "EMP005", name: "Vikram Singh" },
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setPayrollRecords([]);
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    let records = payrollRecords;
    if (search.trim() !== "") {
      records = records.filter(
        (r) =>
          r.employeeName?.toLowerCase().includes(search.toLowerCase()) ||
          r.employeeId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (departmentFilter !== "All") {
      records = records.filter((r) => r.department === departmentFilter);
    }
    setFilteredRecords(records);
  }, [search, departmentFilter, payrollRecords]);

  const showModal = (record = null) => {
    setEditingRecord(record);
    setIsModalOpen(true);
    if (record) {
      form.setFieldsValue(record);
    } else {
      form.resetFields();
      form.setFieldsValue({ increment: 0, esiPf: "Yes" });
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleSubmit = (values) => {
    try {
      if (editingRecord) {
        const updatedData = payrollRecords.map((item) =>
          item.id === editingRecord.id ? { ...editingRecord, ...values } : item
        );
        setPayrollRecords(updatedData);
        message.success("Payroll record updated successfully");
      } else {
        const newRecord = { ...values, id: Date.now() };
        setPayrollRecords([...payrollRecords, newRecord]);
        message.success("Payroll record added successfully");
      }
      handleCancel();
    } catch (error) {
      message.error("Failed to save payroll record");
      console.error(error);
    }
  };

  // ✅ Smooth Fade-Out Delete Animation
  const handleDelete = (id) => {
    const row = document.getElementById(`row-${id}`);
    if (row) {
      row.classList.add("opacity-0", "transition-opacity", "duration-300");
      setTimeout(() => {
        setPayrollRecords((prev) => prev.filter((r) => r.id !== id));
        message.success("Record deleted successfully");
      }, 300);
    } else {
      setPayrollRecords((prev) => prev.filter((r) => r.id !== id));
      message.success("Record deleted successfully");
    }
  };

  // ✅ Auto-fill logic
  const handleEmployeeIdChange = (value) => {
    const emp = employeeDirectory.find(
      (e) => e.id.toLowerCase() === value.toLowerCase()
    );
    if (emp) {
      form.setFieldsValue({ employeeName: emp.name });
    }
  };

  // ✅ Increment logic
  const handleIncrementChange = (value) => {
    const salary = form.getFieldValue("annualSalary") || 0;
    if (incrementType === "%" && !isNaN(value)) {
      const amount = (salary * value) / 100;
      form.setFieldsValue({ incrementAmount: amount });
    } else if (incrementType === "₹" && !isNaN(value)) {
      const percent = salary > 0 ? (value / salary) * 100 : 0;
      form.setFieldsValue({ incrementPercent: percent });
    }
  };

  return (
    <div className="p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="font-semibold text-xl mb-6">Annual Payroll Management</h1>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-wrap justify-end items-center mb-6 gap-3">
        <Space size="middle" className="flex flex-wrap justify-end items-center gap-3">
          <Search
            placeholder="Search by Employee ID or Name"
            allowClear
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            style={{ width: 250 }}
          />
          <Select
            placeholder="Filter by Department"
            value={departmentFilter}
            onChange={(value) => setDepartmentFilter(value)}
            style={{ width: 180 }}
          >
            <Option value="All">All Departments</Option>
            {departments.map((dept) => (
              <Option key={dept} value={dept}>
                {dept}
              </Option>
            ))}
          </Select>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{
              backgroundColor: "#9333ea",
              borderColor: "#9333ea",
              fontWeight: 600,
              borderRadius: 8,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease-in-out",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Add Payroll
          </Button>
        </Space>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="text-center py-6">
            <Spin size="large" />
          </div>
        ) : (
          <table className="w-full min-w-[1000px] border-collapse border border-gray-100 text-base">
            <thead>
              <tr className="bg-gray-50 text-gray-600">
                <th className="border border-gray-100 p-3 text-left">Employee ID</th>
                <th className="border border-gray-100 p-3 text-left">Employee Name</th>
                <th className="border border-gray-100 p-3 text-left">Department</th>
                <th className="border border-gray-100 p-3 text-left">Designation</th>
                <th className="border border-gray-100 p-3 text-left">Branch</th>
                <th className="border border-gray-100 p-3 text-center">Annual Salary (₹)</th>
                <th className="border border-gray-100 p-3 text-center">Increment</th>
                <th className="border border-gray-100 p-3 text-center">ESI / PF</th>
                <th className="border border-gray-100 p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((r) => (
                  <tr
                    key={r.id}
                    id={`row-${r.id}`}
                    className="hover:bg-gray-50 text-gray-700 transition duration-150"
                  >
                    <td className="border border-gray-200 p-3 font-semibold text-[#408CFF]">{r.employeeId}</td>
                    <td className="border border-gray-200 p-3">{r.employeeName}</td>
                    <td className="border border-gray-200 p-3">{r.department}</td>
                    <td className="border border-gray-200 p-3">{r.designation}</td>
                    <td className="border border-gray-200 p-3">{r.branch}</td>
                    <td className="border border-gray-200 p-3 text-center font-semibold">
                      ₹{r.annualSalary.toLocaleString()}
                    </td>
                    <td className="border border-gray-200 p-3 text-center">
                      {r.incrementType === "%" ? `${r.increment}%` : `₹${r.increment}`}
                    </td>
                    <td className="border border-gray-200 p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          r.esiPf === "Yes"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {r.esiPf}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-3 text-center space-x-2">
                      <button
                        className="px-3 py-1 bg-gray-100 rounded shadow hover:bg-gray-200 transition"
                        onClick={() => showModal(r)}
                      >
                        <FaPencilAlt />
                      </button>
                      <Popconfirm
                        title="Are you sure to delete this record?"
                        onConfirm={() => handleDelete(r.id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="px-3 py-1 bg-red-500 text-white rounded shadow hover:bg-red-600 transition">
                          <FaTrash />
                        </button>
                      </Popconfirm>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center text-gray-400 italic p-6">
                    No Payroll records available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ✏️ Add/Edit Modal */}
      <Modal
        title={editingRecord ? "Edit Payroll Record" : "Add Payroll Record"}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ increment: 0, esiPf: "Yes" }}
        >
          <Form.Item
            label="Employee ID"
            name="employeeId"
            rules={[{ required: true, message: "Please enter Employee ID" }]}
          >
            <Input
              placeholder="Enter or Search Employee ID"
              onChange={(e) => handleEmployeeIdChange(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            label="Employee Name"
            name="employeeName"
            rules={[{ required: true, message: "Please enter Employee Name" }]}
          >
            <Input placeholder="Auto-filled or type manually" />
          </Form.Item>

          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please select Department" }]}
          >
            <Select placeholder="Select Department" showSearch>
              {departments.map((dept) => (
                <Option key={dept} value={dept}>
                  {dept}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Designation"
            name="designation"
            rules={[{ required: true, message: "Please enter Designation" }]}
          >
            <Input placeholder="Enter Designation" />
          </Form.Item>

          <Form.Item
            label="Branch"
            name="branch"
            rules={[{ required: true, message: "Please enter Branch" }]}
          >
            <Input placeholder="Enter Branch" />
          </Form.Item>

          <Form.Item
            label="Annual Salary (₹)"
            name="annualSalary"
            rules={[{ required: true, message: "Please enter Annual Salary" }]}
          >
            <InputNumber
              min={0}
              className="w-full"
              placeholder="Enter Annual Salary"
              formatter={(value) =>
                `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>

          <Form.Item label="Increment">
            <Space.Compact className="w-full">
              <Form.Item
                name="increment"
                noStyle
                rules={[{ required: true, message: "Please enter Increment" }]}
              >
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder={
                    incrementType === "%"
                      ? "Enter Increment %"
                      : "Enter Increment Amount (₹)"
                  }
                  onChange={handleIncrementChange}
                />
              </Form.Item>
              <Select
                value={incrementType}
                onChange={setIncrementType}
                style={{ width: 100 }}
              >
                <Option value="%">%</Option>
                <Option value="₹">₹</Option>
              </Select>
            </Space.Compact>

            <div className="text-sm text-gray-500 mt-1">
              {incrementType === "%"
                ? `Equivalent Amount: ₹${(
                    ((form.getFieldValue("annualSalary") || 0) *
                      (form.getFieldValue("increment") || 0)) /
                    100
                  ).toFixed(2)}`
                : `Equivalent Percentage: ${(
                    ((form.getFieldValue("increment") || 0) /
                      (form.getFieldValue("annualSalary") || 1)) *
                    100
                  ).toFixed(2)}%`}
            </div>
          </Form.Item>

          <Form.Item
            label="ESI / PF"
            name="esiPf"
            rules={[{ required: true, message: "Please select ESI / PF" }]}
          >
            <Select placeholder="Select Yes or No">
              {esiPfOptions.map((option) => (
                <Option key={option} value={option}>
                  {option}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item className="text-right">
            <button
              type="submit"
              className="px-6 py-2 bg-purple-500 text-white font-semibold rounded-lg shadow hover:scale-105 transition transform"
            >
              {editingRecord ? "Update" : "Add"}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
