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

type ModifierItemProps = {
  item: ProductModifier | InventoryModifier;
  onUpdate: (id: string, name: string, value: string) => void;
  onDelete: (id: string) => void;
};

export function ModifierItem({ item, onUpdate, onDelete }: ModifierItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [editValue, setEditValue] = useState(item.value);

  const handleSaveEdit = () => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!editValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    onUpdate(item.id, editName.trim(), editValue.trim());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={styles.modifierContainer}>
        <View style={styles.modifierEditRow}>
          <TextInput
            style={styles.modifierEditInput}
            value={editName}
            onChangeText={setEditName}
            placeholder="Name"
            placeholderTextColor="#999"
          />
          <TextInput
            style={styles.modifierEditInput}
            value={editValue}
            onChangeText={setEditValue}
            placeholder="Value"
            placeholderTextColor="#999"
          />
        </View>
        <View style={styles.modifierEditActions}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setEditName(item.name);
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
    <View style={styles.modifierContainer}>
      <View style={styles.modifierRow}>
        <View style={styles.modifierInfo}>
          <Text style={styles.modifierName}>{item.name}</Text>
          <Text style={styles.modifierValue}>{item.value}</Text>
        </View>
        <View style={styles.modifierActions}>
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
});
