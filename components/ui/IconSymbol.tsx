// This file supports both MaterialIcons and Ionicons

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

// Define icon types
type MaterialIconName =
  | 'workspaces-outline' // for workspace
  | 'alternate-email' // for chat
  | 'home'
  | 'send'
  | 'code'
  | 'chevron-right'
  | 'check'
  | 'logout'; // for sign out

type IoniconsName =
  | 'sparkles-outline' // for AI
  | 'play-outline'; // for tasks

// Combined icon type
export type IconSymbolName =
  | { type: 'material'; name: MaterialIconName }
  | { type: 'ionicons'; name: IoniconsName };

/**
 * An icon component that supports both MaterialIcons and Ionicons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: any; // Keep for compatibility
}) {
  // Check the icon type and render the appropriate component
  if (typeof name === 'string') {
    // For backward compatibility, assume MaterialIcons
    return <MaterialIcons color={color} size={size} name={name as any} style={style} />;
  }

  if (name.type === 'material') {
    return <MaterialIcons color={color} size={size} name={name.name} style={style} />;
  } else {
    return <Ionicons color={color} size={size} name={name.name} style={style} />;
  }
}
