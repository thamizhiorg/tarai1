import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductModifier } from '@/types/Product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

type ProductModifiersFullScreenProps = {
  visible: boolean;
  modifiers: ProductModifier[];
  onClose: () => void;
  onSave: (modifiers: ProductModifier[]) => void;
};

export function ProductModifiersFullScreen({
  visible,
  modifiers,
  onClose,
  onSave
}: ProductModifiersFullScreenProps) {
  const [localModifiers, setLocalModifiers] = useState<ProductModifier[]>(modifiers || []);
  const [editingModifierId, setEditingModifierId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editName, setEditName] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSaveModifiers = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      onSave(localModifiers);
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const handleAddModifier = () => {
    if (!newName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!newValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    const newModifier: ProductModifier = {
      id: uuidv4(),
      name: newName.trim(),
      value: newValue.trim()
    };

    setLocalModifiers([...localModifiers, newModifier]);
    setNewName('');
    setNewValue('');
  };

  const handleDeleteModifier = (id: string) => {
    setLocalModifiers(localModifiers.filter(modifier => modifier.id !== id));
    if (editingModifierId === id) {
      setEditingModifierId(null);
    }
  };

  const startEditingModifier = (modifier: ProductModifier) => {
    setEditingModifierId(modifier.id);
    setEditName(modifier.name);
    setEditValue(modifier.value);
  };

  const cancelEditingModifier = () => {
    setEditingModifierId(null);
    setEditName('');
    setEditValue('');
  };

  const saveEditingModifier = (id: string) => {
    if (!editName.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    if (!editValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    const updatedModifiers = localModifiers.map(modifier => {
      if (modifier.id === id) {
        return {
          ...modifier,
          name: editName.trim(),
          value: editValue.trim()
        };
      }
      return modifier;
    });

    setLocalModifiers(updatedModifiers);
    setEditingModifierId(null);
  };

  const renderModifier = ({ item }: { item: ProductModifier }) => {
    const isEditing = editingModifierId === item.id;

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
              onPress={cancelEditingModifier}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveEditingModifier(item.id)}
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
              onPress={() => startEditingModifier(item)}
            >
              <Ionicons name="pencil-outline" size={18} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteModifier(item.id)}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onClose}
            disabled={isSaving}
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Product Modifiers</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveModifiers}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.subtitle}>Add modifiers to customize the product</Text>
          
          {localModifiers.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="construct-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No modifiers added yet</Text>
              <Text style={styles.emptySubtext}>Add modifiers to customize the product</Text>
            </View>
          ) : (
            <FlatList
              data={localModifiers}
              renderItem={renderModifier}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* Add Modifier Footer */}
        <View style={styles.footer}>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
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
    borderRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addContainer: {
    marginTop: 0,
  },
  addInputsRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  addInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  nameInput: {
    flex: 1,
    marginRight: 8,
  },
  valueInput: {
    flex: 1,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
