import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions
} from 'react-native';

type Tab = {
  key: string;
  title: string;
  icon?: React.ReactNode;
};

type TabViewProps = {
  tabs: Tab[];
  renderScene: (tab: Tab) => React.ReactNode;
  initialTab?: string;
};

export function TabView({ tabs, renderScene, initialTab }: TabViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0].key);
  const [indicatorPosition] = useState(new Animated.Value(0));
  
  const handleTabPress = (tabKey: string, index: number) => {
    setActiveTab(tabKey);
    
    // Animate the indicator
    Animated.spring(indicatorPosition, {
      toValue: index * (Dimensions.get('window').width / tabs.length),
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  // Initialize indicator position based on initial tab
  React.useEffect(() => {
    const initialIndex = tabs.findIndex(tab => tab.key === activeTab);
    if (initialIndex >= 0) {
      indicatorPosition.setValue(initialIndex * (Dimensions.get('window').width / tabs.length));
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.activeTabItem
            ]}
            onPress={() => handleTabPress(tab.key, index)}
          >
            {tab.icon}
            <Text
              style={[
                styles.tabTitle,
                activeTab === tab.key && styles.activeTabTitle
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
        
        <Animated.View
          style={[
            styles.indicator,
            {
              width: Dimensions.get('window').width / tabs.length,
              transform: [{ translateX: indicatorPosition }]
            }
          ]}
        />
      </View>
      
      <View style={styles.sceneContainer}>
        {tabs.map(tab => (
          <View
            key={tab.key}
            style={[
              styles.scene,
              { display: activeTab === tab.key ? 'flex' : 'none' }
            ]}
          >
            {renderScene(tab)}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    position: 'relative',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  activeTabItem: {
    backgroundColor: '#f9f9f9',
  },
  tabTitle: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeTabTitle: {
    color: '#007AFF',
    fontWeight: '500',
  },
  indicator: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#007AFF',
    bottom: 0,
  },
  sceneContainer: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
});
