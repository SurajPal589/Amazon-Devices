import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { TV_SAFE_MARGINS, TV_COLORS } from '../../styles/tvTokens';

interface SafeZoneContainerProps extends ViewProps {
  children: React.ReactNode;
}

export const SafeZoneContainer: React.FC<SafeZoneContainerProps> = ({ children, style, ...rest }) => {
  return (
    <View style={[styles.container, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: TV_COLORS.background,
    paddingHorizontal: TV_SAFE_MARGINS.horizontal,
    paddingVertical: TV_SAFE_MARGINS.vertical,
  },
});
