import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getMonthlyAnalytics } from "../api/api";

function MonthlyLineChart() {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    loadMonthlyData();
  }, []);

  const loadMonthlyData = async () => {
    try {
      const analyticsData = await getMonthlyAnalytics();

      const formattedData = analyticsData.map((item) => ({
        month: item.month,
        spending: Number(item.total),
      }));

      setMonthlyData(formattedData);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="chart-card">
      <h3>Monthly Spending Trend</h3>

      <LineChart width={420} height={280} data={monthlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="spending"
          stroke="#4f46e5"
          strokeWidth={3}
        />
      </LineChart>
    </div>
  );
}

export default MonthlyLineChart;