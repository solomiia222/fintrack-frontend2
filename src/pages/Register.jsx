import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    bankName: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.phone_number ||
      !formData.password
    ) {
      setError("Please fill in all required fields");
      return;
    }

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await registerUser({
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        password: formData.password,
      });

      setSuccess(result.message || "User created successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.message || "Registration failed");
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

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Name</label>
            <input
              name="first_name"
              type="text"
              value={formData.first_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Surname</label>
            <input
              name="last_name"
              type="text"
              value={formData.last_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email address</label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone number</label>
            <input
              name="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+49123456789"
              required
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
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}

          {success && <div className="form-success">{success}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register and continue"}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}

export default Register;