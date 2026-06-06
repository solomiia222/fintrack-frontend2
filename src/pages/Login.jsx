import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem("registeredUser"));

    if (!savedUser) {
      alert("No registered user found. Please register first.");
      navigate("/register");
      return;
    }

    if (
      loginData.email === savedUser.email &&
      loginData.password === savedUser.password
    ) {
      localStorage.setItem("user", JSON.stringify(savedUser));
      navigate("/");
      window.location.reload();
    } else {
      alert("Wrong email or password");
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