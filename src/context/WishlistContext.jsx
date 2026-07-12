import { createContext, useContext, useEffect, useState } from 'react';

// Shared, persisted wishlist. Holds the ids of liked flowers so the heart
// buttons on the Dashboard / Shop / Details pages and the Wishlist page all
// stay in sync, and survive refreshes via localStorage.

const WishlistContext = createContext(null);
const STORAGE_KEY = 'wishlist';

function readStored() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(readStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  const isWished = (id) => ids.includes(id);

  const toggle = (id) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const remove = (id) => setIds((prev) => prev.filter((x) => x !== id));

  const clear = () => setIds([]);

  return (
    <WishlistContext.Provider
      value={{ ids, count: ids.length, isWished, toggle, remove, clear }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
