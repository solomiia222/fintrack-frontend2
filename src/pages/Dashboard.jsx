import SummaryCard from "../components/SummaryCard";
import SpendingPieChart from "../components/SpendingPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import { transactions, budgets } from "../data/mockData";

function Dashboard() {
  const totalSpending = transactions.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = budgets.reduce((sum, item) => sum + item.limit, 0);
  const remainingBudget = totalBudget - totalSpending;

  // 🔥 TOP CATEGORY
  const categoryMap = {};
  transactions.forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = 0;
    }
    categoryMap[t.category] += t.amount;
  });

  const topCategory = Object.keys(categoryMap).reduce((a, b) =>
    categoryMap[a] > categoryMap[b] ? a : b
  );

  // 🔥 FAKE AI PREDICTION
  const predictedSpending = totalSpending * 1.2;

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
          description="Current monthly spending"
        />

        <SummaryCard
          title="Remaining Budget"
          value={`€${remainingBudget.toFixed(2)}`}
          description="Available budget this month"
        />

        <SummaryCard
          title="Predicted Spending"
          value={`€${predictedSpending.toFixed(2)}`}
          description="AI forecast for month end"
        />

        <SummaryCard
          title="Top Category"
          value={topCategory}
          description="Highest spending category"
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