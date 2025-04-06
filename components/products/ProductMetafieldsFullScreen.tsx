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
import { ProductMetafield } from '@/types/Product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

type ProductMetafieldsFullScreenProps = {
  visible: boolean;
  metafields: ProductMetafield[];
  onClose: () => void;
  onSave: (metafields: ProductMetafield[]) => void;
  title?: string;
};

export function ProductMetafieldsFullScreen({
  visible,
  metafields,
  onClose,
  onSave,
  title = 'Custom Attributes'
}: ProductMetafieldsFullScreenProps) {
  const [localMetafields, setLocalMetafields] = useState<ProductMetafield[]>(metafields || []);
  const [editingMetafieldId, setEditingMetafieldId] = useState<string | null>(null);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [editKey, setEditKey] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSaveMetafields = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      onSave(localMetafields);
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const handleAddMetafield = () => {
    if (!newKey.trim()) {
      Alert.alert('Error', 'Key cannot be empty');
      return;
    }

    if (!newValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    const newMetafield: ProductMetafield = {
      id: uuidv4(),
      key: newKey.trim(),
      value: newValue.trim()
    };

    setLocalMetafields([...localMetafields, newMetafield]);
    setNewKey('');
    setNewValue('');
  };

  const handleDeleteMetafield = (id: string) => {
    setLocalMetafields(localMetafields.filter(metafield => metafield.id !== id));
    if (editingMetafieldId === id) {
      setEditingMetafieldId(null);
    }
  };

  const startEditingMetafield = (metafield: ProductMetafield) => {
    setEditingMetafieldId(metafield.id);
    setEditKey(metafield.key);
    setEditValue(metafield.value);
  };

  const cancelEditingMetafield = () => {
    setEditingMetafieldId(null);
    setEditKey('');
    setEditValue('');
  };

  const saveEditingMetafield = (id: string) => {
    if (!editKey.trim()) {
      Alert.alert('Error', 'Key cannot be empty');
      return;
    }

    if (!editValue.trim()) {
      Alert.alert('Error', 'Value cannot be empty');
      return;
    }

    const updatedMetafields = localMetafields.map(metafield => {
      if (metafield.id === id) {
        return {
          ...metafield,
          key: editKey.trim(),
          value: editValue.trim()
        };
      }
      return metafield;
    });

    setLocalMetafields(updatedMetafields);
    setEditingMetafieldId(null);
  };

  const renderMetafield = ({ item }: { item: ProductMetafield }) => {
    const isEditing = editingMetafieldId === item.id;

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
              onPress={cancelEditingMetafield}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={() => saveEditingMetafield(item.id)}
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
              onPress={() => startEditingMetafield(item)}
            >
              <Ionicons name="pencil-outline" size={18} color="#007AFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleDeleteMetafield(item.id)}
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
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveMetafields}
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
          <Text style={styles.subtitle}>Add custom key-value pairs</Text>
          
          {localMetafields.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="list-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No custom attributes added yet</Text>
              <Text style={styles.emptySubtext}>Add custom key-value pairs</Text>
            </View>
          ) : (
            <FlatList
              data={localMetafields}
              renderItem={renderMetafield}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* Add Metafield Footer */}
        <View style={styles.footer}>
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
  keyInput: {
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
