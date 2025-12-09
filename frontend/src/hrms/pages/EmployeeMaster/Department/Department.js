
import api from "../../../services/api"; // ✅ use lowercase 'api' to match your existing import

const DepartmentApi = { 
  
  // ✅ Create new department
  create: (data) => api.post("department/createDepartment", data),

  // ✅ Get all departments
  getAll: (page = 1, limit = 10) => api.get("department/getAllDepartments", { params: { page, limit } }),

  // ✅ Get department by ID
  getById: (id) => api.get(`department/getDepartmentById/${id}`),

  // ✅ Update department
  update: (id, data) => api.put(`department/updateDepartment/${id}`, data),

  // ✅ Delete department
  delete: (id) => api.delete(`department/deleteDepartment/${id}`),
};

export default DepartmentApi;
