
import { message } from "antd";
import api from "../../hrms/services/api";

export const userService = {
  // ✅ Register new user
  register: async (data) => {
    try {
      const response = await api.post("/user/user/register", data);
      message.success(response.data.message || "User registered successfully!");
      return response.data;
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Registration failed!";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  sendOtp: async (identifier) => {
    try {
      const response = await api.post("/user/user/forgetpassword", { identifier });
      message.success(response.data?.message || "OTP sent successfully!");
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send OTP";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  verifyOtp: async (identifier, otp) => {
    try {
      const response = await api.post("/user/user/verifyOTP", { identifier, otp });
      message.success(response.data?.message || "OTP verified successfully!");
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to verify OTP";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  resetPassword: async (identifier, newPassword) => {
    try {
      const response = await api.post("/user/user/resetPassword", { identifier, newPassword });
      message.success(response.data?.message || "Password reset successfully!");
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to reset password";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  // ✅ Login user
  login: async (data) => {
    try {
      const response = await api.post("/user/user/login", data);

      // Save token if present
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      message.success(response.data.message || "Login successful!");
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Login failed!";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  // ✅ Logout user (with backend + token cleanup)
  logout: async () => {
    try {
      const response = await api.post("/user/user/logout");
      localStorage.removeItem("token");

      const successMsg = response.data?.message || "Logged out successfully!";
      message.success(successMsg);

      return response.data || { success: true, message: successMsg };
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      localStorage.removeItem("token");

      const errorMsg = error.response?.data?.message || "Logout failed!";
      message.error(errorMsg);

      return error.response?.data || { success: false, message: errorMsg };
    }
  },

  // ✅ Fetch all users
  getAllUsers: async () => {
    try {
      const response = await api.get("/user/user");
      message.success("Users fetched successfully!");
      return response.data;
    } catch (error) {
      console.error("Get users error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Failed to fetch users!";
      message.error(errorMsg);
      return error.response?.data || { success: false, message: errorMsg };
    }
  },


  // ✅ Delete user by ID
deleteUser: async (userId) => {
  try {
    const response = await api.delete(`/user/user/${userId}`);
    message.success(response.data?.message || "User deleted successfully!");
    return response.data;
  } catch (error) {
    console.error("Delete user error:", error.response?.data || error.message);
    const errorMsg = error.response?.data?.message || "Failed to delete user!";
    message.error(errorMsg);
    return error.response?.data || { success: false, message: errorMsg };
  }
},

};
