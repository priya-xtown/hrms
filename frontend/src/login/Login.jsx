import React, { useState } from "react";
import "./Login.css";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { message as antdMessage, Modal, Form, Input, Button } from "antd";
import Loading from "../utils/Loading";
import { userService } from "../hrms/services/Userservice";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isMobileLogin, setIsMobileLogin] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [fpOpen, setFpOpen] = useState(false);
  const [fpLoading, setFpLoading] = useState(false);
  const [fpStep, setFpStep] = useState(1);
  const [fpIdentifier, setFpIdentifier] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidMobile = (mobile) => /^\d{10}$/.test(mobile);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setMobileError("");
    setPasswordError("");
    setLoginError("");

    let hasError = false;

    if (isMobileLogin) {
      if (!mobile.trim()) {
        setMobileError("Mobile number is required");
        hasError = true;
      } else if (!isValidMobile(mobile)) {
        setMobileError("Enter valid 10-digit mobile number");
        hasError = true;
      }
    } else {
      if (!email.trim()) {
        setEmailError("Email is required");
        hasError = true;
      } else if (!isValidEmail(email)) {
        setEmailError("Enter valid email address");
        hasError = true;
      }
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const payload = isMobileLogin
        ? { mobile: mobile.trim(), password }
        : { identifier: email.trim(), password };

      const response = await userService.login(payload);

      if (response?.message === "Login successful") {
        antdMessage.success("Login successful!");

        // ✅ Store tokens and user
        localStorage.setItem("accessToken", response.accessToken || "");
        localStorage.setItem("refreshToken", response.refreshToken || "");
        localStorage.setItem("user", JSON.stringify(response.user || {}));

        // ✅ Navigate to dashboard
        navigate("/hrms/pages/dashboard", { replace: true });
      } else {
        throw new Error(response?.message || "Invalid credentials!");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed!";
      setLoginError(errorMessage);
      antdMessage.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const toggleLoginMode = () => {
    setIsMobileLogin(!isMobileLogin);
    setEmail("");
    setMobile("");
    setEmailError("");
    setMobileError("");
    setLoginError("");
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="welcome-container">
          <h3 className="welcome-heading">
            Welcome to &nbsp;
            <img src={x_logo} alt="XTOWN" /> town..!
          </h3>
          <span className="welcome-tagline">
            We’re here to turn your ideas into reality.
          </span>
        </div>
      </div>

      <div className="login-right">
        <img src={logo} alt="Company Logo" className="logo" />
        <form className="login-form" onSubmit={handleSubmit}>
          <h3>LOGIN TO YOUR ACCOUNT</h3>

          {loginError && (
            <div className="login-error-message global-error">
              {loginError}
            </div>
          )}

          <div
            className={`form-group ${isMobileLogin ? "mobile" : "email"} mb-4`}
          >
            <div className="input-wrapper">
              {isMobileLogin ? (
                <>
                  <input
                    id="mobile"
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={mobile ? "filled" : ""}
                    placeholder="Mobile Number"
                    maxLength={10}
                  />
                  <label htmlFor="mobile">Mobile Number</label>
                  <FaEnvelope
                    className="input-icon toggle-icon"
                    onClick={toggleLoginMode}
                    title="Use Email instead"
                  />
                </>
              ) : (
                <>
                  <input
                    id="email"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={email ? "filled" : ""}
                    placeholder="Email"
                  />
                  <label htmlFor="email">Email</label>
                  <FaPhone
                    className="input-icon toggle-icon"
                    onClick={toggleLoginMode}
                    title="Use Mobile Number instead"
                  />
                </>
              )}
            </div>
            {isMobileLogin && mobileError && (
              <div className="login-error-message">{mobileError}</div>
            )}
            {!isMobileLogin && emailError && (
              <div className="login-error-message">{emailError}</div>
            )}
          </div>

          <div
            className={`form-group password ${passwordError ? "error" : ""}`}
          >
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={password ? "filled" : ""}
                placeholder="Password"
              />
              <label htmlFor="password">Password</label>
              {showPassword ? (
                <FaEyeSlash
                  className="input-icon toggle-icon"
                  onClick={togglePasswordVisibility}
                  title="Hide Password"
                />
              ) : (
                <FaEye
                  className="input-icon toggle-icon"
                  onClick={togglePasswordVisibility}
                  title="Show Password"
                />
              )}
            </div>
            <div className="forgot-password">
            <a onClick={() => setFpOpen(true)}>Forgot Password?</a>
          </div>
            {passwordError && (
              <div className="login-error-message">{passwordError}</div>
            )}
          </div>

          <button type="submit" className="log-button" disabled={loading}>
            {loading ? <Loading /> : "LOGIN"}
          </button>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <span>Don't have an account?</span>
            <span
              style={{
                color: "#3d2c8bff",
                fontWeight: "bold",
                marginLeft: "4px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/register")}
            >
              Register here
            </span>
          </div>
        </form>
        {/* <Modal
          open={fpOpen}
          onCancel={() => {
            setFpOpen(false);
            setFpStep(1);
            setFpIdentifier("");
            setFpOtp("");
            setFpNewPassword("");
            setFpConfirmPassword("");
          }}
          footer={null}
          title={fpStep === 1 ? "Forgot Password" : "Reset Password"}
        >
          {fpStep === 1 ? (
            <Form
              layout="vertical"
              onFinish={async () => {
                if (!fpIdentifier.trim()) {
                  antdMessage.warning("Enter email or phone");
                  return;
                }
                try {
                  setFpLoading(true);
                  const res = await userService.sendOtp(fpIdentifier.trim());
                  if (res) {
                    setFpStep(2);
                  }
                } catch (e) {
                } finally {
                  setFpLoading(false);
                }
              }}
            >
              <Form.Item label="Email or Phone" required>
                <Input
                  value={fpIdentifier}
                  onChange={(e) => setFpIdentifier(e.target.value)}
                  placeholder="Enter email or phone" style={{ width: 200 }}
                />
              </Form.Item >
               <Form.Item className="flex justify-end gap-2">
              <Button type="primary" htmlType="submit" loading={fpLoading} block>
                Send OTP
              </Button>
              </Form.Item>
            </Form>
          ) : (
            <Form
              layout="vertical"
              onFinish={async () => {
                if (!fpOtp.trim()) {
                  antdMessage.warning("Enter OTP");
                  return;
                }
                if (!fpNewPassword.trim()) {
                  antdMessage.warning("Enter new password");
                  return;
                }
                if (fpNewPassword !== fpConfirmPassword) {
                  antdMessage.warning("Passwords do not match");
                  return;
                }
                try {
                  setFpLoading(true);
                  await userService.verifyOtp(fpIdentifier.trim(), fpOtp.trim());
                  await userService.resetPassword(fpIdentifier.trim(), fpNewPassword.trim());
                  antdMessage.success("Password reset successful");
                  setFpOpen(false);
                  setFpStep(1);
                } catch (e) {
                } finally {
                  setFpLoading(false);
                }
              }}
            >
              <Form.Item label="OTP" required>
                <Input value={fpOtp} onChange={(e) => setFpOtp(e.target.value)} placeholder="Enter OTP" />
              </Form.Item>
              <Form.Item label="New Password" required>
                <Input.Password
                  value={fpNewPassword}
                  onChange={(e) => setFpNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </Form.Item>
              <Form.Item label="Confirm Password" required>
                <Input.Password
                  value={fpConfirmPassword}
                  onChange={(e) => setFpConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </Form.Item>
              <Button type="primary" htmlType="submit" loading={fpLoading} block>
                Reset Password
              </Button>
            </Form>
          )}
        </Modal> */}
        <Modal
  open={fpOpen}
  onCancel={() => {
    setFpOpen(false);
    setFpStep(1);
    setFpIdentifier("");
    setFpOtp("");
    setFpNewPassword("");
    setFpConfirmPassword("");
  }}
  footer={null}
  centered
  width={380}
  style={{ borderRadius: 12 }}
>
  <div style={{ padding: "10px 5px" }}>
    {fpStep === 1 ? (
      <div
        style={{
          padding: "20px",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          background: "#fff",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: 20 }}>
          🔐 Forgot Password
        </h3>

        <Form
          layout="vertical"
          onFinish={async () => {
            if (!fpIdentifier.trim()) {
              antdMessage.warning("Enter email or phone");
              return;
            }
            try {
              setFpLoading(true);
              const res = await userService.sendOtp(fpIdentifier.trim());
              if (res) setFpStep(2);
            } catch (e) {
            } finally {
              setFpLoading(false);
            }
          }}
        >
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Email or Phone</span>}
            required
          >
            <Input
              value={fpIdentifier}
              onChange={(e) => setFpIdentifier(e.target.value)}
              placeholder="Enter email or phone"
              style={{ height: 42, borderRadius: 8 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={fpLoading}
            block
            style={{
              height: 42,
              borderRadius: 8,
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            Send OTP
          </Button>
        </Form>
      </div>
    ) : (
      <div
        style={{
          padding: "20px",
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          background: "#fff",
        }}
      >
        <h3 style={{ textAlign: "center", marginBottom: 20 }}>
          🔄 Reset Password
        </h3>

        <Form
          layout="vertical"
          onFinish={async () => {
            if (!fpOtp.trim()) {
              antdMessage.warning("Enter OTP");
              return;
            }
            if (!fpNewPassword.trim()) {
              antdMessage.warning("Enter new password");
              return;
            }
            if (fpNewPassword !== fpConfirmPassword) {
              antdMessage.warning("Passwords do not match");
              return;
            }
            try {
              setFpLoading(true);
              await userService.verifyOtp(fpIdentifier.trim(), fpOtp.trim());
              await userService.resetPassword(
                fpIdentifier.trim(),
                fpNewPassword.trim()
              );
              antdMessage.success("Password reset successful");
              setFpOpen(false);
              setFpStep(1);
            } catch (e) {
            } finally {
              setFpLoading(false);
            }
          }}
        >
          <Form.Item
            label={<span style={{ fontWeight: 600 }}>OTP</span>}
            required
          >
            <Input
              value={fpOtp}
              onChange={(e) => setFpOtp(e.target.value)}
              placeholder="Enter OTP"
              style={{ height: 42, borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>New Password</span>}
            required
          >
            <Input.Password
              value={fpNewPassword}
              onChange={(e) => setFpNewPassword(e.target.value)}
              placeholder="Enter new password"
              style={{ height: 42, borderRadius: 8 }}
            />
          </Form.Item>

          <Form.Item
            label={<span style={{ fontWeight: 600 }}>Confirm Password</span>}
            required
          >
            <Input.Password
              value={fpConfirmPassword}
              onChange={(e) => setFpConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              style={{ height: 42, borderRadius: 8 }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={fpLoading}
            block
            style={{
              height: 42,
              borderRadius: 8,
              fontWeight: 600,
              marginTop: 10,
            }}
          >
            Reset Password
          </Button>
        </Form>
      </div>
    )}
  </div>
</Modal>

      </div>
    </div>
  );
};

export default Login;
