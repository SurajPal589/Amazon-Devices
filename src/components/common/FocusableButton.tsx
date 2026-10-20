import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { TV_COLORS, TV_FOCUS, TV_TYPOGRAPHY } from '../../styles/tvTokens';

interface FocusableButtonProps extends TouchableOpacityProps {
  label: string;
  icon?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  isPrimary?: boolean;
}

export const FocusableButton: React.FC<FocusableButtonProps> = ({
  label,
  icon,
  onPress,
  style,
  textStyle,
  isPrimary = false,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole="button"
      activeOpacity={0.85}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onPress={onPress}
      style={[
        styles.button,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
        isFocused && styles.buttonFocused,
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.text,
          isPrimary ? styles.primaryText : styles.secondaryText,
          isFocused && styles.textFocused,
          textStyle,
        ]}
      >
        {icon ? `${icon}  ${label}` : label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: TV_FOCUS.minTouchTarget,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: TV_FOCUS.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: TV_FOCUS.borderWidth,
    borderColor: 'transparent',
  },
  primaryButton: {
    backgroundColor: TV_COLORS.accentPrimary,
  },
  secondaryButton: {
    backgroundColor: TV_COLORS.cardSurface,
    borderColor: TV_COLORS.borderSubtle,
  },
  buttonFocused: {
    borderColor: TV_COLORS.focusBorder,
    backgroundColor: TV_COLORS.focusBackground,
    transform: [{ scale: TV_FOCUS.scaleActive }],
    elevation: 8,
  },
  text: {
    ...TV_TYPOGRAPHY.bodyRegular,
    fontWeight: '600',
  },
  primaryText: {
    color: TV_COLORS.textInverse,
  },
  secondaryText: {
    color: TV_COLORS.textPrimary,
  },
  textFocused: {
    color: TV_COLORS.accentSecondary,
  },
});
