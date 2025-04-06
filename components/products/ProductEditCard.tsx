import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import { Product } from '@/types/Product';
import { InventoryListFullScreen } from '@/components/inventory/InventoryListFullScreen';
import { ProductOptionsFullScreen } from '@/components/products/ProductOptionsFullScreen';
import { ProductModifiersFullScreen } from '@/components/products/ProductModifiersFullScreen';
import { ProductMetafieldsFullScreen } from '@/components/products/ProductMetafieldsFullScreen';
import { ProductNotesFullScreen } from '@/components/products/ProductNotesFullScreen';

type ProductEditCardProps = {
  product: Product;
  onSave: (updatedProduct: Product) => void;
};

export function ProductEditCard({ product, onSave }: ProductEditCardProps) {
  // State for managing drawer visibility
  const [isInventoryVisible, setIsInventoryVisible] = useState(false);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);
  const [isModifiersVisible, setIsModifiersVisible] = useState(false);
  const [isCustomAttributesVisible, setIsCustomAttributesVisible] = useState(false);
  const [isNotesVisible, setIsNotesVisible] = useState(false);

  // Local state for product data
  const [localProduct, setLocalProduct] = useState<Product>(product);

  // Handler functions for saving data from drawers
  const handleSaveOptions = (options: any) => {
    setLocalProduct(prev => ({ ...prev, options }));
    onSave({ ...localProduct, options });
  };

  const handleSaveModifiers = (modifiers: any) => {
    setLocalProduct(prev => ({ ...prev, modifiers }));
    onSave({ ...localProduct, modifiers });
  };

  const handleSaveMetafields = (metafields: any) => {
    setLocalProduct(prev => ({ ...prev, metafields }));
    onSave({ ...localProduct, metafields });
  };

  const handleSaveNotes = (notes: string) => {
    setLocalProduct(prev => ({ ...prev, notes }));
    onSave({ ...localProduct, notes });
  };

  // Render product images
  const renderProductImages = () => {
    const images = [
      product.f1,
      product.f2,
      product.f3,
      product.f4,
      product.f5
    ].filter(Boolean);

    // If no images, use placeholders
    const displayImages = images.length > 0 ? images : Array(5).fill(null);

    return (
      <View style={styles.imagesContainer}>
        {displayImages.map((image, index) => (
          <View key={index} style={styles.imageWrapper}>
            {image ? (
              <Image source={{ uri: image as string }} style={styles.image} resizeMode="cover" />
            ) : (
              <View style={styles.placeholderImage} />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>

      {/* Product Images */}
      {renderProductImages()}

      {/* Inventory Section */}
      <TouchableOpacity
        style={styles.inventorySection}
        onPress={() => setIsInventoryVisible(true)}
      >
        <View style={styles.inventoryLeft}>
          <Text style={styles.sectionTitle}>Inventory</Text>
          <Text style={styles.inventoryCount}>{product.stock || 5}</Text>
        </View>
        <View style={styles.inventoryRight}>
          <Text style={styles.stockTitle}>Stock</Text>
          <Text style={styles.priceRange}>
            5$ - 10$
          </Text>
          <Text style={styles.unitsText}>units</Text>
        </View>
      </TouchableOpacity>

      {/* Options Section */}
      <TouchableOpacity
        style={styles.optionsSection}
        onPress={() => setIsOptionsVisible(true)}
      >
        <Text style={styles.sectionTitle}>options</Text>
        {/* Options content would go here */}
      </TouchableOpacity>

      {/* Grid Sections - First Row */}
      <View style={styles.gridContainer}>
        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => setIsModifiersVisible(true)}
        >
          <Text style={styles.gridItemTitle}>modifiers</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => setIsCustomAttributesVisible(true)}
        >
          <Text style={styles.gridItemTitle}>custom attributes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.gridItem}
          onPress={() => setIsNotesVisible(true)}
        >
          <Text style={styles.gridItemTitle}>notes</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Grid - Second Row */}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemTitle}>collection</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.gridItemTitle}>category</Text>
        </View>
      </View>

      {/* Bottom Grid - Third Row */}
      <View style={styles.gridContainer}>
        <View style={styles.gridItem}>
          <Text style={styles.gridItemTitle}>brand</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.gridItemTitle}>vendor</Text>
        </View>
      </View>

      {/* Full Screen Components */}
      <InventoryListFullScreen
        visible={isInventoryVisible}
        productId={product.id}
        onClose={() => setIsInventoryVisible(false)}
      />

      <ProductOptionsFullScreen
        visible={isOptionsVisible}
        options={localProduct.options || []}
        onClose={() => setIsOptionsVisible(false)}
        onSave={handleSaveOptions}
      />

      <ProductModifiersFullScreen
        visible={isModifiersVisible}
        modifiers={localProduct.modifiers || []}
        onClose={() => setIsModifiersVisible(false)}
        onSave={handleSaveModifiers}
      />

      <ProductMetafieldsFullScreen
        visible={isCustomAttributesVisible}
        metafields={localProduct.metafields || []}
        onClose={() => setIsCustomAttributesVisible(false)}
        onSave={handleSaveMetafields}
        title="Custom Attributes"
      />

      <ProductNotesFullScreen
        visible={isNotesVisible}
        notes={localProduct.notes || ''}
        onClose={() => setIsNotesVisible(false)}
        onSave={handleSaveNotes}
      />
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  imagesContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f5f5f5',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  imageWrapper: {
    width: (width - 32) / 5 - 4,
    height: (width - 32) / 5 - 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  inventorySection: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  inventoryLeft: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
  },
  inventoryRight: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inventoryCount: {
    fontSize: 48,
    fontWeight: '200',
    color: '#ccc',
    marginTop: 8,
  },
  stockTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'right',
  },
  priceRange: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'right',
  },
  unitsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'right',
  },
  optionsSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 100,
  },
  gridContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  gridItem: {
    flex: 1,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    minHeight: 80,
    justifyContent: 'center',
  },
  gridItemWide: {
    flex: 2,
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#f0f0f0',
    minHeight: 80,
  },
  gridItemTitle: {
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'center',
  },
  gridItemValue: {
    fontSize: 14,
    color: '#666',
  },
});
