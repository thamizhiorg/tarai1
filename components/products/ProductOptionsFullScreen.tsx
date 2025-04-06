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
import { ProductOption } from '@/types/Product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { v4 as uuidv4 } from 'uuid';

type ProductOptionsFullScreenProps = {
  visible: boolean;
  options: ProductOption[];
  onClose: () => void;
  onSave: (options: ProductOption[]) => void;
  maxOptions?: number;
};

export function ProductOptionsFullScreen({
  visible,
  options,
  onClose,
  onSave,
  maxOptions = 3
}: ProductOptionsFullScreenProps) {
  const [localOptions, setLocalOptions] = useState<ProductOption[]>(options || []);
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>(null);
  const [newOptionName, setNewOptionName] = useState('');
  const [newOptionValue, setNewOptionValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSaveOptions = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      onSave(localOptions);
      setIsSaving(false);
      onClose();
    }, 500);
  };

  const handleAddOption = () => {
    if (!newOptionName.trim()) {
      Alert.alert('Error', 'Option name cannot be empty');
      return;
    }

    if (localOptions.length >= maxOptions) {
      Alert.alert('Error', `Maximum ${maxOptions} options allowed`);
      return;
    }

    const newOption: ProductOption = {
      id: uuidv4(),
      name: newOptionName.trim(),
      values: []
    };

    setLocalOptions([...localOptions, newOption]);
    setNewOptionName('');
    setExpandedOptionId(newOption.id);
  };

  const handleDeleteOption = (optionId: string) => {
    setLocalOptions(localOptions.filter(option => option.id !== optionId));
    if (expandedOptionId === optionId) {
      setExpandedOptionId(null);
    }
  };

  const handleAddOptionValue = (optionId: string) => {
    if (!newOptionValue.trim()) {
      Alert.alert('Error', 'Option value cannot be empty');
      return;
    }

    const updatedOptions = localOptions.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          values: [...option.values, newOptionValue.trim()]
        };
      }
      return option;
    });

    setLocalOptions(updatedOptions);
    setNewOptionValue('');
  };

  const handleDeleteOptionValue = (optionId: string, valueIndex: number) => {
    const updatedOptions = localOptions.map(option => {
      if (option.id === optionId) {
        const newValues = [...option.values];
        newValues.splice(valueIndex, 1);
        return {
          ...option,
          values: newValues
        };
      }
      return option;
    });

    setLocalOptions(updatedOptions);
  };

  const toggleOptionExpanded = (optionId: string) => {
    setExpandedOptionId(expandedOptionId === optionId ? null : optionId);
  };

  const renderOption = ({ item }: { item: ProductOption }) => {
    const isExpanded = expandedOptionId === item.id;

    return (
      <View style={styles.optionContainer}>
        <View style={styles.optionHeader}>
          <TouchableOpacity
            style={styles.optionTitleContainer}
            onPress={() => toggleOptionExpanded(item.id)}
          >
            <Ionicons
              name={isExpanded ? 'chevron-down' : 'chevron-forward'}
              size={18}
              color="#666"
            />
            <Text style={styles.optionTitle}>{item.name}</Text>
            <Text style={styles.optionCount}>
              {item.values.length} {item.values.length === 1 ? 'value' : 'values'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteOption(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {isExpanded && (
          <View style={styles.optionValuesContainer}>
            {item.values.length === 0 ? (
              <Text style={styles.emptyValuesText}>No values added yet</Text>
            ) : (
              <View style={styles.valuesList}>
                {item.values.map((value, index) => (
                  <View key={index} style={styles.valueItem}>
                    <Text style={styles.valueText}>{value}</Text>
                    <TouchableOpacity
                      style={styles.deleteValueButton}
                      onPress={() => handleDeleteOptionValue(item.id, index)}
                    >
                      <Ionicons name="close-circle" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.addValueContainer}>
              <TextInput
                style={styles.addValueInput}
                value={newOptionValue}
                onChangeText={setNewOptionValue}
                placeholder="Add new value"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.addValueButton}
                onPress={() => handleAddOptionValue(item.id)}
              >
                <Ionicons name="add-circle" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
          <Text style={styles.headerTitle}>Product Options</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveOptions}
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
          <Text style={styles.subtitle}>Add up to {maxOptions} options (like size, color)</Text>
          
          {localOptions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="options-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No options added yet</Text>
              <Text style={styles.emptySubtext}>Add options like size, color, etc.</Text>
            </View>
          ) : (
            <FlatList
              data={localOptions}
              renderItem={renderOption}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
            />
          )}
        </View>

        {/* Add Option Footer */}
        {localOptions.length < maxOptions && (
          <View style={styles.footer}>
            <View style={styles.addOptionContainer}>
              <TextInput
                style={styles.addOptionInput}
                value={newOptionName}
                onChangeText={setNewOptionName}
                placeholder="Add new option (e.g., Size, Color)"
                placeholderTextColor="#999"
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddOption}
              >
                <Text style={styles.addButtonText}>Add Option</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  optionContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    overflow: 'hidden',
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  optionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#333',
  },
  optionCount: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 4,
  },
  optionValuesContainer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  emptyValuesText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  valuesList: {
    marginBottom: 12,
  },
  valueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    marginBottom: 8,
  },
  valueText: {
    fontSize: 14,
    color: '#333',
  },
  deleteValueButton: {
    padding: 4,
  },
  addValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addValueInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
  },
  addValueButton: {
    padding: 4,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addOptionInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});
