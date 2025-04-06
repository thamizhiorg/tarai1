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
import { InventoryListFullScreen } from './InventoryListFullScreen';
import {
  fetchInventoryForProduct
} from '@/services/TursoService';

type InventoryManagerProps = {
  productId: number;
};

export function InventoryManager({ productId }: InventoryManagerProps) {
  const [isInventoryListVisible, setIsInventoryListVisible] = useState(false);

  const handleOpenInventoryList = () => {
    setIsInventoryListVisible(true);
  };

  const handleCloseInventoryList = () => {
    setIsInventoryListVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Variants</Text>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={handleOpenInventoryList}
        >
          <Ionicons name="list-outline" size={18} color="#007AFF" />
          <Text style={styles.viewButtonText}>View Inventory</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons name="cube-outline" size={48} color="#ccc" />
        <Text style={styles.infoText}>Tap 'View Inventory' to manage product variants</Text>
      </View>

      {/* Full Screen Inventory List */}
      <InventoryListFullScreen
        visible={isInventoryListVisible}
        productId={productId}
        onClose={handleCloseInventoryList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  viewButtonText: {
    marginLeft: 4,
    color: '#007AFF',
    fontWeight: '500',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  }
});
