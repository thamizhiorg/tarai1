import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions
} from 'react-native';

type Tab = {
  key: string;
  title: string;
  icon?: React.ReactNode;
  showTitleWithIcon?: boolean;
};

type TabViewProps = {
  tabs: Tab[];
  renderScene: (tab: Tab) => React.ReactNode;
  initialTab?: string;
};

export function TabView({ tabs, renderScene, initialTab }: TabViewProps) {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0].key);

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tabItem,
              activeTab === tab.key && styles.activeTabItem
            ]}
            onPress={() => handleTabPress(tab.key)}
          >
            {tab.icon && React.cloneElement(tab.icon as React.ReactElement, {
              color: activeTab === tab.key ? '#007AFF' : '#666'
            })}
            {(tab.showTitleWithIcon !== false) && (
              <Text
                style={[
                  styles.tabTitle,
                  activeTab === tab.key && styles.activeTabTitle,
                  !tab.icon && styles.letterTab,
                  !tab.icon && activeTab === tab.key && styles.activeLetterTab
                ]}
              >
                {tab.title}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Static indicator instead of animated */}
        <View
          style={[
            styles.indicator,
            {
              width: Dimensions.get('window').width / tabs.length,
              left: (tabs.findIndex(tab => tab.key === activeTab) * (Dimensions.get('window').width / tabs.length))
            }
          ]}
        />
      </View>

      <View style={styles.sceneContainer}>
        {/* Only render the active tab for better performance */}
        <View style={styles.scene}>
          {renderScene(tabs.find(tab => tab.key === activeTab) || tabs[0])}
        </View>
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
    paddingVertical: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
  },
  activeTabItem: {
    backgroundColor: 'transparent',
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
  letterTab: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 0,
  },
  activeLetterTab: {
    color: '#007AFF',
  },
  indicator: {
    position: 'absolute',
    height: 3,
    backgroundColor: '#007AFF',
    bottom: 0,
    borderRadius: 1.5,
    transition: 'left 0s', // Instant transition
  },
  sceneContainer: {
    flex: 1,
  },
  scene: {
    flex: 1,
  },
});
