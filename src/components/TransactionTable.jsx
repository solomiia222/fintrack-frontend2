import { useState } from "react";
import { transactions } from "../data/mockData";

function TransactionTable() {
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(transactions.map((item) => item.category))];

  const filteredTransactions =
    category === "All"
      ? transactions
      : transactions.filter((item) => item.category === category);

  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Transactions</h3>

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

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
          {filteredTransactions.map((item) => (
            <tr key={item.id}>
              <td>{item.date}</td>
              <td>{item.description}</td>
              <td>{item.category}</td>
              <td>€{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;