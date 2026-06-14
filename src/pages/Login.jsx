import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
    // Logic Fix 1: Client-side validation guardrails 
    // Truncates useless network calls if fields are missing
    if (!loginData.email.trim() || !loginData.password) {
      alert("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(loginData);

      // Save tokens securely to localStorage
      localStorage.setItem("token", data.access_token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: loginData.email.trim(),
        })
      );

      // Logic Fix 2: Eradicate the window.reload() race condition.
      // If the app relies on a hard reload to grab the new token on boot, 
      // change the window path directly instead of using react-router's navigate().
      window.location.href = "/";
      
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Login to FinTrack</h2>

        <p className="login-subtitle">
          Enter your email and password to access your dashboard.
        </p>

        <div className="form-group">
          <label>Email address</label>
          <input
            name="email"
            type="email"
            disabled={loading}
            value={loginData.email}
            onChange={handleChange}
            placeholder="name@example.com"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            disabled={loading}
            value={loginData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </div>

        {/* UI Fix: Disable button while loading to prevent double-submissions */}
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="auth-link-text">
          Don’t have an account?{" "}
          <span 
            onClick={() => !loading && navigate("/register")} 
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;