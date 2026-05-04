import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { budgets } from "../data/mockData";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

function SpendingPieChart() {
  const data = budgets.map((budget) => ({
    name: budget.category,
    value: budget.spent,
  }));

  return (
    <div className="chart-card">
      <h3>Spending by Category</h3>

      <PieChart width={350} height={280}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          label
        >
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default SpendingPieChart;