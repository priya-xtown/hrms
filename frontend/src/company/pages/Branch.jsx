import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Select,
  Tag,
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
  FilterOutlined,
} from "@ant-design/icons";
import BranchApi from "../pages/Branch"; // ✅ adjust path if needed

const { Option } = Select;

export default function Branch() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  // ✅ Fetch all branches
const fetchBranches = async () => {
  setLoading(true);
  try {
    const res = await BranchApi.getAll();

    // ✅ Safely extract data regardless of backend response shape
    const branches =
      res?.data?.data?.branches ||
      res?.data?.data ||
      res?.data?.branches ||
      res?.data?.rows || // some APIs return rows
      res?.data || // fallback if API returns array directly
      [];

    // ✅ Ensure branches is always an array
    const branchList = Array.isArray(branches) ? branches : [branches];

    // ✅ Add `key` for Ant Design Table
    setBranches(branchList.map((b) => ({ ...b, key: b.id || b.branch_id })));
  } catch (error) {
    console.error("❌ Error fetching branches:", error);
    message.error(
      error.response?.data?.message || "Failed to fetch branches"
    );
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchBranches();
}, []);

// ✅ Get by ID (for editing)
const handleGetById = async (id) => {
  if (!id) {
    message.warning("Invalid branch ID");
    return;
  }

  try {
    const res = await BranchApi.getById(id);

    // ✅ Normalize response structure safely
    const branch =
      res?.data?.data?.branch ||
      res?.data?.data ||
      res?.data?.branch ||
      res?.data?.rows?.[0] ||
      res?.data ||
      null;

    if (branch) {
      // ✅ Update local state + form
      setCurrentBranch(branch);
      editForm.setFieldsValue({
        name: branch.branch_name || branch.name || "",
        phone: branch.phone || "",
        email: branch.email || "",
        address: branch.address || "",
        country: branch.country || "",
        state: branch.state || "",
        city: branch.city || "",
        pinCode: branch.pinCode || branch.pincode || "",
      });

      setIsEditModalOpen(true);
    } else {
      message.warning("Branch not found");
    }
  } catch (error) {
    console.error("❌ Error fetching branch by ID:", error);
    message.error(error.response?.data?.message || "Failed to fetch branch details");
  }
};

