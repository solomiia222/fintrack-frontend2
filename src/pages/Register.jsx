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
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    // Professional client-side validation guardrails
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      alert("Please fill in your name, email, and password to continue.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      // api.js now throws clean Error objects. We just display the message directly!
      alert(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
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
            disabled={loading}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Surname</label>
          <input
            name="surname"
            type="text"
            disabled={loading}
            value={formData.surname}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email address</label>
          <input
            name="email"
            type="email"
            disabled={loading}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Phone number</label>
          <input
            name="phone"
            type="tel"
            disabled={loading}
            value={formData.phone}
            onChange={handleChange}
            placeholder="+49..."
          />
        </div>

        <div className="form-group">
          <label>Bank name</label>
          <input
            name="bankName"
            type="text"
            disabled={loading}
            value={formData.bankName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            type="password"
            disabled={loading}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button onClick={handleRegister} disabled={loading}>
          {loading ? "Registering..." : "Register and continue"}
        </button>

        <p className="auth-link-text">
          Already have an account?{" "}
          <span 
            onClick={() => !loading && navigate("/login")}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;