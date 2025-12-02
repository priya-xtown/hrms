
import api from "../../../services/api"; // adjust path

const AttendanceApi = {
  // ✅ Get all attendance records (supports filters)
  getAll: (params) => api.get("/attendance", { params }),

  // ✅ Get a single attendance record by employeeId + date
  getById: (employeeId, date) =>
    api.get(`/attendance/${employeeId}/${date}`),

  // ✅ Create a new attendance record
  create: (data) => api.post("/attendance", data),
};

export default AttendanceApi;
