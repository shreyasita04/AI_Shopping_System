import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";
const API_URL = import.meta.env.VITE_API_URL;

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage("Please enter email and password.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/users/login`,
        {
          email,
          password,
        }
      );

      const user = response.data.user;

      // Save only the information we need
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        })
      );

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (error) {
      console.error("Login error:", error);

      setMessage(
        error.response?.data?.message || "Login failed."
      );
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Login</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            Login
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

       <p className="forgot-password-link">
  <Link to="/forgot-password">Forgot Password?</Link>
</p>

<p className="register-link">
  Don't have an account?{" "}
  <Link to="/register">Register</Link>
</p>
      </div>
    </div>
  );
}

export default Login;