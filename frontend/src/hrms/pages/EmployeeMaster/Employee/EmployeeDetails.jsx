
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Popover,
  Dropdown,
  Menu,
  Tag,
  message,
  Select,
  Modal,
  Space,
  Form,
  DatePicker,
  Upload,
  Avatar,
} from "antd";
import {
  FilterOutlined,
  EllipsisOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import EmployeeApi from "./EmployeeApi";
import api from "../../../services/api.js";
import EmployeePersonalApi from "./EmployeePersonalApi";

const { Option } = Select;

/* ---------------- Filters Popover ---------------- */
const FiltersPopover = ({ onApply }) => {
  const [filters, setFilters] = useState({});
  const fields = [
    {
      key: "status",
      label: "Status",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
    },
  ];

  const onChange = (field, value) => setFilters((f) => ({ ...f, [field]: value }));

  return (
    <div style={{ padding: 10, width: 240 }}>
      {fields.map(({ key, label, options }) => (
        <div key={key} style={{ marginBottom: 12 }}>
          <Select
            allowClear
            placeholder={`Select ${label}`}
            style={{ width: "100%" }}
            value={filters[key]}
            onChange={(val) => onChange(key, val)}
          >
            {options.map((o) => (
              <Option key={o.value} value={o.value}>
                {o.label}
              </Option>
            ))}
          </Select>
        </div>
      ))}
      <Space style={{ marginTop: 8, width: "100%", justifyContent: "center" }}>
        <Button
          danger
          size="small"
          onClick={() => {
            setFilters({});
            onApply({});
          }}
        >
          Reset
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => onApply(filters)}
          disabled={!Object.values(filters).some((v) => v != null)}
        >
          Apply
        </Button>
      </Space>
    </div>
  );
};

