import api from "../../../services/api"; // ✅ Adjust the path as needed

// OD Service
const AttenOd = {
  // Get all OD records
  getAll: () => api.get("/od"),

  // Get a single OD record by employeeId and date
  getById: (employeeId, date) => api.get(`/od/${employeeId}/${date}`),

  // Create a new OD record
  create: (data) => api.post("/od", data),

  // Update an existing OD record
  update: (employeeId, date, data) => api.put(`/od/${employeeId}/${date}`, data),

  // Delete an OD record
  delete: (employeeId, date) => api.delete(`/od/${employeeId}/${date}`),
};

export default AttenOd;
