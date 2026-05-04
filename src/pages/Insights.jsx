import InsightCard from "../components/InsightCard";
import { predictions } from "../data/mockData";

function Insights() {
  return (
    <div>
      <h1>AI Insights</h1>
      <p className="page-subtitle">
        Predictive financial analysis generated from user spending behavior.
      </p>

      <div className="insights-grid">
        {predictions.map((prediction) => (
          <InsightCard
            key={prediction.title}
            title={prediction.title}
            text={prediction.text}
            type={prediction.type}
          />
        ))}
      </div>
    </div>
  );
}

export default Insights;