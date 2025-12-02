import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Dropdown,
  Form,
  Input,
  Select,
  Row,
  Col,
  Modal,
  Popover,
  Menu,
  message,
  Tag,
  Space,
  Switch,
  Card,
} from "antd";
import {
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
  EditOutlined,
  SettingOutlined,
  TableOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { roleService } from "../../services/Role";
import { useTheme } from "../../../context/ThemeContext";
const { Option } = Select;
const { TextArea } = Input;

const getUniqueValues = (data, key) =>
  [...new Set(data.map((item) => item[key]))].filter(Boolean);

const FiltersPopover = ({ onApply, dataSource, currentFilters }) => {
  const [filters, setFilters] = useState({
    status: currentFilters.status,
  });

  const statuses = getUniqueValues(dataSource, "status");

  const onChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderPopoverContent = (field, options) => (
    <div>
      <div style={{ marginBottom: 3, fontWeight: "bold", color: "#555" }}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </div>

      <Select
        value={filters[field]}
        onChange={(val) => onChange(field, val)}
        placeholder={`Select ${field.charAt(0).toUpperCase() + field.slice(1)}`}
        style={{ width: 180 }}
        allowClear
      >
        {options.map((opt) =>
          field === "status" ? (
            <Option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1).toLowerCase()}
            </Option>
          ) : (
            <Option key={opt.id} value={opt.id}>
              {opt.name.charAt(0).toUpperCase() + opt.name.slice(1)}
            </Option>
          )
        )}
      </Select>
    </div>
  );

  return (
    <div style={{ padding: 10, width: 200, height: "auto" }}>
      {["status"].map((field) => (
        <div key={field} style={{ marginBottom: 15 }}>
          <Popover
            content={renderPopoverContent("status", statuses)}
            trigger="hover"
            placement="right"
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                width: 100,
                color: filters.status ? "#1890ff" : "inherit",
              }}
            >
              Status
              {filters.status && (
                <span className="ml-2 text-xs text-gray-500">(1)</span>
              )}
            </div>
          </Popover>
        </div>
      ))}
      <div style={{ textAlign: "center", marginTop: 20 }} className="space-x-2">
        <Button
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
          disabled={Object.values(filters).every((val) => !val)}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={Object.values(filters).every((val) => !val)}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};

