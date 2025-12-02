

// src/services/StaffRecord.js
import api from "../../../services/api"; // adjust path as per your structure

const staffRecordService = {
  getAll: (params = {}) => api.get("/staff/getAllStaff", { params }),
  getById: (id) => api.get(`/staff/getStaffById/${id}`),
  create: (data) => api.post("/staff/createStaff", data),
  update: (id, data) => api.put(`/staff/updateStaff/${id}`, data),
  delete: (id) => api.delete(`/staff/deleteStaff/${id}`),
  deleteAll: () => api.delete("/staff/deleteAllStaff"),
};

export default staffRecordService;
