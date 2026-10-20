import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { WeatherData, CalendarEventItem } from '../../types/kiosk';
import { TV_COLORS, TV_TYPOGRAPHY, TV_FOCUS } from '../../styles/tvTokens';

interface WidgetRailZoneProps {
  weather: WeatherData;
  events: CalendarEventItem[];
  onSelectEvent?: (event: CalendarEventItem) => void;
}

export const WidgetRailZone: React.FC<WidgetRailZoneProps> = ({
  weather,
  events,
  onSelectEvent,
}) => {
  const [focusedCard, setFocusedCard] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Widget 1: Live Weather Card */}
      <View style={styles.weatherCard}>
        <View style={styles.weatherHeader}>
          <Text style={styles.weatherCity}>{weather.city}</Text>
          <Text style={styles.weatherUpdated}>
            {weather.isCached ? 'Cached' : weather.lastUpdated}
          </Text>
        </View>

        <View style={styles.tempRow}>
          <Text style={styles.weatherTemp}>{weather.temperatureF}°F</Text>
          <View style={styles.conditionGroup}>
            <Text style={styles.weatherCondition}>{weather.condition}</Text>
            <Text style={styles.weatherHighLow}>
              H: {weather.highF}° • L: {weather.lowF}°
            </Text>
          </View>
        </View>

        <View style={styles.weatherFooter}>
          <Text style={styles.weatherDetail}>💧 Humidity: {weather.humidityPercent}%</Text>
          <Text style={styles.weatherDetail}>📍 Doppler Atrium</Text>
        </View>
      </View>

      {/* Widget 2: Upcoming Events / Campus Agenda */}
      <View style={styles.eventsCard}>
        <View style={styles.eventsHeader}>
          <Text style={styles.cardTitle}>TODAY'S SCHEDULE</Text>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.eventsList}>
          {events.slice(0, 3).map((event) => {
            const isFocused = focusedCard === event.id;
            return (
              <TouchableOpacity
                key={event.id}
                accessible={true}
                accessibilityRole="button"
                onFocus={() => setFocusedCard(event.id)}
                onBlur={() => setFocusedCard(null)}
                onPress={() => onSelectEvent?.(event)}
                style={[
                  styles.eventItem,
                  event.isLiveNow && styles.eventItemLive,
                  isFocused && styles.eventItemFocused,
                ]}
              >
                <View style={styles.eventTimePill}>
                  <Text style={styles.eventTimeText}>{event.time}</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text
                    style={[styles.eventTitle, isFocused && styles.eventTitleFocused]}
                    numberOfLines={1}
                  >
                    {event.title}
                  </Text>
                  <Text style={styles.eventRoom}>{event.room}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Widget 3: Quick Action / QR Interaction Tile */}
      <View style={styles.qrCard}>
        <View style={styles.qrIconContainer}>
          <Text style={styles.qrIcon}>📱</Text>
        </View>
        <View style={styles.qrTextContainer}>
          <Text style={styles.qrTitle}>Mobile Engagement</Text>
          <Text style={styles.qrSubtitle}>Scan QR with smartphone for interactive map</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingLeft: 16,
  },
  weatherCard: {
    backgroundColor: TV_COLORS.cardBackground,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: TV_COLORS.borderSubtle,
    marginBottom: 12,
  },
  weatherHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  weatherCity: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  weatherUpdated: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textMuted,
    fontSize: 12,
  },
  tempRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weatherTemp: {
    fontSize: 44,
    fontWeight: '800',
    color: TV_COLORS.textPrimary,
  },
  conditionGroup: {
    alignItems: 'flex-end',
  },
  weatherCondition: {
    ...TV_TYPOGRAPHY.bodyRegular,
    fontWeight: '600',
    color: TV_COLORS.accentSecondary,
  },
  weatherHighLow: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
    marginTop: 2,
  },
  weatherFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: TV_COLORS.cardSurface,
    paddingTop: 8,
  },
  weatherDetail: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textMuted,
  },
  eventsCard: {
    flex: 1,
    backgroundColor: TV_COLORS.cardBackground,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: TV_COLORS.borderSubtle,
    marginBottom: 12,
  },
  eventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    ...TV_TYPOGRAPHY.caption,
    fontWeight: '800',
    color: TV_COLORS.textSecondary,
    letterSpacing: 1,
  },
  liveBadge: {
    backgroundColor: TV_COLORS.statusOnline,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  liveBadgeText: {
    color: TV_COLORS.textPrimary,
    fontSize: 10,
    fontWeight: '800',
  },
  eventsList: {
    flex: 1,
    justifyContent: 'space-around',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: TV_FOCUS.borderRadius,
    backgroundColor: TV_COLORS.cardSurface,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 8,
  },
  eventItemLive: {
    borderColor: 'rgba(46, 164, 79, 0.4)',
    backgroundColor: 'rgba(46, 164, 79, 0.1)',
  },
  eventItemFocused: {
    borderColor: TV_COLORS.focusBorder,
    backgroundColor: TV_COLORS.focusBackground,
    transform: [{ scale: 1.03 }],
  },
  eventTimePill: {
    backgroundColor: 'rgba(255, 153, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  eventTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: TV_COLORS.accentPrimary,
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    ...TV_TYPOGRAPHY.bodySecondary,
    fontWeight: '600',
    color: TV_COLORS.textPrimary,
  },
  eventTitleFocused: {
    color: TV_COLORS.accentSecondary,
  },
  eventRoom: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textMuted,
    fontSize: 12,
  },
  qrCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: TV_COLORS.cardBackground,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: TV_COLORS.borderSubtle,
  },
  qrIconContainer: {
    backgroundColor: TV_COLORS.cardSurface,
    padding: 10,
    borderRadius: 8,
    marginRight: 12,
  },
  qrIcon: {
    fontSize: 24,
  },
  qrTextContainer: {
    flex: 1,
  },
  qrTitle: {
    ...TV_TYPOGRAPHY.bodySecondary,
    fontWeight: '700',
    color: TV_COLORS.textPrimary,
  },
  qrSubtitle: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
});
