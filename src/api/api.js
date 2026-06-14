const API_URL = "http://localhost:8000";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function registerUser(formData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      first_name: formData.name,
      last_name: formData.surname,
      phone_number: formData.phone,
      email: formData.email,
      password: formData.password,
    }),
  });

  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}

export async function loginUser(loginData) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginData),
  });

  if (!response.ok) throw new Error("Wrong email or password");
  return response.json();
}

export async function getTransactions() {
  const response = await fetch(`${API_URL}/transactions?limit=100`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to load transactions");
  return response.json();
}

export async function createTransaction(transaction) {
  const response = await fetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(transaction),
  });

  if (!response.ok) throw new Error("Failed to create transaction");
  return response.json();
}

export async function getBudgetAnalytics() {
  const response = await fetch(`${API_URL}/analytics/budgets`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to load budgets");
  return response.json();
}

export async function saveBudget(category, monthlyLimit) {
  const response = await fetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      category,
      monthly_limit: Number(monthlyLimit),
    }),
  });

  if (!response.ok) throw new Error("Failed to save budget");
  return response.json();
}

export async function getPrediction() {
  const response = await fetch(`${API_URL}/predict/spending`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to load prediction");
  return response.json();
}

export async function getMonthlyAnalytics() {
  const response = await fetch(`${API_URL}/analytics/monthly`, {
    headers: authHeaders(),
  });

  if (!response.ok) throw new Error("Failed to load monthly analytics");

  return response.json();
}

export async function getAnalytics() {
  const response = await fetch(`${API_URL}/analytics/categories`, {
    headers: authHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to load category analytics");
  }

  return response.json();
}