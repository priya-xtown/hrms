import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import {
  Card,
  Form,
  Input,
  DatePicker,
  Select,
  Checkbox,
  Button,
  Upload,
  Image,
  App,
} from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import EmployeePersonalApi from "./EmployeePersonalApi.js";
import api from "../../../services/api.js";
import BranchApi from "../../../../company/pages/Branch.js";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const { Option } = Select;
const Employeepersonal = () => {
  const { message } = App.useApp();
  // const [form] = Form.useForm();
  const [profileImage, setProfileImage] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [designationLoading, setDesignationLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchLoading, setBranchLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();    // <-- 📌 MOVE HERE
  const isEditMode = !!id;       // <-- ✔ Correct
  const [hasDetails, setHasDetails] = useState(false);
  const [form] = Form.useForm(); // <-- if using Ant form


  const normalizeId = useCallback((value) => {
    if (!value) return undefined;
    if (typeof value === "object") {
      const fallback = typeof value.toString === "function" ? value.toString() : undefined;
      const safeFallback = fallback && fallback !== "[object Object]" ? fallback : undefined;
      return (
        value.id ||
        value._id ||
        value.value ||
        value.department_id ||
        value.role_id ||
        value.designation_id ||
        value.emp_id ||
        safeFallback
      );
    }
    return value;
  }, []);

  const loadDesignations = useCallback(
    async (deptId, preselectId) => {
      if (!deptId) {
        setDesignations([]);
        form.setFieldsValue({ designation: undefined });
        return [];
      }
      try {
        setDesignationLoading(true);
        const res = await EmployeePersonalApi.getRolebyDepId(deptId);
        const list =
          res?.data?.roles ||
          res?.data?.rows ||
          res?.data?.data ||
          res?.data ||
          [];

        const formatted = Array.isArray(list)
          ? list
            .map((role) => ({
              value: role.id || role._id || role.role_id || role.designation_id,
              label: role.role_name || role.designation_name || role.name || "",
              departmentRef: normalizeId(
                role.department_id ||
                role.departmentId ||
                role.department?.id ||
                role.department?._id ||
                role.department
              ),
            }))
            .filter(
              (role) =>
                role.value &&
                role.label &&
                String(role.departmentRef || deptId) === String(deptId)
            )
          : [];

        setDesignations(formatted);

        if (preselectId) {
          const match = formatted.find(
            (option) => String(option.value) === String(preselectId)
          );
          form.setFieldsValue({ designation: match ? match.value : undefined });
        }

        return formatted;
      } catch (err) {
        console.error("❌ Failed to load designations:", err.response?.data || err.message);
        message.error("Unable to load designations");
        setDesignations([]);
        return [];
      } finally {
        setDesignationLoading(false);
      }
    },
    [form, normalizeId, message]
  );

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await EmployeePersonalApi.getAllDepartments();
        const list =
          res?.data?.rows ||
          res?.data?.departments ||
          res?.data?.data ||
          res?.data ||
          [];

        const formatted = Array.isArray(list)
          ? list
            .map((dept) => ({
              value: dept.id || dept._id || dept.department_id,
              label: dept.department_name || dept.name || dept.title || "",
            }))
            .filter((dept) => dept.value && dept.label)
          : [];

        setDepartments(formatted);
      } catch (err) {
        console.error("❌ Failed to load departments:", err.response?.data || err.message);
        message.error("Unable to load departments");
      }
    };

    fetchDepartments();
  }, [message]);

  const handleDepartmentChange = useCallback(
    async (deptId) => {
      form.setFieldsValue({ department: deptId, designation: undefined });
      await loadDesignations(deptId);
    },
    [form, loadDesignations]
  );

  // Fetch Branches
  useEffect(() => {
    const fetchBranches = async () => {
      setBranchLoading(true);
      try {
        const res = await BranchApi.getAll({
          timeout: 30000,
        });

        const branchList =
          res?.data?.data?.branches ||
          res?.data?.data ||
          res?.data?.branches ||
          res?.data?.rows ||
          res?.data ||
          [];

        const formatted = Array.isArray(branchList)
          ? branchList
            .map((b) => ({
              value: b.id || b._id || b.branch_id,
              label: b.branch_name || b.name || "",
              ...b,
            }))
            .filter((b) => b.value && b.label)
          : [];

        setBranches(formatted);

        if (formatted.length === 0) {
          console.warn("⚠️ No branches found in API");
        }
      } catch (err) {
        console.error("Branch API Error:", err);

        if (err.message?.includes("timeout")) {
          message.error("Branch API timeout. Please try again.");
        } else if (err.code === "ERR_NETWORK") {
          message.error("Network error. Server unreachable.");
        } else {
          message.error(err.response?.data?.message || "Failed to load branches.");
        }

        setBranches([]);
      } finally {
        setBranchLoading(false);
      }
    };

    fetchBranches();
  }, [message]);


   const resolveProfileUrl = (value, baseURL) => {
  if (!value) return null;

  let cleaned = value.trim().replace(/\\/g, "/");

  // If already a full URL -> return
  if (/^https?:\/\//i.test(cleaned)) return cleaned;

  // Remove baseURL if duplicated accidentally
  cleaned = cleaned.replace(baseURL, "").replace(/^\/+/, "");

  // 🔥 Ensure valid folder (employees only!)
  if (cleaned.startsWith("uploads/employees/")) {
    return `${baseURL}/${cleaned}`;
  }

  // If only filename stored → assume employees folder
  return `${baseURL}/uploads/employees/${cleaned}`;
};

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const formatDate = (d) => (d ? dayjs(d).format("YYYY-MM-DD") : null);
      const normalize = (v) => (v === null || v === undefined || v === "" ? "" : String(v).trim());

      const employeeId = id; // route param used by backend as primary key

      // Build the details object (excluding employee_id; backend takes it from top-level)
      const details = {
        attendance_id: normalize(values.attendanceId),
        first_name: normalize(values.firstName),
        last_name: normalize(values.lastName),
        reporting_manager: normalize(values.reportingManager),
        employee_type: normalize(values.employeeType),
        status: normalize(values.status),
        shift_type: normalize(values.shiftType),
        departmentId: normalize(values.department),
        designationId: normalize(values.designation),
        branchId: normalize(values.branchId),
        department_id: normalize(values.department),
        designation_id: normalize(values.designation),
        role_id: normalize(values.designation),
        branch_id: normalize(values.branchId),
        joining_date: formatDate(values.joiningDate),
        date_of_joining: formatDate(values.joiningDate),
        dob: formatDate(values.dob),
        gender: values.gender === "male" ? "Male" : values.gender === "female" ? "Female" : "Other",
        marital_status: values.maritalStatus === "single" ? "UnMarried" : "Married",
        blood_group: normalize(values.bloodGroup),
        nationality: normalize(values.nationality),
        permanent_address: normalize(values.permanentAddress),
        current_address: normalize(values.currentAddress),
        city: normalize(values.city),
        state: normalize(values.state),
        zip_code: normalize(values.pinCode),
        email: normalize(values.email),
        mobile_number: normalize(values.mobileNumber),
        aadhar_number: normalize(values.aadhaar),
        pan_number: normalize(values.panNumber),
        pf_number: normalize(values.pf),
        tax_no: normalize(values.tax),
        bank_name: normalize(values.bankName),
        bank_account_number: normalize(values.account_no),
        ifsc_code: (values.ifsc_code || "").toUpperCase().trim(),
        branch_name: normalize(values.branchName),
        qualification: normalize(values.qualification),
        specialization: normalize(values.specialization),
        institution_name: normalize(values.institution),
        university_name: normalize(values.university),
        edu_start_date: formatDate(values.educationStartDate),
        edu_end_date: formatDate(values.educationEndDate),
        percentage: values.percentage ?? "",
        certifications: normalize(values.additionalCourses),
        company_name: normalize(values.companyName),
        previous_designation: normalize(values.expDesignation),
        previous_department: normalize(values.expDepartment),
        exp_start_date: formatDate(values.experienceStartDate),
        exp_end_date: formatDate(values.experienceEndDate),
        exp_location: normalize(values.location),
        responsibilities: normalize(values.achievements),
        basic_salary: values.basicSalary ?? "",
        allowance: values.allowanceType ?? "",
        bonus: values["bonus/incentives"] ?? "",
        deductions: values.deductions ?? "",
        net_salary: values["net salary"] ?? "",
        asset_type: normalize(values.assetType),
        model: normalize(values.assetId),
        issued_date: formatDate(values.assetIssuedDate),
        return_date: formatDate(values.assetReturnDate),
      };

      // ✅ Extract emergency contacts from form values
      const emergency = (values.emergencyContacts || []).map(contact => ({
        emergency_contact_name: normalize(contact.contactName),
        emergency_contact_relation: normalize(contact.relationship),
        emergency_contact_phone: normalize(contact.phoneNumber),
        emergency_contact_address: normalize(contact.address),
      }));


      // Files mapping
      const filePairs = [
        ["profile_picture_file", "profile_picture"],
        ["resumeUpload", "resume"],
        ["aadharUpload", "aadhar"],
        ["panUpload", "pan"],
        ["degreeUpload", "degree"],
        ["marksheetUpload", "marksheet"],
        ["relievingUpload", "relieving"],
        ["experienceUpload", "experience"],
        ["offerLetterUpload", "offer"],
        ["passportUpload", "passport"],
        ["drivingLicenseUpload", "driving"],
        ["addressProofUpload", "addressproof"],
        ["bankProofUpload", "bankproof"],
      ];

      const formData = new FormData();

      // Append details as JSON string (backend expects req.body.details JSON)
      formData.append("details", JSON.stringify(details));

      // Append emergency contacts as JSON string
      formData.append("emergency", JSON.stringify(emergency));

      // Append files
      // Improved file handling
      filePairs.forEach(([formField, backendKey]) => {
        const fileList = values[formField];
        if (!fileList || fileList.length === 0) return;

        const fileItem = fileList[0];

        // New file uploaded
        if (fileItem.originFileObj) {
          formData.append(backendKey, fileItem.originFileObj);
        }
        // Existing file (from edit mode) — send URL so backend knows not to overwrite
        else if (fileItem.url) {
          formData.append(`${backendKey}_url`, fileItem.url);
        }
      });

      // Debug: inspect what's being sent (remove in production)
      console.log("FormData contents:");
      for (const pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      // Create vs Update: if details already exist, use update; else add
      if (hasDetails) {
        await EmployeePersonalApi.update(employeeId, formData);
        message.success("Employee details updated successfully!");
      } else {
        const topLevelEmployeeId = employeeId || values.primaryId || values.employeeId;
        formData.append("employee_id", topLevelEmployeeId ?? "");
        await EmployeePersonalApi.add(formData);
        message.success("Employee details added successfully!");
      }


      navigate("/employees");
    } catch (err) {
      // AntD Form validation error handling
      if (err && Array.isArray(err.errorFields) && err.errorFields.length > 0) {
        const firstError = err.errorFields[0];
        const msg = Array.isArray(firstError.errors) && firstError.errors.length > 0
          ? firstError.errors[0]
          : "Please fill required fields";
        message.error(msg);
        if (firstError.name) {
          try { form.scrollToField(firstError.name); } catch (_) { }
        }
        console.warn("Validation failed:", err);
        return;
      }

      console.error("Save error:", err);
      message.error(err?.response?.data?.message || err?.message || "Failed to save employee");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        console.log("📡 Fetching employee personal details for ID:", id);

        // Set primaryId immediately
        form.setFieldsValue({ primaryId: id });

        const stateEmployee = location.state?.employee;


        const response = await EmployeePersonalApi.getById(id);
        console.log("✅ Employee personal API response:", response);

        const apiData =
          response?.data?.data || response?.data?.employee || response?.data || {};

        console.log("✅ Extracted employee data:", apiData);

        // ✅ PROPER FIELD MAPPING
        // const origin = new URL(api.defaults.baseURL).origin;
        // const profilePic = apiData.profile_picture;
        // const resolvedProfilePic = profilePic
        //   ? profilePic.startsWith("http")
        //     ? profilePic
        //     : profilePic.startsWith("/uploads")
        //       ? origin + profilePic
        //       : `${origin}/uploads/employee_profile/${profilePic}`
        //   : null;
        const origin = new URL(api.defaults.baseURL).origin;
        const resolvedProfilePic = resolveProfileUrl(apiData.profile_picture, origin);

        const mappedValues = {
          // Hidden primary ID
          primaryId: id,

          // === BASIC DETAILS (from root) ===
          employeeId: apiData.emp_id || "",
          attendanceId: apiData.attendance_id || "",
          firstName: apiData.first_name || "",
          lastName: apiData.last_name || "",
          dateOfJoining: apiData.date_of_joining ? dayjs(apiData.date_of_joining) : null,
          reportingManager: apiData.reporting_manager || "",
          employeeType: apiData.employee_type?.toLowerCase() || "permanent",
          status: apiData.status?.toLowerCase() || "active",
          shiftType: apiData.shift_type || "day",
          profile_picture: resolvedProfilePic || "",

          // === PERSONAL INFORMATION (from details) ===
          dob: apiData.details?.dob ? dayjs(apiData.details.dob) : null,
          gender: apiData.details?.gender?.toLowerCase() || "female",
          maritalStatus: apiData.details?.marital_status === "Married" ? "married" : "single",
          bloodGroup: apiData.details?.blood_group || "",
          nationality: apiData.details?.nationality || "",

          // === CONTACT DETAILS ===
          permanentAddress: apiData.details?.permanent_address || "",
          currentAddress: apiData.details?.current_address || "",
          city: apiData.details?.city || "",
          state: apiData.details?.state || "",
          pinCode: apiData.details?.zip_code || "",
          mobileNumber: apiData.details?.mobile_number || "",
          email: apiData.details?.email || "",

          // === EMERGENCY CONTACTS ===
          emergencyContacts: apiData.emergencies?.length > 0
            ? apiData.emergencies.map((e) => ({
              contactName: e.emergency_contact_name,
              relationship: e.emergency_contact_relation,
              phoneNumber: e.emergency_contact_phone,
              address: e.emergency_contact_address,
            }))
            : [{}],

          // === JOB DETAILS ===
          department: apiData.details?.departmentId || null,
          designation: apiData.details?.designationId || null,
          branchId: apiData.details?.branchId || null,
          joiningDate: apiData.details?.date_of_joining || apiData.date_of_joining
            ? dayjs(apiData.details?.date_of_joining || apiData.date_of_joining)
            : null,

          // === GOVERNMENT DETAILS ===
          aadhaar: apiData.details?.aadhar_number || "",
          panNumber: apiData.details?.pan_number || "",
          pf: apiData.details?.pf_number || "",
          tax: apiData.details?.tax_no || "",

          // === BANK DETAILS ===
          bankName: apiData.details?.bank_name || "",
          account_no: apiData.details?.bank_account_number || "",
          ifsc_code: apiData.details?.ifsc_code || "",
          branchName: apiData.details?.branch_name || "",

          // === EDUCATION DETAILS ===
          qualification: apiData.details?.qualification || "",
          specialization: apiData.details?.specialization || "",
          university: apiData.details?.university_name || "",
          institution: apiData.details?.institution_name || "",
          educationStartDate: apiData.details?.edu_start_date ? dayjs(apiData.details.edu_start_date) : null,
          educationEndDate: apiData.details?.edu_end_date ? dayjs(apiData.details.edu_end_date) : null,
          percentage: apiData.details?.percentage || "",
          additionalCourses: apiData.details?.certifications || "",

          // === EXPERIENCE DETAILS ===
          companyName: apiData.details?.company_name || "",
          expDesignation: apiData.details?.previous_designation || "",
          expDepartment: apiData.details?.previous_department || "",
          location: apiData.details?.exp_location || "",
          experienceStartDate: apiData.details?.exp_start_date ? dayjs(apiData.details.exp_start_date) : null,
          experienceEndDate: apiData.details?.exp_end_date ? dayjs(apiData.details.exp_end_date) : null,
          achievements: apiData.details?.responsibilities || "",

          // === PAYROLL DETAILS ===
          basicSalary: apiData.details?.basic_salary || "",
          allowanceType: apiData.details?.allowance || "",
          "bonus/incentives": apiData.details?.bonus || "",
          deductions: apiData.details?.deductions || "",
          "net salary": apiData.details?.net_salary || "",

          // === ASSET DETAILS ===
          assetType: apiData.details?.asset_type || "",
          assetId: apiData.details?.model || "",
          assetIssuedDate: apiData.details?.issued_date ? dayjs(apiData.details.issued_date) : null,
          assetReturnDate: apiData.details?.return_date ? dayjs(apiData.details.return_date) : null,
        };
        form.setFieldsValue(mappedValues);

        // Track if personal details already exist (controls create vs update)
        setHasDetails(!!apiData?.details);

        // Set profile image if available
        // if (resolvedProfilePic) {
        //   setProfileImage(resolvedProfilePic);
        //   try {
        //     const resp = await fetch(resolvedProfilePic, { cache: "no-store" });
        //     const blob = await resp.blob();
        //     const name = (() => {
        //       try {
        //         return new URL(resolvedProfilePic).pathname.split("/").pop() || "profile.jpg";
        //       } catch (e) {
        //         return "profile.jpg";
        //       }
        //     })();
        //     const fileObj = new File([blob], name, { type: blob.type || "image/jpeg" });
        //     form.setFieldsValue({ profile_picture_file: fileObj });
        //   } catch (e) {
        //     // ignore if unavailable
        //   }
        // }
        // ⬇️ Profile picture resolver + safe fetch
        if (resolvedProfilePic) {
          setProfileImage(resolvedProfilePic);

          try {
            const resp = await fetch(resolvedProfilePic, { cache: "no-store" });

            if (resp.ok) {
              const blob = await resp.blob();
              const filename =
                resolvedProfilePic.split("/").pop() || "profile.jpg";

              const fileObj = new File([blob], filename, {
                type: blob.type || "image/jpeg",
              });

              form.setFieldsValue({ profile_picture_file: fileObj });
            }
          } catch (e) {
            console.warn("⚠️ Image fetch failed, fallback applied");
          }
        } else {
          setProfileImage(null);
        }

        const docs = apiData.documents || {};
        const docUrl = (name) => name ? `${origin}/uploads/employee_docs/${name}` : null;

        form.setFieldsValue({
          resumeUpload: urlToFileList(docUrl(docs.resume)),
          aadharUpload: urlToFileList(docUrl(docs.aadhar)),
          panUpload: urlToFileList(docUrl(docs.pan)),
          degreeUpload: urlToFileList(docUrl(docs.degree)),
          marksheetUpload: urlToFileList(docUrl(docs.marksheet)),
          relievingUpload: urlToFileList(docUrl(docs.relieving)),
          experienceUpload: urlToFileList(docUrl(docs.experience)),
          offerLetterUpload: urlToFileList(docUrl(docs.offer)),
          passportUpload: urlToFileList(docUrl(docs.passport)),
          drivingLicenseUpload: urlToFileList(docUrl(docs.driving)),
          addressProofUpload: urlToFileList(docUrl(docs.addressproof)),
          bankProofUpload: urlToFileList(docUrl(docs.bankproof)),
        });

        // Handle Department/Designation/Branch
        const resolvedDepartmentId = normalizeId(
          apiData.department_id ||
          apiData.departmentId ||
          apiData.department?.id ||
          apiData.department?._id ||
          apiData.department
        );

        const resolvedDesignationId = normalizeId(
          apiData.designation_id ||
          apiData.designationId ||
          apiData.designation?.id ||
          apiData.designation?._id ||
          apiData.designation
        );

        if (resolvedDepartmentId) {
          form.setFieldsValue({ department: resolvedDepartmentId });
          await loadDesignations(resolvedDepartmentId, resolvedDesignationId);
        } else if (resolvedDesignationId) {
          form.setFieldsValue({ designation: resolvedDesignationId });
        }

        const resolvedBranchId = normalizeId(
          apiData.branch_id ||
          apiData.branchId ||
          apiData.branch?.id ||
          apiData.branch?._id ||
          apiData.branch
        );

        if (resolvedBranchId) {
          form.setFieldsValue({ branchId: resolvedBranchId });
        }
      } catch (err) {
        console.error("❌ Failed to load employee data:", err);

        const userMessage =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to fetch employee details";

        message.error(userMessage);
      }
    };

    fetchData();
  }, [id, form, location.state, loadDesignations, normalizeId, message]);

  const uploadProps = {
    maxCount: 1,
    listType: "text",
    accept: ".pdf,.jpg,.jpeg,.png,.doc,.docx",
    onRemove: () => true,
    onPreview: (file) => {
      if (file.url) {
        window.open(file.url, "_blank");
      }
    },
    // This prevents auto-upload; we handle manually
    beforeUpload: () => false,
  };
  // Helper: Convert URL → AntD fileList format (for edit mode)
  const urlToFileList = (url) => {
    if (!url) return [];
    return [
      {
        uid: "-1",
        name: url.split("/").pop() || "document",
        status: "done",
        url: url,
        thumbUrl: url,
      },
    ];
  };

  // Helper: Normalize fileList from event
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e?.fileList;
  };
  return (
    <div className="p-4 bg-gray-50">
      <Form form={form} layout="vertical">
        {/* Basic Details Section */}
        <div className="w-full">
          <Card
            bordered
            title={<span className="font-semibold text-xl">Basic Details</span>}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-2 items-start">
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-x-2 gap-y-2">
                <Form.Item name="employeeId" label="Employee ID">
                  <Input disabled style={{ width: 220 }} />
                </Form.Item>

                <Form.Item name="attendanceId" label="Attendance ID">
                  <Input disabled style={{ width: 220 }} />
                </Form.Item>

                <Form.Item name="firstName" label="First Name">
                  <Input disabled style={{ width: 220 }} />
                </Form.Item>

                <Form.Item name="lastName" label="Last Name">
                  <Input disabled style={{ width: 220 }} />
                </Form.Item>

                <Form.Item name="dateOfJoining" label="Date of Joining">
                  <DatePicker style={{ width: 220 }} disabled />
                </Form.Item>

                <Form.Item name="reportingManager" label="Reporting Manager">
                  <Input disabled style={{ width: 220 }} />
                </Form.Item>

                <Form.Item name="employeeType" label="Employee Type">
                  <Select disabled style={{ width: 220 }}>
                    <Option value="permanent">Permanent</Option>
                    <Option value="contract">Contract</Option>
                    <Option value="intern">Intern</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="status" label="Status">
                  <Select disabled style={{ width: 220 }}>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                  </Select>
                </Form.Item>

                <Form.Item name="shiftType" label="Shift Type">
                  <Select disabled style={{ width: 220 }}>
                    <Option value="day">Day Shift</Option>
                    <Option value="night">Night Shift</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className="flex flex-col items-center justify-start">
                <Form.Item label="Profile Picture" name="profile_picture">
                  <div className="flex flex-col items-center">
                    <Image
                      width={120}
                      height={150}
                      style={{
                        borderRadius: 10,
                        objectFit: "cover",
                        border: "1px solid #ccc",
                      }}
                      src={
                        profileImage ||
                        form.getFieldValue("profile_picture")
                      }
                      alt="Profile"
                    />

                    <Upload
                      showUploadList={false}
                      beforeUpload={(file) => {
                        const url = URL.createObjectURL(file);
                        setProfileImage(url);
                        form.setFieldsValue({ profile_picture_file: file });
                        return false;
                      }}
                    >

                    </Upload>
                  </div>
                </Form.Item>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PERSONAL INFORMATION */}
          <Card
            bordered
            title={<span className="font-semibold text-xl">Personal Information</span>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="dob"
                label={<span className="text-gray-600">Date of Birth</span>}
                rules={[{ required: true, message: "Please select Date of Birth" }]}
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  style={{ width: "100%" }}
                  placeholder="Select Date of Birth"
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label={<span className="text-gray-600">Gender</span>}
                rules={[{ required: true, message: "Please select Gender" }]}
              >
                <Select placeholder="Select">
                  <Option value="male">Male</Option>
                  <Option value="female">Female</Option>
                  <Option value="other">Other</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="maritalStatus"
                label={<span className="text-gray-600">Marital Status</span>}
                rules={[{ required: true, message: "Please select Marital Status" }]}
              >
                <Select placeholder="Select">
                  <Option value="single">UnMarried</Option>
                  <Option value="married">Married</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="bloodGroup"
                label={<span className="text-gray-600">Blood Group</span>}
                rules={[{ required: true, message: "Please enter Blood Group" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="nationality"
                label={<span className="text-gray-600">Nationality</span>}
                rules={[{ required: true, message: "Please enter Nationality" }]}
              >
                <Input />
              </Form.Item>
            </div>
          </Card>

          {/* CONTACT DETAILS */}
          <Card
            bordered
            title={<span className="font-semibold text-xl">Contact Details</span>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="permanentAddress"
                label={<span className="text-gray-600">Permanent Address</span>}
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item name="sameAsPermanent" valuePropName="checked">
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      form.setFieldsValue({
                        currentAddress: form.getFieldValue("permanentAddress"),
                      });
                    } else {
                      form.setFieldsValue({ currentAddress: "" });
                    }
                  }}
                >
                  Same as Permanent
                </Checkbox>
              </Form.Item>

              <Form.Item
                name="currentAddress"
                label={<span className="text-gray-600">Current Address</span>}
                rules={[{ required: true }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                name="city"
                label={<span className="text-gray-600">City</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="state"
                label={<span className="text-gray-600">State</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="pinCode"
                label={<span className="text-gray-600">Pin Code</span>}
                rules={[{ required: true }]}
              >
                <Input
                  maxLength={6}
                  onChange={async (e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    form.setFieldsValue({ pinCode: value });

                    if (value.length === 6) {
                      try {
                        const response = await fetch(
                          `https://api.postalpincode.in/pincode/${value}`
                        );
                        const data = await response.json();
                        if (
                          data[0].Status === "Success" &&
                          data[0].PostOffice &&
                          data[0].PostOffice.length > 0
                        ) {
                          const postOffice = data[0].PostOffice[0];
                          form.setFieldsValue({
                            city: postOffice.District,
                            state: postOffice.State,
                          });
                        } else {
                          form.setFieldsValue({ city: "", state: "" });
                          message.error("Invalid Pin Code or data not found");
                        }
                      } catch (error) {
                        console.error(error);
                        message.error("Failed to fetch City/State");
                      }
                    } else {
                      form.setFieldsValue({ city: "", state: "" });
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                name="mobileNumber"
                label={<span className="text-gray-600">Mobile Number</span>}
                rules={[
                  { required: true, message: "Please enter Mobile Number" },
                  { pattern: /^[0-9]{10}$/, message: "Enter a valid 10-digit number" },
                ]}
              >
                <Input
                  addonBefore="+91"
                  maxLength={10}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) e.preventDefault();
                  }}
                />
              </Form.Item>

              <Form.Item
                name="email"
                label={<span className="text-gray-600">Email</span>}
                rules={[{ required: true, type: "email" }]}
              >
                <Input />
              </Form.Item>
            </div>

          </Card>
          {/* EMERGENCY DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Emergency Details</span>}
          >
            <Form.List name="emergencyContacts" initialValue={[{}]}>
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <div
                      key={key}
                      className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mb-4 rounded-lg bg-gray-50 relative p-4"
                    >
                      {/* Remove Icon (top-right corner) */}
                      <Button
                        type="text"
                        danger
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(name)}
                        style={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                        }}
                      />

                      <Form.Item
                        {...rest}
                        name={[name, "contactName"]}
                        label={<span className="text-gray-600">Name</span>}
                        rules={[{ required: true, message: "Please enter Name" }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...rest}
                        name={[name, "relationship"]}
                        label={<span className="text-gray-600">Relationship</span>}
                        rules={[{ required: true, message: "Please enter Relationship" }]}
                      >
                        <Input />
                      </Form.Item>

                      <Form.Item
                        {...rest}
                        name={[name, "phoneNumber"]}
                        label={<span className="text-gray-600">Phone Number</span>}
                        rules={[
                          { required: true, message: "Please enter Phone Number" },
                          {
                            pattern: /^[0-9]{10}$/,
                            message: "Enter a valid 10-digit number",
                          },
                        ]}
                      >
                        <Input
                          addonBefore="+91"
                          maxLength={10}
                          onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) e.preventDefault();
                          }}
                        />
                      </Form.Item>

                      <Form.Item
                        {...rest}
                        name={[name, "address"]}
                        label={<span className="text-gray-600">Address</span>}
                        rules={[{ required: true, message: "Please enter Address" }]}
                      >
                        <Input.TextArea rows={1} />
                      </Form.Item>
                    </div>

                  ))}

                  {/* Add new contact icon only */}
                  <div className="flex justify-center mt-2">
                    <PlusOutlined
                      onClick={() => add()}
                      style={{
                        fontSize: 22,
                        color: "#7C3AED",
                        cursor: "pointer",

                        position: "absolute",
                        top: 8,
                        right: 8,
                      }}

                    />
                  </div>
                </>
              )}
            </Form.List>
          </Card>

          {/* JOB DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold ">Job Details</span>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">

              <Form.Item
                name="department"
                label={<span className="text-gray-600">Department</span>}
                rules={[{ required: true, message: "Please select Department" }]}
              >
                <Select
                  placeholder="Select Department"
                  onChange={handleDepartmentChange}
                  options={departments} // ✅ [{ value: deptId, label: deptName }]
                />
              </Form.Item>

              <Form.Item
                name="designation"
                label={<span className="text-gray-600">Designation</span>}
                rules={[{ required: true, message: "Please select Designation" }]}
              >
                <Select
                  placeholder="Select Designation"
                  loading={designationLoading}
                  options={designations} // ✅ [{ value: roleId, label: roleName }]
                />
              </Form.Item>

              <Form.Item
                label="Branch"
                name="branchId"
                rules={[{ required: true, message: "Please select a branch" }]}
              >
                <Select
                  placeholder="Select Branch"
                  loading={branchLoading}
                  options={branches}   // direct use
                />
              </Form.Item>
              <Form.Item name="joiningDate"
                label={<span className="text-gray-600">Date of Joining</span>}
                rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} disabled />
              </Form.Item>

            </div>
          </Card>

          {/* GOVERNMENT DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Government Details</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="aadhaar"
                label={<span className="text-gray-600">Aadhaar No</span>}
                rules={[
                  { required: true, message: "Please enter Aadhaar Number" },
                  {
                    pattern: /^\d{12}$/,
                    message: "Aadhaar No must be exactly 12 digits",
                  },
                ]}
              >
                <Input
                  maxLength={12}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // ❌ Block letters/symbols
                    }
                  }}
                  placeholder="Enter 12-digit Aadhaar No"
                />
              </Form.Item>

              <Form.Item
                name="panNumber"
                label={<span className="text-gray-600">PAN Number</span>}
                rules={[{ required: true }]}
              >
                <Input
                  maxLength={10}
                  placeholder="Enter 10-characters PAN No" />
              </Form.Item>

              <Form.Item
                name="pf"
                label={<span className="text-gray-600">Provident Fund (PF) / ESI / SSN</span>}
                rules={[{ required: true, message: "Please enter PF/ESI/SSN Number" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="tax"
                label={<span className="text-gray-600">Tax Category / TDS Information</span>}
                rules={[{ required: true, message: "Please enter Tax/TDS Information" }]}
              >
                <Input />
              </Form.Item>
            </div>

          </Card>

          {/* BANK DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Bank Details</span>}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="bankName"
                label={<span className="text-gray-600">Bank Name</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="account_no"
                label={<span className="text-gray-600">Account No</span>}
                rules={[
                  { required: true, message: "Please enter Account No" },
                  {
                    pattern: /^\d{13}$/,
                    message: "Account No must be exactly 13 digits",
                  },
                ]}
              >
                <Input
                  maxLength={13}
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // ❌ Block letters/symbols
                    }
                  }}
                  placeholder="Enter 13-digit Account No"
                />
              </Form.Item>


              <Form.Item
                name="ifsc_code"
                label={<span className="text-gray-600">IFSC Code</span>}
                rules={[
                  { required: true, message: "Please enter IFSC Code" },
                  {
                    pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/,
                    message: "Enter a valid IFSC Code (e.g., IDIB000XXXX)",
                  },
                ]}
              >
                <Input
                  maxLength={11}
                  placeholder="Enter IFSC Code (e.g. IDIB0001234)"
                  onInput={(e) => {
                    e.target.value = e.target.value.toUpperCase(); // auto uppercase
                  }}
                />
              </Form.Item>


              <Form.Item
                name="branchName"
                label={<span className="text-gray-600">Branch Name</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </div>

          </Card>

          {/* EDUCATION DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Eductaional Details</span>}>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="qualification"
                label={<span className="text-gray-600">Qualification</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="specialization"
                label={<span className="text-gray-600">Specialization</span>}
                rules={[{ required: true, message: "Please enter your Specialization" }]}
              >
                <Input placeholder="e.g. Computer Science, Marketing" />
              </Form.Item>

              <Form.Item
                name="university"
                label={<span className="text-gray-600">University / Board</span>}
                rules={[{ required: true, message: "Please enter your University / Board" }]}
              >
                <Input placeholder="e.g. Anna University, CBSE" />
              </Form.Item>

              <Form.Item
                name="institution"
                label={<span className="text-gray-600">Institution</span>}

              >
                <Input />
              </Form.Item>

              <Form.Item
                name="educationStartDate"
                label={<span className="text-gray-600">Start Date</span>}
              >
                <DatePicker picker="month" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="educationEndDate"
                label={<span className="text-gray-600">End Date</span>}
              >
                <DatePicker picker="month" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="percentage"
                label={<span className="text-gray-600">Percentage / GPA / CGPA</span>}
                rules={[{ required: true, message: "Please enter your Percentage / GPA / CGPA" }]}
              >
                <Input placeholder="e.g. 85% or 8.5 CGPA" />
              </Form.Item>

              <Form.Item
                name="additionalCourses"
                label={<span className="text-gray-600">Additional Courses (if any)</span>}
                rules={[{ required: true, message: "Please enter Additional Courses or write N/A" }]}
              >
                <Input.TextArea rows={2} placeholder="e.g. Data Science, Cloud Computing" />
              </Form.Item>
            </div>

          </Card>

          {/* EXPERIENCE DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Experience Details</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="companyName"
                label={<span className="text-gray-600">Company Name</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="expDesignation"
                label={<span className="text-gray-600">Designation</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="expDepartment"
                label={<span className="text-gray-600">Department</span>}
                rules={[{ required: true, message: "Please enter your Department" }]}
              >
                <Input placeholder="e.g. IT, HR, Finance" />
              </Form.Item>

              <Form.Item
                name="location"
                label={<span className="text-gray-600">Location</span>}
                rules={[{ required: true, message: "Please enter your Work Location" }]}
              >
                <Input placeholder="e.g. Chennai, Bangalore" />
              </Form.Item>

              <Form.Item
                name="experienceStartDate"
                label={<span className="text-gray-600">Start Date</span>}
              >
                <DatePicker picker="month" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="experienceEndDate"
                label={<span className="text-gray-600">End Date</span>}
              >
                <DatePicker picker="month" style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="achievements"
                label={<span className="text-gray-600">Key Achievements / Responsibilities</span>}
                rules={[{ required: true, message: "Please enter your Key Achievements / Responsibilities" }]}
              >
                <Input.TextArea rows={3} placeholder="" />
              </Form.Item>
            </div>

          </Card>

          {/* PAYROLL DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Payroll Details</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              <Form.Item
                name="basicSalary"
                label={<span className="text-gray-600">Basic Salary</span>}
                rules={[{ required: true }]}
              >
                <Input prefix="₹"
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // ❌ Block letters
                    }
                  }} />
              </Form.Item>

              <Form.Item
                name="allowanceType"
                label={<span className="text-gray-600">Allowances</span>}
                rules={[{ required: true, message: "Please select an allowance type" }]}
              >
                <Input
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // ❌ Block letters/symbols
                    }
                  }} />
              </Form.Item>

              <Form.Item
                name="bonus/incentives"
                label={<span className="text-gray-600">Bonus/Incentives</span>}
              >
                <Input
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // ❌ Block letters/symbols
                    }
                  }} />
              </Form.Item>

              <Form.Item
                name="deductions"
                label={<span className="text-gray-600">Deductions</span>}
                rules={[{ required: true, message: "Please select or enter a deduction" }]}
              >
                <Input onKeyPress={(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault(); // ❌ Block letters/symbols
                  }
                }} />
              </Form.Item>

              <Form.Item
                name="net salary"
                label={<span className="text-gray-600">Net Salary</span>}
              >
                <Input
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault(); // ❌ Block letters/symbols
                    }
                  }} />
              </Form.Item>
            </div>
          </Card>
          {/* ASSETS DETAILS */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Asset Details</span>}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
              {/* <Form.Item
                name="employeeId"
                label={<span className="text-gray-600">Employee ID</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item> */}

              <Form.Item
                name="assetType"
                label={<span className="text-gray-600">Asset Type</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="assetId"
                label={<span className="text-gray-600">Model</span>}
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="assetIssuedDate"
                label={<span className="text-gray-600">Issued Date</span>}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>

              <Form.Item
                name="assetReturnDate"
                label={<span className="text-gray-600">Return Date</span>}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>

          </Card>
          {/* DOCUMENT UPLOAD */}
          <Card
            bordered
            title={<span className="text-xl text-gray-800 font-bold">Document Upload</span>}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

              {/* Resume */}
              <Form.Item
                label="Upload Resume"
                name="resumeUpload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Resume</Button>
                </Upload>
              </Form.Item>

              {/* Aadhar */}
              <Form.Item label="Aadhar" name="aadharUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Aadhar</Button>
                </Upload>
              </Form.Item>

              {/* PAN */}
              <Form.Item label="PAN" name="panUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload PAN</Button>
                </Upload>
              </Form.Item>

              {/* Degree Certificate */}
              <Form.Item label="Degree Certificate" name="degreeUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Degree</Button>
                </Upload>
              </Form.Item>

              {/* Marksheet */}
              <Form.Item label="Marksheet" name="marksheetUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Marksheet</Button>
                </Upload>
              </Form.Item>

              {/* Relieving Letter */}
              <Form.Item label="Relieving Letter" name="relievingUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Relieving Letter</Button>
                </Upload>
              </Form.Item>

              {/* Experience Letter */}
              <Form.Item label="Experience Letter" name="experienceUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Experience Letter</Button>
                </Upload>
              </Form.Item>

              {/* Offer Letter */}
              <Form.Item label="Offer Letter" name="offerLetterUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Offer Letter</Button>
                </Upload>
              </Form.Item>

              {/* Passport */}
              <Form.Item label="Passport" name="passportUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Passport</Button>
                </Upload>
              </Form.Item>

              {/* Driving License */}
              <Form.Item label="Driving License" name="drivingLicenseUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Driving License</Button>
                </Upload>
              </Form.Item>

              {/* Address Proof */}
              <Form.Item label="Address Proof" name="addressProofUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Address Proof</Button>
                </Upload>
              </Form.Item>

              {/* Bank Proof */}
              <Form.Item label="Bank Proof" name="bankProofUpload" valuePropName="fileList" getValueFromEvent={normFile}>
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />}>Upload Bank Proof</Button>
                </Upload>
              </Form.Item>

            </div>
          </Card>

        </div>

        {/* SAVE BUTTON */}
        <div className="flex justify-end gap-4 mt-6">
          <Button onClick={() => form.resetFields()}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Employeepersonal;
