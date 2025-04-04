import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Product } from '@/types/Product';
import { useProducts } from '@/context/ProductContext';

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

  // Update form when product changes
  useEffect(() => {
    setName(product.name || '');
    setPrice(product.price?.toString() || '0');
    setStock(product.stock?.toString() || '0');
    setCategory(product.category || '');
    setType(product.type || '');
    setVendor(product.vendor || '');
    setBrand(product.brand || '');
  }, [product]);

  // Handle save
  const handleSave = async () => {
    // Validate form
    if (!name.trim()) {
      Alert.alert('Error', 'Product name is required');
      return;
    }

    setIsSaving(true);
    let success = false;

    try {
      if (isNew) {
        // Create new product object
        const newProductData = {
          ...product as Omit<Product, 'id'>,
          name,
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          category,
          type,
          vendor,
          brand
        };

        // Create new product
        const newProduct = await createNewProduct(newProductData);
        success = !!newProduct;
      } else {
        // Create updated product object
        const updatedProduct: Product = {
          ...(product as Product),
          name,
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          category,
          type,
          vendor,
          brand
        };

        // Update product
        success = await updateProductDetails(updatedProduct);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      Alert.alert('Error', 'Failed to save product');
    } finally {
      setIsSaving(false);
    }

    // Notify parent component
    if (onSave) {
      onSave(success);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        <View style={styles.formContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{product.id ? 'Edit Product' : 'New Product'}</Text>
              {product.id > 0 && <Text style={styles.subtitle}>ID: {product.id}</Text>}
            </View>

            <View style={styles.headerButtonContainer}>
              <TouchableOpacity
                style={[styles.headerButton, styles.saveButton, isSaving && styles.disabledButton]}
                onPress={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={[styles.buttonText, { color: '#fff' }]}>Save</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.headerButton, styles.cancelButton]}
                onPress={onCancel}
                disabled={isSaving}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Product name"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="0.00"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Category"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Type</Text>
            <TextInput
              style={styles.input}
              value={type}
              onChangeText={setType}
              placeholder="Type"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Vendor</Text>
            <TextInput
              style={styles.input}
              value={vendor}
              onChangeText={setVendor}
              placeholder="Vendor"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Brand</Text>
            <TextInput
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              placeholder="Brand"
              placeholderTextColor="#999"
            />
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 0,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f8f8',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  headerButtonContainer: {
    flexDirection: 'row',
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  formGroup: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});
