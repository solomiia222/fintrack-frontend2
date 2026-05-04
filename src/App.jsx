import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Account from "./pages/Account";

function App() {
  const user = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <div className="app">
        {user && <Header />}

        <main className={user ? "main-content" : ""}>
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />

            <Route
              path="/"
              element={user ? <Dashboard /> : <Navigate to="/login" />}
            />

            <Route
              path="/transactions"
              element={user ? <Transactions /> : <Navigate to="/login" />}
            />

            <Route
              path="/budgets"
              element={user ? <Budgets /> : <Navigate to="/login" />}
            />

            <Route
              path="/insights"
              element={user ? <Insights /> : <Navigate to="/login" />}
            />

            <Route
              path="/account"
              element={user ? <Account /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>

        {user && <Footer />}
      </div>
    </BrowserRouter>
  );
}

export default App;