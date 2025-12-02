// EmployeePersonalApi.js — CORRECTED VERSION
import api from "../../../services/api.js";

const EmployeePersonalApi = {
  getById: (id) => api.get(`employee/getEmployeeById/${id}`),
  getAllDepartments: () => api.get("department/getAllDepartments"),
  getRolebyDepId: (deptId) => api.get(`role/getRolebyDepId/${deptId}`),
  getAllBranches: () => api.get("branch/getAllBranches"),

  // ADD → simple POST
  add: (data) => api.post("employee/addEmployeeFullInfo", data),

  // EDIT → Laravel method spoofing → POST + _method=PUT
  update: (id, data) => {
    // Important: FormData already has _method=PUT from buildFormData
    return api.put(`employee/updateEmployeeFullInfo/${id}`, data, {
      // headers: {
      //   "Content-Type": "multipart/form-data",
      // },
    });
  },
};

export default EmployeePersonalApi;