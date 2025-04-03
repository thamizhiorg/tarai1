import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, View } from 'react-native';

import { CustomTabBar } from '@/components/CustomTabBar';
import { HUD } from '@/components/HUD';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <HUD />
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
  );
}
