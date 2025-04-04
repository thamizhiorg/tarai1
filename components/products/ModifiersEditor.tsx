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
import { ProductModifier, InventoryModifier } from '@/types/Product';
import { ModifierItem } from './ModifierItem';
import { v4 as uuidv4 } from 'uuid';

type ModifiersEditorProps = {
  modifiers?: (ProductModifier | InventoryModifier)[];
  onChange: (modifiers: (ProductModifier | InventoryModifier)[]) => void;
  title?: string;
};

export function ModifiersEditor({
  modifiers = [],
  onChange,
  title = 'Modifiers'
}: ModifiersEditorProps) {
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddModifier = () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!newValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    const newModifier = {
      id: uuidv4(),
      name: newName.trim(),
      value: newValue.trim()
    };

    onChange([...(modifiers || []), newModifier]);
    setNewName('');
    setNewValue('');
  };

  const handleDeleteModifier = (id: string) => {
    onChange((modifiers || []).filter(modifier => modifier.id !== id));
  };

  const handleUpdateModifier = (id: string, name: string, value: string) => {
    const updatedModifiers = (modifiers || []).map(modifier => {
      if (modifier.id === id) {
        return { ...modifier, name, value };
      }
      return modifier;
    });

    onChange(updatedModifiers);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Add modifiers to customize the product</Text>

      <View style={styles.modifiersList}>
        {(modifiers || []).length === 0 ? (
          <Text style={styles.emptyText}>No modifiers added yet</Text>
        ) : (
          (modifiers || []).map(item => (
            <ModifierItem
              key={item.id}
              item={item}
              onUpdate={handleUpdateModifier}
              onDelete={handleDeleteModifier}
            />
          ))
        )}
      </View>

      <View style={styles.addContainer}>
        <View style={styles.addInputsRow}>
          <TextInput
            style={[styles.addInput, styles.nameInput]}
            value={newName}
            onChangeText={setNewName}
            placeholder="Name"
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
          onPress={handleAddModifier}
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
  modifiersList: {
    maxHeight: 300,
  },
  modifierContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  modifierRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modifierInfo: {
    flex: 1,
  },
  modifierName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  modifierValue: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  modifierActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  modifierEditRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modifierEditInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  modifierEditActions: {
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
  nameInput: {
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
