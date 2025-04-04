import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '@/types/Product';

type ProductListItemProps = {
  product: Product;
  onPress: (product: Product) => void;
  isSelected: boolean;
};

export function ProductListItem({ product, onPress, isSelected }: ProductListItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={() => onPress(product)}
    >
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>

        <View style={styles.detailsRow}>
          {product.category && (
            <Text style={styles.category}>{product.category}</Text>
          )}

          <Text style={styles.price}>
            {product.price != null ? `$${Number(product.price).toFixed(2)}` : 'No price'}
          </Text>
        </View>

        <View style={styles.stockRow}>
          <Text style={[
            styles.stockText,
            (product.stock != null && Number(product.stock) > 0) ? styles.inStock : styles.outOfStock
          ]}>
            {product.stock != null && Number(product.stock) > 0
              ? `In Stock: ${product.stock}`
              : 'Out of Stock'}
          </Text>

          <Text style={styles.sku}>ID: {product.id}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  selectedContainer: {
    backgroundColor: '#f8f8ff',
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stockText: {
    fontSize: 13,
  },
  inStock: {
    color: '#4CAF50',
  },
  outOfStock: {
    color: '#F44336',
  },
  sku: {
    fontSize: 13,
    color: '#888',
  },
});
