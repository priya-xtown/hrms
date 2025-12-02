
import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.4:4001/hrms_api/v1/",
  headers: {
    "Content-Type": "application/json",
  },
});

const stripContentTypeForFormData = (headers) => {
  if (!headers) return;

  // Axios v1 uses AxiosHeaders instance
  if (typeof headers.delete === "function") {
    headers.delete("Content-Type");
    headers.delete("content-type");
  } else {
    delete headers["Content-Type"];
    delete headers["content-type"];
  }
};

// ✅ Automatically attach accessToken for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // ✅ Must match your key in Application tab
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Correct format for backend
      console.log("✅ Token attached:", token);
    } else {
      console.warn("⚠️ No token found in localStorage");
    }

    // ✅ For FormData requests, let browser set Content-Type with boundary
    if (config.data instanceof FormData) {
      stripContentTypeForFormData(config.headers);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle unauthorized (401) globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("❌ Unauthorized — invalid or missing token");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;

