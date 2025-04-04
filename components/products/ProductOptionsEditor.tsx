import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ProductOption } from '@/types/Product';
import { v4 as uuidv4 } from 'uuid';

type ProductOptionsEditorProps = {
  options?: ProductOption[];
  onChange: (options: ProductOption[]) => void;
  maxOptions?: number;
};

export function ProductOptionsEditor({
  options = [],
  onChange,
  maxOptions = 3
}: ProductOptionsEditorProps) {
  const [newOptionName, setNewOptionName] = useState('');
  const [expandedOptionId, setExpandedOptionId] = useState<string | null>(null);
  const [newOptionValue, setNewOptionValue] = useState('');

  const handleAddOption = () => {
    if (!newOptionName.trim()) {
      Alert.alert('Error', 'Option name cannot be empty');
      return;
    }

    if ((options || []).length >= maxOptions) {
      Alert.alert('Error', `Maximum ${maxOptions} options allowed`);
      return;
    }

    const newOption: ProductOption = {
      id: uuidv4(),
      name: newOptionName.trim(),
      values: []
    };

    onChange([...(options || []), newOption]);
    setNewOptionName('');
    setExpandedOptionId(newOption.id);
  };

  const handleDeleteOption = (optionId: string) => {
    onChange((options || []).filter(option => option.id !== optionId));
    if (expandedOptionId === optionId) {
      setExpandedOptionId(null);
    }
  };

  const handleAddOptionValue = (optionId: string) => {
    if (!newOptionValue.trim()) {
      Alert.alert('Error', 'Option value cannot be empty');
      return;
    }

    const updatedOptions = (options || []).map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          values: [...option.values, newOptionValue.trim()]
        };
      }
      return option;
    });

    onChange(updatedOptions);
    setNewOptionValue('');
  };

  const handleDeleteOptionValue = (optionId: string, valueIndex: number) => {
    const updatedOptions = (options || []).map(option => {
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

    onChange(updatedOptions);
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
            {item.values.map((value, index) => (
              <View key={index} style={styles.optionValueRow}>
                <Text style={styles.optionValue}>{value}</Text>
                <TouchableOpacity
                  style={styles.deleteValueButton}
                  onPress={() => handleDeleteOptionValue(item.id, index)}
                >
                  <Ionicons name="close-circle" size={18} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}

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
    <View style={styles.container}>
      <Text style={styles.title}>Product Options</Text>
      <Text style={styles.subtitle}>Add up to {maxOptions} options (like size, color)</Text>

      <View style={styles.optionsList}>
        {(options || []).length === 0 ? (
          <Text style={styles.emptyText}>No options added yet</Text>
        ) : (
          (options || []).map(item => {
            const isExpanded = expandedOptionId === item.id;

            return (
              <View key={item.id} style={styles.optionContainer}>
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
                    {item.values.map((value, index) => (
                      <View key={index} style={styles.optionValueRow}>
                        <Text style={styles.optionValue}>{value}</Text>
                        <TouchableOpacity
                          style={styles.deleteValueButton}
                          onPress={() => handleDeleteOptionValue(item.id, index)}
                        >
                          <Ionicons name="close-circle" size={18} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    ))}

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
          })
        )}
      </View>

      {(options || []).length < maxOptions && (
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
      )}
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
  optionsList: {
    maxHeight: 300,
  },
  optionContainer: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 8,
  },
  optionCount: {
    fontSize: 14,
    color: '#999',
    marginLeft: 8,
  },
  deleteButton: {
    padding: 8,
  },
  optionValuesContainer: {
    marginTop: 8,
    paddingLeft: 26,
  },
  optionValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionValue: {
    fontSize: 14,
    color: '#333',
  },
  deleteValueButton: {
    padding: 4,
  },
  addValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addValueInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 14,
  },
  addValueButton: {
    padding: 8,
  },
  addOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 16,
  },
  addOptionInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
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
