import api from "../../../services/api"; // ✅ adjust path if needed

// Leave API methods
const leaveService = {
  // ✅ Get all leave records
  getAll: (params = {}) => api.get("/leave/getAllLeave", { params }),

  // ✅ Get leave by Employee ID (and optional filters)
  getById: (employeeId, date) =>
    api.get(`/leave/getLeave/${employeeId}`, { params: { date } }),

  // ✅ Create a new leave record
  create: (record) => api.post("/leave/createLeave", record),

  // ✅ Update an existing leave record
  update: (employeeId, date, record) =>
    api.put(`/leave/updateLeave/${employeeId}`, { ...record, date }),

  // ✅ Delete a specific leave record
  delete: (employeeId, date) =>
    api.delete(`/leave/deleteLeave/${employeeId}`, { data: { date } }),

  // ✅ Delete all leave records
  deleteAll: () => api.delete("/leave/deleteAllLeave"),
};

export default leaveService;
