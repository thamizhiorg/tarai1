import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Pressable,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type RichTextEditorProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerStyle?: any;
  minHeight?: number;
};

export function RichTextEditor({
  value,
  onChangeText,
  placeholder = 'Type something...',
  containerStyle,
  minHeight = 200,
}: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const highlightAnim = useRef(new Animated.Value(0)).current;

  const startHighlightAnimation = () => {
    setIsFocused(true);
    Animated.timing(highlightAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  };

  const endHighlightAnimation = () => {
    Animated.timing(highlightAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start(() => setIsFocused(false));
  };

  const backgroundColor = highlightAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffffff', '#f9f9f9']
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor, minHeight },
        containerStyle,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="document-text-outline" size={18} color="#666" />
          <Text style={styles.title}>Notes</Text>
        </View>
      </View>

      {/* Formatting toolbar */}
      <View style={styles.toolbar}>
        <Pressable style={styles.toolbarButton}>
          <MaterialIcons name="format-bold" size={18} color="#666" />
        </Pressable>
        <Pressable style={styles.toolbarButton}>
          <MaterialIcons name="format-italic" size={18} color="#666" />
        </Pressable>
        <Pressable style={styles.toolbarButton}>
          <MaterialIcons name="format-underlined" size={18} color="#666" />
        </Pressable>
        <View style={styles.toolbarDivider} />
        <Pressable style={styles.toolbarButton}>
          <MaterialIcons name="format-list-bulleted" size={18} color="#666" />
        </Pressable>
        <Pressable style={styles.toolbarButton}>
          <MaterialIcons name="format-list-numbered" size={18} color="#666" />
        </Pressable>
        <View style={styles.toolbarDivider} />
        <Pressable style={styles.toolbarButton}>
          <MaterialIcons name="link" size={18} color="#666" />
        </Pressable>
      </View>

      <TouchableOpacity
        style={styles.editorContainer}
        activeOpacity={0.9}
        onPress={() => {
          inputRef.current?.focus();
        }}
      >
        <TextInput
          ref={inputRef}
          style={styles.editor}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          multiline={true}
          textAlignVertical="top"
          onFocus={startHighlightAnimation}
          onBlur={endHighlightAnimation}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
    color: '#666',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fafafa',
  },
  toolbarButton: {
    padding: 6,
    marginHorizontal: 2,
    borderRadius: 4,
  },
  toolbarDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 8,
  },
  editorContainer: {
    flex: 1,
    padding: 16,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});
