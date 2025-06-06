import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase-conifg";

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

// Convert Firebase User to our User interface
const convertFirebaseUser = async (
  firebaseUser: FirebaseUser
): Promise<User> => {
  // Get additional user data from Firestore
  const userDocRef = doc(db, "users", firebaseUser.uid);
  const userDoc = await getDoc(userDocRef);
  const userData = userDoc.exists() ? userDoc.data() : {};

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || userData.name || undefined,
    photoURL: firebaseUser.photoURL || userData.photoURL || undefined,
    provider: firebaseUser.providerData[0]?.providerId || "email",
    emailVerified: firebaseUser.emailVerified,
    watchlist: userData.watchlist || [],
    preferences: userData.preferences || {
      notifications: true,
      theme: "dark",
    },
    createdAt:
      userData.createdAt?.toDate() ||
      new Date(firebaseUser.metadata.creationTime || Date.now()),
  };
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
        } catch (error) {
          console.error("Error loading user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Email/password login
  const login = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated automatically via onAuthStateChanged
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  };

  // Email/password registration
  const register = async (
    email: string,
    password: string,
    name?: string
  ): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update the user's display name if provided
      if (name && userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      }

      // Create user document in Firestore
      if (userCredential.user) {
        const userDocRef = doc(db, "users", userCredential.user.uid);
        await setDoc(userDocRef, {
          name: name || "",
          email: userCredential.user.email,
          watchlist: [],
          preferences: {
            notifications: true,
            theme: "dark",
          },
          createdAt: new Date(),
        });

        // Send verification email
        await sendEmailVerification(userCredential.user);
      }
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  };

  // Google OAuth login
  const loginWithGoogle = async (): Promise<void> => {
    try {
      const provider = new GoogleAuthProvider();
      // Optional: Add additional scopes
      provider.addScope("profile");
      provider.addScope("email");

      await signInWithPopup(auth, provider);
      // User state will be updated automatically via onAuthStateChanged
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Google login was cancelled");
      }
      throw new Error(error.message || "Google login failed");
    }
  };

  // Twitter OAuth login
  const loginWithTwitter = async (): Promise<void> => {
    try {
      const provider = new TwitterAuthProvider();
      await signInWithPopup(auth, provider);
      // User state will be updated automatically via onAuthStateChanged
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        throw new Error("Twitter login was cancelled");
      }
      throw new Error(error.message || "Twitter login failed");
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message || "Password reset failed");
    }
  };

  // Logout
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // User state will be updated automatically via onAuthStateChanged
    } catch (error: any) {
      throw new Error(error.message || "Logout failed");
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>): Promise<void> => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in");
      }

      const updates: any = {};

      if (data.name !== undefined) {
        updates.displayName = data.name;
      }

      if (data.photoURL !== undefined) {
        updates.photoURL = data.photoURL;
      }

      // Update Firebase profile
      if (Object.keys(updates).length > 0) {
        await updateProfile(auth.currentUser, updates);
      }

      // Update email separately if provided
      if (data.email && data.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, data.email);
      }

      // Update Firestore document with additional data
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const firestoreUpdates: any = {};

      if (data.name !== undefined) firestoreUpdates.name = data.name;
      if (data.watchlist !== undefined)
        firestoreUpdates.watchlist = data.watchlist;
      if (data.preferences !== undefined)
        firestoreUpdates.preferences = data.preferences;

      if (Object.keys(firestoreUpdates).length > 0) {
        await updateDoc(userDocRef, firestoreUpdates);
      }

      // Update local state
      if (user) {
        setUser({ ...user, ...data });
      }
    } catch (error: any) {
      throw new Error(error.message || "Profile update failed");
    }
  };

  // Send verification email
  const sendVerificationEmail = async (): Promise<void> => {
    try {
      if (!auth.currentUser) {
        throw new Error("No user is currently signed in");
      }
      await sendEmailVerification(auth.currentUser);
    } catch (error: any) {
      throw new Error(error.message || "Failed to send verification email");
    }
  };

  // Resend verification email (same as send)
  const resendVerificationEmail = async (): Promise<void> => {
    await sendVerificationEmail();
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
