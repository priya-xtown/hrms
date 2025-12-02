
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Tag,
  Space,
  Input,
  Dropdown,
  Menu,
  Modal,
  Form,
  message,
  Popconfirm,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
} from "@ant-design/icons";
import RoleApi from "../Designation/Designation";
import DepartmentApi from "../Department/Department";

const { Search } = Input;

export default function Designations() {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDesignation, setCurrentDesignation] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const [deptMap, setDeptMap] = useState({});

  // Fetch Departments and create map
  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true);
      const res = await DepartmentApi.getAll();
      const deptList =
        res?.data?.rows ||
        res?.data?.departments ||
        res?.data?.data ||
        res?.data ||
        [];

      const formatted = Array.isArray(deptList)
        ? deptList.map((d) => ({
            id: d.id || d._id || d.department_id,
            department_name: d.department_name || d.name || "—",
          }))
        : [];

      setDepartments(formatted);

      // Map for table lookup
      const map = {};
      formatted.forEach((d) => (map[d.id] = d.department_name));
      setDeptMap(map);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
      message.error("Failed to fetch departments");
    } finally {
      setLoadingDepartments(false);
    }
  };

  // Fetch Designations
  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const res = await RoleApi.getAll();
      const rawData =
        res?.data?.rows ||
        res?.data?.roles ||
        res?.data?.data ||
        res?.data ||
        [];

      const formatted = Array.isArray(rawData)
        ? rawData.map((item) => ({
            id: item.id || item.role_id || item._id,
            designation_name: item.role_name || "",
            department:
              item.department_name || deptMap[item.department_id] || "—",
            department_id: item.department_id,
            status: item.is_active ? "Active" : "Inactive",
          }))
        : [];

      setDesignations(formatted);
    } catch (err) {
      console.error("❌ Error fetching designations:", err);
      message.error(err.response?.data?.message || "Failed to fetch designations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (Object.keys(deptMap).length > 0) {
      fetchDesignations();
    }
  }, [deptMap]);

  const fetchDesignationById = async (id) => {
    try {
      if (!id) return message.warning("Invalid designation ID");

      const res = await RoleApi.getById(id);
      const designation =
        res?.data?.data ||
        res?.data?.role ||
        res?.data?.rows?.[0] ||
        res?.data;

      if (!designation) {
        message.warning("Designation not found");
        return null;
      }

      return designation;
    } catch (err) {
      console.error("❌ Error fetching designation:", err);
      message.error(err.response?.data?.message || "Failed to fetch designation");
      return null;
    }
  };

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      const payload = {
        role_name: values.designation_name,
        department_id: values.department,
      };
      const res = await RoleApi.create(payload);

      if ((res?.status >= 200 && res?.status < 300) || res?.data?.success) {
        message.success(res?.data?.message || "Designation added successfully!");
        setIsAddModalOpen(false);
        form.resetFields();
        fetchDesignations();
      } else {
        message.error(res?.data?.message || "Failed to add designation");
      }
    } catch (err) {
      console.error("❌ Error adding designation:", err);
      message.error(err.response?.data?.message || "Failed to add designation");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (values) => {
    try {
      setLoading(true);
      const id =
        currentDesignation?._id ||
        currentDesignation?.id ||
        currentDesignation?.role_id;

      if (!id) {
        message.error("Designation ID missing for update");
        return;
      }

      const payload = {
        role_name: values.role_name,
        department_id: values.department,
        is_active: values.status === "Active",
      };

      const res = await RoleApi.update(id, payload);

      if (res.status === 200 || res.data?.success) {
        message.success(res.data?.message || "Designation updated successfully!");
        setIsEditModalOpen(false);
        editForm.resetFields();
        fetchDesignations();
      } else {
        message.error(res.data?.message || "Failed to update designation");
      }
    } catch (err) {
      console.error("❌ Update Error:", err);
      message.error(err.response?.data?.message || "Error updating designation");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await RoleApi.delete(id);
      if (res?.status === 200 || res?.data?.success) {
        message.success(res?.data?.message || "Designation deleted successfully!");
        fetchDesignations();
      } else {
        message.error(res?.data?.message || "Failed to delete designation");
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
      message.error(err.response?.data?.message || "Failed to delete designation");
    } finally {
      setLoading(false);
    }
  };

  const filteredData =
    statusFilter === "All"
      ? designations
      : designations.filter((item) => item.status === statusFilter);

  const columns = [
    {
      title: "Designation Name",
      dataIndex: "designation_name",
      key: "designation_name",
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      render: (text) => text || "—",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={async () => {
              const designation = await fetchDesignationById(
                record.id || record._id || record.role_id
              );
             if (designation) {
  setCurrentDesignation(designation);
  setIsEditModalOpen(true); // first open the modal
  setTimeout(() => {
    editForm.setFieldsValue({
      role_name: designation.role_name,
      department: designation.department_id || designation.department,
      status: designation.status,
    });
  }, 0); // ensures form is mounted
}

            }}
          />
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(record.id)} // ✅ send backend UUID
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Employee / Designations</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Designation
        </Button>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">Designation List</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <Dropdown
            menu={{
              items: [
                { label: "Last 7 Days", key: "7" },
                { label: "Last 30 Days", key: "30" },
                { label: "All Time", key: "all" },
              ],
            }}
            trigger={["click"]}
          >
            <Button>
              Sort By: Last 7 Days <DownOutlined />
            </Button>
          </Dropdown>
          <Search placeholder="Search" style={{ width: 200 }} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ pageSize: 10 }}
          rowKey={(record) => record.id || record._id || record.role_id}
          loading={loading}
        />
      </div>

      {/* Add Modal */}
      <Modal
        title="Add Designation"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAdd} initialValues={{ status: "Active" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
            <Form.Item
              name="designation_name"
              label="Designation Name"
              rules={[{ required: true, message: "Please enter Designation name" }]}
            >
              <Input style={{ width: 220 }} placeholder="Enter designation name" />
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please select Department" }]}
            >
              <Select
                style={{ width: 220 }}
                placeholder="Select department"
                loading={loadingDepartments}
              >
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
<Form.Item
  name="status"
  label="Status"
  rules={[{ required: true, message: "Please select status" }]}
>
  <Select
    style={{ width: 220 }}
    options={[
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ]}
  />
</Form.Item>

          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-orange-500">
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Designation"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={editForm} onFinish={handleEdit} initialValues={{ status: "Active" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-1">
            <Form.Item
              name="role_name"
              label="Designation Name"
              rules={[{ required: true, message: "Please enter Designation name" }]}
            >
              <Input style={{ width: 220 }} placeholder="Enter designation name" />
            </Form.Item>

            <Form.Item
              name="department"
              label="Department"
              rules={[{ required: true, message: "Please select Department" }]}
            >
              <Select
                style={{ width: 220 }}
                placeholder="Select department"
                loading={loadingDepartments}
              >
                {departments.map((dept) => (
                  <Select.Option key={dept.id} value={dept.id}>
                    {dept.department_name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
              initialValue="Active"
            >
              <Select
                style={{ width: 220 }}
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" className="bg-orange-500">
              Update
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
