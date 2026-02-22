import axios from "axios";

/* =====================================================
   AXIOS INSTANCE
===================================================== */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // prevents infinite loading
});

/* =====================================================
   GLOBAL RESPONSE INTERCEPTOR
===================================================== */
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("❌ Backend not reachable. Is server running?");
      throw new Error("Unable to connect to server");
    }

    // Optional: Handle 401 globally
    if (error.response.status === 401) {
      console.warn("⚠️ Unauthorized. Invalid token or credentials.");
    }

    throw new Error(error.response.data?.message || error.message);
  }
);

/* =====================================================
   AUTH FUNCTIONS
===================================================== */

// 🔐 LOGIN
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data; // contains { token, user }
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    throw error;
  }
};

// 📝 REGISTER
export const registerUser = async (username, email, password) => {
  try {
    const response = await API.post("/auth/register", { username, email, password });
    return response.data; // contains { message } or user info
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    throw error;
  }
};

// 👤 GET CURRENT USER
export const getCurrentUser = async (token) => {
  try {
    const response = await API.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // user object
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    throw error;
  }
};
