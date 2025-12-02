// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.18:4001/hrms_api/v1/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // ✅ Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // ✅ Response interceptor
// api.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

// export default api;


// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://192.168.1.5:4001/hrms_api/v1/",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor to attach token safely
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");

//     if (token && token !== "undefined" && token !== "null") {
//       config.headers.Authorization = `Bearer ${token}`;
//     } else {
//       console.warn("⚠️ No valid token found in localStorage");
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for 401 handling
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response && error.response.status === 401) {
//       console.error("❌ Unauthorized — token missing or invalid");
//       localStorage.removeItem("token");
//       window.location.href = "/login"; // Redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
