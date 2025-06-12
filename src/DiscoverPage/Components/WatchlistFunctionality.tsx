import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "../../ProfilePage/Components/BackendAuthContext"; // Fixed import path

// Types
export interface WatchlistItem {
  id: string;
  type: "crypto" | "user";
  itemId: string; // coin symbol or username
  addedAt: string;
}

export interface WatchlistContextType {
  // Crypto watchlist
  cryptoWatchlist: Set<string>;
  isCryptoWatchlistView: boolean;
  addCryptoToWatchlist: (symbol: string) => Promise<void>;
  removeCryptoFromWatchlist: (symbol: string) => Promise<void>;
  toggleCryptoWatchlist: (symbol: string) => Promise<void>;
  toggleCryptoWatchlistView: () => void;
  isInCryptoWatchlist: (symbol: string) => boolean;

  // User/Trader watchlist
  userWatchlist: Set<string>;
  isUserWatchlistView: boolean;
  addUserToWatchlist: (username: string) => Promise<void>;
  removeUserFromWatchlist: (username: string) => Promise<void>;
  toggleUserWatchlist: (username: string) => Promise<void>;
  toggleUserWatchlistView: () => void;
  isInUserWatchlist: (username: string) => boolean;

  // General
  loading: boolean;
  error: string | null;
}

// Create Context
const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

// API Functions
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8001";

const watchlistAPI = {
  // Get user's watchlist
  getWatchlist: async (userId: string): Promise<WatchlistItem[]> => {
    const response = await fetch(`${API_BASE}/api/watchlist/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    if (!response.ok) throw new Error("Failed to fetch watchlist");
    return response.json();
  },

  // Add item to watchlist
  addItem: async (
    userId: string,
    type: "crypto" | "user",
    itemId: string
  ): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ userId, type, itemId }),
    });
    if (!response.ok) throw new Error("Failed to add to watchlist");
  },

  // Remove item from watchlist
  removeItem: async (
    userId: string,
    type: "crypto" | "user",
    itemId: string
  ): Promise<void> => {
    const response = await fetch(`${API_BASE}/api/watchlist`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify({ userId, type, itemId }),
    });
    if (!response.ok) throw new Error("Failed to remove from watchlist");
  },
};

// Provider Component
export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();

  // State
  const [cryptoWatchlist, setCryptoWatchlist] = useState<Set<string>>(
    new Set()
  );
  const [userWatchlist, setUserWatchlist] = useState<Set<string>>(new Set());
  const [isCryptoWatchlistView, setIsCryptoWatchlistView] = useState(false);
  const [isUserWatchlistView, setIsUserWatchlistView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load user's watchlist when they log in
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserWatchlist();
    } else {
      // Clear watchlist when user logs out
      setCryptoWatchlist(new Set());
      setUserWatchlist(new Set());
      setIsCryptoWatchlistView(false);
      setIsUserWatchlistView(false);
    }
  }, [isAuthenticated, user]);

  const loadUserWatchlist = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const items = await watchlistAPI.getWatchlist(user.id);

      const cryptoItems = new Set(
        items
          .filter((item) => item.type === "crypto")
          .map((item) => item.itemId)
      );
      const userItems = new Set(
        items.filter((item) => item.type === "user").map((item) => item.itemId)
      );

      setCryptoWatchlist(cryptoItems);
      setUserWatchlist(userItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load watchlist");
      console.error("Error loading watchlist:", err);
    } finally {
      setLoading(false);
    }
  };

  // Crypto Watchlist Functions
  const addCryptoToWatchlist = async (symbol: string) => {
    if (!user) return;

    try {
      await watchlistAPI.addItem(user.id, "crypto", symbol);
      setCryptoWatchlist((prev) => {
        const newSet = new Set(prev);
        newSet.add(symbol);
        return newSet;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add crypto");
    }
  };

  const removeCryptoFromWatchlist = async (symbol: string) => {
    if (!user) return;

    try {
      await watchlistAPI.removeItem(user.id, "crypto", symbol);
      setCryptoWatchlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(symbol);
        if (newSet.size === 0 && isCryptoWatchlistView) {
          setIsCryptoWatchlistView(false);
        }
        return newSet;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove crypto");
    }
  };

  const toggleCryptoWatchlist = async (symbol: string) => {
    if (cryptoWatchlist.has(symbol)) {
      await removeCryptoFromWatchlist(symbol);
    } else {
      await addCryptoToWatchlist(symbol);
    }
  };

  const toggleCryptoWatchlistView = () => {
    if (cryptoWatchlist.size > 0) {
      setIsCryptoWatchlistView((prev) => !prev);
    }
  };

  const isInCryptoWatchlist = (symbol: string) => cryptoWatchlist.has(symbol);

  // User Watchlist Functions
  const addUserToWatchlist = async (username: string) => {
    if (!user) return;

    try {
      await watchlistAPI.addItem(user.id, "user", username);
      setUserWatchlist((prev) => {
        const newSet = new Set(prev);
        newSet.add(username);
        return newSet;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add user");
    }
  };

  const removeUserFromWatchlist = async (username: string) => {
    if (!user) return;

    try {
      await watchlistAPI.removeItem(user.id, "user", username);
      setUserWatchlist((prev) => {
        const newSet = new Set(prev);
        newSet.delete(username);
        if (newSet.size === 0 && isUserWatchlistView) {
          setIsUserWatchlistView(false);
        }
        return newSet;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove user");
    }
  };

  const toggleUserWatchlist = async (username: string) => {
    if (userWatchlist.has(username)) {
      await removeUserFromWatchlist(username);
    } else {
      await addUserToWatchlist(username);
    }
  };

  const toggleUserWatchlistView = () => {
    if (userWatchlist.size > 0) {
      setIsUserWatchlistView((prev) => !prev);
    }
  };

  const isInUserWatchlist = (username: string) => userWatchlist.has(username);

  const value: WatchlistContextType = {
    // Crypto watchlist
    cryptoWatchlist,
    isCryptoWatchlistView,
    addCryptoToWatchlist,
    removeCryptoFromWatchlist,
    toggleCryptoWatchlist,
    toggleCryptoWatchlistView,
    isInCryptoWatchlist,

    // User watchlist
    userWatchlist,
    isUserWatchlistView,
    addUserToWatchlist,
    removeUserFromWatchlist,
    toggleUserWatchlist,
    toggleUserWatchlistView,
    isInUserWatchlist,

    // General
    loading,
    error,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};

// Custom Hook
export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error("useWatchlist must be used within a WatchlistProvider");
  }
  return context;
};

// Utility functions
export const filterCryptosByWatchlist = <T extends { symbol: string }>(
  cryptos: T[],
  isWatchlistView: boolean,
  watchlist: Set<string>
): T[] => {
  if (isWatchlistView) {
    return cryptos.filter((crypto) => watchlist.has(crypto.symbol));
  }
  return cryptos;
};

export const filterUsersByWatchlist = <T extends { username: string }>(
  users: T[],
  isWatchlistView: boolean,
  watchlist: Set<string>
): T[] => {
  if (isWatchlistView) {
    return users.filter((user) => watchlist.has(user.username));
  }
  return users;
};
