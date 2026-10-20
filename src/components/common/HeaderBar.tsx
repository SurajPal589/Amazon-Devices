import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { TV_COLORS, TV_TYPOGRAPHY, TV_FOCUS } from '../../styles/tvTokens';
import { APP_METADATA, LAYOUT_CONFIG } from '../../config/kioskConfig';

interface HeaderBarProps {
  isOnline: boolean;
  onOpenAdmin: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ isOnline, onOpenAdmin }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isAdminFocused, setIsAdminFocused] = useState<boolean>(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.header}>
      {/* Brand & Terminal Location Info */}
      <View style={styles.brandingGroup}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>AMZN</Text>
        </View>
        <View>
          <Text style={styles.titleText}>{APP_METADATA.name}</Text>
          <Text style={styles.locationText}>{APP_METADATA.location}</Text>
        </View>
      </View>

      {/* Clock, Status & Settings Trigger */}
      <View style={styles.statusGroup}>
        <View style={styles.clockContainer}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>

        {/* Network Status Badge */}
        <View
          style={[
            styles.statusPill,
            { backgroundColor: isOnline ? TV_COLORS.statusOnline : TV_COLORS.statusOffline },
          ]}
        >
          <Text style={styles.statusText}>{isOnline ? 'ONLINE' : 'OFFLINE'}</Text>
        </View>

        {/* Admin Gear Button */}
        <TouchableOpacity
          accessible={true}
          accessibilityRole="button"
          onFocus={() => setIsAdminFocused(true)}
          onBlur={() => setIsAdminFocused(false)}
          onPress={onOpenAdmin}
          style={[styles.adminButton, isAdminFocused && styles.adminButtonFocused]}
        >
          <Text style={[styles.adminButtonText, isAdminFocused && styles.adminButtonTextFocused]}>
            ⚙ ADMIN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: LAYOUT_CONFIG.headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: TV_COLORS.borderSubtle,
    paddingBottom: 12,
    marginBottom: 16,
  },
  brandingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    backgroundColor: TV_COLORS.accentPrimary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 14,
  },
  logoText: {
    color: TV_COLORS.textInverse,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  titleText: {
    ...TV_TYPOGRAPHY.titleCard,
    color: TV_COLORS.textPrimary,
  },
  locationText: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockContainer: {
    alignItems: 'flex-end',
    marginRight: 20,
  },
  timeText: {
    ...TV_TYPOGRAPHY.bodyRegular,
    fontWeight: '700',
    color: TV_COLORS.textPrimary,
  },
  dateText: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
  },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 16,
  },
  statusText: {
    color: TV_COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  adminButton: {
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: TV_FOCUS.borderRadius,
    backgroundColor: TV_COLORS.cardSurface,
    borderWidth: 2,
    borderColor: TV_COLORS.borderSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  adminButtonFocused: {
    borderColor: TV_COLORS.focusBorder,
    backgroundColor: TV_COLORS.focusBackground,
    transform: [{ scale: 1.05 }],
  },
  adminButtonText: {
    ...TV_TYPOGRAPHY.caption,
    fontWeight: '700',
    color: TV_COLORS.textPrimary,
  },
  adminButtonTextFocused: {
    color: TV_COLORS.accentSecondary,
  },
});
