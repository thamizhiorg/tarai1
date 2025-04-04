import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ProductListItem } from './ProductListItem';
import { Product } from '@/types/Product';
import { useProducts } from '@/context/ProductContext';
import { router } from 'expo-router';

type ProductListProps = {
  onProductEdit?: (product: Product) => void;
};

export function ProductList({ onProductEdit }: ProductListProps = {}) {
  const { products, selectedProduct, selectProduct, isLoading, error, loadProducts, productsLoaded } = useProducts();

  // Load products if not already loaded
  useEffect(() => {
    if (!productsLoaded && !isLoading) {
      console.log('Loading products from ProductList');
      loadProducts();
    }
  }, [productsLoaded, isLoading, loadProducts]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading products: {error.message}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            console.log('Retrying product load...');
            loadProducts();
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No products found</Text>
      </View>
    );
  }

  // Handle product selection
  const handleProductPress = (product: Product) => {
    selectProduct(product);

    // Navigate to the AI tab for editing
    router.push({
      pathname: '/(tabs)/ai',
      params: { productId: product.id }
    });
  };

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ProductListItem
          product={item}
          onPress={handleProductPress}
          isSelected={selectedProduct?.id === item.id}
        />
      )}
      style={styles.list}
      contentContainerStyle={styles.listContent}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 16,
  },
  loadingText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 10,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    fontSize: 16,
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
