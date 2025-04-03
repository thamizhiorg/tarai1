import React, { useState } from 'react';
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

// Sample agent data
const agents = [
  { id: '1', name: 'Agent 1', description: 'General purpose assistant' },
  { id: '2', name: 'Agent 2', description: 'Code specialist' },
  { id: '3', name: 'Agent 3', description: 'Data analyst' },
  { id: '4', name: 'Agent 4', description: 'Creative writer' },
];

export function HUD() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [modalVisible, setModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.hudBar}>
        <Text style={styles.hudTitle}>HUD</Text>
        
        <TouchableOpacity 
          style={styles.agentSelector}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.agentName}>{selectedAgent.name}</Text>
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
            />
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
  agentName: {
    fontSize: 14,
    color: '#333',
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '70%',
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
});
