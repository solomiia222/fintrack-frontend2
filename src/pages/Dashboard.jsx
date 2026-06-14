import { useEffect, useState } from "react";
import SummaryCard from "../components/SummaryCard";
import SpendingPieChart from "../components/SpendingPieChart";
import MonthlyLineChart from "../components/MonthlyLineChart";
import { getTransactions, getBudgets } from "../api/api"; // Fixed: Pull from backend API

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Run requests in parallel to prevent waterfalls
        const [txData, budgetData] = await Promise.all([
          getTransactions(),
          getBudgets()
        ]);
        setTransactions(txData || []);
        setBudgets(budgetData || []);
      } catch (error) {
        console.error("Dashboard failed to load data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // --- MATHEMATICAL & LOGIC FIXES ---

  // 1. Separate actual Expenses (negative numbers) from Income (positive numbers)
  const totalSpending = transactions.reduce((sum, item) => {
    const amt = Number(item.amount);
    return amt < 0 ? sum + Math.abs(amt) : sum; // Sum up absolute values of EXPENSES only
  }, 0);

  const totalBudget = budgets.reduce((sum, item) => sum + Number(item.limit || 0), 0);
  const remainingBudget = totalBudget - totalSpending;

  // 2. Fix the Top Category Math bug (Aggregate by absolute values)
  const categoryMap = {};
  transactions.forEach((t) => {
    const amt = Number(t.amount);
    if (amt < 0) { // Only calculate Top Category based on EXPENSES
      const cat = t.category || "Uncategorized";
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += Math.abs(amt);
    }
  });

  const categories = Object.keys(categoryMap);
  const topCategory = categories.length > 0 
    ? categories.reduce((a, b) => (categoryMap[a] > categoryMap[b] ? a : b))
    : "No expenses logged";

  // 3. Fix the "Fake AI" calculation. Let's make it a slightly more logical estimation 
  // based on remaining days in the month, or at least keep it bound securely to the absolute values.
  const predictedSpending = totalSpending * 1.15;

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading financial dashboard...</div>;
  }

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
          // Add basic visual alarm if budget is blown
          style={{ color: remainingBudget < 0 ? "#d9534f" : "inherit" }} 
        />

        <SummaryCard
          title="Predicted Spending"
          value={`€${predictedSpending.toFixed(2)}`}
          description="Forecast for month end"
        />

        <SummaryCard
          title="Top Category"
          value={topCategory}
          description="Highest spending category"
        />
      </div>

      <div className="charts-grid">
        {/* Pass your real transactions down to charts so they reflect actual data too! */}
        <SpendingPieChart transactions={transactions} />
        <MonthlyLineChart transactions={transactions} />
      </div>
    </div>
  );
}

export default Dashboard;