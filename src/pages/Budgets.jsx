import { useEffect, useState } from "react";
import BudgetProgress from "../components/BudgetProgress";
import { getBudgetAnalytics, saveBudget } from "../api/api";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBudgets, setEditedBudgets] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadBudgets = async () => {
    try {
      const data = await getBudgetAnalytics();
      console.log("Raw Budget Analytics Data from Backend:", data);

      const formatted = (data || []).map((item, idx) => {
        const budgetLimit = item.limit !== undefined 
          ? item.limit 
          : (item.monthly_limit !== undefined ? item.monthly_limit : 0);

        return {
          // Logic Fix: Inject a unique, unchanging key ID for React to track safely
          id: `db-${item.category || idx}`,
          category: item.category || "Uncategorized",
          spent: Number(item.spent || 0),
          limit: Number(budgetLimit),
        };
      });

      setBudgets(formatted);
      setEditedBudgets(JSON.parse(JSON.stringify(formatted)));
    } catch (error) {
      alert("Failed to load budgets: " + error.message);
    }
  };

  useEffect(() => {
    loadBudgets();
  }, []);

  const handleEditClick = () => {
    setEditedBudgets(JSON.parse(JSON.stringify(budgets)));
    setIsEditing(true);
  };

  const handleChange = (index, field, value) => {
    const updated = editedBudgets.map((budget, i) => {
      if (i !== index) return budget;
      
      if (field === "limit") {
        let numValue = value === "" ? 0 : parseFloat(value);
        if (isNaN(numValue) || numValue < 0) numValue = 0;
        return { ...budget, limit: numValue };
      }
      
      return { ...budget, [field]: value };
    });

    setEditedBudgets(updated);
  };

  const handleSave = async () => {
    const hasInvalidCategory = editedBudgets.some(b => !b.category || b.category.trim() === "");
    if (hasInvalidCategory) {
      alert("Please specify a name for all budget categories.");
      return;
    }

    setSaving(true);
    try {
      const savePromises = editedBudgets.map((budget) =>
        saveBudget(budget.category.trim(), budget.limit)
      );

      await Promise.all(savePromises);
      setIsEditing(false);
      await loadBudgets();
    } catch (error) {
      alert("Failed to save some limits: " + error.message);
    } finally {
      setSaving(false);
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

        {!isEditing && budgets.length > 0 && (
          <button className="edit-button" onClick={handleEditClick}>
            Edit limits
          </button>
        )}
      </div>

      {budgets.length === 0 && !isEditing && (
        <div className="table-card" style={{ marginTop: "24px", padding: "32px", textAlign: "center" }}>
          <p className="page-subtitle" style={{ marginBottom: "16px" }}>
            No active budget limits configured yet. Add categorized transactions first, or click below to build one manually.
          </p>
          <button 
            className="primary-button" 
            onClick={() => {
              // Logic Fix: Assign a random unique runtime ID string so typing doesn't shift the key
              setEditedBudgets([{ id: `new-${Date.now()}`, category: "", spent: 0, limit: 0 }]);
              setIsEditing(true);
            }}
          >
            + Create a Budget Limit
          </button>
        </div>
      )}

      <div className="budget-grid">
        {(isEditing ? editedBudgets : budgets).map((budget, index) => (
          // Logic Fix: key now targets budget.id, which NEVER updates during keystrokes!
          <div key={budget.id || index} className="budget-edit-card">
            
            {isEditing && budget.spent === 0 ? (
              <div className="form-group" style={{ marginBottom: "12px" }}>
                <label>Category Name</label>
                <input
                  type="text"
                  value={budget.category}
                  placeholder="e.g. Groceries, Utilities, Rent"
                  disabled={saving}
                  onChange={(e) => handleChange(index, "category", e.target.value)}
                />
              </div>
            ) : (
              <BudgetProgress
                category={budget.category}
                spent={budget.spent}
                limit={budget.limit || 0}
              />
            )}

            {isEditing && (
              <div className="budget-limit-editor" style={{ marginTop: "12px" }}>
                <label>New monthly limit</label>
                <div className="budget-input-wrapper">
                  <span>€</span>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    disabled={saving}
                    value={budget.limit === 0 ? "" : budget.limit}
                    placeholder="0"
                    onChange={(e) => handleChange(index, "limit", e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="edit-actions" style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          {budgets.length === 0 && (
            <button 
              className="secondary-button" 
              style={{ marginRight: "auto" }}
              disabled={saving}
              onClick={() => setEditedBudgets([...editedBudgets, { id: `new-${Date.now()}-${Math.random()}`, category: "", spent: 0, limit: 0 }])}
            >
              + Add Another Category
            </button>
          )}

          <button className="secondary-button" disabled={saving} onClick={handleCancel}>
            Cancel
          </button>

          <button className="primary-button" disabled={saving} onClick={handleSave}>
            {saving ? "Saving changes..." : "Save changes"}
          </button>
        </div>
      )}
    </div>
  );
}

export default Budgets;