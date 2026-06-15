import { useEffect, useState } from "react";
import { getTransactions, createTransaction } from "../api/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    date: "",
  });

  const CATEGORIES = [
    "Food",
    "Transport",
    "Bills",
    "Entertainment",
    "Housing",
    "Groceries",
    "Other",
    "Uncategorized",
  ];

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddTransaction = async () => {
    if (!formData.amount || !formData.description || !formData.date) {
      alert("Please fill in amount, description and date");
      return;
    }

    try {
      await createTransaction({
        amount: Number(formData.amount),
        description: formData.description,
        category: formData.category || null,
        date: formData.date,
      });

      setFormData({
        amount: "",
        description: "",
        category: "",
        date: "",
      });

      loadTransactions();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>Transactions</h1>
      <p className="page-subtitle">
        Add and view your real transactions from the backend.
      </p>

      <div className="table-card" style={{ marginBottom: "24px" }}>
        <h3>Add transaction</h3>

        <div className="form-group">
          <label>Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <input
            name="description"
            type="text"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={newBudget.category}
            onChange={handleNewBudgetChange}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>

        <button className="primary-button" onClick={handleAddTransaction}>
          Add transaction
        </button>
      </div>

      <div className="table-card">
        <h3>Transactions</h3>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item) => (
              <tr key={item.id}>
                <td>{item.date}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>€{Number(item.amount).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
