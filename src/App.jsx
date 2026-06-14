import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import ProductDetail from "./pages/ProductDetail";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import { OrdersList, OrderDetail } from "./pages/Orders";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import {
  AdminLayout,
  AdminDashboard,
  AdminProducts,
  AdminCategories,
  AdminOrders,
  AdminUsers,
} from "./pages/admin/Admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      <CartDrawer />
      <Footer />
    </>
  );
}

function AppRouter() {
  if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }

  return (
    <Routes>
      <Route path="/login" element={<Shell><Login /></Shell>} />
      <Route path="/register" element={<Shell><Register /></Shell>} />
      <Route path="/" element={<Shell><Home /></Shell>} />
      <Route path="/category/:slug" element={<Shell><CategoryPage /></Shell>} />
      <Route path="/product/:id" element={<Shell><ProductDetail /></Shell>} />
      <Route path="/search" element={<Shell><SearchPage /></Shell>} />
      <Route path="/cart" element={<Shell><CartPage /></Shell>} />
      <Route path="/wishlist" element={<Shell><ProtectedRoute><Wishlist /></ProtectedRoute></Shell>} />
      <Route path="/checkout" element={<Shell><ProtectedRoute><Checkout /></ProtectedRoute></Shell>} />
      <Route path="/order-success" element={<Shell><ProtectedRoute><OrderSuccess /></ProtectedRoute></Shell>} />
      <Route path="/orders" element={<Shell><ProtectedRoute><OrdersList /></ProtectedRoute></Shell>} />
      <Route path="/orders/:id" element={<Shell><ProtectedRoute><OrderDetail /></ProtectedRoute></Shell>} />
      <Route path="/profile" element={<Shell><ProtectedRoute><Profile /></ProtectedRoute></Shell>} />

      <Route path="/admin" element={<Shell><ProtectedRoute admin><AdminLayout /></ProtectedRoute></Shell>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <CartProvider>
              <AppRouter />
            </CartProvider>
          </AuthProvider>
        </QueryClientProvider>
      </BrowserRouter>
      <Toaster position="top-center" richColors />
    </div>
  );
}