import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

// ✅ ONLY ONE PLACE FOR TOKEN
api.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Expenses
export const getExpenses = () => api.get("/expenses");
export const createExpense = (data) => api.post("/expenses", data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Auth
export const signupUser = (email, password) =>
  api.post("/auth/signup", { email, password });

export const loginUser = (email, password) =>
  api.post(
    "/auth/login",
    new URLSearchParams({ username: email, password })
  );
export const getBudget = () => api.get("/budget");
export const setBudget = (budget) => api.post("/budget", { budget });

