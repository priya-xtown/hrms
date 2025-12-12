import api from "../../../services/api"; // adjust path if needed

const AttendanceApi = {
  getAttendanceReport: (params = {}) =>
    api.get("staf/getAttendanceReport", { params }),
};

export default AttendanceApi;
