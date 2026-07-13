import { createContext, useContext, useState, useCallback } from 'react';

const WishlistContext = createContext();

function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.id || user?._id || 'guest';
  } catch {
    return 'guest';
  }
}

function getStorageKey() {
  return `wishlist_${getCurrentUserId()}`;
}

function loadIds() {
  try {
    const raw = localStorage.getItem(getStorageKey());
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState(loadIds);

  // Call this right after login/signup/logout so the badge and list
  // switch to whichever account is now active, instead of a stale one.
  const refresh = useCallback(() => {
    setIds(loadIds());
  }, []);

  const toggle = (id) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem(getStorageKey(), JSON.stringify(next));
      return next;
    });
  };

  const remove = (id) => {
    setIds((prev) => {
      const next = prev.filter((x) => x !== id);
      localStorage.setItem(getStorageKey(), JSON.stringify(next));
      return next;
    });
  };

  // Clears the CURRENTLY ACTIVE user's wishlist (used by the "Clear All"
  // button on the Wishlist page) — not meant to run automatically on logout.
  const clear = () => {
    localStorage.removeItem(getStorageKey());
    setIds([]);
  };

  const isWished = (id) => ids.includes(id);

  return (
    <WishlistContext.Provider
      value={{ ids, count: ids.length, toggle, remove, clear, isWished, refresh }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}