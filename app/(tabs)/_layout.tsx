import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, View } from 'react-native';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

import { CustomTabBar } from '@/components/CustomTabBar';
import { HUD } from '@/components/HUD';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useAgent } from '@/context/AgentContext';

export default function TabLayout() {
  const { setCurrentAgentId } = useAgent();
  const router = useRouter();

  // Handle agent changes from HUD
  const handleAgentChange = (agentId: string) => {
    // Navigate to workspace tab when agent changes
    if (router.pathname !== '/(tabs)/workspace') {
      router.replace('/(tabs)/workspace');
    }
  };

  return (
    <ProtectedRoute>
      <View style={{ flex: 1 }}>
        <HUD onAgentChange={handleAgentChange} />
        <Tabs
          tabBar={(props) => <CustomTabBar {...props} />}
          screenOptions={{
            headerShown: false,
          }}
        >
      {/* Include all screens but let the custom tab bar handle which ones to show */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Index',
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          title: 'Workspace',
        }}
      />
      <Tabs.Screen
        name="ai"
        options={{
          title: 'AI',
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          title: 'Tasks',
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
        }}
      />
    </Tabs>
      </View>
    </ProtectedRoute>
  );
}
