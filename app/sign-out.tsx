import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';

export default function SignOutScreen() {
  const { signOut } = useAuth();

  // Handle sign-out as soon as this screen loads
  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Sign out from InstantDB
        await signOut();
        
        // Navigate to sign-in page
        router.replace('/');
      } catch (error) {
        console.error('Error signing out:', error);
        // If there's an error, still try to navigate to sign-in
        router.replace('/');
      }
    };

    performSignOut();
  }, [signOut]);

  // Show a loading indicator while signing out
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007AFF" />
      <ThemedText style={styles.text}>Signing out...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#555555',
  },
});
