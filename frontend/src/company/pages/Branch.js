// src/hrms/pages/Branch/BranchApi.js
import Api from "../services/Api";

const BranchApi = {
   // ✅ Create new branch
  create: (data) => Api.post("/branch/createBranch", data),
  // ✅ Get all branches - allow custom config (e.g., timeout) for backward compatibility
  getAll: (config) => Api.get("/branch/getAllBranches", config || {}),

  // ✅ Get branch by ID
  getById: (id) => Api.get(`/branch/getBranchById/${id}`),

  // ✅ Update branch
  update: (id, data) => Api.put(`/branch/updateBranch/${id}`, data),

  // ✅ Delete branch
  delete: (id) => Api.delete(`/branch/deleteBranch/${id}`),
};

export default BranchApi;
