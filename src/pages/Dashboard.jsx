import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import SpendingPieChart from "../components/SpendingPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import { getTransactions, getPrediction } from "../api/api";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [predictedSpending, setPredictedSpending] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const transactionsData = await getTransactions();
      setTransactions(Array.isArray(transactionsData) ? transactionsData : []);

      const predictionData = await getPrediction();
      setPredictedSpending(
        Number(
          predictionData.predicted_next_month_spending ||
            predictionData.prediction ||
            0
        )
      );
    } catch (error) {
      setTransactions([]);
      setPredictedSpending(0);
      alert(error.message);
    }
  };

  const totalSpending = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const categoryTotals = transactions.reduce((acc, item) => {
    const category = item.category || "Other";
    acc[category] = (acc[category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});

  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
      : "No data";

  return (
    <div>
      <h1>Dashboard</h1>

      <p className="page-subtitle">
        Overview of your financial activity and AI-based predictions.
      </p>

      <div className="summary-grid">
        <SummaryCard
          title="Total Spending"
          value={`€${totalSpending.toFixed(2)}`}
          description={
            transactions.length > 0
              ? "Current spending from backend"
              : "No transactions yet"
          }
        />

        <SummaryCard
          title="Transactions"
          value={transactions.length}
          description="Number of recorded transactions"
        />

        <SummaryCard
          title="Predicted Spending"
          value={`€${predictedSpending.toFixed(2)}`}
          description={
            transactions.length > 0
              ? "Backend prediction for next month"
              : "Prediction needs transaction data"
          }
        />

        <SummaryCard
          title="Top Category"
          value={topCategory}
          description={
            transactions.length > 0
              ? "Highest spending category"
              : "No category data yet"
          }
        />
      </div>

      <div className="charts-grid">
        <SpendingPieChart />
        <MonthlyLineChart />
      </div>
    </div>
  );
}

export default Dashboard;