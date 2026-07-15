import { createContext, useContext, useState, useCallback } from 'react';

// Per-user shopping cart, persisted to localStorage (same pattern as
// WishlistContext). Each entry is a line item — for the bouquet builder that's
// a single "custom-bouquet" object carrying its stems, message, delivery and
// totals — but the shape is generic enough for regular products too.

const CartContext = createContext();

function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id || user?._id || 'guest';
  } catch {
    return 'guest';
  }
}

function getStorageKey() {
  return `cart_${getCurrentUserId()}`;
}

function loadItems() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadItems);

  const persist = (next) => {
    localStorage.setItem(getStorageKey(), JSON.stringify(next));
    return next;
  };

  // Switch the cart to whichever account is active (call after login/logout).
  const refresh = useCallback(() => {
    setItems(loadItems());
  }, []);

  const addItem = (item) => {
    setItems((prev) =>
      persist([
        ...prev,
        { qty: 1, ...item, cartId: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
      ])
    );
  };

  const removeItem = (cartId) => {
    setItems((prev) => persist(prev.filter((i) => i.cartId !== cartId)));
  };

  // Change a line item's quantity (never below 1).
  const updateQty = (cartId, qty) => {
    setItems((prev) =>
      persist(prev.map((i) => (i.cartId === cartId ? { ...i, qty: Math.max(1, qty) } : i)))
    );
  };

  const clear = () => {
    localStorage.removeItem(getStorageKey());
    setItems([]);
  };

  const count = items.length;
  const total = items.reduce((sum, i) => sum + (i.total || 0) * (i.qty || 1), 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clear, refresh, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
