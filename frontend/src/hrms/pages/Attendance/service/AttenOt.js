import api from "../../../services/api";

/**
 * Attendance Overtime (OT) API Service
 * ---------------------------------------------------
 * Handles all API interactions for the OT Management page.
 * Endpoints expected:
 *   GET    /ot                      → Fetch all OT records
 *   GET    /ot/:employeeId/:date    → Fetch a specific OT record
 *   POST   /ot                      → Create a new OT record
 *   POST   /ot/bulk                 → Create multiple OT records (optional)
 *   PUT    /ot/:employeeId/:date    → Update an OT record
 *   DELETE /ot/:employeeId/:date    → Delete an OT record
 */

const AttenOt = {
  /**
   * 🔹 Fetch all OT records
   * @returns {Promise} List of all OT records
   */
  getAll: () => api.get("/ot"),

  getAllOt: () => api.get("/attendance/ot"),

  /**
   * 🔹 Fetch a single OT record by Employee ID and Date
   * @param {string} employeeId
   * @param {string} date
   * @returns {Promise} Single OT record
   */
  getById: (employeeId, date) => api.get(`/ot/${employeeId}/${date}`),

  /**
   * 🔹 Create new OT record(s)
   * Supports single or multiple employees.
   * @param {Object|Array} data - Single record or array of records
   * @returns {Promise}
   */
  create: (data) => {
    if (Array.isArray(data)) {
      // When multiple employees selected, post as bulk
      return api.post("/ot/bulk", data);
    }
    return api.post("/ot", data);
  },

  /**
   * 🔹 Update an existing OT record
   * @param {string} employeeId
   * @param {string} date
   * @param {Object} data - Updated record fields
   * @returns {Promise}
   */
  update: (employeeId, date, data) =>
    api.put(`/ot/${employeeId}/${date}`, data),

  /**
   * 🔹 Delete an OT record
   * @param {string} employeeId
   * @param {string} date
   * @returns {Promise}
   */
  delete: (employeeId, date) => api.delete(`/ot/${employeeId}/${date}`),
};

export default AttenOt;
