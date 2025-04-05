import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type ProductTabHeaderProps = {
  onSave: () => void;
  onCancel: () => void;
  isSaving: boolean;
};

export function ProductTabHeader({
  onSave,
  onCancel,
  isSaving,
}: ProductTabHeaderProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={onCancel}
        disabled={isSaving}
      >
        <MaterialIcons name="arrow-back" size={24} color="#666" />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.disabledButton]}
        onPress={onSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <MaterialIcons name="check" size={24} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  spacer: {
    flex: 1,
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    opacity: 0.7,
  },
});
