import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';

export default function WorkspaceScreen() {
  const { user } = useAuth();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>Workspace</ThemedText>
      {user && (
        <ThemedText style={styles.welcomeText}>
          Welcome, {user.email}
        </ThemedText>
      )}
      <ThemedText style={styles.contentText}>Your workspace content goes here</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 18,
    marginBottom: 24,
  },
  contentText: {
    marginBottom: 32,
  },

});
