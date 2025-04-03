import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { BlurView } from 'expo-blur';

// Custom tab bar component that only shows the 4 tabs we want
export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  // Define our 4 tabs
  const tabs = [
    { name: 'workspace', icon: { type: 'material', name: 'workspaces-outline' } },
    { name: 'ai', icon: { type: 'ionicons', name: 'sparkles-outline' } },
    { name: 'tasks', icon: { type: 'ionicons', name: 'play-outline' } },
    { name: 'chat', icon: { type: 'material', name: 'alternate-email' } }
  ];

  return (
    <View style={[
      styles.container,
      { paddingBottom: insets.bottom > 0 ? insets.bottom : 10 }
    ]}>
      {Platform.OS === 'ios' && (
        <BlurView
          tint="systemChromeMaterial"
          intensity={100}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View style={styles.tabsContainer}>
        {tabs.map((tab) => {
          // Find the route index for this tab name
          const routeIndex = state.routes.findIndex(route => route.name === tab.name);

          // If the route doesn't exist, skip this tab
          if (routeIndex === -1) return null;

          const isFocused = state.index === routeIndex;
          const { options } = descriptors[state.routes[routeIndex].key];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: state.routes[routeIndex].key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(tab.name);
            }
          };

          return (
            <TouchableOpacity
              key={tab.name}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.tab}
            >
              <IconSymbol
                size={28}
                name={tab.icon}
                color={isFocused ? Colors.light.tint : Colors.light.tabIconDefault}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#fff',
    borderTopWidth: Platform.OS === 'ios' ? 0 : StyleSheet.hairlineWidth,
    borderTopColor: '#ccc',
    elevation: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
