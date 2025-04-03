import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';

type CodeStepProps = {
  email: string;
  onBack: () => void;
};

export function CodeStep({ email, onBack }: CodeStepProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithMagicCode } = useAuth();

  const handleSubmit = async () => {
    if (!code) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithMagicCode(email, code);
      // No need to navigate here, the AuthContext will handle that
    } catch (err: any) {
      setError(err.message || 'Invalid verification code');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <ThemedText style={styles.title}>VERIFICATION CODE</ThemedText>
        <ThemedText style={styles.subtitle}>
          We sent a code to
        </ThemedText>
        <ThemedText style={styles.emailText}>
          {email}
        </ThemedText>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter code"
        placeholderTextColor="#888"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
        editable={!isLoading}
      />

      {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <ThemedText style={styles.buttonText}>Verify</ThemedText>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={onBack}
        disabled={isLoading}
      >
        <ThemedText style={styles.backButtonText}>Back to Email</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    maxWidth: 350,
    alignSelf: 'center',
  },
  headerContainer: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#000000',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: '#555555',
    paddingHorizontal: 10,
  },
  emailText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#555555',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});
