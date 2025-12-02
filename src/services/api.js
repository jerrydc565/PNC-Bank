const API_BASE_URL = "https://pnc-bank-backend-2.onrender.com/api";

// Get userId from localStorage (you'll need to store this during login)
const getUserId = () => {
  return localStorage.getItem("userId");
};

export const transactionAPI = {
  // Create a new transaction
  createTransaction: async (type, amount, description) => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in");

    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: parseInt(userId),
        transactionType: type,
        amount: parseFloat(amount),
        description,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Transaction failed");
    }

    return response.json();
  },

  // Get all transactions for current user
  getTransactions: async () => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in");

    const response = await fetch(`${API_BASE_URL}/transactions/${userId}`);

    // If backend returns 500, return empty array to prevent crash
    if (!response.ok) {
      console.error("Backend error fetching transactions:", response.status);
      return [];
    }

    try {
      const data = await response.json();
      // Backend currently returns single object instead of array
      // Handle both cases for compatibility
      if (Array.isArray(data)) {
        return data;
      } else if (data && typeof data === "object") {
        // If it's a single transaction object, wrap it in array
        return [data];
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error parsing transactions:", error);
      return [];
    }
  },

  // Get user balance
  getBalance: async () => {
    const userId = getUserId();
    if (!userId) throw new Error("User not logged in");

    const response = await fetch(`${API_BASE_URL}/user/${userId}/balance`);
    if (!response.ok) throw new Error("Failed to fetch balance");

    const data = await response.json();
    return data.balance;
  },
};

export const userAPI = {
  // Get user profile by email
  getUserProfile: async (email) => {
    const response = await fetch(`${API_BASE_URL}/user/${email}`);
    if (!response.ok) throw new Error("Failed to fetch user profile");
    return response.json();
  },
};
