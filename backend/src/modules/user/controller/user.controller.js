import userService from "../service/user.service.js";
import {
  registerSchema,
  userLoginSchema,
  updateUserSchema,
} from "../dto/user.dto.js";

const userController = {
  // ✅ Register User
  async createUser(req, res) {
    try {
      const data = registerSchema.body.parse(req.body);
      const user = await userService.createUser(data);
      return res.status(201).json({ message: "User created successfully", user });
    } catch (err) {
      if (err.name === "ZodError") {
        return res.status(400).json({ error: err.errors });
      }
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get all users
  async getUsers(req, res) {
    try {
      const users = await userService.getUsers();
      return res.status(200).json(users);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch users" });
    }
  },

  // ✅ Get user by ID
  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Get currently logged-in user
  async getMe(req, res) {
    try {
      const user = await userService.getMe(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Login user
  async loginUser(req, res) {
    try {
      const data = userLoginSchema.body.parse(req.body);

      if (!data.identifier || !data.password) {
        return res.status(400).json({ error: "Identifier and password are required" });
      }

      const { user, accessToken, refreshToken } = await userService.loginUser(data);

      return res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (err) {
      if (err.message.includes("Invalid email/phone or password")) {
        return res.status(401).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Update user
  async updateUserById(req, res) {
    try {
      const data = updateUserSchema.body.parse(req.body);
      const user = await userService.updateUserById(req.params.id, data, req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: "User updated successfully", user });
    } catch (err) {
      if (err.name === "ZodError") {
        return res.status(400).json({ error: err.errors });
      }
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Soft delete user
  async softDeleteUser(req, res) {
    try {
      const result = await userService.softDeleteUser(req.params.id, req.user.id);
      if (!result) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: "User soft deleted successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Restore user
  async restoreUser(req, res) {
    try {
      const result = await userService.restoreUser(req.params.id);
      if (!result) return res.status(404).json({ error: "User not found" });
      return res.status(200).json({ message: "User restored successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Refresh token
  async refreshAccessToken(req, res) {
    try {
      const token = await userService.refreshAccessToken(req.user.id);
      return res.status(200).json({ token });
    } catch (err) {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }
  },

  // ✅ Logout
  async logoutUser(req, res) {
    try {
      await userService.logoutUser(req.user.id);
      return res.status(200).json({ message: "Logged out successfully" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Send OTP
  async sendOtpToken(req, res) {
    try {
      const otp = await userService.sendOtpToken(req.body.identifier);
      return res.status(200).json({ message: "OTP sent successfully", otp });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

    // ✅ Verify OTP
  async verifyOtp(req, res) {
    try {
      const { identifier, otp } = req.body;
      await userService.verifyOtp(identifier, otp);
      return res.status(200).json({ message: "OTP verified successfully" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // ✅ Reset password after OTP verified
  async resetPassword(req, res) {
    try {
      const { identifier, newPassword } = req.body;
      await userService.resetPassword(identifier, newPassword);
      return res.status(200).json({ message: "Password reset successfully" });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  },

  // ✅ Check if user exists
  async userAlreadyExists(req, res) {
    try {
      const exists = await userService.userAlreadyExists(req.query.email);
      return res.status(200).json({ exists });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  // ✅ Change password
  async changePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      await userService.changePassword(req.user.id, oldPassword, newPassword);
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (err) {
      if (err.message.includes("incorrect")) {
        return res.status(401).json({ error: err.message });
      }
      return res.status(500).json({ error: err.message });
    }
  },
};

export default userController;

