import React, { useState } from "react";
import "./Login.css";
import logo from "../components/assets/Company_logo.png";
import x_logo from "../components/assets/Dark Logo.png";
import { FaEnvelope, FaEye, FaEyeSlash, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { message as antdMessage } from "antd";
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
      </div>
    </div>
  );
};

export default Login;
