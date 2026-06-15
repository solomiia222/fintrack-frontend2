import ReactMarkdown from "react-markdown";

function InsightCard({ title, text, type }) {
  return (
    <div className={type === "warning" ? "insight-card warning" : "insight-card"}>
      <h3>{title}</h3>

      <div className="insight-text">
        <ReactMarkdown>{text}</ReactMarkdown>
      </div>
    </div>
  );
}

export default InsightCard;