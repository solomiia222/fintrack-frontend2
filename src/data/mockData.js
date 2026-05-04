export const transactions = [
  { id: 1, date: "2026-04-01", description: "REWE", category: "Groceries", amount: 34.5 },
  { id: 2, date: "2026-04-03", description: "Netflix", category: "Entertainment", amount: 12.99 },
  { id: 3, date: "2026-04-05", description: "Rent", category: "Housing", amount: 700 },
  { id: 4, date: "2026-04-07", description: "HVV Ticket", category: "Transport", amount: 58 },
  { id: 5, date: "2026-04-10", description: "Edeka", category: "Groceries", amount: 46.8 },
  { id: 6, date: "2026-04-12", description: "Cinema", category: "Entertainment", amount: 18 },
];

export const budgets = [
  { category: "Groceries", limit: 300, spent: 220 },
  { category: "Housing", limit: 700, spent: 700 },
  { category: "Entertainment", limit: 100, spent: 130 },
  { category: "Transport", limit: 80, spent: 58 },
];

export const predictions = [
  {
    title: "Food overspending risk",
    text: "You may overspend in Groceries by €120 this month.",
    type: "warning",
  },
  {
    title: "Recurring payment detected",
    text: "Netflix €12.99 appears every month.",
    type: "info",
  },
  {
    title: "Transport trend",
    text: "Your transport costs are 18% higher than last month.",
    type: "info",
  },
];

export const monthlySpending = [
  { month: "Jan", spending: 980 },
  { month: "Feb", spending: 1120 },
  { month: "Mar", spending: 1050 },
  { month: "Apr", spending: 1270 },
];