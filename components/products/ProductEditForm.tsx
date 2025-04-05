import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Text
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Product, ProductOption, ProductModifier, ProductMetafield, ProductChannel } from '@/types/Product';
import { useProducts } from '@/context/ProductContext';
import { NotionTableInput } from '@/components/ui/NotionTableInput';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ProductTabHeader } from '@/components/products/ProductTabHeader';
import { TabView } from '@/components/ui/TabView';
import { InventoryManager } from '@/components/inventory/InventoryManager';
import { ProductImagesEditor } from '@/components/products/ProductImagesEditor';
import { ProductOptionsEditor } from '@/components/products/ProductOptionsEditor';
import { ModifiersEditor } from '@/components/products/ModifiersEditor';
import { MetafieldsEditor } from '@/components/products/MetafieldsEditor';
import { ChannelsEditor } from '@/components/products/ChannelsEditor';
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

  // Render the product details tab content
  const renderDetailsTab = () => {
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

        {/* Product Metafields */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list-outline" size={18} color="#666" />
            <Text style={styles.sectionHeaderText}>Custom Attributes</Text>
            <View style={styles.sectionTitleContainer}>
              <View style={styles.sectionTitleLine} />
            </View>
          </View>

          <View style={styles.tableContainer}>
            <MetafieldsEditor
              metafields={metafields}
              onChange={setMetafields}
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  // Render the options & modifiers tab content
  const renderOptionsModifiersTab = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Product Options */}
        <View style={styles.sectionContainer}>
          <View style={styles.tableContainer}>
            <ProductOptionsEditor
              options={options}
              onChange={setOptions}
            />
          </View>
        </View>

        {/* Product Modifiers */}
        <View style={styles.sectionContainer}>
          <View style={styles.tableContainer}>
            <ModifiersEditor
              modifiers={modifiers}
              onChange={setModifiers}
            />
          </View>
        </View>
      </ScrollView>
    );
  };

  // Render the notes tab content
  const renderNotesAndChannelsTab = () => {
    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Sales Channels */}
        <View style={styles.sectionContainer}>
          <View style={styles.tableContainer}>
            <ChannelsEditor
              channels={channels}
              onChange={setChannels}
            />
          </View>
        </View>

        {/* Rich Text Notes */}
        <View style={[styles.sectionContainer, { marginTop: 24 }]}>
          <RichTextEditor
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this product..."
            minHeight={200}
          />
        </View>
      </ScrollView>
    );
  };

  // Render the inventory tab content
  const renderInventoryTab = () => {
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <View style={styles.formContainer}>

        <View style={styles.headerContainer}>
          <ProductTabHeader
            onSave={handleSave}
            onCancel={onCancel}
            isSaving={isSaving}
          />
        </View>

        <TabView
          tabs={[
            {
              key: 'details',
              title: 'C',
              showTitleWithIcon: true
            },
            {
              key: 'options',
              title: 'O',
              showTitleWithIcon: true
            },
            {
              key: 'inventory',
              title: 'I',
              showTitleWithIcon: true
            },
            {
              key: 'notes',
              title: 'N',
              showTitleWithIcon: true
            }
          ]}
          renderScene={(tab) => {
            switch (tab.key) {
              case 'details':
                return renderDetailsTab();
              case 'options':
                return renderOptionsModifiersTab();
              case 'inventory':
                return renderInventoryTab();
              case 'notes':
                return renderNotesAndChannelsTab();
              default:
                return renderDetailsTab();
            }
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  formContainer: {
    flex: 1,
    padding: 0,
  },
  headerContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
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
});
