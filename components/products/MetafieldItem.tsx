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
import { ProductMetafield, InventoryMetafield } from '@/types/Product';

type MetafieldItemProps = {
  item: ProductMetafield | InventoryMetafield;
  onUpdate: (id: string, key: string, value: string) => void;
  onDelete: (id: string) => void;
};

export function MetafieldItem({ item, onUpdate, onDelete }: MetafieldItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editKey, setEditKey] = useState(item.key);
  const [editValue, setEditValue] = useState(item.value);

  const handleSaveEdit = () => {
    if (!editKey.trim()) {
      Alert.alert('Error', 'Key cannot be empty');
      return;
    }

    if (!editValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    onUpdate(item.id, editKey.trim(), editValue.trim());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.metafieldContainer}>
        <View style={styles.metafieldEditRow}>
          <TextInput
            style={styles.metafieldEditInput}
            value={editKey}
            onChangeText={setEditKey}
            placeholder="Key"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.metafieldEditInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder="Value"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.metafieldEditActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditKey(item.key);
              setEditValue(item.value);
              setIsEditing(false);
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveEdit}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.metafieldContainer}>
      <View style={styles.metafieldRow}>
        <View style={styles.metafieldInfo}>
          <Text style={styles.metafieldKey}>{item.key}</Text>
          <Text style={styles.metafieldValue}>{item.value}</Text>
        </View>
        <View style={styles.metafieldActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsEditing(true)}
          >
            <Ionicons name="pencil-outline" size={18} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  metafieldContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  metafieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metafieldInfo: {
    flex: 1,
  },
  metafieldKey: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  metafieldValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  metafieldActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  metafieldEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metafieldEditInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  metafieldEditActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
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
});
