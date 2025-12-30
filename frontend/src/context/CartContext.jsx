import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "lf_cart_v1";

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.warn("Failed to persist cart", err);
    }
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((c) => {
      const exists = c.find((it) => it.id === product.id);
      if (exists)
        return c.map((it) =>
          it.id === product.id ? { ...it, qty: (it.qty || 1) + qty } : it
        );
      return [
        ...c,
        {
          id: product.id,
          title: product.title,
          price: product.salePrice ?? product.price,
          qty,
        },
      ];
    });
  };

  const removeFromCart = (id) => setCart((c) => c.filter((it) => it.id !== id));
  const updateQty = (id, qty) =>
    setCart((c) => c.map((it) => (it.id === id ? { ...it, qty } : it)));
  const clearCart = () => setCart([]);

  const total = cart.reduce((s, it) => s + (it.price ?? 0) * (it.qty ?? 1), 0);

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

export default CartContext;
