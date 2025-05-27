import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, twitterProvider } from '../../firebase';

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
    theme: 'dark' | 'light';
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await loadUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load user profile from Firestore
  const loadUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: userData.name || firebaseUser.displayName,
          photoURL: userData.photoURL || firebaseUser.photoURL || undefined,
          provider: userData.provider,
          emailVerified: firebaseUser.emailVerified,
          watchlist: userData.watchlist || [],
          preferences: userData.preferences || {
            notifications: true,
            theme: 'dark'
          },
          createdAt: userData.createdAt?.toDate()
        });
      } else {
        // Create new user profile
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          photoURL: firebaseUser.photoURL || undefined,
          provider: 'email',
          emailVerified: firebaseUser.emailVerified,
          watchlist: [],
          preferences: {
            notifications: true,
            theme: 'dark'
          },
          createdAt: new Date()
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
        setUser(newUser);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  // Email/password login
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // Email/password registration
  const register = async (email: string, password: string, name?: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email immediately after registration
    await sendEmailVerification(result.user);
    
    // Create user profile in Firestore
    const newUser: User = {
      id: result.user.uid,
      email: result.user.email!,
      name: name || email.split('@')[0],
      provider: 'email',
      emailVerified: false,
      watchlist: [],
      preferences: {
        notifications: true,
        theme: 'dark'
      },
      createdAt: new Date()
    };

    await setDoc(doc(db, 'users', result.user.uid), newUser);
  };

  // Google login
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      const newUser: User = {
        id: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
        provider: 'google',
        emailVerified: true, // Google accounts are automatically verified
        watchlist: [],
        preferences: {
          notifications: true,
          theme: 'dark'
        },
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', result.user.uid), newUser);
    }
  };

  // Twitter login
  const loginWithTwitter = async () => {
    const result = await signInWithPopup(auth, twitterProvider);
    
    // Check if user profile exists, if not create one
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!userDoc.exists()) {
      const newUser: User = {
        id: result.user.uid,
        email: result.user.email!,
        name: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
        provider: 'twitter',
        emailVerified: true, // Social accounts are automatically verified
        watchlist: [],
        preferences: {
          notifications: true,
          theme: 'dark'
        },
        createdAt: new Date()
      };

      await setDoc(doc(db, 'users', result.user.uid), newUser);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    await setDoc(doc(db, 'users', user.id), updatedUser, { merge: true });
    setUser(updatedUser);
  };

  // Send verification email to current user
  const sendVerificationEmail = async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
      await sendEmailVerification(auth.currentUser);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
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
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};