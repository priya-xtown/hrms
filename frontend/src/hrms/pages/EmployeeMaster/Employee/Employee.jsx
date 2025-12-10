import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Tag,
  message,
  Select,
  Modal,
  Space,
  Card,
  Form,
  DatePicker,
  Upload,
  Avatar,
  Popconfirm,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DeleteFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import EmployeeApi from "./EmployeeApi";
import api from "../../../services/api.js";

const { Option } = Select;
// Robust resolver that collapses duplicate /uploads segments and fixes double-path full URLs
const resolveProfileUrl = (value, baseURL) => {
  if (!value) return null;
  let v = String(value).trim().replace(/\\/g, "/");

  // 1) If it's an absolute URL, try to normalize pathname
  if (/^https?:\/\//i.test(v)) {
    try {
      const url = new URL(v);

      // 1a) collapse duplicate slashes
      let pathname = url.pathname.replace(/\/{2,}/g, "/");

      // 1b) If pathname contains repeated uploads/employees patterns,
      //     safest is to extract the final filename and return canonical employees path
      if (pathname.includes("/uploads/employees/")) {
        const filename = pathname.split("/").pop();
        return `${url.origin}/uploads/employees/${filename}`;
      }

      // 1c) collapse repeated /uploads/ segments (e.g. /uploads/uploads/ -> /uploads/)
      pathname = pathname.replace(/(\/uploads\/)+/g, "/uploads/");

      return `${url.origin}${pathname}${url.search}${url.hash}`;
    } catch (e) {
      // fall through to string-based handling
    }
  }

  // 2) Remove baseURL if the backend accidentally stored it
  if (baseURL && v.startsWith(baseURL)) {
    v = v.slice(baseURL.length);
  }

  // 3) normalize leading/trailing and duplicate slashes
  v = v.replace(/^\/+/, "").replace(/\/{2,}/g, "/");

  // 4) If it already contains uploads/... return joined form
  const uploadsIndex = v.indexOf("uploads/");
  if (uploadsIndex !== -1) {
    const tail = v.slice(uploadsIndex).replace(/^\/+/, "").replace(/(\/uploads\/)+/g, "/uploads/");
    return `${baseURL.replace(/\/+$/, "")}/${tail}`;
  }

  // 5) otherwise treat it as a filename and put into uploads/employees
  const filename = v.split("/").pop();
  return `${baseURL.replace(/\/+$/, "")}/uploads/employees/${filename}`;
};


