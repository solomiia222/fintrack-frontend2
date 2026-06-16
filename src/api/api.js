const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://fintrack-frontend2.onrender.com";

function getToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function readResponse(response, fallbackMessage) {
  let data = {};

  try {
    data = await response.json();
  } catch {
    // Backend did not return JSON
  }

  if (!response.ok) {
    let errorMessage = fallbackMessage;

    if (typeof data.detail === "string") {
      errorMessage = data.detail;
    } else if (Array.isArray(data.detail)) {
      errorMessage = data.detail
        .map((error) => error.msg || "Invalid data")
        .join(", ");
    } else if (typeof data.message === "string") {
      errorMessage = data.message;
    }

    throw new Error(errorMessage);
  }

  return data;
}

async function apiFetch(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";

    throw new Error("Session expired");
  }

  return response;
}

export async function registerUser(formData) {
  const response = await apiFetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: formData.first_name,
      last_name: formData.last_name,
      phone_number: formData.phone_number,
      email: formData.email,
      password: formData.password,
    }),
  });

  return readResponse(response, "Registration failed");
}

export async function loginUser(loginData) {
  const response = await apiFetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  return readResponse(response, "Wrong email or password");
}

export async function getTransactions() {
  const response = await apiFetch(`${API_URL}/transactions?limit=100`, {
    headers: authHeaders(),
  });

  return readResponse(response, "Failed to load transactions");
}

export async function createTransaction(transaction) {
  const response = await apiFetch(`${API_URL}/transactions`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(transaction),
  });

  return readResponse(response, "Failed to create transaction");
}

export async function updateTransaction(transactionId, transaction) {
  const response = await apiFetch(
    `${API_URL}/transactions/${transactionId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(transaction),
    }
  );

  return readResponse(response, "Failed to update transaction");
}

export async function deleteTransaction(transactionId) {
  const response = await apiFetch(
    `${API_URL}/transactions/${transactionId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );

  return readResponse(response, "Failed to delete transaction");
}

export async function getBudgetAnalytics() {
  const response = await apiFetch(`${API_URL}/analytics/budgets`, {
    headers: authHeaders(),
  });

  return readResponse(response, "Failed to load budgets");
}

export async function saveBudget(category, monthlyLimit) {
  const response = await apiFetch(`${API_URL}/budgets`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      category,
      monthly_limit: Number(monthlyLimit),
    }),
  });

  return readResponse(response, "Failed to save budget");
}

export async function getPrediction() {
  const response = await apiFetch(`${API_URL}/predict/spending`, {
    headers: authHeaders(),
  });

  return readResponse(response, "Failed to load prediction");
}

export async function getMonthlyAnalytics() {
  const response = await apiFetch(`${API_URL}/analytics/monthly`, {
    headers: authHeaders(),
  });

  return readResponse(response, "Failed to load monthly analytics");
}

export async function getAnalytics() {
  const response = await apiFetch(`${API_URL}/analytics/categories`, {
    headers: authHeaders(),
  });

  return readResponse(response, "Failed to load category analytics");
}

export async function getAiReport() {
  const response = await apiFetch(`${API_URL}/ai/report`, {
    headers: authHeaders(),
  });

  return readResponse(response, "Failed to load AI report");
}

export async function getBudgetSuggestions() {
  const response = await apiFetch(`${API_URL}/ai/budget-suggestions`, {
    headers: authHeaders(),
  });

  return readResponse(response, "Failed to load budget suggestions");
}

export const sendChatMessage = async (message) => {
  const res = await apiFetch(`${API_URL}/ai/coach`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      message: message
    })
  });

  return readResponse(res, "Chat failed");
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await apiFetch(`${API_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  if (!res.ok) throw new Error("Request failed");

  return res.json();
};