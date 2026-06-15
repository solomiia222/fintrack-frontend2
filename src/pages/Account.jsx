import { useEffect, useState } from "react";
import { getUserProfile } from "../api/api";

function Account() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getUserProfile();
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  if (!user) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h1>Account</h1>

      <div className="account-card">
        <div className="account-row">
          <span>Name</span>
          <strong>{user.first_name}</strong>
        </div>

        <div className="account-row">
          <span>Surname</span>
          <strong>{user.last_name}</strong>
        </div>

        <div className="account-row">
          <span>Email</span>
          <strong>{user.email}</strong>
        </div>

        <div className="account-row">
          <span>Phone number</span>
          <strong>{user.phone_number}</strong>
        </div>
      </div>
    </div>
  );
}

export default Account;
