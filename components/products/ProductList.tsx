import React, { useEffect, useState, useMemo } from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ProductListItem } from './ProductListItem';
import { ProductListHeader, ColumnVisibility } from './ProductListHeader';
import { Product } from '@/types/Product';
import { useProducts } from '@/context/ProductContext';
import { router } from 'expo-router';

type ProductListProps = {
  onProductEdit?: (product: Product) => void;
};

export function ProductList({ onProductEdit }: ProductListProps = {}) {
  const { products, selectedProduct, selectProduct, isLoading, error, loadProducts, productsLoaded } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOptions, setFilterOptions] = useState<{
    category?: string;
    inStock?: boolean;
    priceRange?: { min: number; max: number };
  }>({});
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    category: true,
    price: true,
    stock: true,
    id: true
  });

  // Load products if not already loaded
  useEffect(() => {
    if (!productsLoaded && !isLoading) {
      console.log('Loading products from ProductList');
      loadProducts();
    }
  }, [productsLoaded, isLoading, loadProducts]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filterOptions.category && product.category !== filterOptions.category) {
        return false;
      }

      // In stock filter
      if (filterOptions.inStock && (!product.stock || product.stock <= 0)) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, filterOptions]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ProductListHeader
          onSearch={setSearchQuery}
          onFilter={setFilterOptions}
          onColumnVisibilityChange={setColumnVisibility}
          searchQuery={searchQuery}
          filterOptions={filterOptions}
          columnVisibility={columnVisibility}
        />
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading products...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ProductListHeader
          onSearch={setSearchQuery}
          onFilter={setFilterOptions}
          onColumnVisibilityChange={setColumnVisibility}
          searchQuery={searchQuery}
          filterOptions={filterOptions}
          columnVisibility={columnVisibility}
        />
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
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.container}>
        <ProductListHeader
          onSearch={setSearchQuery}
          onFilter={setFilterOptions}
          onColumnVisibilityChange={setColumnVisibility}
          searchQuery={searchQuery}
          filterOptions={filterOptions}
          columnVisibility={columnVisibility}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No products found</Text>
        </View>
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

  // Show no results message if filtered products is empty
  if (filteredProducts.length === 0) {
    return (
      <View style={styles.container}>
        <ProductListHeader
          onSearch={setSearchQuery}
          onFilter={setFilterOptions}
          onColumnVisibilityChange={setColumnVisibility}
          searchQuery={searchQuery}
          filterOptions={filterOptions}
          columnVisibility={columnVisibility}
        />
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No products match your search</Text>
          {searchQuery || Object.keys(filterOptions).length > 0 ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchQuery('');
                setFilterOptions({});
              }}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProductListHeader
        onSearch={setSearchQuery}
        onFilter={setFilterOptions}
        onColumnVisibilityChange={setColumnVisibility}
        searchQuery={searchQuery}
        filterOptions={filterOptions}
        columnVisibility={columnVisibility}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ProductListItem
            product={item}
            onPress={handleProductPress}
            isSelected={selectedProduct?.id === item.id}
            columnVisibility={columnVisibility}
          />
        )}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
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
  clearButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});
