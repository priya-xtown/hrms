import api from "../../../services/api";

const leaveService = {
  create: (data) => api.post("leave/createLeave", data),
  getAll: (params = {}) => api.get("leave/getAllLeaves", { params }),
  getById: (id) => api.get(`leave/getleave/${id}`),
  update: (id, data) => api.put(`leave/updateLeave/${id}`, data),
  updateStatus: (id, data) => api.patch(`leave/updateLeavestatus/${id}`, data),
  delete: (id) => api.delete(`leave/deleteLeave/${id}`),
};

export default leaveService;
