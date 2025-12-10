import api from "../../../services/api";

const AttenOt = {
  getAll: (params = {}) => api.get("overtime/getAllOvertime", { params }),
  getById: (id) => api.get(`overtime/getOvertimeById/${id}`),
  create: (data) => api.post("overtime/createOvertime", data),
  update: (id, data) => api.put(`overtime/updateOvertime/${id}`, data),
  delete: (id) => api.delete(`overtime/deleteOvertime/${id}`),

  // Employee dropdown API
  getEmployees: () => api.get("employee/getEmployees"),
};

export default AttenOt;
