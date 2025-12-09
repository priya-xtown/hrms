
import api from "../../services/api.js";

export const shiftService = {

  createShift: (data) => api.post("shift/shift/create", data),

  // Get all shifts (no pagination in backend)
  getAllShifts: (page = 1, limit = 10) => api.get("shift/shift/all",  { params: { page, limit } }),
  
  updateShift: (id, data) => api.put(`shift/updateshift/${id}`, data), 

  deleteShift: (id) => api.delete(`shift/shift/${id}`),

  getShiftById: (id) => api.get(`shift/shift/${id}`),
};