/* ---------------- Main Employee Component ---------------- */
const Employee = () => {
  const primaryColor = "#7C3AED";
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [contractEmployees, setContractEmployees] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addEditModalVisible, setAddEditModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTable, setCurrentTable] = useState("employees"); // which table to edit
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loadingFullDetails, setLoadingFullDetails] = useState(false);
  const [filters, setFilters] = useState({});
  const [searchText, setSearchText] = useState("");
  const [pageSize] = useState(10);

  // Unregistered Pagination
  const [currentPageUnreg, setCurrentPageUnreg] = useState(1);
  const [totalUnreg, setTotalUnreg] = useState(0);

  // Registered Pagination
  const [currentPageReg, setCurrentPageReg] = useState(1);
  const [totalReg, setTotalReg] = useState(0);

  // ✅ Fetch registered and unregistered employees from backend
  useEffect(() => {
    fetchRegisteredAndUnregistered();
  }, [currentPageUnreg, currentPageReg]);


  // const fetchRegisteredAndUnregistered = async () => {
    
  //   try {
  //     setLoading(true);
  //     const [regRes, unregRes] = await Promise.all([
  //       EmployeeApi.getRegisteredEmployees(currentPageReg, pageSize),
  //       EmployeeApi.getUnregisteredEmployees(currentPageUnreg, pageSize),

  //     ]);

  //     // ⭐ FIX PAGINATION TOTAL HERE ⭐
  //     const extractTotal = (res) =>
  //       res.data?.count ||
  //       res.data?.total ||
  //       res.data?.data?.total ||
  //       res.data?.data?.count ||
  //       0;
  //     setTotalUnreg(extractTotal(unregRes));
  //     setTotalReg(extractTotal(regRes));

  //     let rows = [];
  //     let count = 0;
  //     const origin = new URL(api.defaults.baseURL).origin;
  //     const normalizeRows = (res) => {
  //       const rows = Array.isArray(res.data?.rows)
  //         ? res.data.rows
  //         : Array.isArray(res.data?.data)
  //           ? res.data.data
  //           : Array.isArray(res.data)
  //             ? res.data
  //             : [];
  //       return rows.map((emp) => ({
  //         ...emp,
  //         profileImage:
  //           typeof emp.profile_picture === "string" && emp.profile_picture.startsWith("/uploads")
  //             ? origin + emp.profile_picture
  //             : emp.profile_picture || emp.profileImage || null,
  //       }));
  //     };

  //     const registered = normalizeRows(regRes);
  //     const unregistered = normalizeRows(unregRes);

  //     setContractEmployees(registered);
  //     setEmployees(unregistered);
  //   } catch (err) {
  //     console.error("❌ Error fetching registered/unregistered employees:", err);
  //     const msg = err.response?.data?.message || "Failed to fetch employees";
  //     message.error(msg);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchRegisteredAndUnregistered = async () => {
  try {
    setLoading(true);

    const [regRes, unregRes] = await Promise.all([
      EmployeeApi.getRegisteredEmployees(currentPageReg, pageSize),
      EmployeeApi.getUnregisteredEmployees(currentPageUnreg, pageSize),
    ]);

    // ⭐ FINAL WORKING PAGINATION TOTAL ⭐
    const extractTotal = (res) =>
      res.data?.count ||
      res.data?.total ||
      res.data?.data?.total ||
      res.data?.data?.count ||
      (Array.isArray(res.data?.rows) ? res.data.rows.length : 0);

    setTotalUnreg(extractTotal(unregRes));
    setTotalReg(extractTotal(regRes));

    const origin = new URL(api.defaults.baseURL).origin;

    const normalizeRows = (res) => {
      const rows = Array.isArray(res.data?.rows)
        ? res.data.rows
        : Array.isArray(res.data?.data)
        ? res.data.data
        : Array.isArray(res.data)
        ? res.data
        : [];

      return rows.map((emp) => ({
        ...emp,
        profileImage:
          typeof emp.profile_picture === "string" &&
          emp.profile_picture.startsWith("/uploads")
            ? origin + emp.profile_picture
            : emp.profile_picture || emp.profileImage || null,
      }));
    };

    const registered = normalizeRows(regRes);
    const unregistered = normalizeRows(unregRes);

    setContractEmployees(registered);
    setEmployees(unregistered);
  } catch (err) {
    console.error("❌ Error fetching registered/unregistered employees:", err);
    const msg = err.response?.data?.message || "Failed to fetch employees";
    message.error(msg);
  } finally {
    setLoading(false);
  }
};


  // ✅ Check if employee has full details (registered)
  const checkEmployeeRegistration = async (employeeId) => {
    try {
      const res = await EmployeePersonalApi.getById(employeeId);
      const apiData = res?.data?.data || res?.data?.employee || res?.data || {};

      // Check if employee has personal details filled (not just basic details)
      const hasFullDetails = !!(
        apiData.dob ||
        apiData.gender ||
        apiData.marital_status ||
        apiData.permanent_address ||
        apiData.current_address ||
        apiData.email ||
        apiData.mobile ||
        apiData.department ||
        apiData.designation ||
        apiData.aadhaar_no ||
        apiData.pan_no ||
        apiData.bank_name ||
        apiData.account_no
      );

      return hasFullDetails;
    } catch (err) {
      // If API call fails, assume employee is not registered
      console.log("Employee not registered or API error:", err);
      return false;
    }
  };

  // ✅ Separate employees into registered and unregistered
  const separateEmployees = async (allEmployees) => {
    if (allEmployees.length === 0) {
      setEmployees([]);
      setContractEmployees([]);
      return;
    }

    setLoadingFullDetails(true);
    const unregistered = [];
    const registered = [];

    // Check each employee's registration status
    for (const emp of allEmployees) {
      const empId = emp._id || emp.id || emp.emp_id;
      if (empId) {
        const isRegistered = await checkEmployeeRegistration(empId);
        if (isRegistered) {
          registered.push(emp);
        } else {
          unregistered.push(emp);
        }
      } else {
        // If no ID, treat as unregistered
        unregistered.push(emp);
      }
    }

    setEmployees(unregistered);
    setContractEmployees(registered);
    setLoadingFullDetails(false);
  };

  /* ---------- Handle Actions ---------- */
  const handleActionClick = (key, record, table) => {
    const stateArray = table === "employees" ? employees : contractEmployees;
    const setStateArray = table === "employees" ? setEmployees : setContractEmployees;

    if (key === "view") {
      setSelectedEmployee(record);
      setModalVisible(true);
    } else if (key === "edit") {
      setIsEditing(true);
      setCurrentTable(table);
      setSelectedEmployee(record);
      setProfileImage(record.profileImage || null);
      form.setFieldsValue({
        first_name: record.first_name,
        last_name: record.last_name,
        employeeCode: record["employee code"],
        attendanceId: record["attendance id"],
        dateOfJoining: moment(record["date of joining"]),
        reportingManager: record["reporting manager"],
        employeeType: record["employee type"],
        shiftType: record["shift type"],
        status: record.status,
      });
      setAddEditModalVisible(true);
    } else if (key === "delete") {
      Modal.confirm({
        title: "Delete Employee",
        content: `Are you sure you want to delete ${record.first_name}?`,
        okText: "Yes",
        cancelText: "No",
        onOk: () => {
          setStateArray((prev) => prev.filter((e) => e.key !== record.key));
          message.success("Employee deleted successfully!");
        },
      });
    }
  };

  /* ---------- Profile Image Edit/Remove ---------- */
  const handleProfileChange = (file) => {
    const imageUrl = URL.createObjectURL(file);
    setProfileImage(imageUrl);
    message.success("Profile image updated!");
    return false;
  };

  const handleRemoveProfile = () => {
    setProfileImage(null);
    message.success("Profile image removed!");
  };

  /* ---------- Columns ---------- */
  const getColumns = (table) => [
    {
      title: "S.No",
      key: "serial",
      render: (_, __, i) => i + 1,
    },
    {
      title: "Profile",
      dataIndex: "profileImage",
      key: "profile",
      render: (_, record) => (
        <Avatar
          src={record.profileImage}
          icon={!record.profileImage && <UserOutlined />}
          style={{
            backgroundColor: "#EDE9FE",
            color: primaryColor,
            cursor: "pointer",
          }}
          size={40}
        />
      ),
    },
    {
      title: "Employee ID",
      dataIndex: "emp_id",
      key: "emp_id",
      render: (code, record) => {
        const empId = code || record.emp_id || record.employee_id || record.id;
        const recordId = record._id || record.id || record.emp_id;
        return (
          <span
            style={{
              color: primaryColor,
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() =>
              navigate(`/hrms/pages/employee/${recordId}`, { state: { employee: record } })
            }
          >
            {empId}
          </span>
        );
      },
    },
    {
      title: "Name",
      key: "name",
      render: (_, record) => `${record.first_name || ""} ${record.last_name || ""}`.trim() || "—"
    },
    { title: "Reporting Manager", dataIndex: "reporting_manager", key: "reporting_manager" },
    { title: "Employee Type", dataIndex: "employee_type", key: "employee_type" },
    { title: "Shift Type", dataIndex: "shift_type", key: "shift_type" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const color =
          status?.toLowerCase() === "active"
            ? "green"
            : "red"; // inactive or anything else → red
        const label = status
          ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
          : "Unknown";

        return <Tag color={color}>{label}</Tag>;
      },
    }


  ];

  /* ---------- Save Add/Edit ---------- */
  const handleSaveEmployee = () => {
    form.validateFields().then((values) => {
      const formatted = {
        ...values,
        "date of joining": values.dateOfJoining.format("YYYY-MM-DD"),
        key: isEditing ? selectedEmployee.key : Date.now(),
      };

      const setStateArray = currentTable === "employees" ? setEmployees : setContractEmployees;
      const stateArray = currentTable === "employees" ? employees : contractEmployees;

      if (isEditing) {
        setStateArray((prev) =>
          prev.map((e) =>
            e.key === selectedEmployee.key ? { ...e, ...formatted, profileImage } : e
          )
        );
        message.success("Employee updated successfully!");
      } else {
        setStateArray((prev) => [
          ...prev,
          {
            ...formatted,
            first_name: values.first_name,
            last_name: values.last_name,
            "employee id": values.employeeCode,
            "attendance id": values.attendanceId,
            "reporting manager": values.reportingManager,
            "employee type": values.employeeType,
            "shift type": values.shiftType,
            status: values.status,
            profileImage,
          },
        ]);
        message.success("Employee added successfully!");
      }
      setAddEditModalVisible(false);
      setProfileImage(null);
      form.resetFields();
      setIsEditing(false);
    });
  };

  const applyFilters = (list) => {
    let filtered = [...list];

    // Filter by Status
    if (filters.status) {
      filtered = filtered.filter(
        (emp) =>
          emp.status?.toLowerCase() === filters.status.toLowerCase()
      );
    }

    return filtered;
  };


  const applySearch = (list) => {
    if (!searchText) return list;
    return list.filter((emp) => {
      const fullText = Object.values(emp).join(" ").toLowerCase();
      return fullText.includes(searchText.toLowerCase());
    });
  };

  return (

    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header: Search + Filters on top, heading below */}
      <div className="mb-6">
        {/* controls row: centered on mobile, right on desktop */}
        <div className="flex justify-center sm:justify-end items-center mb-3">
          <Space size={20}>
            <Input.Search
              placeholder="Search..."
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300, maxWidth: "100%" }}
            />

            <Popover
              content={<FiltersPopover onApply={(values) => setFilters(values)} />}
              trigger="click"
              placement="bottomLeft"
            >
              <Button icon={<FilterOutlined />}>Filters</Button>
            </Popover>

          </Space>
        </div>

        {/* heading */}
        <div>
          <span className="font-semibold text-xl text-center sm:text-left">Un-Registered Employees</span>
        </div>
      </div>



      {/* UnRegistered Employees Table */}
      <div className="mb-10">
        <Table
          columns={getColumns("employees")}
          dataSource={applyFilters(applySearch(employees))}
          rowKey={(record) => record._id || record.id || record.emp_id}
          size="small"
          pagination={{
            current: currentPageUnreg,
            pageSize,
            total: totalUnreg,
            onChange: (page) => setCurrentPageUnreg(page),
          }}
          bordered
          loading={loading || loadingFullDetails}
        />
        <div className="flex justify-center items-center mt-4 gap-3">
          <Button
            onClick={() => setCurrentPageUnreg(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>

          <span>
            Page {currentPageUnreg} of {Math.max(1, Math.ceil(totalUnreg / pageSize))}
          </span>

          <Button
            onClick={() =>
              setCurrentPageUnreg(prev =>
                prev < Math.ceil(totalUnreg / pageSize) ? prev + 1 : prev
              )
            }
          >
            Next
          </Button>
        </div>

      </div>

      {/* Registered Employees Section */}
      <div style={{ marginTop: 26 }}>
        <span className="font-semibold text-xl">
          Registered Employees
        </span>

        {/* small gap between heading and table */}
        <div style={{ marginTop: 24 }}>
          <Table
            columns={getColumns("contractEmployees")}
            dataSource={applyFilters(applySearch(contractEmployees))}
            rowKey={(record) => record._id || record.id || record.emp_id}
            size="small"
            pagination={{
              current: currentPageReg,
              pageSize,
              total: totalReg,
              onChange: (page) => setCurrentPageReg(page),
            }}
            bordered
            loading={loading || loadingFullDetails}
          />
          <div className="flex justify-center items-center mt-4 gap-3">
            <Button onClick={() => setCurrentPageReg(prev => Math.max(prev - 1, 1))}>
              Previous
            </Button>

            <span>
              Page {currentPageReg} of {Math.max(1, Math.ceil(totalReg / pageSize))}
            </span>

            <Button onClick={() => setCurrentPageReg(prev => prev < Math.ceil(totalReg / pageSize) ? prev + 1 : prev)}>
              {currentPageReg >= Math.ceil(totalReg / pageSize)}
              Next
            </Button>
          </div>
        </div>
      </div>


      {/* View Modal */}
      <Modal
        title="Employee Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={<Button onClick={() => setModalVisible(false)}>Close</Button>}
      >
        {selectedEmployee && (
          <div className="space-y-2">
            <p><b>Name:</b> {selectedEmployee.first_name} {selectedEmployee.last_name}</p>
            <p><b>Employee ID:</b> {selectedEmployee["employee code"]}</p>
            <p><b>Attendance ID:</b> {selectedEmployee["attendance id"]}</p>
            <p><b>Date of Joining:</b> {selectedEmployee["date of joining"]}</p>
            <p><b>Reporting Manager:</b> {selectedEmployee["reporting manager"]}</p>
            <p><b>Status:</b> {selectedEmployee.status}</p>
          </div>
        )}
      </Modal>

      {/* Add/Edit Modal */}
      <Modal
        title={isEditing ? "Edit Employee" : "Add Employee"}
        open={addEditModalVisible}
        onCancel={() => setAddEditModalVisible(false)}
        onOk={handleSaveEmployee}
        okText={isEditing ? "Update" : "Save"}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <Avatar
            src={profileImage}
            icon={!profileImage && <UserOutlined />}
            size={80}
            style={{
              backgroundColor: "#EDE9FE",
              color: primaryColor,
              cursor: "pointer",
            }}
          />
          <div style={{ marginTop: 8, display: "flex", justifyContent: "center", gap: 16 }}>
            <Upload showUploadList={false} beforeUpload={handleProfileChange}>
              <EditOutlined style={{ fontSize: 20, cursor: "pointer" }} title="Edit Profile" />
            </Upload>
            {profileImage && (
              <DeleteOutlined
                style={{ fontSize: 20, cursor: "pointer", color: "red" }}
                onClick={handleRemoveProfile}
                title="Remove Profile"
              />
            )}
          </div>
        </div>

        <Form form={form} layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="employeeid" label="Employee ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="attendanceId" label="Attendance ID">
              <Input />
            </Form.Item>
            <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="reportingManager" label="Reporting Manager">
              <Input />
            </Form.Item>
            <Form.Item name="employeeType" label="Employee Type">
              <Select>
                <Option value="Permanent">Permanent</Option>
                <Option value="Contract">Contract</Option>
                <Option value="Intern">Intern</Option>
              </Select>
            </Form.Item>
            <Form.Item name="shiftType" label="Shift Type">
              <Select>
                <Option value="Day">Day</Option>
                <Option value="Night">Night</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select>
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>

  );
};

export default Employee;
