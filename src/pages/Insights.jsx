import { useEffect, useState } from "react";
import InsightCard from "../components/InsightCard";
import ChatBox from "../components/ChatBox";
import { getAiReport, getBudgetSuggestions } from "../api/api";

function Insights() {
  const [report, setReport] = useState("");
  const [suggestions, setSuggestions] = useState("");

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      const reportData = await getAiReport();
      const suggestionsData = await getBudgetSuggestions();

      setReport(reportData.report || "No report available yet.");
      setSuggestions(suggestionsData.suggestions || "No suggestions available yet.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div>
      <h1>AI Insights</h1>

      <p className="page-subtitle">
        AI-generated financial analysis based on your real transaction data.
      </p>

      <div className="insights-grid">
        <InsightCard
          title="Monthly Financial Report"
          text={report}
          type="normal"
        />

        <InsightCard
          title="Budget Suggestions"
          text={suggestions}
          type="warning"
        />
      </div>

      <div className="chat-section">
        <h2>AI Financial Coach</h2>
        <ChatBox />
      </div>
    </div>
  );
}

export default Insights;