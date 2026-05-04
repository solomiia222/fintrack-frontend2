function Account() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <p>No user data found.</p>;
  }

  return (
    <div>
      <h1>Account</h1>
      <p className="page-subtitle">
        Personal information connected to this FinTrack profile.
      </p>

      <div className="account-card">
        <div className="account-row">
          <span>Name</span>
          <strong>{user.name}</strong>
        </div>

        <div className="account-row">
          <span>Surname</span>
          <strong>{user.surname}</strong>
        </div>

        <div className="account-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="account-row">
          <span>Phone number</span>
          <strong>{user.phone}</strong>
        </div>

        <div className="account-row">
          <span>Bank name</span>
          <strong>{user.bankName}</strong>
        </div>
      </div>
    </div>
  );
}

export default Account;