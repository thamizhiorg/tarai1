import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Product, ProductOption, ProductModifier, ProductMetafield, ProductChannel } from '@/types/Product';
import { useProducts } from '@/context/ProductContext';
import { NotionTableInput } from '@/components/ui/NotionTableInput';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
// ProductEditHUD removed as requested
import { ProductEditBottomBar } from '@/components/products/ProductEditBottomBar';
import { InventoryManager } from '@/components/inventory/InventoryManager';
import { ProductImagesEditor } from '@/components/products/ProductImagesEditor';
import { ProductOptionsFullScreen } from '@/components/products/ProductOptionsFullScreen';
import { ProductModifiersFullScreen } from '@/components/products/ProductModifiersFullScreen';
import { ProductMetafieldsFullScreen } from '@/components/products/ProductMetafieldsFullScreen';
import { ProductNotesFullScreen } from '@/components/products/ProductNotesFullScreen';
import { ChannelsEditor } from '@/components/products/ChannelsEditor';
import { ProductEditCard } from '@/components/products/ProductEditCard';
import { v4 as uuidv4 } from 'uuid';

type ProductEditFormProps = {
  product: Product | Omit<Product, 'id'>;
  isNew?: boolean;
  onSave?: (success: boolean) => void;
  onCancel?: () => void;
};

