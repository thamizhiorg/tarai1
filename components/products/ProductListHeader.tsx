import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type FilterOptions = {
  category?: string;
  inStock?: boolean;
  priceRange?: { min: number; max: number };
};

export type ColumnVisibility = {
  category: boolean;
  price: boolean;
  stock: boolean;
  id: boolean;
};

type ProductListHeaderProps = {
  onSearch: (query: string) => void;
  onFilter: (options: FilterOptions) => void;
  onColumnVisibilityChange: (visibility: ColumnVisibility) => void;
  searchQuery: string;
  filterOptions: FilterOptions;
  columnVisibility: ColumnVisibility;
};

export function ProductListHeader({
  onSearch,
  onFilter,
  onColumnVisibilityChange,
  searchQuery,
  filterOptions,
  columnVisibility = {
    category: true,
    price: true,
    stock: true,
    id: true
  }
}: ProductListHeaderProps) {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isColumnModalVisible, setIsColumnModalVisible] = useState(false);
  const [localFilterOptions, setLocalFilterOptions] = useState<FilterOptions>(filterOptions);
  const [localColumnVisibility, setLocalColumnVisibility] = useState<ColumnVisibility>(columnVisibility);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  const handleSearchChange = (text: string) => {
    onSearch(text);
  };

  const handleFilterPress = () => {
    setLocalFilterOptions(filterOptions);
    setIsFilterModalVisible(true);
  };

  const handleApplyFilter = () => {
    onFilter(localFilterOptions);
    setIsFilterModalVisible(false);
  };

  const handleCancelFilter = () => {
    setIsFilterModalVisible(false);
  };

  const handleClearFilter = () => {
    const emptyFilter: FilterOptions = {};
    setLocalFilterOptions(emptyFilter);
    onFilter(emptyFilter);
    setIsFilterModalVisible(false);
  };

  const handleClearSearch = () => {
    onSearch('');
  };

  const handleColumnPress = () => {
    if (columnVisibility) {
      setLocalColumnVisibility(columnVisibility);
    } else {
      // Set default values if columnVisibility is undefined
      setLocalColumnVisibility({
        category: true,
        price: true,
        stock: true,
        id: true
      });
    }
    setIsColumnModalVisible(true);
  };

  const handleApplyColumns = () => {
    onColumnVisibilityChange(localColumnVisibility);
    setIsColumnModalVisible(false);
  };

  const handleCancelColumns = () => {
    setIsColumnModalVisible(false);
  };

  const handleResetColumns = () => {
    const defaultVisibility: ColumnVisibility = {
      category: true,
      price: true,
      stock: true,
      id: true
    };
    setLocalColumnVisibility(defaultVisibility);
    onColumnVisibilityChange(defaultVisibility);
    setIsColumnModalVisible(false);
  };

  const hasActiveFilters = Object.keys(filterOptions || {}).length > 0;
  const hasCustomColumns = columnVisibility ? !Object.values(columnVisibility).every(value => value === true) : false;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={18} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        {/* Filter Button */}
        <TouchableOpacity
          style={[styles.actionButton, hasActiveFilters && styles.activeActionButton]}
          onPress={handleFilterPress}
        >
          <Ionicons
            name="filter"
            size={20}
            color={hasActiveFilters ? "#007AFF" : "#666"}
          />
        </TouchableOpacity>

        {/* Column Visibility Button */}
        <TouchableOpacity
          style={[styles.actionButton, hasCustomColumns && styles.activeActionButton]}
          onPress={handleColumnPress}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={hasCustomColumns ? "#007AFF" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelFilter}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Products</Text>
            <TouchableOpacity onPress={handleCancelFilter}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Category Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Category</Text>
              <View style={styles.categoryOptions}>
                {['All', 'Electronics', 'Clothing', 'Food', 'Books'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      (localFilterOptions.category === category ||
                        (category === 'All' && !localFilterOptions.category)) &&
                      styles.selectedCategoryOption
                    ]}
                    onPress={() => setLocalFilterOptions({
                      ...localFilterOptions,
                      category: category === 'All' ? undefined : category
                    })}
                  >
                    <Text style={[
                      styles.categoryText,
                      (localFilterOptions.category === category ||
                        (category === 'All' && !localFilterOptions.category)) &&
                      styles.selectedCategoryText
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* In Stock Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Availability</Text>
              <TouchableOpacity
                style={[
                  styles.stockOption,
                  localFilterOptions.inStock && styles.selectedStockOption
                ]}
                onPress={() => setLocalFilterOptions({
                  ...localFilterOptions,
                  inStock: !localFilterOptions.inStock
                })}
              >
                <Ionicons
                  name={localFilterOptions.inStock ? "checkbox" : "square-outline"}
                  size={20}
                  color={localFilterOptions.inStock ? "#007AFF" : "#666"}
                  style={styles.checkboxIcon}
                />
                <Text style={styles.stockText}>In Stock Only</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearFilter}
            >
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Column Visibility Modal */}
      <Modal
        visible={isColumnModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelColumns}
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Column Visibility</Text>
            <TouchableOpacity onPress={handleCancelColumns}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Show/Hide Columns</Text>

              {/* Category Column */}
              <TouchableOpacity
                style={styles.columnOption}
                onPress={() => setLocalColumnVisibility({
                  ...localColumnVisibility,
                  category: !localColumnVisibility.category
                })}
              >
                <Ionicons
                  name={localColumnVisibility.category ? "checkbox" : "square-outline"}
                  size={20}
                  color={localColumnVisibility.category ? "#007AFF" : "#666"}
                  style={styles.checkboxIcon}
                />
                <Text style={styles.columnText}>Category</Text>
              </TouchableOpacity>

              {/* Price Column */}
              <TouchableOpacity
                style={styles.columnOption}
                onPress={() => setLocalColumnVisibility({
                  ...localColumnVisibility,
                  price: !localColumnVisibility.price
                })}
              >
                <Ionicons
                  name={localColumnVisibility.price ? "checkbox" : "square-outline"}
                  size={20}
                  color={localColumnVisibility.price ? "#007AFF" : "#666"}
                  style={styles.checkboxIcon}
                />
                <Text style={styles.columnText}>Price</Text>
              </TouchableOpacity>

              {/* Stock Column */}
              <TouchableOpacity
                style={styles.columnOption}
                onPress={() => setLocalColumnVisibility({
                  ...localColumnVisibility,
                  stock: !localColumnVisibility.stock
                })}
              >
                <Ionicons
                  name={localColumnVisibility.stock ? "checkbox" : "square-outline"}
                  size={20}
                  color={localColumnVisibility.stock ? "#007AFF" : "#666"}
                  style={styles.checkboxIcon}
                />
                <Text style={styles.columnText}>Stock Status</Text>
              </TouchableOpacity>

              {/* ID Column */}
              <TouchableOpacity
                style={styles.columnOption}
                onPress={() => setLocalColumnVisibility({
                  ...localColumnVisibility,
                  id: !localColumnVisibility.id
                })}
              >
                <Ionicons
                  name={localColumnVisibility.id ? "checkbox" : "square-outline"}
                  size={20}
                  color={localColumnVisibility.id ? "#007AFF" : "#666"}
                  style={styles.checkboxIcon}
                />
                <Text style={styles.columnText}>Product ID</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleResetColumns}
            >
              <Text style={styles.clearButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyColumns}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  actionButton: {
    padding: 10,
    marginLeft: 4,
    borderRadius: 8,
  },
  activeActionButton: {
    backgroundColor: '#e6f2ff',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  categoryOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryOption: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#fff',
  },
  stockOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  selectedStockOption: {
    backgroundColor: '#f5f5f7',
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  checkboxIcon: {
    marginRight: 8,
  },
  stockText: {
    fontSize: 16,
    color: '#333',
  },
  columnOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  columnText: {
    fontSize: 16,
    color: '#333',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  clearButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
