
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
import DepartmentApi from "../Department/Department";

const { Search } = Input;

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentDept, setCurrentDept] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  const fetchDepartments = async (page = 1) => {
    try {
      setLoading(true);
      const res = await DepartmentApi.getAll(page, pageSize);
      console.log("✅ Department list response:", res.data);

      let rows = [];
      let count = 0;

      if (res?.data) {
        if (Array.isArray(res.data.rows)) {
          rows = res.data.rows;
          count = typeof res.data.count === "number" ? res.data.count : res.data.rows.length;
        } else if (Array.isArray(res.data)) {
          rows = res.data;
          count = res.data.length;
        } else if (Array.isArray(res.data?.departments)) {
          rows = res.data.departments;
          count = res.data.departments.length;
        } else if (Array.isArray(res.data?.data)) {
          rows = res.data.data;
          count = res.data.data.length;
        }
      }

      setDepartments(rows);
      setTotal(count);
      setCurrentPage(page);
    } catch (err) {
      console.error("❌ Error fetching departments:", err);
      message.error(err.response?.data?.message || "Failed to fetch departments");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-fetch on component mount and when page changes
  useEffect(() => {
    fetchDepartments(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // ✅ Get Department by ID
  const fetchDepartmentById = async (id) => {
    try {
      if (!id) {
        message.warning("Invalid department ID");
        return null;
      }

      console.log("📡 Fetching department by ID:", id);
      const res = await DepartmentApi.getById(id);
      console.log("✅ Department getById response:", res?.data);

      let department =
        res?.data?.data ||
        res?.data?.department ||
        res?.data?.rows?.[0] ||
        res?.data;

      if (!department) {
        message.warning("Department not found");
        return null;
      }

      const normalized = {
        ...department,
        id: department.id || department.department_id || department._id,
        department_name: department.department_name || department.name || "",
        phone: department.phone || "",
        email: department.email || "",
        status: department.status || "",
      };

      console.log("🏢 Normalized department:", normalized);
      return normalized;
    } catch (err) {
      console.error("❌ Error fetching department:", err);
      message.error(err?.response?.data?.message || "Failed to fetch department");
      return null;
    }
  };

  // ✅ Create Department
const handleAdd = async (values) => {
  setLoading(true);
  try {
    const payload = {
      department_name: values.name, // 👈 fixed field name
      status: values.status,
    };

    console.log("📤 Create Department Payload:", payload);

    const res = await DepartmentApi.create(payload); // 👈 normal JSON body

    if ((res?.status >= 200 && res?.status < 300) || res?.data?.success) {
      message.success(res?.data?.message || "Department added successfully!");
      setIsAddModalOpen(false);
      form.resetFields();
      
      // Update pagination: compute new total & page where it should appear
      const newTotal = (typeof total === "number" ? total : departments.length) + 1;
      const newPage = Math.max(1, Math.ceil(newTotal / pageSize));
      setTotal(newTotal);
      await fetchDepartments(newPage);
    } else {
      message.error(res?.data?.message || "Failed to add department");
    }
  } catch (err) {
    console.error("❌ Error adding department:", err);
    message.error(err.response?.data?.message || "Error adding department");
  } finally {
    setLoading(false);
  }
};
// update
const handleEdit = async (values) => {
  try {
    setLoading(true);

    const id =
      currentDept?._id || currentDept?.id || currentDept?.department_id;

    if (!id) {
      message.error("Department ID missing for update");
      return;
    }

    const payload = {
      department_name: values.name, // 👈 match form field
      status: values.status,        // 👈 include status for update
    };

    console.log("🟢 Sending department update:", id, payload);

    const res = await DepartmentApi.update(id, payload);

    if (res.status === 200 || res.data?.success) {
      message.success(res.data?.message || "Department updated successfully!");
      setIsEditModalOpen(false);
      editForm.resetFields();
      fetchDepartments(currentPage);
    } else {
      message.error(res.data?.message || "Failed to update department");
    }
  } catch (err) {
    console.error("❌ Update Error:", err);
    message.error(err.response?.data?.message || "Error updating department");
  } finally {
    setLoading(false);
  }
};


  // ✅ Delete Department
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      console.log("🗑️ Deleting department ID:", id);

      const res = await DepartmentApi.delete(id);

      if (res?.status === 200 || res?.data?.success) {
        message.success(res?.data?.message || "Department deleted successfully!");
        const newTotal = Math.max(0, total - 1);
        const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
        const pageToFetch = currentPage > maxPage ? maxPage : currentPage;
        setTotal(newTotal);
        await fetchDepartments(pageToFetch);
      } else {
        message.error(res?.data?.message || "Failed to delete department");
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
      if (err.response) {
        message.error(err.response.data?.message || "Server error while deleting department");
      } else if (err.request) {
        message.error("No response from server. Check backend connection.");
      } else {
        message.error("Error setting up delete request.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredData =
    statusFilter === "All"
      ? departments
      : departments.filter((item) => item.status === statusFilter);

  // ✅ FIXED column field names
  const columns = [
    {
      title: "Department Name",
      dataIndex: "department_name", // ✅ fixed
    },
  
    {
        title: "Status",
        dataIndex: "status",
        key: "status",
        render: (status) => (
          <Tag color={status === "Active" ? "red" : "green"}>
            {status || "Active"}
          </Tag>
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
              const dept = await fetchDepartmentById(
                record.id || record._id || record.department_id
              );
              if (dept) {
                setCurrentDept(dept);
                editForm.setFieldsValue({
  name: dept.department_name, // 👈 match the form field name
  status: dept.status || "Active",
});

                setIsEditModalOpen(true);
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

  const menu = (
    <Menu
      items={[
        { label: "Last 7 Days", key: "7" },
        { label: "Last 30 Days", key: "30" },
        { label: "All Time", key: "all" },
      ]}
    />
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Employee / Departments</p>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="bg-orange-500 hover:bg-orange-600"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Department
        </Button>
      </div>

      <div className="flex flex-wrap justify-between items-center bg-whit mb-4">
        <h2 className="font-semibold text-xl">Department List</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <Dropdown overlay={menu} trigger={["click"]}>
            <Button>
              Sort By: Last 7 Days <DownOutlined />
            </Button>
          </Dropdown>
          <Search placeholder="Search" style={{ width: 200 }} />
        </div>
      </div>

      <div className="bg-white p-1 rounded-lg shadow">
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
            showSizeChanger: false,
          }}
          rowKey={(record) => record.id || record._id || record.department_id}
          loading={loading}
        />

        <div className="flex justify-center items-center mt-4 gap-3">
          <Button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <span>
            Page {currentPage} of {Math.max(1, Math.ceil(total / pageSize))}
          </span>

          <Button
            onClick={() => setCurrentPage((prev) => (prev < Math.ceil(total / pageSize) ? prev + 1 : prev))}
            disabled={currentPage >= Math.ceil(total / pageSize)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Add Modal */}
      <Modal
        title="Add Department"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAdd} initialValues={{
    status: "Active", // 👈 Default value for status
  }}>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
             <Form.Item
            name="name"
            label="Department Name"
            rules={[{ required: true, message: "Please select department name" }]}
          >
           <Input style={{ width: 220 }} placeholder="Enter department name" />
          </Form.Item>

          <Form.Item
  name="status"
  label="Status"
  rules={[{ required: true, message: "Please select status" }]}
  initialValue="Active" // 👈 Default selected value
>
  <Select style={{ width: 220 }}
    placeholder="Select status"
    options={[
      { value: "Active", label: "Active" },
      { value: "Inactive", label: "Inactive" },
    ]}
  />
</Form.Item>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit"  loading={loading}>
              Save
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit Department"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
       <Form
  layout="vertical"
  form={editForm}
  onFinish={handleEdit}
  initialValues={{
    status: "Active", // ✅ Default selected value
  }}
>
  <div className="grid grid-cols-1 md:grid-cols-1 gap-x-1 gap-y-1">
    <Form.Item
      name="name"
      label="Department Name"
      rules={[{ required: true, message: "Please enter department name" }]}
    >
      <Input style={{ width: 220 }} placeholder="Enter department name" />
    </Form.Item>

    <Form.Item
      name="status"
      label="Status"
      rules={[{ required: true, message: "Please select status" }]}
    >
      <Select
        style={{ width: 220 }}
        placeholder="Select status"
        options={[
          { value: "Active", label: "Active" },
          { value: "Inactive", label: "Inactive" },
        ]}
      />
    </Form.Item>
  </div>

  <Form.Item>
    <div className="flex justify-end gap-2 mt-4">
      <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
      <Button type="primary" htmlType="submit" className="bg-orange-500">
        Update
      </Button>
    </div>
  </Form.Item>
</Form>

      </Modal>
    </div>
  );
}
