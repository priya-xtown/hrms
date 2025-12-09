import React, { useState, useMemo } from "react";
import {
  Form,
  DatePicker,
  Modal,
  Input,
  Button,
  Table,
  Tag,
  Space,
  Select,
  Popconfirm,
  message ,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

export default function CompanyAssets() {
  const [companyAssets, setCompanyAssets] = useState([]);
  const [companyForm, setCompanyForm] = useState({
    assetType: "",
    customAssetType: "",
    purchasedDate: "",
    serialNumber: "",
    model: "",
    condition: "",
    status: "",
    notes: "",
    value: "",
  });
  const [form] = Form.useForm();
  const [errors, setErrors] = useState({});
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const assetTypes = ["Laptop", "Desktop", "Monitor", "Other"];
  const modelBrands = ["Dell", "HP", "Lenovo", "Asus"];
  const conditions = ["New", "Used", "Damaged"];
  const statuses = ["Active", "Inactive"];
  const itemsPerPage = 5;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const formatDisplayDate = (date) => {
    if (!date) return "";
    return dayjs(date, "DD/MM/YYYY").isValid()
      ? dayjs(date, "DD/MM/YYYY").format("DD/MM/YYYY")
      : "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleDateChange = (date, dateString) => {
    setCompanyForm((prev) => ({ ...prev, purchasedDate: dateString }));
    setErrors((prev) => ({ ...prev, purchasedDate: "" }));
  };

  const resetForm = () => {
    setCompanyForm({
      assetType: "",
      customAssetType: "",
      purchasedDate: "",
      serialNumber: "",
      model: "",
      condition: "",
      status: "",
      notes: "",
      value: "",
    });
    setErrors({});
    setEditIndex(null);
  };

  // create
const handleAdd = async (values) => {
setLoading(true);
try {
// Determine final asset type
const finalAssetType =
values.asset_type === "Other" ? values.customAssetType : values.asset_type;

// Construct payload for API
const payload = {
  assetType: finalAssetType,
  assetName: values.assetName || "",
  value: parseFloat(values.value) || 0,
  purchaseDate: values.purchased_date.format("DD/MM/YYYY"),
  serialNumber: values.serial_number,
  model: values.model_type,
  status: values.status || "Active",
  notes: values.notes || "",
  condition: values.condition,
};

console.log("📤 Create Asset Payload:", payload);

// Call your API via assetService
const res = await assetService.createAsset(payload);

if ((res?.status >= 200 && res?.status < 300) || res?.data?.success) {
  message.success(res?.data?.message || "Asset added successfully!");
  setIsModalOpen(false);
  form.resetFields(); // reset your form fields

  // Add new asset to local state
  setCompanyAssets((prev) => [
    ...prev,
    { ...payload, assetId: res.data?.assetId || Date.now() },
  ]);

  // Optional: refetch assets from server to stay synced
  await fetchAssets();
} else {
  message.error(res?.data?.message || "Failed to add asset");
}


} catch (err) {
console.error("❌ Error adding asset:", err);
message.error(err.response?.data?.message || "Error adding asset");
} finally {
setLoading(false);
}
};



  const handleEdit = (index) => {
    setCompanyForm(companyAssets[index]);
    setEditIndex(index);
    setIsModalOpen(true);
  };

  const handleDelete = (index) => {
    setCompanyAssets((prev) => prev.filter((_, i) => i !== index));
  };

  const filteredData = useMemo(() => {
    return companyAssets.filter((a) =>
      (a.serialNumber || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [companyAssets, searchQuery]);

  const currentData = filteredData.slice(0, itemsPerPage);

  const totalCompanyValue = companyAssets.reduce(
    (acc, a) => acc + (a.value || 0),
    0
  );

  const openModalForAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <h2 className="font-semibold text-xl m-0">Company Assets</h2>
        <div className="flex gap-2 flex-wrap">
          <Input.Search
            placeholder="Search by Serial..."
            allowClear
            value={searchQuery}
            onChange={handleSearchChange}
            style={{ width: 260 }}
          />
          <Button type="primary" onClick={openModalForAdd}>
            Add Asset
          </Button>
        </div>
      </div>

      {/* Table */}
      <Table
  columns={[
    { title: "Asset Type", dataIndex: "assetType" },
    { title: "Serial", dataIndex: "serialNumber" },
    { title: "Model", dataIndex: "model" },
    { title: "Condition", dataIndex: "condition" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "Active" ? "green" : "red"}>
          {status || "Active"}
        </Tag>
      ),
    },
    {
      title: "Purchased",
      dataIndex: "purchasedDate",
      render: (date) => formatDisplayDate(date),
    },
    {
      title: "Value",
      dataIndex: "value",
      render: (value) => `₹${value}`,
    },
    { title: "Notes", dataIndex: "notes" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.assetId)}
          />
          <Popconfirm
            title="Delete this asset?"
            onConfirm={() => handleDelete(record.assetId)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]}
  dataSource={currentData}
  rowKey="assetId" // <-- Use a unique field instead of index
  pagination={false}
  bordered
/>

      {/* Total Value */}
      <div className="mt-3 font-bold text-gray-700">
        Total Asset Value: ₹{totalCompanyValue.toLocaleString()}
      </div>

      {/* Modal */}
      <Modal
        title={editIndex !== null ? "Edit Asset" : "Add Asset"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}

      >

        <Form
          form={form}        // ✅ Connect form instance here
          layout="vertical"
          onFinish={(values) => {
            handleAdd(values);
            form.resetFields();
          }}
          initialValues={{
            assetType: "",
            model: "",
            condition: "",
            status: "active",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Asset Type */}
            <Form.Item
              name="asset_type"
              label="Asset Type"
              rules={[{ required: true, message: "Please select asset type" }]}
            >
              <Select placeholder="Select Asset Type">
                <Select.Option value="Laptop">Laptop</Select.Option>
                <Select.Option value="Desktop">Desktop</Select.Option>
                <Select.Option value="Printer">Printer</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>

            {/* Custom Asset Type */}
            <Form.Item
              shouldUpdate={(prev, curr) => prev.assetType !== curr.assetType}
              noStyle
            >
              {({ getFieldValue }) =>
                getFieldValue("assetType") === "Other" ? (
                  <Form.Item
                    name="customAssetType"
                    label="Custom Asset Type"
                    rules={[{ required: true, message: "Please enter custom asset type" }]}
                  >
                    <Input placeholder="Enter Custom Asset Type" />
                  </Form.Item>
                ) : null
              }
            </Form.Item>

            {/* Purchased Date */}
            <Form.Item
              name="purchased_date"
              label="Purchased Date"
              rules={[{ required: true, message: "Please select purchased date" }]}
            >
              <DatePicker format="DD/MM/YYYY" className="w-full" />
            </Form.Item>

            {/* Serial Number */}
            <Form.Item
              name="serial_number"
              label="Serial Number"
              rules={[{ required: true, message: "Please enter serial number" }]}
            >
              <Input placeholder="Enter Serial Number" />
            </Form.Item>

            {/* Model */}
            <Form.Item
              name="model_type"
              label="Model"
              rules={[{ required: true, message: "Please select model" }]}
            >
              <Select placeholder="Select Model">
                <Select.Option value="HP">HP</Select.Option>
                <Select.Option value="Dell">Dell</Select.Option>
                <Select.Option value="Lenovo">Lenovo</Select.Option>
              </Select>
            </Form.Item>

            {/* Condition */}
            <Form.Item
              name="condition"
              label="Condition"
              rules={[{ required: true, message: "Please select condition" }]}
            >
              <Select placeholder="Select Condition">
                <Select.Option value="New">New</Select.Option>
                <Select.Option value="Used">Used</Select.Option>
                <Select.Option value="Damaged">Damaged</Select.Option>
              </Select>
            </Form.Item>

            {/* Status */}
            <Form.Item
              name="status"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Select.Option value="active">Active</Select.Option>
                <Select.Option value="inactive">Inactive</Select.Option>
              </Select>
            </Form.Item>

            {/* Value */}
            <Form.Item
              name="value"
              label="Value"
              rules={[{ required: true, message: "Please enter asset value" }]}
            >
              <Input type="number" placeholder="Enter Asset Value" />
            </Form.Item>

            {/* Notes */}
            <Form.Item name="notes" label="Notes" className="col-span-4">
              <Input.TextArea rows={3} placeholder="Enter Notes" />
            </Form.Item>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
            <Button
              danger
              onClick={() => {
                form.resetFields();
                setIsModalOpen(false);
              }}
            >
              Cancel
            </Button>


            <Button type="primary" htmlType="submit">
              {editIndex !== null ? "Update Asset" : "Add Asset"}
            </Button>
          </div>
        </Form>
      </Modal>

    </>
  );
}
