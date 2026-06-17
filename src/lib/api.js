import axios from "axios";

// ==========================================
// 🔥 RAILWAY BACKEND URL (HARDCODED)
// ==========================================
const API_URL = "https://mb-grocery-production.up.railway.app";
const API_BASE = `${API_URL}/api`;

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 60000,
});

// ==========================================
// Request Interceptor - Auth Token
// ==========================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`🌐 API Call: ${config.method.toUpperCase()} ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor - Error Handling
// ==========================================
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("❌ API Error:", error?.response?.data || error.message);
    if (error.code === "ERR_NETWORK") {
      console.error("🔴 Network Error - Backend is not reachable!");
    }
    return Promise.reject(error);
  }
);

// ==========================================
// Helper Functions
// ==========================================
export const formatApiError = (err) => {
  const d = err?.response?.data?.detail;
  if (!d) return err?.message || "Something went wrong";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((e) => e?.msg || JSON.stringify(e)).join(", ");
  return JSON.stringify(d);
};

export const formatPrice = (n) => `₹${Number(n).toFixed(0)}`;

// ==========================================
// API FUNCTIONS
// ==========================================

// Products
export const getProducts = async (limit = 20) => {
  const response = await api.get(`/products?limit=${limit}`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getProductsByCategory = async (category) => {
  const response = await api.get(`/products?category=${category}`);
  return response.data;
};

// Categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

// Cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await api.post("/cart", { productId, quantity });
  return response.data;
};

export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

export const updateCartItem = async (productId, quantity) => {
  const response = await api.put(`/cart/${productId}`, { quantity });
  return response.data;
};

export const removeFromCart = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

// Orders
export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

// Auth
export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  if (response.data.token) {
    localStorage.setItem("auth_token", response.data.token);
  }
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  window.location.href = "/";
};

export default api;
