import { useEffect, useState } from "react";
import InsightCard from "../components/InsightCard";
import ChatBox from "../components/ChatBox";
import { getAiReport, getBudgetSuggestions } from "../api/api";

function Insights() {
  const [report, setReport] = useState("");
  const [suggestions, setSuggestions] = useState("");

  const [reportLoading, setReportLoading] = useState(true);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);

  useEffect(() => {
    const loadReport = async () => {
      setReportLoading(true);
      try {
        const data = await getAiReport();
        setReport(data.report || "No report available yet.");
      } catch (e) {
        setReport("Failed to load report");
      } finally {
        setReportLoading(false);
      }
    };

    const loadSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const data = await getBudgetSuggestions();
        setSuggestions(
          data.suggestions || "No suggestions available yet."
        );
      } catch (e) {
        setSuggestions("Failed to load suggestions");
      } finally {
        setSuggestionsLoading(false);
      }
    };

    loadReport();
    loadSuggestions();
  }, []);

  return (
    <div>
      <h1>AI Insights</h1>

      <p className="page-subtitle">
        AI-generated financial analysis based on your real transaction data.
      </p>

      <div className="insights-grid">
        <InsightCard
          title="Monthly Financial Report"
          text={reportLoading ? "Loading..." : report}
          type="normal"
        />

        <InsightCard
          title="Budget Suggestions"
          text={suggestionsLoading ? "Loading..." : suggestions}
          type="warning"
        />
      </div>
    </div>
  );
}

export default Insights;