import axios from "axios";

const api = axios.create({
  baseURL: "http://192.168.1.4:4001/hrms_api/v1", // ✅ Your new backend path
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // optional but useful
});

// ✅ Automatically attach accessToken for every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // must match login storage key
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("✅ Token attached:", token);
    } else {
      console.warn("⚠️ No token found in localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling for unauthorized requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // ✅ Always handle 401 errors (authentication)
    if (error.response && error.response.status === 401) {
      console.error("❌ Unauthorized — token expired or invalid");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login"; // redirect to login
    } 
    // ✅ Suppress duplicate network/timeout error logs - components handle user-facing messages
    // Only log network errors in debug mode or for non-common endpoints
    else if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED" || error.code === "ERR_CONNECTION_TIMED_OUT" || error.message?.includes("timeout")) {
      // ✅ Reduced logging - let component-level error handling provide user feedback
      // Components will show appropriate messages to users
    } 
    // ✅ Log API errors (4xx, 5xx) but only once
    else if (error.response) {
      // Only log non-401 API errors once
      const status = error.response.status;
      if (status >= 400 && status !== 401) {
        console.error(`🚨 API Error (${status}):`, error.response.data?.message || error.message);
      }
    } 
    // ✅ Log unexpected errors
    else {
      console.error("⚠️ Unexpected Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
