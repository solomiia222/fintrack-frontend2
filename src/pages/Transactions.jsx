import { useEffect, useState } from "react";
import { getTransactions, createTransaction } from "../api/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    amount: "",
    description: "",
    category: "",
    date: "",
    type: "expense" // Added default type logic
  });

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
    const { name, value } = e.target;

    // Logic Fix: Guard against typing negative numbers directly in the input field
    if (name === "amount" && value !== "" && parseFloat(value) < 0) {
      return; 
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAddTransaction = async () => {
    const amountNum = parseFloat(formData.amount);

    // Logic Fix: Clean validation check
    if (!formData.amount || !formData.description || !formData.date) {
      alert("Please fill in amount, description and date");
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      alert("Please enter a valid amount greater than 0");
      return;
    }

    try {
      // Logic Fix: Ensure math signs align with app types. 
      // If your backend handles values explicitly via negative numbers, we multiply by -1 here.
      // If your backend expects positive values + a type field, adjust this object payload accordingly.
      const finalAmount = formData.type === "expense" ? -Math.abs(amountNum) : Math.abs(amountNum);

      await createTransaction({
        amount: finalAmount,
        description: formData.description,
        category: formData.category || "Uncategorized",
        date: formData.date,
      });

      setFormData({
        amount: "",
        description: "",
        category: "",
        date: "",
        type: "expense"
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

        {/* Logic Fix: Added explicit selector for Income vs Expense */}
        <div className="form-group">
          <label>Transaction Type</label>
          <select 
            name="type" 
            value={formData.type} 
            onChange={handleChange}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="expense">Expense (-)</option>
            <option value="income">Income (+)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            name="amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="0.00"
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
          <input
            name="category"
            type="text"
            placeholder="Groceries, Housing, Transport..."
            value={formData.category}
            onChange={handleChange}
          />
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
            {transactions.map((item) => {
              const numAmount = Number(item.amount);
              return (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{item.description}</td>
                  <td>{item.category}</td>
                  {/* Logic/UI Fix: Add dynamic text coloring for positive/negative balance lists */}
                  <td style={{ color: numAmount < 0 ? "#d9534f" : "#5cb85c", fontWeight: "bold" }}>
                    {numAmount < 0 ? "-" : "+"}€{Math.abs(numAmount).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;