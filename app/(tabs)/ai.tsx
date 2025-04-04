import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useProducts } from '@/context/ProductContext';
import { ProductListItem } from '@/components/products/ProductListItem';
import { ProductEditForm } from '@/components/products/ProductEditForm';
import { Product } from '@/types/Product';

export default function AIScreen() {
  const { products, selectedProduct, selectProduct, error, loadProducts, getNewProductTemplate, productsLoaded, isLoading: contextLoading } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null | Omit<Product, 'id'>>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const params = useLocalSearchParams<{ productId: string }>();

  // Load products when the screen mounts (only if not already loaded)
  useEffect(() => {
    if (!productsLoaded) {
      setIsLoading(true);
      loadProducts().finally(() => setIsLoading(false));
    }
  }, [loadProducts, productsLoaded]);

  // Handle product ID from params
  useEffect(() => {
    const productId = params.productId ? parseInt(params.productId) : null;

    if (productId) {
      // If we have a product ID but no products loaded yet, load them
      if (products.length === 0) {
        setIsLoading(true);
        loadProducts()
          .then(loadedProducts => {
            const product = loadedProducts.find(p => p.id === productId);
            if (product) {
              console.log('Found product from params:', product.name);
              setEditingProduct(product);
              selectProduct(product);
            }
          })
          .catch(err => console.error('Error loading products for editing:', err))
          .finally(() => setIsLoading(false));
      } else {
        // If products are already loaded, find the one we need
        const product = products.find(p => p.id === productId);
        if (product) {
          console.log('Found product from params:', product.name);
          setEditingProduct(product);
          selectProduct(product);
        }
      }
    }
  }, [params.productId, products, selectProduct, loadProducts]);

  // Handle creating a new product
  const handleCreateNew = () => {
    const newProductTemplate = getNewProductTemplate();
    setEditingProduct(newProductTemplate);
    setIsNewProduct(true);
  };

  // Handle save completion
  const handleSaveComplete = (success: boolean) => {
    if (success) {
      // If we came from a direct link with productId, go back to workspace
      if (params.productId) {
        router.replace('/(tabs)/workspace');
      } else {
        // Otherwise just close the edit form
        setEditingProduct(null);
        setIsNewProduct(false);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // If we came from a direct link with productId, go back to workspace
    if (params.productId) {
      router.replace('/(tabs)/workspace');
    } else {
      // Otherwise just close the edit form
      setEditingProduct(null);
      setIsNewProduct(false);
    }
  };

  // Render loading state
  if ((isLoading || contextLoading) && products.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
      </ThemedView>
    );
  }

  // Render error state
  if (error && products.length === 0) {
    return (
      <ThemedView style={styles.centerContainer}>
        <ThemedText style={styles.errorText}>Error loading products: {error.message}</ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadProducts()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  // If we're editing a product, show the edit form
  if (editingProduct) {
    return (
      <ThemedView style={styles.container}>
        <ProductEditForm
          product={editingProduct}
          isNew={isNewProduct}
          onSave={handleSaveComplete}
          onCancel={handleCancel}
        />
      </ThemedView>
    );
  }

  // Otherwise, show the add new product button
  return (
    <ThemedView style={styles.emptyContainer}>
      <View style={styles.emptyContent}>
        <Ionicons name="cube-outline" size={64} color="#ccc" style={styles.emptyIcon} />
        <ThemedText style={styles.emptyTitle}>No Product Selected</ThemedText>
        <ThemedText style={styles.emptySubtitle}>Select a product from the Products tab to edit, or create a new one</ThemedText>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateNew}
        >
          <Ionicons name="add-circle-outline" size={24} color="#fff" />
          <Text style={styles.createButtonText}>Create New Product</Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 16,
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});