const RoleMaster = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({});
  const [form] = Form.useForm();
  const [roles, setRoles] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const { primaryColor, showCustomButton } = useTheme();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [viewMode, setViewMode] = useState(
    localStorage.getItem("roleViewMode") || "table"
  );

  useEffect(() => {
    localStorage.setItem("roleViewMode", viewMode);
  }, [viewMode]);

  const [visibleColumns, setVisibleColumns] = useState(() => {
    const saved = localStorage.getItem("RoleVisibleColumns");
    return saved
      ? JSON.parse(saved)
      : ["name", "description", "status", "actions"]; // ✅ fixed "status"
  });

  useEffect(() => {
    localStorage.setItem("RoleVisibleColumns", JSON.stringify(visibleColumns));
  }, [visibleColumns]);

  const defaultColumns = [
    "employee",
    "company_name",
    "branch_name",
    "department_name",
    "division_name",
    "phone",
    "address",
    "designation_name",
    "status",
    "actions",
  ];

  const fetchRole = async (
    paginationParams = pagination,
    search = searchText,
    appliedFilters = filters
  ) => {
    setLoading(true);
    try {
      const params = {
        page: paginationParams.current,
        pageSize: paginationParams.pageSize,
        search: search || undefined,
        status: appliedFilters.status,
      };
      console.log("Fetching with params:", params);
      const response = await roleService.getroleAll(params);
      console.log("Response from getroleAll:", response);
      if (response.status === 200 && response.data?.success) {
        const fetchedRoles = response.data.data || [];
        setRoles(fetchedRoles);
        setPagination({
          current: paginationParams.current,
          pageSize: paginationParams.pageSize,
          total: response.data.pagination?.total || 0,
        });
      } else {
        messageApi.error("Failed to fetch roles");
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
      messageApi.error("Error fetching roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, []);

  const handleTableChange = (newPagination) => {
    console.log("Table pagination change:", newPagination);
    setPagination(newPagination);
    fetchRole(newPagination, searchText, filters);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchText(val);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchRole({ ...pagination, current: 1 }, val, filters);
  };

  const handleFilterApply = (newFilters) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchRole({ ...pagination, current: 1 }, searchText, newFilters);
  };

  const openEditModal = (role) => {
    setIsEditing(true);
    setEditingRoleId(role.id);
    form.setFieldsValue({
      name: role.name,
      description: role.description,
      status: role.status,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (values) => {
    try {
      const data = {
        name: values.name,
        description: values.description,
        status: values.status,
      };
      console.log("Form data to submit:", data);
      if (isEditing && editingRoleId) {
        // Edit mode
        const response = await roleService.updateRole(editingRoleId, data);
        console.log("Response from updateRole:", response);
        if (response.success) {
          messageApi.success(
            response.data.message || "Role updated successfully"
          );
          form.resetFields();
          setIsModalOpen(false);
          setIsEditing(false);
          setEditingRoleId(null);
          await fetchRole();
        } else {
          if (response.statusCode === 409) {
            form.setFields([
              { name: "name", errors: ["Designation already exists"] },
            ]);
          }
          messageApi.error(response.error || "Failed to update role");
        }
      } else {
        // Add mode
        const response = await roleService.createrole(data);
        if (response.success) {
          messageApi.success(
            response.data.message || "Role created successfully"
          );
          form.resetFields();
          setIsModalOpen(false);
          await fetchRole();
        } else {
          if (response.statusCode === 409) {
            form.setFields([
              { name: "name", errors: ["Designation already exists"] },
            ]);
          }
          messageApi.error(response.error || "Failed to create role");
        }
      }
    } catch (error) {
      console.error("Error saving role:", error);
      messageApi.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await roleService.deleterole(id);
      if (!result.success) {
        messageApi.error("Failed to delete Role");
        return;
      }
      messageApi.success(result.message || "Role deleted successfully");
      fetchRole();
    } catch (error) {
      messageApi.error("Failed to delete role");
      console.error("Error deleting role:", error);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };
  const capitalizeWords = (text) => {
    return text?.replace(/\b\w/g, (char) => char.toUpperCase()) || "";
  };
  const allColumns = [
    {
      title: "S.No",
      key: "serialNumber",
      width: 70,
      render: (_, __, index) => index + 1,
      fixed: "left",
    },
    {
      title: "Designation",
      dataIndex: "name",
      key: "name",
      render: (text) => capitalizeWords(text),
    },

    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => capitalizeWords(text),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag
          style={{
            color: status === "active" ? "#52c41a" : "#f5222d",
            backgroundColor: status === "active" ? "#f6ffed" : "#fff1f0",
            fontWeight: 500,
            border: `1px solid ${status === "active" ? "#b7eb8f" : "#ffa39e"}`,
          }}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              onClick={({ key }) => {
                if (key === "view") {
                  // handle view if needed
                }
                if (key === "edit") openEditModal(record);
                if (key === "delete") handleDelete(record.id);
              }}
            >
              <Menu.Item icon={<EyeOutlined />} key="view">
                View
              </Menu.Item>
              <Menu.Item icon={<EditOutlined />} key="edit">
                Edit
              </Menu.Item>
              <Menu.Item icon={<DeleteOutlined />} key="delete">
                Delete
              </Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <EllipsisOutlined className="cursor-pointer text-lg rotate-90" />
        </Dropdown>
      ),
    },
  ];

  const columns = allColumns.filter((c) => visibleColumns.includes(c.key));

  const handleModalCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingRoleId(null);
    form.resetFields();
  };

  return (
    <>
      {contextHolder}
      <div className="max-w-full overflow-hidden">
        <div className="bg-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
            <h1 className="text-xl font-semibold">Designation</h1>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="w-full sm:w-[250px] min-w-[200px]">
                <Input.Search
                  placeholder="Search by role name"
                  value={searchText}
                  onChange={handleSearchChange}
                  className="w-full"
                  allowClear
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto justify-stretch sm:justify-end">
                <Popover
                  content={
                    <FiltersPopover
                      dataSource={roles}
                      currentFilters={filters}
                      onApply={handleFilterApply}
                    />
                  }
                  trigger="click"
                  placement="bottomLeft"
                >
                  <Button icon={<FilterOutlined />}>Filters</Button>
                </Popover>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setIsEditing(false);
                    setEditingRoleId(null);
                    form.resetFields();
                    setIsModalOpen(true);
                  }}
                >
                  Add Designation
                </Button>

                {showCustomButton && (
                  <Dropdown
                    menu={{
                      items: allColumns.map((col) => ({
                        key: col.dataIndex || col.key,
                        label: (
                          <Space>
                            <Switch
                              checked={visibleColumns.includes(
                                col.dataIndex || col.key
                              )}
                              onChange={(checked) => {
                                if (checked) {
                                  setVisibleColumns([
                                    ...visibleColumns,
                                    col.dataIndex || col.key,
                                  ]);
                                } else {
                                  setVisibleColumns(
                                    visibleColumns.filter(
                                      (k) => k !== (col.dataIndex || col.key)
                                    )
                                  );
                                }
                              }}
                            />
                            {col.title}
                          </Space>
                        ),
                      })),
                    }}
                  >
                    <Button icon={<SettingOutlined />}></Button>
                  </Dropdown>
                )}
                <Button
                  icon={
                    viewMode === "table" ? (
                      <AppstoreOutlined />
                    ) : (
                      <TableOutlined />
                    )
                  }
                  onClick={() =>
                    setViewMode((m) => (m === "table" ? "card" : "table"))
                  }
                >
                  {/* {viewMode === "table" ? "Card View" : "Table View"} */}
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {viewMode === "table" ? (
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={roles}
              loading={loading}
              size="small"
              pagination={{
                pageSize: 10,
                responsive: true,
                showSizeChanger: true,
                showTotal: (total, range) =>
                  `${range[0]}-${range[1]} of ${total} items`,
              }}
              onChange={handleTableChange}
              rowKey="id"
              scroll={{ x: "max-content" }}
              className="min-w-full"
              components={{
                header: {
                  cell: (props) => (
                    <th
                      {...props}
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 2,
                        padding: "8px 8px",
                        whiteSpace: "nowrap",
                      }}
                    />
                  ),
                },
              }}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
              {roles.length ? (
                roles.map((role, i) => (
                  <Card
                    key={role.id}
                    title={`${i + 1}. ${
                      role.name.charAt(0).toUpperCase() + role.name.slice(1)
                    }`}
                    className="shadow-sm hover:shadow-md"
                  >
                    <p>
                      <strong>Description:</strong> {role.description}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <Tag color={role.status === "active" ? "green" : "red"}>
                        {role.status.charAt(0).toUpperCase() +
                          role.status.slice(1)}
                      </Tag>
                    </p>
                    <Dropdown
                      overlay={
                        <Menu onClick={(e) => handleMenuClick(rec, e)}>
                          <Menu.Item icon={<EyeOutlined />} key="view">
                            View
                          </Menu.Item>
                          <Menu.Item icon={<EditOutlined />} key="edit">
                            Edit
                          </Menu.Item>
                          <Menu.Item icon={<DeleteOutlined />} key="delete">
                            Delete
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={["click"]}
                    >
                      <EllipsisOutlined
                        rotate={90}
                        className="cursor-pointer text-lg"
                      />
                    </Dropdown>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  No designations found
                </div>
              )}
            </div>
          )}
        </div>
        <Modal
          title={
            <div className="text-xl font-semibold">
              {isEditing ? "Edit Designation" : "Add Designation"}
            </div>
          }
          open={isModalOpen}
          onCancel={handleModalCancel}
          footer={null}
          style={{ top: 20 }}
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleFormSubmit}
            initialValues={{ status: "Active" }}
            className="w-full"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="Designation"
                  rules={[
                    { required: true, message: "Please enter the designation" },
                  ]}
                >
                  <Input placeholder="Enter role name" allowClear />
                </Form.Item>
              </Col>
              {isEditing && (
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[
                      { required: true, message: "Please select status" },
                    ]}
                  >
                    <Select placeholder="Select status" allowClear>
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                    </Select>
                  </Form.Item>
                </Col>
              )}

              <Col xs={24}>
                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    { required: true, message: "Please enter the description" },
                  ]}
                >
                  <TextArea
                    placeholder="Enter role description"
                    allowClear
                    // rows={1}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4">
              <Button
                danger
                onClick={handleModalCancel}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full sm:w-auto"
              >
                {isEditing ? "Update" : "Submit"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default RoleMaster;