export function ProductEditForm({ product, isNew = false, onSave, onCancel }: ProductEditFormProps) {
  const { updateProductDetails, createNewProduct } = useProducts();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [name, setName] = useState(product.name || '');
  const [price, setPrice] = useState(product.price?.toString() || '0');
  const [stock, setStock] = useState(product.stock?.toString() || '0');
  const [category, setCategory] = useState(product.category || '');
  const [type, setType] = useState(product.type || '');
  const [vendor, setVendor] = useState(product.vendor || '');
  const [brand, setBrand] = useState(product.brand || '');
  const [unit, setUnit] = useState(product.unit || '');
  const [collection, setCollection] = useState(product.collection || '');
  const [notes, setNotes] = useState(product.notes || '');

  // Image fields
  const [images, setImages] = useState<(string | null)[]>([
    product.f1 || null,
    product.f2 || null,
    product.f3 || null,
    product.f4 || null,
    product.f5 || null
  ]);

  // JSON fields
  const [options, setOptions] = useState<ProductOption[]>(product.options || []);
  const [modifiers, setModifiers] = useState<ProductModifier[]>(product.modifiers || []);
  const [metafields, setMetafields] = useState<ProductMetafield[]>(product.metafields || []);

  // Modal visibility state
  const [isOptionsModalVisible, setIsOptionsModalVisible] = useState(false);
  const [isModifiersModalVisible, setIsModifiersModalVisible] = useState(false);
  const [isMetafieldsModalVisible, setIsMetafieldsModalVisible] = useState(false);
  const [isNotesModalVisible, setIsNotesModalVisible] = useState(false);
  const [channels, setChannels] = useState<ProductChannel[]>(
    product.channels || [
      { id: uuidv4(), name: 'POS', enabled: true },
      { id: uuidv4(), name: 'Storefront', enabled: true },
      { id: uuidv4(), name: 'Marketplace', enabled: false }
    ]
  );

  // Update form when product changes
  useEffect(() => {
    setName(product.name || '');
    setPrice(product.price?.toString() || '0');
    setStock(product.stock?.toString() || '0');
    setCategory(product.category || '');
    setType(product.type || '');
    setVendor(product.vendor || '');
    setBrand(product.brand || '');
    setUnit(product.unit || '');
    setCollection(product.collection || '');
    setNotes(product.notes || '');

    setImages([
      product.f1 || null,
      product.f2 || null,
      product.f3 || null,
      product.f4 || null,
      product.f5 || null
    ]);

    setOptions(product.options || []);
    setModifiers(product.modifiers || []);
    setMetafields(product.metafields || []);
    setChannels(product.channels || [
      { id: uuidv4(), name: 'POS', enabled: true },
      { id: uuidv4(), name: 'Storefront', enabled: true },
      { id: uuidv4(), name: 'Marketplace', enabled: false }
    ]);
  }, [product]);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    setIsSaving(true);

    try {
      if (isNew) {
        await createNewProduct({
          ...product,
          name,
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          category,
          type,
          vendor,
          brand,
          unit,
          collection,
          f1: images[0],
          f2: images[1],
          f3: images[2],
          f4: images[3],
          f5: images[4],
          options,
          modifiers,
          metafields,
          channels,
          notes
        });
      } else {
        await updateProductDetails({
          ...product as Product,
          name,
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          category,
          type,
          vendor,
          brand,
          unit,
          collection,
          f1: images[0],
          f2: images[1],
          f3: images[2],
          f4: images[3],
          f5: images[4],
          options,
          modifiers,
          metafields,
          channels,
          notes
        } as Product);
      }

      if (onSave) {
        onSave(true);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product');
      if (onSave) {
        onSave(false);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Render the product details section
  const renderDetailsSection = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Product Images */}
        <View style={styles.sectionContainer}>
          <ProductImagesEditor
            images={images}
            onChange={setImages}
          />
        </View>

        {/* Basic Product Details */}
        <View style={styles.sectionContainer}>
          <View style={styles.tableContainer}>
            <NotionTableInput
              label="Name"
              value={name}
              onChangeText={setName}
              placeholder="Product name"
              icon="text-outline"
            />

            <NotionTableInput
              label="Price"
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              keyboardType="decimal-pad"
              icon="cash-outline"
            />

            <NotionTableInput
              label="Stock"
              value={stock}
              onChangeText={setStock}
              placeholder="0"
              keyboardType="number-pad"
              icon="cube-outline"
            />

            <NotionTableInput
              label="Category"
              value={category}
              onChangeText={setCategory}
              placeholder="Category"
              icon="folder-outline"
            />

            <NotionTableInput
              label="Type"
              value={type}
              onChangeText={setType}
              placeholder="Type"
              icon="pricetag-outline"
            />

            <NotionTableInput
              label="Collection"
              value={collection}
              onChangeText={setCollection}
              placeholder="Collection"
              icon="albums-outline"
            />

            <NotionTableInput
              label="Unit"
              value={unit}
              onChangeText={setUnit}
              placeholder="Unit (e.g., pcs, kg)"
              icon="resize-outline"
            />

            <NotionTableInput
              label="Vendor"
              value={vendor}
              onChangeText={setVendor}
              placeholder="Vendor"
              icon="business-outline"
            />

            <NotionTableInput
              label="Brand"
              value={brand}
              onChangeText={setBrand}
              placeholder="Brand"
              icon="bookmark-outline"
            />
          </View>
        </View>


      </ScrollView>
    );
  };

  // Render the options & modifiers section
  const renderOptionsModifiersSection = () => {
    return (
      <View style={styles.fullScreenTabContainer}>
        {/* Custom Attributes (Metafields) */}
        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={() => setIsMetafieldsModalVisible(true)}
        >
          <View style={styles.fullScreenButtonContent}>
            <Ionicons name="list-outline" size={24} color="#333" style={styles.fullScreenButtonIcon} />
            <View style={styles.fullScreenButtonTextContainer}>
              <Text style={styles.fullScreenButtonTitle}>Custom Attributes</Text>
              <Text style={styles.fullScreenButtonSubtitle}>
                {metafields.length > 0 ? `${metafields.length} attributes` : 'No attributes added'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        {/* Product Options */}
        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={() => setIsOptionsModalVisible(true)}
        >
          <View style={styles.fullScreenButtonContent}>
            <Ionicons name="options-outline" size={24} color="#333" style={styles.fullScreenButtonIcon} />
            <View style={styles.fullScreenButtonTextContainer}>
              <Text style={styles.fullScreenButtonTitle}>Product Options</Text>
              <Text style={styles.fullScreenButtonSubtitle}>
                {options.length > 0 ? `${options.length} options` : 'No options added'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        {/* Product Modifiers */}
        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={() => setIsModifiersModalVisible(true)}
        >
          <View style={styles.fullScreenButtonContent}>
            <Ionicons name="construct-outline" size={24} color="#333" style={styles.fullScreenButtonIcon} />
            <View style={styles.fullScreenButtonTextContainer}>
              <Text style={styles.fullScreenButtonTitle}>Product Modifiers</Text>
              <Text style={styles.fullScreenButtonSubtitle}>
                {modifiers.length > 0 ? `${modifiers.length} modifiers` : 'No modifiers added'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        {/* Full Screen Modals */}
        <ProductOptionsFullScreen
          visible={isOptionsModalVisible}
          options={options}
          onClose={() => setIsOptionsModalVisible(false)}
          onSave={setOptions}
        />

        <ProductModifiersFullScreen
          visible={isModifiersModalVisible}
          modifiers={modifiers}
          onClose={() => setIsModifiersModalVisible(false)}
          onSave={setModifiers}
        />

        <ProductMetafieldsFullScreen
          visible={isMetafieldsModalVisible}
          metafields={metafields}
          onClose={() => setIsMetafieldsModalVisible(false)}
          onSave={setMetafields}
        />
      </View>
    );
  };

  // Render the notes and channels section
  const renderNotesAndChannelsSection = () => {
    return (
      <View style={styles.sectionContent}>
        {/* Sales Channels */}
        <View style={styles.channelsContainer}>
          <ChannelsEditor
            channels={channels}
            onChange={setChannels}
          />
        </View>

        {/* Notes Button */}
        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={() => setIsNotesModalVisible(true)}
        >
          <View style={styles.fullScreenButtonContent}>
            <Ionicons name="document-text-outline" size={24} color="#333" style={styles.fullScreenButtonIcon} />
            <View style={styles.fullScreenButtonTextContainer}>
              <Text style={styles.fullScreenButtonTitle}>Product Notes</Text>
              <Text style={styles.fullScreenButtonSubtitle}>
                {notes ? 'Edit product notes' : 'Add notes about this product'}
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={24} color="#999" />
        </TouchableOpacity>

        {/* Notes Full Screen Modal */}
        <ProductNotesFullScreen
          visible={isNotesModalVisible}
          notes={notes}
          onClose={() => setIsNotesModalVisible(false)}
          onSave={setNotes}
        />
      </View>
    );
  };

  // Render the inventory section
  const renderInventorySection = () => {
    if (isNew || !product.id) {
      return (
        <View style={styles.emptyInventoryContainer}>
          <Ionicons name="cube-outline" size={48} color="#ccc" />
          <Text style={styles.emptyInventoryText}>
            Save the product first to manage inventory
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.inventoryTabContainer}>
        <InventoryManager productId={product.id} />
      </View>
    );
  };

  // Create a function to handle product updates from the ProductEditCard
  const handleProductUpdate = (updatedProduct: Product & { saveAction?: boolean }) => {
    // Update local state
    setName(updatedProduct.name || '');
    setPrice(updatedProduct.price?.toString() || '0');
    setStock(updatedProduct.stock?.toString() || '0');
    setCategory(updatedProduct.category || '');
    setType(updatedProduct.type || '');
    setVendor(updatedProduct.vendor || '');
    setBrand(updatedProduct.brand || '');
    setUnit(updatedProduct.unit || '');
    setCollection(updatedProduct.collection || '');
    setNotes(updatedProduct.notes || '');
    setImages([
      updatedProduct.f1 || null,
      updatedProduct.f2 || null,
      updatedProduct.f3 || null,
      updatedProduct.f4 || null,
      updatedProduct.f5 || null
    ]);
    setOptions(updatedProduct.options || []);
    setModifiers(updatedProduct.modifiers || []);
    setMetafields(updatedProduct.metafields || []);
    setChannels(updatedProduct.channels || []);

    // If this is a save action (not just an update), trigger the save
    if (updatedProduct.saveAction) {
      handleSave();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.formContainer}>
        {/* HUD removed as requested */}

        {/* Content container */}
        <View style={styles.contentContainer}>
          {/* New Product Edit Card */}
          <ProductEditCard
            product={{
              ...product as Product,
              name,
              price: parseFloat(price) || 0,
              stock: parseInt(stock) || 0,
              category,
              type,
              vendor,
              brand,
              unit,
              collection,
              f1: images[0],
              f2: images[1],
              f3: images[2],
              f4: images[3],
              f5: images[4],
              options,
              modifiers,
              metafields,
              channels,
              notes
            } as Product}
            onSave={handleProductUpdate}
            onBack={onCancel}
          />
        </View>

        {/* Bottom action bar removed in favor of back tile */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 0, // No padding needed at top since HUD is removed
  },
  formContainer: {
    flex: 1,
    padding: 0,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 0, // No padding needed at bottom since bottom bar is removed
    paddingTop: 0, // No padding needed at top since HUD is removed
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  sectionTitleContainer: {
    flex: 1,
    marginLeft: 8,
    height: 1,
    justifyContent: 'center',
  },
  sectionTitleLine: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  inventoryTabContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullScreenTabContainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  fullScreenButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  fullScreenButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fullScreenButtonIcon: {
    marginRight: 16,
  },
  fullScreenButtonTextContainer: {
    flex: 1,
  },
  fullScreenButtonTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  fullScreenButtonSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  inventoryContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  emptyInventoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  emptyInventoryText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  channelsContainer: {
    marginBottom: 16,
  },
});
