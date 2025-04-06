import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RichTextEditor } from '@/components/ui/RichTextEditor';

type ProductNotesFullScreenProps = {
  visible: boolean;
  notes: string;
  onClose: () => void;
  onSave: (notes: string) => void;
};

export function ProductNotesFullScreen({
  visible,
  notes,
  onClose,
  onSave
}: ProductNotesFullScreenProps) {
  const [localNotes, setLocalNotes] = useState<string>(notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const insets = useSafeAreaInsets();

  const handleSaveNotes = () => {
    setIsSaving(true);
    // Simulate API call delay
    setTimeout(() => {
      onSave(localNotes);
      setIsSaving(false);
      onClose();
    }, 500);
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
          <Text style={styles.headerTitle}>Product Notes</Text>
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSaveNotes}
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
          <Text style={styles.subtitle}>Add detailed notes about this product</Text>
          
          <RichTextEditor
            value={localNotes}
            onChangeText={setLocalNotes}
            placeholder="Add notes about this product..."
            minHeight={500}
            style={styles.editor}
          />
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
  editor: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
});
