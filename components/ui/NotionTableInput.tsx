import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardTypeOptions,
  ViewStyle,
  TextStyle,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type NotionTableInputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  icon?: React.ComponentProps<typeof Ionicons>['name'];
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
  numberOfLines?: number;
};

export function NotionTableInput({
  label,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  icon,
  containerStyle,
  labelStyle,
  inputStyle,
  multiline = false,
  numberOfLines = 1,
}: NotionTableInputProps) {
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
        { backgroundColor },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.touchableRow}
        activeOpacity={0.8}
        onPress={() => {
          inputRef.current?.focus();
        }}
      >
        <View style={styles.labelContainer}>
          {icon && (
            <Ionicons
              name={icon}
              size={16}
              color={isFocused ? '#007AFF' : '#888'}
              style={styles.icon}
            />
          )}
          <Text
            style={[
              styles.label,
              labelStyle,
              isFocused && styles.labelFocused
            ]}
          >
            {label}
          </Text>
        </View>

        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#aaa"
          keyboardType={keyboardType}
          onFocus={startHighlightAnimation}
          onBlur={endHighlightAnimation}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  touchableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    transition: 'color 0.2s',
  },
  labelFocused: {
    color: '#007AFF',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 0,
  },
  multilineInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
});
