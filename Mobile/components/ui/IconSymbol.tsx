// Finished - for Andriod/web/fallback Icons //


import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';


const MAPPING = {
  // https://icons.expo.fyi


  'arrowshape.forward.circle': 'login', // Login
  'person.badge.plus': 'person-add', // Register

  'person.crop.circle': 'account-circle', // Profile
  'list.bullet.rectangle.portrait': 'list-alt', // Leader Baord
  'house.fill': 'home', // DashBoard

  'gearshape.2': 'settings', // Settings
  'gearshape': 'settings', // Settings

  'rectangle.portrait.and.arrow.right': 'logout', // Logout

  'plus': 'add', // add
  'x.square.fill': 'exit-to-app', // X
  'envelope': 'mail', // requests

  'checkmark': 'check', // requests
  'trash': 'delete', // requests

  
  'circle.fill': 'circle', // Place Holder / No Icon Needed
  'paperplane.fill': 'send', // Send

  'chevron.left.forwardslash.chevron.right': 'code', // demo
  'chevron.right': 'chevron-right', // demo
} as unknown as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

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
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}
