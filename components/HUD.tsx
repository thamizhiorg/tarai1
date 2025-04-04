import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  SafeAreaView
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/IconSymbol';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useAgent } from '@/context/AgentContext';
import { router } from 'expo-router';

// Agent data
const agents = [
  { id: '1', emoji: '🏷️', name: 'Products', description: 'View and manage your product catalog' },
  { id: '2', emoji: '📦', name: 'Inventory', description: 'Track and manage inventory' },
  { id: '4', emoji: '👜', name: 'Orders', description: 'Process and track orders' },
];

type HUDProps = {
  onAgentChange?: (agentId: string) => void;
};

export function HUD({ onAgentChange }: HUDProps = {}) {
  const { currentAgentId, setCurrentAgentId } = useAgent();
  const [selectedAgent, setSelectedAgent] = useState(() => {
    return agents.find(agent => agent.id === currentAgentId) || agents[0];
  });
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { loadProducts, productsLoaded } = useProducts();

  const handleSignOut = () => {
    // Close the modal first
    setModalVisible(false);

    // Navigate to the dedicated sign-out screen
    router.replace('/sign-out');
  };

  const handleSelectAgent = (agent: any) => {
    setSelectedAgent(agent);
    setModalVisible(false);

    // Update agent context
    setCurrentAgentId(agent.id);

    // Notify parent component about agent change if provided
    if (onAgentChange) {
      onAgentChange(agent.id);
    }

    // Handle navigation based on agent selection
    if (agent.id === '1') { // Products agent - View products
      // Only load products if not already loaded
      if (!productsLoaded) {
        loadProducts();
      }
      // Navigate to workspace tab
      router.replace('/(tabs)/workspace');
    }
  };

  // Load products on initial render if Products agent is selected and not already loaded
  useEffect(() => {
    if (selectedAgent.id === '1' && !productsLoaded) { // Products agent
      console.log('Initial load of products from HUD');
      loadProducts();
    }
  }, [loadProducts, productsLoaded, selectedAgent.id]);

  // Update selected agent when currentAgentId changes
  useEffect(() => {
    const agent = agents.find(a => a.id === currentAgentId);
    if (agent && agent.id !== selectedAgent.id) {
      setSelectedAgent(agent);
    }
  }, [currentAgentId]);

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.hudBar}>
        <Text style={styles.hudTitle}>HUD</Text>

        <TouchableOpacity
          style={styles.agentSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.agentEmoji}>{selectedAgent.emoji}</Text>
          <IconSymbol
            name={{ type: 'material', name: 'chevron-right' }}
            size={18}
            color="#666"
            style={styles.dropdownIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Agent Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Agent</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>Close</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalContentInner}>
              <FlatList
                data={agents}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.agentItem,
                      selectedAgent.id === item.id && styles.selectedAgentItem
                    ]}
                    onPress={() => handleSelectAgent(item)}
                  >
                    <Text style={styles.agentItemEmoji}>{item.emoji}</Text>
                    <View style={styles.agentInfo}>
                      <Text style={styles.agentItemName}>{item.name}</Text>
                      <Text style={styles.agentDescription}>{item.description}</Text>
                    </View>
                    {selectedAgent.id === item.id && (
                      <IconSymbol
                        name={{ type: 'material', name: 'check' }}
                        size={20}
                        color="#007AFF"
                      />
                    )}
                  </TouchableOpacity>
                )}
                style={styles.agentList}
              />

              {user && (
                <TouchableOpacity
                  style={styles.profileContainer}
                  onPress={handleSignOut}
                >
                  <View style={styles.profileImageContainer}>
                    <Text style={styles.profileInitial}>{user.email.charAt(0).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.profileEmail}>{user.email}</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    zIndex: 10,
  },
  hudBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hudTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  agentSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  agentEmoji: {
    fontSize: 18,
    marginRight: 4,
  },
  dropdownIcon: {
    transform: [{ rotate: '90deg' }],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingBottom: 20,
    height: '100%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  agentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedAgentItem: {
    backgroundColor: '#f0f8ff',
  },
  agentItemEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  agentInfo: {
    flex: 1,
  },
  agentItemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  agentDescription: {
    fontSize: 14,
    color: '#666',
  },
  modalContentInner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  agentList: {
    flex: 1,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  profileImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
});
