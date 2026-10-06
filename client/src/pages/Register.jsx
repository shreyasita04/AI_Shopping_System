import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/api/users/register`,
        {
          name,
          email,
          password,
        }
      );

      setMessage("Registration successful!");

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error("Registration error:", error);

      setMessage(
        error.response?.data?.message || "Registration failed."
      );
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1>Create Account</h1>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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
            Register
          </button>
        </form>

        {message && (
          <p className="register-message">{message}</p>
        )}

        <p className="login-link">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;