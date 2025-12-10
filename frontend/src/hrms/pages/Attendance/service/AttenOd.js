import api from "../../../services/api";

const AttenOd = {
  getAll: (params = {}) => api.get("addondutty/getAllAddondutty", { params }),
  getById: (id) => api.get(`addondutty/getAddonduttyById/${id}`),
  create: (data) => api.post("addondutty/createAddondutty", data),
  update: (id, data) => api.put(`addondutty/updateAddondutty/${id}`, data),
  delete: (id) => api.delete(`addondutty/deleteAddondutty/${id}`),
   // Employee dropdown API
  getEmployees: () => api.get("employee/getEmployees"),
};

export default AttenOd;
