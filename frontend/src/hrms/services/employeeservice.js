import api from "./api.js";
import { message } from "antd";

// Helper function to extract success message
function extractMessage(response, defaultMsg) {
  const msg = response.data?.message || defaultMsg;
  console.log("Extracted success message:", msg);
  return msg;
}

// Helper function to extract error message
function extractErrorMessage(error, defaultMsg) {
  let errMsg;
  if (error.response) {
    errMsg =
      error.response.data?.message ||
      error.response.data?.error ||
      (Array.isArray(error.response.data?.errors)
        ? error.response.data.errors.join(", ")
        : error.response.data?.errors) ||
      defaultMsg ||
      "Something went wrong";
  } else if (error.request) {
    errMsg = "Network error: Unable to reach the server";
  } else {
    errMsg = error.message || "Unexpected error occurred";
  }
  console.error("Extracted error message:", errMsg, "Error details:", error);
  return errMsg;
}

export const employeeService = {
  // Create Employee
  createEmployee: async (employeeData) => {
    try {
      const payload = {
        employee_code: employeeData.employee_code,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        phone: employeeData.phone,
        company_id: employeeData.company_id
          ? Number(employeeData.company_id)
          : undefined,
        department_id: employeeData.department_id
          ? Number(employeeData.department_id)
          : undefined,
        division_id: employeeData.division_id
          ? Number(employeeData.division_id)
          : undefined,
        branch_id: employeeData.branch_id
          ? Number(employeeData.branch_id)
          : undefined,
        designation_id: employeeData.designation_id
          ? Number(employeeData.designation_id)
          : undefined,
        date_of_joining: employeeData.date_of_joining,
        date_of_birth: employeeData.date_of_birth,
        address_line1: employeeData.address_line1,
        address_line2: employeeData.address_line2,
        city: employeeData.city ? Number(employeeData.city) : undefined,
        state: employeeData.state ? Number(employeeData.state) : undefined,
        pincode: employeeData.pincode
          ? Number(employeeData.pincode)
          : undefined,
        country: employeeData.country
          ? Number(employeeData.country)
          : undefined,
        status: employeeData.status?.toLowerCase() || "active",
        is_active:
          employeeData.is_active !== undefined ? employeeData.is_active : true,
      };

      // Validate required fields
      const requiredFields = [
        "employee_code",
        "first_name",
        "last_name",
        "email",
        "phone",
        "date_of_birth",
        "address_line1",
        "city",
        "state",
        "pincode",
        "country",
        "designation_id",
        "branch_id",
        "department_id",
        "division_id",
      ];
      const missingFields = requiredFields.filter((field) => !payload[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Validate optional numeric fields
      const numericFields = [
        "company_id",
        "department_id",
        "division_id",
        "branch_id",
        "designation_id",
        "city",
        "state",
        "pincode",
        "country",
      ];
      numericFields.forEach((field) => {
        if (
          payload[field] !== undefined &&
          (isNaN(payload[field]) || payload[field] <= 0)
        ) {
          throw new Error(`Invalid ${field.replace("_id", " ID")} provided`);
        }
      });

      // Remove undefined fields to match schema
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      );

      console.log("Payload sent to backend:", cleanedPayload);
      const res = await api.post("/hrms/employee", cleanedPayload);
      const msg = extractMessage(res, "Employee created successfully");
      message.success(msg);
      return { success: true, data: res.data.data, statusCode: res.status };
    } catch (error) {
      const status = error.response?.status;
      let errMsg = extractErrorMessage(error, "Failed to create employee");
      switch (status) {
        case 400:
          errMsg = extractErrorMessage(error, "Invalid employee data provided");
          break;
        case 404:
          errMsg = "Resource not found";
          break;
        case 409:
          errMsg = "Duplicate employee data entered";
          break;
        case 429:
          errMsg = "Too many requests. Please wait a few minutes";
          break;
        case 500:
          errMsg = "Server error. Please try again later";
          break;
      }
      message.error(errMsg);
      return { success: false, error: errMsg, statusCode: status };
    }
  },

  // Update Employee
  updateEmployee: async (id, employeeData) => {
    if (!id) {
      throw new Error("Employee ID is required for update");
    }

    try {
      const payload = {
        employee_code: employeeData.employee_code,
        first_name: employeeData.first_name,
        last_name: employeeData.last_name,
        email: employeeData.email,
        phone: employeeData.phone,
        company_id: employeeData.company_id
          ? Number(employeeData.company_id)
          : undefined,
        department_id: employeeData.department_id
          ? Number(employeeData.department_id)
          : undefined,
        division_id: employeeData.division_id
          ? Number(employeeData.division_id)
          : undefined,
        branch_id: employeeData.branch_id
          ? Number(employeeData.branch_id)
          : undefined,
        designation_id: employeeData.designation_id
          ? Number(employeeData.designation_id)
          : undefined,
        date_of_joining: employeeData.date_of_joining,
        date_of_birth: employeeData.date_of_birth,
        address_line1: employeeData.address_line1,
        address_line2: employeeData.address_line2,
        city: employeeData.city ? Number(employeeData.city) : undefined,
        state: employeeData.state ? Number(employeeData.state) : undefined,
        pincode: employeeData.pincode
          ? Number(employeeData.pincode)
          : undefined,
        country: employeeData.country
          ? Number(employeeData.country)
          : undefined,
        status: employeeData.status?.toLowerCase() || "active",
        is_active:
          employeeData.is_active !== undefined ? employeeData.is_active : true,
      };

      const requiredFields = [
        "employee_code",
        "first_name",
        "last_name",
        "email",
        "phone",
        "date_of_birth",
        "address_line1",
        "city",
        "state",
        "pincode",
        "country",
        "designation_id",
        "branch_id",
        "department_id",
        "division_id",
      ];
      const missingFields = requiredFields.filter((field) => !payload[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const numericFields = [
        "company_id",
        "department_id",
        "division_id",
        "branch_id",
        "designation_id",
        "city",
        "state",
        "pincode",
        "country",
      ];
      numericFields.forEach((field) => {
        if (
          payload[field] !== undefined &&
          (isNaN(payload[field]) || payload[field] <= 0)
        ) {
          throw new Error(`Invalid ${field.replace("_id", " ID")} provided`);
        }
      });

      // Remove undefined fields to match schema
      const cleanedPayload = Object.fromEntries(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      );

      console.log("Payload sent to backend for update:", cleanedPayload);
      const response = await api.put(`/hrms/employee/${id}`, cleanedPayload);
      const msg = extractMessage(response, "Employee updated successfully");
      message.success(msg);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const status = error.response?.status;
      let errMsg = extractErrorMessage(error, "Failed to update employee");
      switch (status) {
        case 400:
          errMsg = extractErrorMessage(error, "Invalid employee data provided");
          break;
        case 404:
          errMsg = "Employee not found";
          break;
        case 409:
          errMsg = "Duplicate employee data entered";
          break;
        case 429:
          errMsg = "Too many requests. Please wait a few minutes";
          break;
        case 500:
          errMsg = "Server error. Please try again later";
          break;
      }
      message.error(errMsg);
      return { success: false, error: errMsg, statusCode: status };
    }
  },

  getEmployees: async (params = {}) => {
    try {
      const defaultParams = {
        page: 1,
        limit: 10,
        search: "",
        sort_by: "created_at",
        sort_order: "desc",
        company_id: undefined,
        division_id: undefined,
        branch_id: undefined,
        department_id: undefined,
        designation_id: undefined,
        status: undefined,
      };

      const queryParams = { ...defaultParams, ...params };
      queryParams.limit = parseInt(queryParams.limit, 10);
      queryParams.page = parseInt(queryParams.page, 10);

      // Remove undefined fields from query parameters
      const cleanedParams = Object.fromEntries(
        Object.entries(queryParams).filter(
          ([_, value]) => value !== undefined && value !== null
        )
      );

      console.log("Fetching employees with params:", cleanedParams);
      const response = await api.get("/hrms/employee", {
        params: cleanedParams,
      });
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      let errMsg = extractErrorMessage(error, "Failed to fetch employees");
      message.error(errMsg);
      throw error;
    }
  },

  // Get Employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/hrms/employee/${id}`);
      return response.data;
    } catch (error) {
      const status = error.response?.status;
      let errMsg = extractErrorMessage(error, "Failed to fetch employee");
      message.error(errMsg);
      throw error;
    }
  },

  // Delete Employee
  deleteEmployee: async (id) => {
    try {
      const response = await api.delete(`/hrms/employee/${id}`);
      const msg = extractMessage(response, "Employee deleted successfully");
      message.success(msg);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const status = error.response?.status;
      let errMsg = extractErrorMessage(error, "Failed to delete employee");
      switch (status) {
        case 400:
          errMsg = extractErrorMessage(error, "Invalid request");
          break;
        case 404:
          errMsg = "Employee not found";
          break;
        case 429:
          errMsg = "Too many requests. Please wait a few minutes";
          break;
        case 500:
          errMsg = "Server error. Please try again later";
          break;
      }
      message.error(errMsg);
      return { success: false, error: errMsg, statusCode: status };
    }
  },
};
