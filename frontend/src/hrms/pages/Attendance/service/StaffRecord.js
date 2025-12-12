

// // src/services/StaffRecord.js
// import api from "../../../services/api"; // adjust path as per your structure

// const staffRecordService = {
//   create: (data) => api.post("/staff/createStaff", data),
//   getAll: (params = {}) => api.get("/staff/getAllStaff", { params }),
//   getById: (id) => api.get(`/staff/getStaffById/${id}`),
//   update: (id, data) => api.put(`/staff/updateStaff/${id}`, data),
//   delete: (id) => api.delete(`/staff/deleteStaff/${id}`),
// };

// export default staffRecordService;


import api from "../../../services/api";

const staffRecordService = {
  getAttendanceReport: (params = {}) => api.get("staf/getAttendanceReport", { params }),
};

export default staffRecordService;
