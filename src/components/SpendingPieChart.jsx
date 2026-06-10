import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { getAnalytics } from "../api/api";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444"];

function SpendingPieChart() {
  const [analytics, setAnalytics] = useState([]);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      const analyticsData = await getAnalytics();
      
      const formattedData = analyticsData.data.map((item) => ({
        name: item.category,
        value: Number(item.total),
      }));

      setAnalytics(formattedData);
    } catch (error) {
      alert(error.message);
    }
  };

  

  return (
    <div className="chart-card">
      <h3>Spending by Category</h3>

      <PieChart width={350} height={280}>
        <Pie
          data={analytics}
          dataKey="value"
          nameKey="name"
          outerRadius={90}
          label
        >
          {analytics.map((entry, index) => (
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