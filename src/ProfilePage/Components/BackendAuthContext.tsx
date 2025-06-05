import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  photoURL?: string;
  provider?: string;
  emailVerified?: boolean;
  watchlist?: string[];
  preferences?: {
    notifications: boolean;
    theme: "dark" | "light";
  };
  createdAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithTwitter: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  resendVerificationEmail: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Backend API configuration
const API_BASE_URL = "http://localhost:8000/api";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper function to make authenticated requests
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("authToken");

    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return response.json();
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (token) {
          // Verify token with backend
          const userData = await apiRequest("/auth/verify");
          setUser(userData.user);
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Email/password login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  // Email/password registration
  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<void> => {
    try {
      const response = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, name }),
      });

      localStorage.setItem("authToken", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  // Google OAuth login
  const loginWithGoogle = async (): Promise<void> => {
    try {
      // Get Google OAuth URL from backend
      const response = await apiRequest("/auth/google/url");
      const authUrl = response.url;

      // Open popup window for Google OAuth
      const popup = window.open(
        authUrl,
        "google-oauth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      // Listen for popup completion
      return new Promise((resolve, reject) => {
        const checkPopup = setInterval(() => {
          try {
            if (popup?.closed) {
              clearInterval(checkPopup);
              // Check if login was successful
              const token = localStorage.getItem("authToken");
              const userData = localStorage.getItem("user");

              if (token && userData) {
                setUser(JSON.parse(userData));
                resolve();
              } else {
                reject(new Error("Google login cancelled or failed"));
              }
            }
          } catch (error) {
            clearInterval(checkPopup);
            reject(error);
          }
        }, 1000);

        // Handle popup messages
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === "GOOGLE_AUTH_SUCCESS") {
            localStorage.setItem("authToken", event.data.token);
            localStorage.setItem("user", JSON.stringify(event.data.user));
            setUser(event.data.user);
            popup?.close();
            clearInterval(checkPopup);
            window.removeEventListener("message", handleMessage);
            resolve();
          } else if (event.data.type === "GOOGLE_AUTH_ERROR") {
            popup?.close();
            clearInterval(checkPopup);
            window.removeEventListener("message", handleMessage);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener("message", handleMessage);
      });
    } catch (error) {
      throw error;
    }
  };

  // Twitter OAuth login (similar to Google)
  const loginWithTwitter = async (): Promise<void> => {
    try {
      const response = await apiRequest("/auth/twitter/url");
      const authUrl = response.url;

      const popup = window.open(
        authUrl,
        "twitter-oauth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      return new Promise((resolve, reject) => {
        const checkPopup = setInterval(() => {
          try {
            if (popup?.closed) {
              clearInterval(checkPopup);
              const token = localStorage.getItem("authToken");
              const userData = localStorage.getItem("user");

              if (token && userData) {
                setUser(JSON.parse(userData));
                resolve();
              } else {
                reject(new Error("Twitter login cancelled or failed"));
              }
            }
          } catch (error) {
            clearInterval(checkPopup);
            reject(error);
          }
        }, 1000);

        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== window.location.origin) return;

          if (event.data.type === "TWITTER_AUTH_SUCCESS") {
            localStorage.setItem("authToken", event.data.token);
            localStorage.setItem("user", JSON.stringify(event.data.user));
            setUser(event.data.user);
            popup?.close();
            clearInterval(checkPopup);
            window.removeEventListener("message", handleMessage);
            resolve();
          } else if (event.data.type === "TWITTER_AUTH_ERROR") {
            popup?.close();
            clearInterval(checkPopup);
            window.removeEventListener("message", handleMessage);
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener("message", handleMessage);
      });
    } catch (error) {
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (error) {
      // Continue with logout even if backend request fails
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>): Promise<void> => {
    try {
      const response = await apiRequest("/auth/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      });

      const updatedUser = { ...user, ...response.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    try {
      await apiRequest("/auth/send-verification", { method: "POST" });
    } catch (error) {
      throw error;
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (): Promise<void> => {
    try {
      await apiRequest("/auth/resend-verification", { method: "POST" });
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    loginWithGoogle,
    loginWithTwitter,
    logout,
    updateUserProfile,
    sendVerificationEmail,
    resendVerificationEmail,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
