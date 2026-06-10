import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

function Register() {
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

  const handleRegister = async () => {
  if (
    !formData.name ||
    !formData.surname ||
    !formData.email ||
    !formData.phone ||
    !formData.password
  ) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    await registerUser(formData);
    alert("Registration successful. Please log in.");
    navigate("/login");
  } catch (error) {
    alert(error.message);
  }
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

        <p className="auth-link-text">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