const Employee = () => {
  const navigate = useNavigate();
  const primaryColor = "#10b981";

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null); // preview for add/edit
  const [file, setFile] = useState(null); // File for add
  const [editFile, setEditFile] = useState(null); // File for edit
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Base origin for images (derived from api baseURL)
  const origin = (() => {
    try {
      return new URL(api.defaults.baseURL).origin;
    } catch (e) {
      return "";
    }
  })();

  useEffect(() => {
    fetchEmployees(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // const fetchEmployees = async (page = 1) => {
  //   try {
  //     setLoading(true);
  //     const res = await EmployeeApi.getAll(page, pageSize);
  //     let rows = [];
  //     let count = 0;

  //     if (res?.data) {
  //       if (Array.isArray(res.data)) {
  //         rows = res.data;
  //         count = res.data.length;
  //       } else if (Array.isArray(res.data.rows)) {
  //         rows = res.data.rows;
  //         count = typeof res.data.count === "number" ? res.data.count : res.data.rows.length;
  //       } else {
  //         rows = Array.isArray(res.data) ? res.data : [];
  //         count = rows.length;
  //       }
  //     }
  //     const updatedRows = rows.map((emp) => {
  //       const raw = emp.profile_picture || emp.profileImage || emp.image || emp.photo || null;
  //       const final = resolveProfileUrl(raw, origin);
  //       return {
  //         ...emp,
  //         // keep raw for debugging but rely on profile_picture_url in UI
  //         profile_picture: raw,
  //         profile_picture_url: final,
  //       };
  //     });

  //     setEmployees(updatedRows);
  //     setTotal(count);
  //     // setCurrentPage(page);
  //   } catch (err) {
  //     console.error("❌ Error fetching employees:", err);
  //     message.error(err?.response?.data?.message || "Failed to fetch employees");
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const fetchEmployees = async (page = 1) => {
    try {
      setLoading(true);

      const res = await EmployeeApi.getAll(page, pageSize);

      let rows = [];
      let count = 0;

      if (res?.data) {
        if (Array.isArray(res.data)) {
          rows = res.data;
          count = res.data.length;
        } else if (Array.isArray(res.data.rows)) {
          rows = res.data.rows;
          count = res.data.count;
        }
      }

      const updatedRows = rows.map((emp) => {
        const raw = emp.profile_picture || emp.profileImage || emp.image || emp.photo || null;
        const final = resolveProfileUrl(raw, origin);
        return {
          ...emp,
          profile_picture: raw,
          profile_picture_url: final,
        };
      });

      setEmployees(updatedRows);
      setTotal(count);

    } catch (err) {
      console.error("❌ Error fetching employees:", err);
      message.error(err?.response?.data?.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAttendanceId = async (firstName, formRef) => {
    if (!firstName?.trim()) return "";
    try {
      const res = await EmployeeApi.getEmpCodeByName(firstName);
      const empCode = res?.data?.data?.emp_code || res?.data?.emp_code || null;
      if (empCode) {
        formRef.setFieldsValue({ attendance_id: empCode });
        message.success(`Attendance ID auto-filled: ${empCode}`);
        return empCode;
      } else {
        formRef.setFieldsValue({ attendance_id: "" });
        message.warning("Employee attendance number not found. Please enter manually.");
        return "";
      }
    } catch (error) {
      console.warn("⚠️ Auto-generate attendance ID failed:", error);
      message.error("Failed to fetch employee data. Please check the backend.");
      return "";
    }
  };

  // ---------- Upload handlers (Add) ----------
  const beforeAddUpload = (fileObj) => {
    // Prevent upload (we'll send file via FormData on submit)
    setFile(fileObj);
    setProfileImage(URL.createObjectURL(fileObj));
    // store into form field so validation/submit can read it if needed
    form.setFieldsValue({ profile_picture: fileObj });
    return false; // prevent auto upload
  };

  const removeAddFile = () => {
    setFile(null);
    setProfileImage(null);
    form.setFieldsValue({ profile_picture: undefined });
  };

  // ---------- Upload handlers (Edit) ----------
  const beforeEditUpload = (fileObj) => {
    setEditFile(fileObj);
    setProfileImage(URL.createObjectURL(fileObj));
    editForm.setFieldsValue({ profile_picture: fileObj });
    return false;
  };

  const removeEditFile = () => {
    setEditFile(null);
    setProfileImage(null);
    editForm.setFieldsValue({ profile_picture: undefined });
  };

  const handleAdd = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("first_name", values.first_name || "");
      formData.append("last_name", values.last_name || "");
      formData.append("attendance_id", values.attendance_id || "");

      if (values.date_of_joining) {
        formData.append("date_of_joining", values.date_of_joining.format("YYYY-MM-DD"));
      } else {
        formData.append("date_of_joining", "");
      }

      formData.append("reporting_manager", values.reporting_manager || "");
      formData.append("employee_type", values.employee_type || "");
      formData.append("shift_type", values.shift_type || "");
      formData.append("status", values.status || "");

      // Append the blob/file if present (we stored in state `file`)
      // If user didn't use the upload component but provided a File in values, handle that too.
      const fileToSend = file || values.profile_picture || null;
      if (fileToSend instanceof File) {
        formData.append("profile_picture", fileToSend);
      }

      const res = await EmployeeApi.create(formData);
      const serverMessage = res?.data?.message || "Employee added successfully!";
      message.success(serverMessage);
      setAddModalVisible(false);
      form.resetFields();
      setProfileImage(null);
      setFile(null);

      // Update pagination: compute new total & page where it should appear
      const newTotal = (typeof total === "number" ? total : employees.length) + 1;
      const newPage = Math.max(1, Math.ceil(newTotal / pageSize));
      setTotal(newTotal);
      await fetchEmployees(newPage);
    } catch (err) {
      console.error("❌ Error adding employee:", err);
      message.error(err?.response?.data?.message || "Failed to add employee");
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async (id) => {
    try {
      if (!id) {
        message.warning("Invalid employee ID");
        return null;
      }
      const res = await EmployeeApi.getById(id);

      let employee =
        res?.data?.data || res?.data?.employee || res?.data?.rows?.[0] || res?.data || null;

      if (!employee) {
        message.warning("Employee not found");
        return null;
      }

      const normalized = {
        ...employee,
        id: employee.emp_id || employee._id || employee.id,
        first_name: employee.first_name || "",
        last_name: employee.last_name || "",
        reporting_manager: employee.reporting_manager || "",
        date_of_joining: employee.date_of_joining ? dayjs(employee.date_of_joining) : null,
        employee_type: employee.employee_type || "",
        shift_type: employee.shift_type || "",
        status: employee.status || "",
        // Keep original profile_picture field and expose resolved url
        profile_picture: employee.profile_picture || null,
        profile_picture_url: resolveProfileUrl(employee.profile_picture || null, origin),
      };

      return normalized;
    } catch (err) {
      console.error("❌ Error fetching employee:", err);
      message.error(err?.response?.data?.message || "Failed to fetch employee");
      return null;
    }
  };

  const handleEditClick = (record) => {
    const id = record._id || record.id || record.emp_id || record.employee_id;
    if (!id) {
      message.error("Employee ID not found");
      return;
    }

    // Build preview image url (record may already have profile_picture_url)
    const preview = resolveProfileUrl(record.profile_picture || record.profile_picture_url || null, origin);
    setProfileImage(preview);

    setEditingEmployee(record);
    setEditModalVisible(true);

    editForm.setFieldsValue({
      employeeId: record.emp_id || "",
      attendanceId: record.attendance_id || "",
      firstName: record.first_name || "",
      lastName: record.last_name || "",
      dateOfJoining: record.date_of_joining ? dayjs(record.date_of_joining) : null,
      reportingManager: record.reporting_manager || "",
      employeeType: record.employee_type || "",
      shiftType: record.shift_type || "",
      status: record.status || "",
      profile_picture: null, // keep upload empty until user selects new file
    });

    // reset editFile when opening
    setEditFile(null);

    if (preview) {
      (async () => {
        try {
          // Try fetching sanitized preview
          const resp = await fetch(preview, { cache: "no-store" });
          if (resp.ok) {
            const blob = await resp.blob();
            const name = (new URL(preview, origin)).pathname.split("/").pop() || "profile.jpg";
            const fileObj = new File([blob], name, { type: blob.type || "image/jpeg" });
            setEditFile(fileObj);
            editForm.setFieldsValue({ profile_picture: fileObj });
          } else {
            // fallback: if preview failed and original record.profile_picture is a string,
            // attempt to extract filename and build a "simple" URL
            const raw = record.profile_picture || "";
            const maybeName = raw.split("/").pop();
            if (maybeName) {
              const alt = `${origin}/uploads/employees/${maybeName}`;
              try {
                const r2 = await fetch(alt, { cache: "no-store" });
                if (r2.ok) {
                  const blob2 = await r2.blob();
                  const fileObj2 = new File([blob2], maybeName, { type: blob2.type || "image/jpeg" });
                  setEditFile(fileObj2);
                  editForm.setFieldsValue({ profile_picture: fileObj2 });
                  setProfileImage(alt);
                }
              } catch (err) {
                // ignore — user can reupload
              }
            }
          }
        } catch (e) {
          // ignore fetch errors
        }
      })();
    }
  };

  const handleEdit = async (values) => {
    try {
      setLoading(true);

      const id = editingEmployee?._id || editingEmployee?.id || editingEmployee?.emp_id;

      if (!id) {
        message.error("Employee ID missing for update");
        return;
      }

      const formData = new FormData();

      formData.append("emp_id", values.employeeId);
      formData.append("attendance_id", values.attendanceId);
      formData.append("first_name", values.firstName);
      formData.append("last_name", values.lastName);
      formData.append(
        "date_of_joining",
        values.dateOfJoining ? values.dateOfJoining.format("YYYY-MM-DD") : ""
      );
      formData.append("reporting_manager", values.reportingManager || "");
      formData.append("employee_type", values.employeeType || "");
      formData.append("shift_type", values.shiftType || "");
      formData.append("status", values.status || "");

      // If user uploaded a new file during edit, prefer editFile
      const toSend = editFile || values.profile_picture || null;
      if (toSend instanceof File) {
        formData.append("profile_picture", toSend);
      }

      const res = await EmployeeApi.update(id, formData);

      if (res?.status === 200 || res?.data?.success) {
        message.success(res.data?.message || "Employee updated successfully");
        setEditModalVisible(false);
        setProfileImage(null);
        setEditingEmployee(null);
        setEditFile(null);
        fetchEmployees(currentPage);
      } else {
        message.error(res.data?.message || "Failed to update employee");
      }
    } catch (err) {
      console.error("❌ Update Error:", err);
      message.error(err?.response?.data?.message || "Failed to update employee");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const res = await EmployeeApi.delete(id);
      if (res?.status === 200 || res?.data?.success) {
        message.success(res?.data?.message || "Employee deleted successfully!");
        const newTotal = Math.max(0, total - 1);
        const maxPage = Math.max(1, Math.ceil(newTotal / pageSize));
        const pageToFetch = currentPage > maxPage ? maxPage : currentPage;
        setTotal(newTotal);
        await fetchEmployees(pageToFetch);
      } else {
        message.error(res?.data?.message || "Failed to delete employee");
      }
    } catch (err) {
      console.error("❌ Delete Error:", err);
      message.error(err?.response?.data?.message || "Server error while deleting");
    } finally {
      setLoading(false);
    }
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => e.status?.toLowerCase() === "active").length;
  const inactiveEmployees = employees.filter((e) => e.status?.toLowerCase() === "inactive").length;
  const newJoiners = employees.filter(
    (e) => e.date_of_joining && dayjs().diff(dayjs(e.date_of_joining), "days") <= 30
  ).length;

  const dynamicStats = [
    { title: "Total Employees", value: totalEmployees, color: "bg-black" },
    { title: "Active", value: activeEmployees, color: "bg-green-500" },
    { title: "Inactive", value: inactiveEmployees, color: "bg-red-500" },
    { title: "New Joiners", value: newJoiners, color: "bg-blue-500" },
  ];

  const columns = [
    // { title: "S.No", render: (_, __, i) => i + 1 },

    {
      title: "S.No",
      render: (_, __, index) =>
        (currentPage - 1) * pageSize + index + 1,
    },

    {
      title: "Profile",
      dataIndex: "profile_picture",
      render: (_, record) => {
        // const img = record.profile_picture_url || resolveProfileUrl(record.profile_picture, origin);
        const img = record.profile_picture_url || resolveProfileUrl(record.profile_picture, origin);

        return (
          <Avatar src={img} icon={<UserOutlined />} size={40} style={{ backgroundColor: "#f0f0f0" }} />
        );
      },
    },

    {
      title: "Employee ID",
      dataIndex: "emp_id",
      render: (id, record) => (
        <span
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
          onClick={() => {
            const targetId = record._id || record.id || record.emp_id || record.employee_id;
            navigate(`/hrms/pages/employee/${targetId}`, { state: { employee: record } });
          }}
        >
          {id}
        </span>
      ),
    },
    { title: "Name", render: (_, record) => `${record.first_name || ""} ${record.last_name || ""}` },
    { title: "Reporting Manager", dataIndex: "reporting_manager" },
    { title: "Employee Type", dataIndex: "employee_type" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color={s?.toLowerCase() === "active" ? "green" : "red"}>{s}</Tag>,
    },
    { title: "Shift Type", dataIndex: "shift_type" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} />
          <Popconfirm
            title="Delete?"
            onConfirm={() =>
              handleDelete(record._id || record.id || record.emp_id || record.employee_id)
            }
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
    <div className="bg-white p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {dynamicStats.map((s) => (
          <Card key={s.title} className="flex flex-row items-center gap-3 shadow">
            <div className={`rounded-full h-10 w-10 flex items-center justify-center ${s.color}`}>
              <UserOutlined className="text-white text-xl" />
            </div>
            <div>
              <div className="text-xs font-medium text-gray-600">{s.title}</div>
              <div className="text-xl font-bold">{s.value}</div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-xl">Employee</h2>
        <Button
          type="primary"
          onClick={() => {
            setProfileImage(null);
            setFile(null);
            form.resetFields();
            setAddModalVisible(true);
          }}
        >
          Add Employee
        </Button>
      </div>

      <div>
        <Table
          columns={columns}
          dataSource={employees}
          rowKey={(record) => record._id || record.id || record.emp_id}
          loading={loading}
          bordered
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            onChange: (page) => setCurrentPage(page),
          }}
        />

        <div className="flex justify-center items-center mt-4 gap-3">
          <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
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

      {/* Add Employee Modal */}
      <Modal title="Add Employee" open={addModalVisible} onCancel={() => setAddModalVisible(false)} footer={null} width={800}>
        <Form form={form} layout="vertical" onFinish={handleAdd}>
          <Form.Item name="profile_picture" label="Profile Picture">
            <div className="flex items-center gap-4">
              <div className="relative rounded-full flex items-center justify-center overflow-hidden bg-gray-100" style={{ width: 64, height: 64 }}>
                {profileImage ? (
                  <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <UserOutlined style={{ fontSize: 28, color: "#bfbfbf" }} />
                )}

                {profileImage && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-white bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                    <Upload beforeUpload={beforeAddUpload} showUploadList={false}>
                      <EditOutlined style={{ fontSize: 18, color: "gray", cursor: "pointer" }} />
                    </Upload>
                    <DeleteFilled
                      style={{ fontSize: 18, color: "gray", cursor: "pointer" }}
                      onClick={removeAddFile}
                    />
                  </div>
                )}
              </div>

              {!profileImage && (
                <Upload beforeUpload={beforeAddUpload} showUploadList={false} maxCount={1} onRemove={removeAddFile}>
                  <UploadOutlined style={{ fontSize: 22, color: "#1890ff", cursor: "pointer" }} />
                </Upload>
              )}
            </div>
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="emp_id" label="Employee ID">
              <Input disabled placeholder="Auto-generated" />
            </Form.Item>

            <Form.Item name="attendance_id" label="Attendance ID" rules={[{ required: true, message: "Please enter Attendance id " }]}>
              <Input placeholder="Auto-generated or enter manually" />
            </Form.Item>

            <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: "Please enter First Name" }]}>
              <Input style={{ width: 220 }} onBlur={async () => handleGenerateAttendanceId(form.getFieldValue("first_name"), form)} />
            </Form.Item>

            <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="date_of_joining" label="Date of Joining" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="reporting_manager" label="Reporting Manager" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item name="employee_type" label="Employee Type" rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                <Option value="permanent">Permanent</Option>
                <Option value="contract">Contract</Option>
                <Option value="intern">Intern</Option>
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>

            <Form.Item name="shift_type" label="Shift Type" rules={[{ required: true, message: "Please select a shift type" }]}>
              <Select placeholder="Select Shift Type">
                <Option value="day">Day Shift</Option>
                <Option value="night">Night Shift</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="flex justify-end gap-2">
            <Button onClick={() => setAddModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal title="Edit Employee" open={editModalVisible} onCancel={() => setEditModalVisible(false)} footer={null} width={800}>
        <Form form={editForm} layout="vertical" onFinish={handleEdit}>
          <Form.Item name="profile_picture" label="Profile Picture">
            <div className="flex items-center gap-4">
              <div className="relative rounded-full flex items-center justify-center overflow-hidden bg-gray-100" style={{ width: 64, height: 64 }}>
                {profileImage ? (
                  <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <UserOutlined style={{ fontSize: 28, color: "#bfbfbf" }} />
                )}

                {profileImage && (
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-white bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity">
                    <Upload beforeUpload={beforeEditUpload} showUploadList={false}>
                      <EditOutlined style={{ fontSize: 18, color: "gray", cursor: "pointer" }} />
                    </Upload>
                    <DeleteFilled style={{ fontSize: 18, color: "gray", cursor: "pointer" }} onClick={removeEditFile} />
                  </div>
                )}
              </div>

              {!profileImage && (
                <Upload beforeUpload={beforeEditUpload} showUploadList={false} maxCount={1} onRemove={removeEditFile}>
                  <UploadOutlined style={{ fontSize: 22, color: "#1890ff", cursor: "pointer" }} />
                </Upload>
              )}
            </div>
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item name="employeeId" label="Employee ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="attendanceId" label="Attendance ID" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="reportingManager" label="Reporting Manager" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="employeeType" label="Employee Type" rules={[{ required: true }]}>
              <Select placeholder="Select Type">
                <Option value="permanent">Permanent</Option>
                <Option value="contract">Contract</Option>
                <Option value="intern">Intern</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Select Status">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
              </Select>
            </Form.Item>
            <Form.Item name="shiftType" label="Shift Type" rules={[{ required: true, message: "Please select a shift type" }]}>
              <Select placeholder="Select Shift Type">
                <Option value="day">Day Shift</Option>
                <Option value="night">Night Shift</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item className="flex justify-end gap-2">
            <Button onClick={() => setEditModalVisible(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Update
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Employee;
