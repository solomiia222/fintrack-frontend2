import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { monthlySpending } from "../data/mockData";

function MonthlyLineChart() {
  return (
    <div className="chart-card">
      <h3>Monthly Spending Trend</h3>

      <LineChart width={420} height={280} data={monthlySpending}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="spending" stroke="#4f46e5" strokeWidth={3} />
      </LineChart>
    </div>
  );
}

export default MonthlyLineChart;