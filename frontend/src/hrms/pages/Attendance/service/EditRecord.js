import api from "../../../services/api"; // ✅ Adjust path

const editRecordService = {
  getAll: (params = {}) => api.get("/editRecord/getAllStaff", { params }),
  update: (id, data) => api.put(`/editRecord/updateStaff/${id}`, data),
  delete: (id) => api.delete(`/editRecord/deleteStaff/${id}`),
  create: (data) => api.post("/editRecord/createStaff", data),
};

export default editRecordService;