// ✅ Add new branch
const handleAdd = async (values) => {
  setLoading(true);
  try {
    const res = await BranchApi.create({
      branch_name: values.branch_name, // ✅ Must match backend field
      phone: values.phone,
      email: values.email,
      address: values.address,
      country: values.country,
      state: values.state,
      city: values.city,
      pincode: values.pincode, // ✅ match backend lowercase key
      status: "Active",
    });

   if (res?.status >= 200 && res?.status < 300) {
      message.success("Branch added successfully");
      setIsAddModalOpen(false);
      form.resetFields();
      fetchBranches();
    }
  } catch (error) {
    console.error("❌ Add branch error:", error);
    message.error(
      error.response?.data?.message || "Failed to add branch"
    );
  } finally {
    setLoading(false);
  }
};


  // ✅ Edit branch
  const handleEdit = async (values) => {
    if (!currentBranch) return;
    setLoading(true);
    try {
      const res = await BranchApi.update(currentBranch.id, values);
       if ((res?.status >= 200 && res?.status < 300) || res?.data?.success) {
        message.success("Branch updated successfully");
        setIsEditModalOpen(false);
        editForm.resetFields();
        fetchBranches();
      }
    } catch (error) {
      message.error("Failed to update branch");
    } finally {
      setLoading(false);
    }
  };

 const handleDelete = async (id) => {
  if (!id) {
    message.warning("Invalid branch ID");
    return;
  }

  try {
    const res = await BranchApi.delete(id);
    if (res?.status >= 200 && res?.status < 300) {
      message.success(res?.data?.message || "Branch deleted successfully");
      fetchBranches();
    } else {
      message.error(res?.data?.error || "Failed to delete branch");
    }
  } catch (error) {
    console.error("❌ Delete branch error:", error);
    message.error(error.response?.data?.message || "Failed to delete branch");
  }
};
 

  // ✅ Table columns
  const columns = [
    {
      title: "S.No",
      key: "index",
      render: (_, __, i) => i + 1,
      width: 70,
    },
    {
      title: "Branch Name",
      dataIndex: "branch_name",
      key: "branch_name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
{
  title: "Actions",
  key: "actions",
  render: (_, record) => (
    <div style={{ display: "flex", gap: "12px" }}>
      <EditOutlined
        
        onClick={() => handleGetById(record.id)}
      />
      <Popconfirm
  title="Delete?"
  onConfirm={() => handleDelete(record.id)} // ✅ send backend UUID
  okText="Yes"
  cancelText="No"
>
  <Button danger icon={<DeleteOutlined />} />
</Popconfirm>
    </div>
  ),
},

  ];

  // ✅ Filtered data by status
  const filteredBranches =
    statusFilter === "All"
      ? branches
      : branches.filter((b) => b.status === statusFilter);

  // ✅ Pin code autofill (shared)
  const handlePinCodeChange = async (e, formInstance) => {
    const value = e.target.value.replace(/\D/g, "");
    formInstance.setFieldsValue({ pinCode: value });
    if (value.length === 6) {
      try {
        const response = await fetch(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = await response.json();
        if (data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          const postOffice = data[0].PostOffice[0];
          formInstance.setFieldsValue({
            city: postOffice.District || "",
            state: postOffice.State || "",
            country: postOffice.Country || "India",
          });
        } else {
          formInstance.setFieldsValue({ city: "", state: "", country: "" });
          message.error("Invalid Pin Code or data not found");
        }
      } catch {
        message.error("Failed to fetch City/State/Country");
      }
    } else {
      formInstance.setFieldsValue({ city: "", state: "", country: "" });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ✅ Header Section */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="font-semibold text-xl">Branch List</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <Input.Search
            placeholder="Search branch name"
            allowClear
            onSearch={(value) =>
              setBranches((prev) =>
                prev.filter((b) =>
                  b.name.toLowerCase().includes(value.toLowerCase())
                )
              )
            }
            style={{ width: 220 }}
          />
          <Button icon={<FilterOutlined />}>Filter</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Branch
          </Button>
        </div>
      </div>

      {/* ✅ Table */}
      <Table
        columns={columns}
        dataSource={filteredBranches}
        loading={loading}
        pagination={{ pageSize: 10 }}
        rowKey="id"
      />

      {/* ✅ Add Modal */}
      <Modal
        title="Add Branch"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={handleAdd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Form.Item
              label="Branch Name"
              name="branch_name"
              rules={[{ required: true, message: "Enter branch name" }]}
            >
              <Input style={{ width: 220 }} placeholder="Enter branch name" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input style={{ width: 220 }} placeholder="Enter phone" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input style={{ width: 220 }} placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input.TextArea style={{ width: 220 }} placeholder="Enter address" />
            </Form.Item>
            <Form.Item label="Country" name="country">
              <Input style={{ width: 220 }} placeholder="Enter country" />
            </Form.Item>
            <Form.Item label="State" name="state">
              <Input style={{ width: 220 }} placeholder="Enter state" />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input style={{ width: 220 }} placeholder="Enter city" />
            </Form.Item>
            <Form.Item
              name="pincode"
              label={<span className="text-gray-600">Pin Code</span>}
              rules={[{ required: true, message: "Please enter Pin Code" }]}
            >
              <Input
                maxLength={6}
                onChange={(e) => handlePinCodeChange(e, form)}
              />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form>
      </Modal>

      {/* ✅ Edit Modal */}
      <Modal
        title="Edit Branch"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        footer={null}
      >
        <Form layout="vertical" form={editForm} onFinish={handleEdit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Form.Item
              label="Branch Name"
              name="name"
              rules={[{ required: true, message: "Enter branch name" }]}
            >
              <Input style={{ width: 220 }} placeholder="Enter branch name" />
            </Form.Item>
            <Form.Item label="Phone" name="phone">
              <Input style={{ width: 220 }} placeholder="Enter phone" />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input style={{ width: 220 }} placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Address" name="address">
              <Input.TextArea style={{ width: 220 }} placeholder="Enter address" />
            </Form.Item>
            <Form.Item label="Country" name="country">
              <Input style={{ width: 220 }} placeholder="Enter country" />
            </Form.Item>
            <Form.Item label="State" name="state">
              <Input style={{ width: 220 }} placeholder="Enter state" />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input style={{ width: 220 }} placeholder="Enter city" />
            </Form.Item>
            <Form.Item
              name="pinCode"
              label={<span className="text-gray-600">Pin Code</span>}
              rules={[{ required: true, message: "Please enter Pin Code" }]}
            >
              <Input
                maxLength={6}
                onChange={(e) => handlePinCodeChange(e, editForm)}
              />
            </Form.Item>
          </div>
          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form>
      </Modal>
    </div>
  );

}