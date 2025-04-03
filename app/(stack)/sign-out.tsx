import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';

export default function SignOutScreen() {
  const { signOut } = useAuth();

  useEffect(() => {
    async function performSignOut() {
      try {
        const success = await signOut();
        if (success) {
          // Navigate to sign-in page after successful sign-out
          router.navigate('/(stack)/index');
        }
      } catch (error) {
        console.error('Error signing out:', error);
        // Navigate to sign-in page even if there's an error
        router.navigate('/(stack)/index');
      }
    }

    performSignOut();
  }, [signOut]);

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
    padding: 20,
  },
  text: {
    marginTop: 20,
    fontSize: 16,
  },
});
