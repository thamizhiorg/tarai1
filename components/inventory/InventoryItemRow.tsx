import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Inventory } from '@/types/Product';

type InventoryItemRowProps = {
  item: Inventory;
  isNew?: boolean;
  onSave: (item: Inventory) => void;
  onDelete: (itemId: number) => void;
  onCancel: () => void;
};

export function InventoryItemRow({
  item,
  isNew = false,
  onSave,
  onDelete,
  onCancel
}: InventoryItemRowProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [name, setName] = useState(item.name || '');
  const [sku, setSku] = useState(item.sku || '');
  const [barcode, setBarcode] = useState(item.barcode || '');
  const [available, setAvailable] = useState(item.available?.toString() || '0');
  const [committed, setCommitted] = useState(item.committed?.toString() || '0');
  const [instock, setInstock] = useState(item.instock?.toString() || '0');
  const [price, setPrice] = useState(item.price?.toString() || '0');
  const [compare, setCompare] = useState(item.compare?.toString() || '');
  const [cost, setCost] = useState(item.cost?.toString() || '');
  const [location, setLocation] = useState(item.location || '');
  const [imageUrl, setImageUrl] = useState(item.f || '');
  const [modifiers, setModifiers] = useState(item.modifiers || []);
  const [metafields, setMetafields] = useState(item.metafields || []);

  const handleEdit = () => {
    setIsEditing(true);
  };

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
    if (!isNew) {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Variant',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(item.id)
        }
      ]
    );
  };

  const handleCancel = () => {
    if (isNew) {
      onCancel();
    } else {
      // Reset to original values
      setName(item.name || '');
      setSku(item.sku || '');
      setBarcode(item.barcode || '');
      setImageUrl(item.f || '');
      setAvailable(item.available?.toString() || '0');
      setCommitted(item.committed?.toString() || '0');
      setInstock(item.instock?.toString() || '0');
      setPrice(item.price?.toString() || '0');
      setCompare(item.compare?.toString() || '');
      setCost(item.cost?.toString() || '');
      setLocation(item.location || '');
      setModifiers(item.modifiers || []);
      setMetafields(item.metafields || []);
      setIsEditing(false);
    }
  };

  // View mode (not editing)
  if (!isEditing) {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>SKU: {item.sku}</Text>
            <Text style={styles.detailText}>Available: {item.available}</Text>
            <Text style={styles.detailText}>In Stock: {item.instock}</Text>
            <Text style={styles.detailText}>Price: ${item.price?.toFixed(2)}</Text>
            {item.cost && <Text style={styles.detailText}>Cost: ${item.cost.toFixed(2)}</Text>}
          </View>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="pencil-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Edit mode
  return (
    <View style={[styles.container, styles.editingContainer]}>
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
          value={imageUrl}
          onChangeText={setImageUrl}
          placeholder="Image URL"
        />
      </View>

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

      <View style={styles.formRow}>
        <Text style={styles.label}>Location:</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
        />
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  editingContainer: {
    flexDirection: 'column',
    borderBottomColor: '#007AFF',
    borderBottomWidth: 2,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 80,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    padding: 8,
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});
