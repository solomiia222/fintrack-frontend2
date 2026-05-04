function BudgetProgress({ category, spent, limit }) {
  const percentage = Math.min((spent / limit) * 100, 100);
  const isOverBudget = spent > limit;

  return (
    <div className="budget-card">
      <div className="budget-top">
        <h3>{category}</h3>
        <p>
          €{spent} / €{limit}
        </p>
      </div>

      <div className="progress-bg">
        <div
          className={isOverBudget ? "progress-fill danger" : "progress-fill"}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {isOverBudget && (
        <p className="warning-text">Budget exceeded</p>
      )}
    </div>
  );
}

export default BudgetProgress;