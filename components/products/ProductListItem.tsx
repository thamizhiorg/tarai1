import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '@/types/Product';
import { ColumnVisibility } from './ProductListHeader';

type ProductListItemProps = {
  product: Product;
  onPress: (product: Product) => void;
  isSelected: boolean;
  columnVisibility: ColumnVisibility;
};

export function ProductListItem({ product, onPress, isSelected, columnVisibility }: ProductListItemProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer
      ]}
      onPress={() => onPress(product)}
    >
      {/* Thumbnail Image */}
      <View style={styles.imageContainer}>
        {product.f1 ? (
          <Image source={{ uri: product.f1 }} style={styles.thumbnail} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderContainer}>
            <Ionicons name="image-outline" size={24} color="#ccc" />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>

        <View style={styles.detailsRow}>
          {columnVisibility.category && product.category && (
            <Text style={styles.category}>{product.category}</Text>
          )}

          {columnVisibility.price && (
            <Text style={styles.price}>
              {product.price != null ? `$${Number(product.price).toFixed(2)}` : 'No price'}
            </Text>
          )}
        </View>

        <View style={styles.stockRow}>
          {columnVisibility.stock && (
            <Text style={[
              styles.stockText,
              (product.stock != null && Number(product.stock) > 0) ? styles.inStock : styles.outOfStock
            ]}>
              {product.stock != null && Number(product.stock) > 0
                ? `In Stock: ${product.stock}`
                : 'Out of Stock'}
            </Text>
          )}

          {columnVisibility.id && (
            <Text style={styles.sku}>ID: {product.id}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#ffffff',
  },
  selectedContainer: {
    backgroundColor: '#f8f8ff',
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#f5f5f5',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
