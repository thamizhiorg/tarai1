import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Inventory } from '@/types/Product';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  fetchInventoryForProduct,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '@/services/TursoService';
import { InventoryItemFullScreen } from './InventoryItemFullScreen';

type InventoryListFullScreenProps = {
  visible: boolean;
  productId: number;
  onClose: () => void;
};

export function InventoryListFullScreen({
  visible,
  productId,
  onClose
}: InventoryListFullScreenProps) {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [isItemFullScreenVisible, setIsItemFullScreenVisible] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const insets = useSafeAreaInsets();

  // Load inventory when component mounts or productId changes
  useEffect(() => {
    if (visible && productId) {
      loadInventory();
    }
  }, [visible, productId]);

  const loadInventory = async () => {
    if (!productId) return;

    setIsLoading(true);
    setError(null);

    try {
      const items = await fetchInventoryForProduct(productId);
      setInventory(items);
    } catch (err) {
      console.error('Error loading inventory:', err);
      setError(err instanceof Error ? err : new Error('Failed to load inventory'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    // Create a new empty inventory item template
    const newItem: Inventory = {
      id: -1,
      product_id: productId,
      name: '',
      f: null,
      sku: '',
      barcode: '',
      available: 0,
      committed: 0,
      instock: 0,
      price: 0,
      compare: null,
      cost: null,
      metafields: null,
      modifiers: null,
      location: ''
    };

    setIsAddingNew(true);
    setEditingItem(newItem);
    setIsItemFullScreenVisible(true);
  };

  const handleEditItem = (item: Inventory) => {
    setEditingItem(item);
    setIsItemFullScreenVisible(true);
  };

  const handleSaveItem = async (item: Inventory) => {
    setIsLoading(true);
    setError(null);

    try {
      if (item.id === -1) {
        // This is a new item
        const newItem = await createInventoryItem(item);
        if (newItem) {
          setInventory(prev => prev.filter(i => i.id !== -1).concat([newItem]));
          setIsAddingNew(false);
        } else {
          throw new Error('Failed to create inventory item');
        }
      } else {
        // This is an existing item
        const success = await updateInventoryItem(item);
        if (success) {
          setInventory(prev =>
            prev.map(i => i.id === item.id ? item : i)
          );
        } else {
          throw new Error('Failed to update inventory item');
        }
      }

      // Close the item edit screen
      setIsItemFullScreenVisible(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving inventory item:', err);
      Alert.alert('Error', 'Failed to save inventory item');
      setError(err instanceof Error ? err : new Error('Failed to save inventory item'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsItemFullScreenVisible(false);
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (itemId === -1) {
      // This is a new unsaved item, just remove it from state
      setInventory(prev => prev.filter(i => i.id !== -1));
      setIsAddingNew(false);
      setIsItemFullScreenVisible(false);
      setEditingItem(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await deleteInventoryItem(itemId);
      if (success) {
        setInventory(prev => prev.filter(i => i.id !== itemId));
        setIsItemFullScreenVisible(false);
        setEditingItem(null);
      } else {
        throw new Error('Failed to delete inventory item');
      }
    } catch (err) {
      console.error('Error deleting inventory item:', err);
      Alert.alert('Error', 'Failed to delete inventory item');
      setError(err instanceof Error ? err : new Error('Failed to delete inventory item'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderInventoryItem = ({ item }: { item: Inventory }) => (
    <TouchableOpacity
      style={styles.inventoryItemContainer}
      onPress={() => handleEditItem(item)}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>SKU: {item.sku}</Text>
          <Text style={styles.detailText}>Available: {item.available}</Text>
          <Text style={styles.detailText}>In Stock: {item.instock}</Text>
        </View>
        <View style={styles.detailsRow}>
          <Text style={styles.detailText}>Price: ${item.price?.toFixed(2)}</Text>
          {item.cost && <Text style={styles.detailText}>Cost: ${item.cost.toFixed(2)}</Text>}
        </View>
      </View>
      <View style={styles.actionsContainer}>
        <Ionicons name="chevron-forward" size={18} color="#999" />
      </View>
    </TouchableOpacity>
  );

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
          >
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventory Items</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNew}
          >
            <Ionicons name="add" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading && inventory.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Loading inventory...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#FF3B30" />
            <Text style={styles.errorText}>Error loading inventory</Text>
            <Text style={styles.errorMessage}>{error.message}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadInventory}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : inventory.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No variants found</Text>
            <Text style={styles.emptySubtext}>Add variants to track inventory</Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={handleAddNew}>
              <Ionicons name="add-circle-outline" size={20} color="#fff" style={styles.addFirstButtonIcon} />
              <Text style={styles.addFirstButtonText}>Add First Variant</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={inventory}
            renderItem={renderInventoryItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Loading overlay when refreshing data */}
        {isLoading && inventory.length > 0 && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}

        {/* Full Screen Inventory Edit/Add Form */}
        {editingItem && (
          <InventoryItemFullScreen
            visible={isItemFullScreenVisible}
            item={editingItem}
            isNew={isAddingNew}
            onSave={handleSaveItem}
            onCancel={handleCancelEdit}
            onDelete={editingItem.id !== -1 ? () => handleDeleteItem(editingItem.id) : undefined}
            isSaving={isLoading}
          />
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
  addButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
  },
  errorMessage: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  addFirstButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  addFirstButtonIcon: {
    marginRight: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  inventoryItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  actionsContainer: {
    marginLeft: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
