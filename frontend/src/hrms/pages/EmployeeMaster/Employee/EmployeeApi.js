import api from "../../../services/api.js"; 

const EmployeeApi = {
  // 🔹 Generate employee code
  getEmpCodeByName: (first_name) =>
    api.get("employee/getEmpCodeByName", { params: { first_name } }),

  // 🔹 Create employee
  create: (data) => api.post("employee/createEmployee", data),

  // 🔹 Get all employees (pagination supported)
  getAll: (page = 1, limit = 10) =>
    api.get("employee/getAllEmployees", { params: { page, limit } }),

  // 🔹 Get employee BY EMPLOYEE ID (main profile)
  getEmployeeById: (id) => api.get(`/employee/getEmployeeById/${id}`),
  getById: (id) => api.get(`/employee/getEmployeeById/${id}`),

  // 🔹 Get REGISTERED employees
  getRegisteredEmployees: (page = 1, limit = 10) => 
    api.get(`employee/getRegisteredEmployees`, { params: { page, limit } }),

  // 🔹 Get UNREGISTERED employees
  getUnregisteredEmployees: (page = 1, limit = 10) =>
     api.get(`employee/getUnregisteredEmployees`, { params: { page, limit } }),

  // 🔹 Update employee
  update: (id, data) => api.put(`/employee/updateEmployee/${id}`, data),

  // 🔹 Delete employee
  delete: (id) => api.delete(`employee/deleteEmployee/${id}`),
};

export default EmployeeApi;
