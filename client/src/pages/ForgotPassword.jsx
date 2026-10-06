import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ForgotPassword.css";
const API_URL = import.meta.env.VITE_API_URL;

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/reset-password`,
        {
          email,
          newPassword,
        }
      );

      setMessage(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Reset password error:", error);

      setMessage(
        error.response?.data?.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-card">
        <h1>Forgot Password?</h1>

        <p>
          Enter your email and choose a new password.
        </p>

        <form onSubmit={handleResetPassword}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="submit">
            Reset Password
          </button>
        </form>

        {message && (
          <p className="forgot-password-message">
            {message}
          </p>
        )}

        <p className="back-to-login">
          Remember your password?{" "}
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;