function InsightCard({ title, text, type }) {
  return (
    <div className={type === "warning" ? "insight-card warning" : "insight-card"}>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default InsightCard;