import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Colors } from '../constants/Colors';

interface LoadingIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  style?: object;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'large', color = Colors.primary, style }) => (
  <View style={[styles.center, style]}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
