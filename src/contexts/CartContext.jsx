import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [open, setOpen] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      const { data } = await api.get("/cart");
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  }, [user]);

  const refreshWishlist = useCallback(async () => {
    if (!user) {
      setWishlist([]);
      return;
    }
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data.items || []);
    } catch {
      setWishlist([]);
    }
  }, [user]);

  useEffect(() => {
    refresh();
    refreshWishlist();
  }, [refresh, refreshWishlist]);

  const addToCart = async (product_id, quantity = 1) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    const { data } = await api.post("/cart", { product_id, quantity });
    setItems(data.items || []);
  };

  const removeFromCart = async (product_id) => {
    const { data } = await api.delete(`/cart/${product_id}`);
    setItems(data.items || []);
  };

  const clear = async () => {
    await api.delete("/cart");
    setItems([]);
  };

  const toggleWishlist = async (product_id) => {
    if (!user) {
      window.location.href = "/login";
      return;
    }
    await api.post(`/wishlist/${product_id}`);
    refreshWishlist();
  };

  const qtyOf = (pid) => items.find((i) => i.product_id === pid)?.quantity || 0;
  const wishlistIds = new Set(wishlist.map((w) => w.product_id));
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        wishlistIds,
        open,
        setOpen,
        refresh,
        addToCart,
        removeFromCart,
        clear,
        toggleWishlist,
        qtyOf,
        subtotal,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};