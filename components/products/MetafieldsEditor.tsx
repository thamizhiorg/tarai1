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
import { MetafieldItem } from './MetafieldItem';
import { v4 as uuidv4 } from 'uuid';

type MetafieldsEditorProps = {
  metafields?: (ProductMetafield | InventoryMetafield)[];
  onChange: (metafields: (ProductMetafield | InventoryMetafield)[]) => void;
  title?: string;
};

export function MetafieldsEditor({
  metafields = [],
  onChange,
  title = 'Custom Attributes'
}: MetafieldsEditorProps) {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddMetafield = () => {
    if (!newKey.trim()) {
      Alert.alert('Error', 'Key cannot be empty');
      return;
    }

    if (!newValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    const newMetafield = {
      id: uuidv4(),
      key: newKey.trim(),
      value: newValue.trim()
    };

    onChange([...(metafields || []), newMetafield]);
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteMetafield = (id: string) => {
    onChange((metafields || []).filter(metafield => metafield.id !== id));
  };

  const handleUpdateMetafield = (id: string, key: string, value: string) => {
    const updatedMetafields = (metafields || []).map(metafield => {
      if (metafield.id === id) {
        return { ...metafield, key, value };
      }
      return metafield;
    });

    onChange(updatedMetafields);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Add custom key-value pairs</Text>

      <View style={styles.metafieldsList}>
        {(metafields || []).length === 0 ? (
          <Text style={styles.emptyText}>No custom attributes added yet</Text>
        ) : (
          (metafields || []).map(item => (
            <MetafieldItem
              key={item.id}
              item={item}
              onUpdate={handleUpdateMetafield}
              onDelete={handleDeleteMetafield}
            />
          ))
        )}
      </View>

      <View style={styles.addContainer}>
        <View style={styles.addInputsRow}>
          <TextInput
            style={[styles.addInput, styles.keyInput]}
            value={newKey}
            onChangeText={setNewKey}
            placeholder="Key"
            placeholderTextColor="#999"
          />
          <TextInput
            style={[styles.addInput, styles.valueInput]}
            value={newValue}
            onChangeText={setNewValue}
            placeholder="Value"
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddMetafield}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  metafieldsList: {
    maxHeight: 300,
  },
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
  addContainer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  addInputsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addInput: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 14,
  },
  keyInput: {
    flex: 1,
    marginRight: 8,
  },
  valueInput: {
    flex: 2,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
});
