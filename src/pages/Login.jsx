import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    bankName: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = () => {
    if (
      !formData.name ||
      !formData.surname ||
      !formData.email ||
      !formData.phone ||
      !formData.bankName ||
      !formData.password
    ) {
      alert("Please fill in all fields");
      return;
    }

    localStorage.setItem("user", JSON.stringify(formData));

    navigate("/");
    window.location.reload();
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2>Create your FinTrack account</h2>

        <p className="login-subtitle">
          Enter your personal and banking information to continue.
        </p>

        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Surname</label>
          <input
            name="surname"
            type="text"
            value={formData.surname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone number</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bank name</label>
          <input
            name="bankName"
            type="text"
            value={formData.bankName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button onClick={handleRegister}>Register and continue</button>
      </div>
    </div>
  );
}

export default Login;