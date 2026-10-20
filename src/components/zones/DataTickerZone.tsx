import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TickerMessage, EmergencyAlert } from '../../types/kiosk';
import { TV_COLORS, TV_TYPOGRAPHY } from '../../styles/tvTokens';
import { LAYOUT_CONFIG } from '../../config/kioskConfig';

interface DataTickerZoneProps {
  messages: TickerMessage[];
  emergencyAlert: EmergencyAlert | null;
}

export const DataTickerZone: React.FC<DataTickerZoneProps> = ({
  messages,
  emergencyAlert,
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);

  // Cycle ticker messages every 8 seconds
  useEffect(() => {
    if (messages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [messages]);

  // If Emergency Alert is active, render the priority alert banner
  if (emergencyAlert && emergencyAlert.active) {
    return (
      <View style={[styles.container, styles.emergencyContainer]}>
        <View style={styles.emergencyBadge}>
          <Text style={styles.emergencyBadgeText}>⚠️ EMERGENCY ALERT</Text>
        </View>
        <View style={styles.emergencyContent}>
          <Text style={styles.emergencyHeadline} numberOfLines={1}>
            {emergencyAlert.headline}
          </Text>
          <Text style={styles.emergencyMessage} numberOfLines={1}>
            {emergencyAlert.message}
          </Text>
        </View>
      </View>
    );
  }

  const currentMsg = messages[currentMessageIndex] || {
    text: 'Amazon Devices Signage Kiosk • Powered by Vega OS & Fire TV',
    source: 'LIVE FEED',
    category: 'announcement',
  };

  return (
    <View style={styles.container}>
      {/* Feed Category Badge */}
      <View
        style={[
          styles.categoryBadge,
          currentMsg.priority && styles.priorityBadge,
        ]}
      >
        <Text style={styles.categoryText}>
          {currentMsg.priority ? '★ ALERT' : `LIVE • ${currentMsg.source.toUpperCase()}`}
        </Text>
      </View>

      {/* Ticker Content Line */}
      <View style={styles.tickerTrack}>
        <Text style={styles.tickerText} numberOfLines={1}>
          {currentMsg.text}
        </Text>
      </View>

      {/* Ticker Index Indicator */}
      <View style={styles.counterPill}>
        <Text style={styles.counterText}>
          {currentMessageIndex + 1}/{messages.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: LAYOUT_CONFIG.footerTickerHeight,
    backgroundColor: TV_COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: TV_COLORS.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  emergencyContainer: {
    backgroundColor: 'rgba(218, 54, 51, 0.25)',
    borderColor: TV_COLORS.alertEmergency,
    borderWidth: 2,
  },
  emergencyBadge: {
    backgroundColor: TV_COLORS.alertEmergency,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 16,
  },
  emergencyBadgeText: {
    color: TV_COLORS.textPrimary,
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1,
  },
  emergencyContent: {
    flex: 1,
  },
  emergencyHeadline: {
    ...TV_TYPOGRAPHY.bodySecondary,
    fontWeight: '800',
    color: '#FFA198',
  },
  emergencyMessage: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textPrimary,
  },
  categoryBadge: {
    backgroundColor: TV_COLORS.cardSurface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 16,
    borderWidth: 1,
    borderColor: TV_COLORS.borderSubtle,
  },
  priorityBadge: {
    backgroundColor: 'rgba(255, 153, 0, 0.25)',
    borderColor: TV_COLORS.accentPrimary,
  },
  categoryText: {
    ...TV_TYPOGRAPHY.caption,
    fontWeight: '800',
    color: TV_COLORS.accentPrimary,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  tickerTrack: {
    flex: 1,
    justifyContent: 'center',
  },
  tickerText: {
    ...TV_TYPOGRAPHY.tickerText,
    color: TV_COLORS.textPrimary,
  },
  counterPill: {
    backgroundColor: TV_COLORS.cardSurface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginLeft: 16,
  },
  counterText: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
});
