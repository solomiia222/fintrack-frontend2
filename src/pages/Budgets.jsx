import { useEffect, useState } from "react";
import BudgetProgress from "../components/BudgetProgress";
import { getBudgetAnalytics, saveBudget } from "../api/api";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudgets, setEditedBudgets] = useState([]);

  const loadBudgets = async () => {
    try {
      const data = await getBudgetAnalytics();

      const formatted = data.map((item) => ({
        category: item.category,
        spent: Number(item.spent),
        limit: Number(item.monthly_limit),
      }));

      setBudgets(formatted);
      setEditedBudgets(formatted);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleEditClick = () => {
    setEditedBudgets(budgets);
    setIsEditing(true);
  };

  const handleChange = (category, value) => {
    const cleanedValue = value.replace(/^0+(?=\d)/, "");

    const updated = editedBudgets.map((budget) =>
      budget.category === category
        ? { ...budget, limit: cleanedValue === "" ? "" : Number(cleanedValue) }
        : budget
    );

    setEditedBudgets(updated);
  };

  const handleSave = async () => {
    try {
      for (const budget of editedBudgets) {
        await saveBudget(budget.category, budget.limit);
      }

      setIsEditing(false);
      loadBudgets();
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCancel = () => {
    setEditedBudgets(budgets);
    setIsEditing(false);
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h1>Budgets</h1>
          <p className="page-subtitle">
            Track and adjust your monthly spending limits.
          </p>
        </div>

        {!isEditing && (
          <button className="edit-button" onClick={handleEditClick}>
            Edit limits
          </button>
        )}
      </div>

      {budgets.length === 0 && (
        <p className="page-subtitle">
          No budgets yet. Add transactions first, then create budgets.
        </p>
      )}

      <div className="budget-grid">
        {(isEditing ? editedBudgets : budgets).map((budget) => (
          <div key={budget.category} className="budget-edit-card">
            <BudgetProgress
              category={budget.category}
              spent={budget.spent}
              limit={budget.limit || 0}
            />

            {isEditing && (
              <div className="budget-limit-editor">
                <label>New monthly limit</label>

                <div className="budget-input-wrapper">
                  <span>€</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={budget.limit}
                    onChange={(e) =>
                      handleChange(budget.category, e.target.value)
                    }
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="edit-actions">
          <button className="secondary-button" onClick={handleCancel}>
            Cancel
          </button>

          <button className="primary-button" onClick={handleSave}>
            Save changes
          </button>
        </div>
      )}
    </div>
  );
}

export default Budgets;