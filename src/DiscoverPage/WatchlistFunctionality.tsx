import { createContext, useContext, useState, ReactNode } from "react";

// Types
export interface WatchlistContextType {
  watchlist: Set<string>;
  isWatchlistView: boolean;
  addToWatchlist: (username: string) => void;
  removeFromWatchlist: (username: string) => void;
  toggleWatchlist: (username: string) => void;
  toggleWatchlistView: () => void;
  isInWatchlist: (username: string) => boolean;
  hasWatchlistItems: () => boolean;
}

// Create Context
const WatchlistContext = createContext<WatchlistContextType | undefined>(
  undefined
);

// Provider Component
export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<Set<string>>(new Set());
  const [isWatchlistView, setIsWatchlistView] = useState(false);

  const addToWatchlist = (username: string) => {
    setWatchlist((prev) => new Set([...Array.from(prev), username]));
  };

  const removeFromWatchlist = (username: string) => {
    setWatchlist((prev) => {
      const newSet = new Set(prev);
      newSet.delete(username);
      // If we remove the last item and we're in watchlist view, go back to normal view
      if (newSet.size === 0 && isWatchlistView) {
        setIsWatchlistView(false);
      }
      return newSet;
    });
  };

  const toggleWatchlist = (username: string) => {
    if (watchlist.has(username)) {
      removeFromWatchlist(username);
    } else {
      addToWatchlist(username);
    }
  };

  const toggleWatchlistView = () => {
    // Only toggle if there are items in the watchlist
    if (watchlist.size > 0) {
      setIsWatchlistView((prev) => !prev);
    }
    // If no items in watchlist, do nothing (as requested)
  };

  const isInWatchlist = (username: string) => {
    return watchlist.has(username);
  };

  const hasWatchlistItems = () => {
    return watchlist.size > 0;
  };

  const value: WatchlistContextType = {
    watchlist,
    isWatchlistView,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist,
    toggleWatchlistView,
    isInWatchlist,
    hasWatchlistItems,
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

// Utility function to filter rows based on watchlist view
export const filterRowsByWatchlist = <T extends { username: string }>(
  rows: T[],
  isWatchlistView: boolean,
  watchlist: Set<string>
): T[] => {
  if (isWatchlistView) {
    return rows.filter((row) => watchlist.has(row.username));
  }
  return rows;
};
