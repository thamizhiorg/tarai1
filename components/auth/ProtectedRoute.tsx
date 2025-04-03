import React, { ReactNode, useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading, user, error } = useAuth();
  const hasRedirected = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip the first render to avoid redirect loops during initialization
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Only redirect if not loading, no user, and we haven't already redirected
    // This handles cases where the user is not authenticated but tries to access protected routes
    if (!isLoading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      // Navigate to sign-in page
      router.navigate('/');
    }

    // Reset the flag if the user is logged in
    if (user) {
      hasRedirected.current = false;
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={styles.errorText}>Error: {error.message}</ThemedText>
      </View>
    );
  }

  // If authenticated, render children
  if (user) {
    return <>{children}</>;
  }

  // This should not be visible as the useEffect will redirect
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});
