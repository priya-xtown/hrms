import { Router } from "express";
import userController from "../controller/user.controller.js";
// import { verifyToken, authorizeRole } from "../../middleware/index.js";
import { verifyToken, authorizeRole } from "../../../middleware/index.js";
const router = Router();

// Public routes
router.post("/user/register", userController.createUser);
router.post("/user/login", userController.loginUser);

// Protected routes (require authentication)
router.get("/user", verifyToken, authorizeRole(["admin"]), userController.getUsers);
router.get("/user/:id", verifyToken, authorizeRole(["ADMIN"]), userController.getUserById);
router.get("/me/profile", verifyToken, authorizeRole(["ADMIN", "USER"]), userController.getMe);

router.put("/user/:id", verifyToken, authorizeRole(["ADMIN"]), userController.updateUserById);
router.delete("/user/:id", verifyToken, authorizeRole(["ADMIN"]), userController.softDeleteUser);
router.patch("/user/:id/restore", verifyToken, authorizeRole(["ADMIN"]), userController.restoreUser);

//logout , forgetpassword
router.post("/user/logout", verifyToken, userController.logoutUser);
router.post("/user/forgetpassword", userController.sendOtpToken);
router.post("/user/verifyOTP", userController.verifyOtp);
router.post("/user/resetPassword", userController.resetPassword);
router.post("/user/changePassword",verifyToken, userController.changePassword);


export default router;
