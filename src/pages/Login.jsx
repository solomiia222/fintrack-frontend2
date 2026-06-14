import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async () => {
  try {
    const data = await loginUser(loginData);

    localStorage.setItem("token", data.access_token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: loginData.email,
      })
    );

    navigate("/");
    window.location.reload();
  } catch (error) {
    alert(error.message);
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
            value={loginData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={loginData.password}
            onChange={handleChange}
          />
        </div>

        <button onClick={handleLogin}>Login</button>

        <p className="auth-link-text">
          Don’t have an account?{" "}
          <span onClick={() => navigate("/register")}>Register here</span>
        </p>
      </div>
    </div>
  );
}

export default Login;