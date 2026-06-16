import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthChoice from "./pages/AuthChoice";
import Account from "./pages/Account";
import FloatingChat from "./components/FloatingChat";

function App() {
  const user = localStorage.getItem("user");

  return (
    <BrowserRouter>
      <div className="app">
        {user && <Header />}

        <main className={user ? "main-content" : ""}>
          <Routes>
            <Route
              path="/start"
              element={user ? <Navigate to="/" /> : <AuthChoice />}
            />

            <Route
              path="/register"
              element={user ? <Navigate to="/" /> : <Register />}
            />

            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <Login />}
            />

            <Route
              path="/"
              element={user ? <Dashboard /> : <Navigate to="/start" />}
            />

            <Route
              path="/transactions"
              element={user ? <Transactions /> : <Navigate to="/start" />}
            />

            <Route
              path="/budgets"
              element={user ? <Budgets /> : <Navigate to="/start" />}
            />

            <Route
              path="/insights"
              element={user ? <Insights /> : <Navigate to="/start" />}
            />

            <Route
              path="/account"
              element={user ? <Account /> : <Navigate to="/start" />}
            />
          </Routes>
        </main>

        {user && <Footer />}
        {user && <FloatingChat />}
      </div>
    </BrowserRouter>
  );
}

export default App;