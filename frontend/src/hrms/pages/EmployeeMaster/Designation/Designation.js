// src/hrms/pages/Role/RoleApi.js
import Api from "../../../services/api";

const RoleApi = { 
  
  // ✅ Create new role / designation
  create: (data) => Api.post("role/createRole", data),

  // ✅ Get all roles
  getAll: (page = 1, limit = 10) => Api.get("role/getAllRoles", { params: { page, limit } }),
  // ✅ Get role by ID
  getById: (id) => Api.get(`/role/getRoleById/${id}`),

  // ✅ Update role
  update: (id, data) => Api.put(`/role/updateRole/${id}`, data),

  // ✅ Delete role
  delete: (id) => Api.delete(`/role/deleteRole/${id}`),
};

export default RoleApi;
