import { useEffect, useState } from "react";
import InsightCard from "../components/InsightCard";
import { getAiReport, getBudgetSuggestions } from "../api/api";

function Insights() {
  const [report, setReport] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [loading, setLoading] = useState(true);

  const loadInsights = async () => {
    setLoading(true);
    try {
      // Logic Fix: Trigger both AI requests simultaneously in parallel 
      // instead of waiting for one to finish before starting the next.
      const [reportResult, suggestionsResult] = await Promise.allSettled([
        getAiReport(),
        getBudgetSuggestions()
      ]);

      // Handle the Monthly Report result safely
      if (reportResult.status === "fulfilled") {
        setReport(reportResult.value?.report || "No report available yet.");
      } else {
        console.error("Report failed:", reportResult.reason);
        setReport("Failed to generate report. Add more transaction data or check your AI API key configurations.");
      }

      // Handle the Budget Suggestions result safely
      if (suggestionsResult.status === "fulfilled") {
        setSuggestions(suggestionsResult.value?.suggestions || "No suggestions available yet.");
      } else {
        console.error("Suggestions failed:", suggestionsResult.reason);
        setSuggestions("Failed to generate budget suggestions. Make sure you have active spending data.");
      }

    } catch (error) {
      // Emergency unexpected layout fallback
      alert("An unexpected error occurred while fetching insights: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <div>
      <h1>AI Insights</h1>

      <p className="page-subtitle">
        AI-generated financial analysis based on your real transaction data.
      </p>

      {/* Logic Fix: Show a clean loading indicator while waiting for the LLM tokens to stream back */}
      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
          🤖 FinTrack AI is analyzing your transactions... Please wait...
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default Insights;