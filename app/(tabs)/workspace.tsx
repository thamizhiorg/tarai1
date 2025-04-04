import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useAuth } from '@/context/AuthContext';
import { useAgent } from '@/context/AgentContext';
import { ProductList } from '@/components/products/ProductList';

export default function WorkspaceScreen() {
  const { user } = useAuth();
  const { currentAgentId } = useAgent();

  // Render content based on selected agent
  const renderContent = () => {
    switch (currentAgentId) {
      case '1': // Products
        return <ProductList />;
      case '2': // Inventory
        return (
          <View style={styles.placeholderContainer}>
            <ThemedText style={styles.placeholderText}>Inventory management coming soon</ThemedText>
          </View>
        );
      case '3': // Sales
        return (
          <View style={styles.placeholderContainer}>
            <ThemedText style={styles.placeholderText}>Sales dashboard coming soon</ThemedText>
          </View>
        );
      case '4': // Orders
        return (
          <View style={styles.placeholderContainer}>
            <ThemedText style={styles.placeholderText}>Order management coming soon</ThemedText>
          </View>
        );
      default:
        return (
          <View style={styles.placeholderContainer}>
            <ThemedText style={styles.placeholderText}>Select an agent to view content</ThemedText>
          </View>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      {renderContent()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
