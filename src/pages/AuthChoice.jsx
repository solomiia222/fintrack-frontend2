import { useNavigate } from "react-router-dom";

function AuthChoice() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-card auth-choice-card">
        <h2>Welcome to FinTrack AI</h2>

        <p className="login-subtitle">
          Please choose how you want to continue.
        </p>

        <button onClick={() => navigate("/register")}>
          Create new account
        </button>

        <button
          className="secondary-auth-button"
          onClick={() => navigate("/login")}
        >
          Login to existing account
        </button>
      </div>
    </div>
  );
}

export default AuthChoice;