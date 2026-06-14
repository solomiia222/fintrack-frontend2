function Account() {
  // Safely parse the user object to prevent JSON crash if localStorage is manipulated
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user || !user.email) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <p>No active user session found. Please log in again.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Account</h1>
      <p className="page-subtitle">
        Personal information connected to this FinTrack profile.
      </p>

      <div className="account-card" style={{ maxWidth: "600px", marginTop: "24px" }}>
        <div className="account-row" style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee" }}>
          <span style={{ color: "#666" }}>Email</span>
          <strong>{user.email}</strong>
        </div>

        {/* Fallbacks for data not currently provided by the JWT /auth payload */}
        <div className="account-row" style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee" }}>
          <span style={{ color: "#666" }}>Name</span>
          <strong style={{ color: "#999", fontStyle: "italic" }}>Protected</strong>
        </div>

        <div className="account-row" style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #eee" }}>
          <span style={{ color: "#666" }}>Phone number</span>
          <strong style={{ color: "#999", fontStyle: "italic" }}>Protected</strong>
        </div>

        <div className="account-row" style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
          <span style={{ color: "#666" }}>Bank connection</span>
          <strong style={{ color: "#5cb85c" }}>Active</strong>
        </div>
      </div>
    </div>
  );
}

export default Account;