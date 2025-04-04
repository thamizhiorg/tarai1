import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Inventory } from '@/types/Product';
import { InventoryItemRow } from './InventoryItemRow';
import { InventoryItemFullScreen } from './InventoryItemFullScreen';
import {
  fetchInventoryForProduct,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem
} from '@/services/TursoService';

type InventoryManagerProps = {
  productId: number;
};

export function InventoryManager({ productId }: InventoryManagerProps) {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingItem, setEditingItem] = useState<Inventory | null>(null);
  const [isFullScreenVisible, setIsFullScreenVisible] = useState(false);

  // Load inventory when component mounts or productId changes
  useEffect(() => {
    console.log('InventoryManager useEffect triggered with productId:', productId);
    if (productId) {
      loadInventory();
    }
  }, [productId]);

  const loadInventory = async () => {
    if (!productId) return;

    console.log('Loading inventory for product ID:', productId);
    setIsLoading(true);
    setError(null);

    try {
      const items = await fetchInventoryForProduct(productId);
      console.log('Inventory items loaded:', items.length, items);
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
    setIsFullScreenVisible(true);
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
    } catch (err) {
      console.error('Error saving inventory item:', err);
      Alert.alert('Error', 'Failed to save inventory item');
      setError(err instanceof Error ? err : new Error('Failed to save inventory item'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    if (itemId === -1) {
      // This is a new unsaved item, just remove it from state
      setInventory(prev => prev.filter(i => i.id !== -1));
      setIsAddingNew(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const success = await deleteInventoryItem(itemId);
      if (success) {
        setInventory(prev => prev.filter(i => i.id !== itemId));
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

  const handleCancelAdd = () => {
    setInventory(prev => prev.filter(i => i.id !== -1));
    setIsAddingNew(false);
    setEditingItem(null);
    setIsFullScreenVisible(false);
  };

  const handleEditItem = (item: Inventory) => {
    setEditingItem(item);
    setIsFullScreenVisible(true);
  };

  if (isLoading && inventory.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading inventory...</Text>
      </View>
    );
  }

  if (error && inventory.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadInventory}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Variants</Text>
        {!isAddingNew && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddNew}
            disabled={isLoading}
          >
            <Ionicons name="add-circle-outline" size={18} color="#007AFF" />
            <Text style={styles.addButtonText}>Add Variant</Text>
          </TouchableOpacity>
        )}
      </View>

      {inventory.length === 0 && !isAddingNew ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cube-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No variants found</Text>
          <Text style={styles.emptySubtext}>Add variants to track inventory</Text>
        </View>
      ) : (
        <View style={styles.listContent}>
          {inventory.map(item => (
            <TouchableOpacity
              key={item.id.toString()}
              style={styles.inventoryItemContainer}
              onPress={() => handleEditItem(item)}
            >
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>SKU: {item.sku}</Text>
                  <Text style={styles.detailText}>Available: {item.available}</Text>
                  <Text style={styles.detailText}>In Stock: {item.instock}</Text>
                  <Text style={styles.detailText}>Price: ${item.price?.toFixed(2)}</Text>
                  {item.cost && <Text style={styles.detailText}>Cost: ${item.cost.toFixed(2)}</Text>}
                </View>
              </View>
              <View style={styles.actionsContainer}>
                <Ionicons name="chevron-forward" size={18} color="#999" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {isLoading && inventory.length > 0 && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {/* Full Screen Inventory Edit/Add Form */}
      {editingItem && (
        <InventoryItemFullScreen
          visible={isFullScreenVisible}
          item={editingItem}
          isNew={editingItem.id === -1}
          onSave={handleSaveItem}
          onCancel={handleCancelAdd}
          isSaving={isLoading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inventoryItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
    marginRight: 8,
    marginBottom: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    marginLeft: 4,
    color: '#007AFF',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
