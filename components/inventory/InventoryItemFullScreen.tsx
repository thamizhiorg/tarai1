import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Inventory } from '@/types/Product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type InventoryItemFullScreenProps = {
  visible: boolean;
  item: Inventory;
  isNew?: boolean;
  onSave: (item: Inventory) => void;
  onCancel: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
};

export function InventoryItemFullScreen({
  visible,
  item,
  isNew = false,
  onSave,
  onCancel,
  onDelete,
  isSaving = false
}: InventoryItemFullScreenProps) {
  const [name, setName] = useState(item.name || '');
  const [sku, setSku] = useState(item.sku || '');
  const [barcode, setBarcode] = useState(item.barcode || '');
  const [imageUrl, setImageUrl] = useState(item.f || '');
  const [available, setAvailable] = useState(item.available?.toString() || '0');
  const [committed, setCommitted] = useState(item.committed?.toString() || '0');
  const [instock, setInstock] = useState(item.instock?.toString() || '0');
  const [price, setPrice] = useState(item.price?.toString() || '0');
  const [compare, setCompare] = useState(item.compare?.toString() || '');
  const [cost, setCost] = useState(item.cost?.toString() || '');
  const [location, setLocation] = useState(item.location || '');
  const [modifiers, setModifiers] = useState(item.modifiers || []);
  const [metafields, setMetafields] = useState(item.metafields || []);

  const insets = useSafeAreaInsets();

  const handleSave = () => {
    // Validate required fields
    if (!name.trim()) {
      Alert.alert('Error', 'Variant name is required');
      return;
    }

    if (!sku.trim()) {
      Alert.alert('Error', 'SKU is required');
      return;
    }

    // Create updated inventory item
    const updatedItem: Inventory = {
      ...item,
      name,
      sku,
      barcode,
      f: imageUrl || null,
      available: parseInt(available) || 0,
      committed: parseInt(committed) || 0,
      instock: parseInt(instock) || 0,
      price: parseFloat(price) || 0,
      compare: compare ? parseFloat(compare) : null,
      cost: cost ? parseFloat(cost) : null,
      location,
      modifiers,
      metafields
    };

    onSave(updatedItem);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onCancel}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onCancel}
              disabled={isSaving}
            >
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {isNew ? 'Add Variant' : 'Edit Variant'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            {!isNew && onDelete && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert(
                    'Delete Variant',
                    'Are you sure you want to delete this variant?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: onDelete }
                    ]
                  );
                }}
                disabled={isSaving}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.saveButtonText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Content */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.formContainer}
          keyboardVerticalOffset={100}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollViewContent,
              { paddingBottom: insets.bottom + 20 }
            ]}
          >
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.formRow}>
                <Text style={styles.label}>Name:</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Variant name"
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>SKU:</Text>
                <TextInput
                  style={styles.input}
                  value={sku}
                  onChangeText={setSku}
                  placeholder="SKU"
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Barcode:</Text>
                <TextInput
                  style={styles.input}
                  value={barcode}
                  onChangeText={setBarcode}
                  placeholder="Barcode"
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Image URL:</Text>
                <TextInput
                  style={styles.input}
                  value={imageUrl || ''}
                  onChangeText={setImageUrl}
                  placeholder="Image URL"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Inventory</Text>

              <View style={styles.formRow}>
                <Text style={styles.label}>Available:</Text>
                <TextInput
                  style={styles.input}
                  value={available}
                  onChangeText={setAvailable}
                  placeholder="0"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Committed:</Text>
                <TextInput
                  style={styles.input}
                  value={committed}
                  onChangeText={setCommitted}
                  placeholder="0"
                  keyboardType="number-pad"
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>In Stock:</Text>
                <TextInput
                  style={styles.input}
                  value={instock}
                  onChangeText={setInstock}
                  placeholder="0"
                  keyboardType="number-pad"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Pricing</Text>

              <View style={styles.formRow}>
                <Text style={styles.label}>Price:</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Compare:</Text>
                <TextInput
                  style={styles.input}
                  value={compare}
                  onChangeText={setCompare}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>

              <View style={styles.formRow}>
                <Text style={styles.label}>Cost:</Text>
                <TextInput
                  style={styles.input}
                  value={cost}
                  onChangeText={setCost}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Location</Text>

              <View style={styles.formRow}>
                <Text style={styles.label}>Location:</Text>
                <TextInput
                  style={styles.input}
                  value={location}
                  onChangeText={setLocation}
                  placeholder="Location"
                />
              </View>
            </View>

            {/* Additional sections for modifiers and metafields could be added here */}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  deleteButton: {
    padding: 8,
    marginRight: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
  },
  formContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  formRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
});
