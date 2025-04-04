import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch
} from 'react-native';
import { ProductChannel } from '@/types/Product';

type ChannelsEditorProps = {
  channels?: ProductChannel[];
  onChange: (channels: ProductChannel[]) => void;
};

export function ChannelsEditor({ channels = [], onChange }: ChannelsEditorProps) {
  const handleToggleChannel = (id: string, enabled: boolean) => {
    const updatedChannels = (channels || []).map(channel => {
      if (channel.id === id) {
        return { ...channel, enabled };
      }
      return channel;
    });

    onChange(updatedChannels);
  };



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sales Channels</Text>
      <Text style={styles.subtitle}>Enable or disable product visibility in different channels</Text>

      <View style={styles.channelsList}>
        {(channels || []).length === 0 ? (
          <Text style={styles.emptyText}>No channels configured</Text>
        ) : (
          (channels || []).map(item => (
            <View key={item.id} style={styles.channelRow}>
              <Text style={styles.channelName}>{item.name}</Text>
              <Switch
                value={item.enabled}
                onValueChange={(value) => handleToggleChannel(item.id, value)}
                trackColor={{ false: '#f0f0f0', true: '#4cd964' }}
                thumbColor="#fff"
              />
            </View>
          ))
        )}
      </View>
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
  channelsList: {
    maxHeight: 200,
  },
  channelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  channelName: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 16,
  },
});
