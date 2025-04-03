import React, { createContext, useContext, ReactNode, useCallback, useState, useEffect } from 'react';
import { init, User } from '@instantdb/react-native';
// Navigation is handled by components
import 'react-native-get-random-values';

// You'll need to get an APP_ID from InstantDB dashboard
// Visit https://www.instantdb.com/dash to get your APP_ID
const APP_ID = '84f087af-f6a5-4a5f-acbc-bc4008e3a725'; // Replace with your actual App ID

// Initialize InstantDB
const db = init({ appId: APP_ID });

type AuthContextType = {
  isLoading: boolean;
  user: User | null;
  error: any | null; // Using any for error type to accommodate InstantDB's error format
  sendMagicCode: (email: string) => Promise<void>;
  signInWithMagicCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use local state to track authentication status
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { isLoading: dbLoading, user, error } = db.useAuth();

  // Combine loading states
  const isLoading = dbLoading || isSigningOut;

  // Ensure user and error are never undefined
  const safeUser = user || null;
  const safeError = error || null;

  // Reset isSigningOut when user changes
  useEffect(() => {
    if (isSigningOut && !safeUser) {
      setIsSigningOut(false);
    }
  }, [safeUser, isSigningOut]);

  const sendMagicCode = async (email: string) => {
    try {
      await db.auth.sendMagicCode({ email });
    } catch (err) {
      console.error('Error sending magic code:', err);
      throw err;
    }
  };

  const signInWithMagicCode = async (email: string, code: string) => {
    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err) {
      console.error('Error signing in with magic code:', err);
      throw err;
    }
  };

  // Simple sign-out function that follows InstantDB documentation
  const signOut = useCallback(async () => {
    try {
      // Set signing out state to true to prevent redirects during sign-out
      setIsSigningOut(true);

      // Call the InstantDB signOut method
      await db.auth.signOut();

      // Reset signing out state
      setIsSigningOut(false);

      return true;
    } catch (err) {
      console.error('Error signing out:', err);
      setIsSigningOut(false);
      throw err;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        user: safeUser,
        error: safeError,
        sendMagicCode,
        signInWithMagicCode,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
