import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  usePreventHideSplashScreen,
  useHideSplashScreenCallback,
} from '@amazon-devices/react-native-kepler';
import { useReportFullyDrawn } from '@amazon-devices/kepler-performance-api';

// Configuration & Default Data
import { DEFAULT_PLAYLIST, DEFAULT_CALENDAR_EVENTS, INITIAL_WEATHER } from './config/defaultPlaylist';
import { DEFAULT_KIOSK_SETTINGS, LAYOUT_CONFIG, KIOSK_TIMERS } from './config/kioskConfig';
import { KioskSettings, WeatherData, CalendarEventItem, EmergencyAlert } from './types/kiosk';

// Services & Hooks
import { logger } from './services/logger';
import { weatherService } from './services/weatherService';
import { tickerService } from './services/tickerService';
import { assetCache } from './services/assetCache';
import { usePlaylistEngine } from './hooks/usePlaylistEngine';
import { useRemoteControl } from './hooks/useRemoteControl';
import { useNetworkMonitor } from './hooks/useNetworkMonitor';

// UI Components
import { SafeZoneContainer } from './components/common/SafeZoneContainer';
import { HeaderBar } from './components/common/HeaderBar';
import { KioskErrorBoundary } from './components/common/KioskErrorBoundary';
import { MediaCanvasZone } from './components/zones/MediaCanvasZone';
import { WidgetRailZone } from './components/zones/WidgetRailZone';
import { DataTickerZone } from './components/zones/DataTickerZone';
import { AdminSettingsModal } from './components/admin/AdminSettingsModal';

export default function App(): JSX.Element {
  // Vega OS native splash screen & performance reporting
  usePreventHideSplashScreen();
  const hideSplashScreen = useHideSplashScreenCallback();
  const reportFullyDrawn = useReportFullyDrawn();

  // State Management
  const [settings, setSettings] = useState<KioskSettings>({ ...DEFAULT_KIOSK_SETTINGS });
  const [weather, setWeather] = useState<WeatherData>({ ...INITIAL_WEATHER });
  const [events] = useState<CalendarEventItem[]>([...DEFAULT_CALENDAR_EVENTS]);
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencyAlert | null>(null);

  // Network Monitoring
  const { isOnline: hardwareOnline } = useNetworkMonitor();
  const effectiveOnline = settings.offlineMode ? false : hardwareOnline;

  // Slide Rotation Engine
  const {
    currentSlide,
    currentIndex,
    totalSlides,
    isPaused,
    progressPercent,
    remainingSeconds,
    togglePause,
    nextSlide,
    prevSlide,
    setDwellDuration,
  } = usePlaylistEngine(DEFAULT_PLAYLIST);

  // Initial Boot Sequence & TTFD Reporting
  useEffect(() => {
    logger.info('App', 'Amazon Devices Signage Kiosk booting up');
    try {
      reportFullyDrawn();
    } catch (e) {
      logger.warn('App', 'TTFD report error', e);
    }
    try {
      hideSplashScreen();
    } catch (e) {
      logger.warn('App', 'Hide splash screen error', e);
    }
  }, [reportFullyDrawn, hideSplashScreen]);

  // Periodic Weather Refresh
  useEffect(() => {
    const fetchWeather = async () => {
      const data = await weatherService.getWeather(effectiveOnline);
      setWeather(data);
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, KIOSK_TIMERS.weatherRefreshIntervalMs);
    return () => clearInterval(interval);
  }, [effectiveOnline]);

  // Periodic Telemetry Heartbeat
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      const heartbeat = logger.createHeartbeat(currentSlide?.id || 'none', effectiveOnline);
      logger.info('Telemetry', `Heartbeat: Uptime=${heartbeat.uptimeSeconds}s Slide=${heartbeat.currentSlideId}`);
    }, KIOSK_TIMERS.heartbeatIntervalMs);

    return () => clearInterval(heartbeatInterval);
  }, [currentSlide, effectiveOnline]);

  // Remote Control Handlers
  const handleMenuPress = useCallback(() => {
    setSettings((prev) => ({ ...prev, showAdminOverlay: !prev.showAdminOverlay }));
  }, []);

  const handleBackPress = useCallback((): boolean => {
    if (settings.showAdminOverlay) {
      setSettings((prev) => ({ ...prev, showAdminOverlay: false }));
      return true; // Handled
    }
    return false; // Propagate to system
  }, [settings.showAdminOverlay]);

  useRemoteControl({
    onSelect: togglePause,
    onLeft: prevSlide,
    onRight: nextSlide,
    onMenu: handleMenuPress,
    onBack: handleBackPress,
    isAdminOpen: settings.showAdminOverlay,
  });

  // Admin Overlay actions
  const handleUpdateSettings = useCallback((newSettings: Partial<KioskSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (newSettings.slideTransitionDurationMs) {
        setDwellDuration(Math.floor(newSettings.slideTransitionDurationMs / 1000));
      }
      return updated;
    });
  }, [setDwellDuration]);

  const handleToggleEmergencyAlert = useCallback(() => {
    setEmergencyAlert((prev) => {
      if (prev && prev.active) {
        tickerService.setEmergencyAlert(null);
        return null;
      }
      const newAlert: EmergencyAlert = {
        id: `alert-${Date.now()}`,
        headline: 'CRITICAL CAMPUS WEATHER / SECURITY NOTICE',
        message: 'All personnel follow standard guidance. Remote kiosk override active.',
        severity: 'critical',
        active: true,
      };
      tickerService.setEmergencyAlert(newAlert);
      return newAlert;
    });
  }, []);

  const handleReloadPlaylist = useCallback(() => {
    assetCache.resetFailures();
    logger.info('App', 'Manual asset & playlist reload initiated');
  }, []);

  const tickerMessages = useMemo(() => tickerService.getMessages(), []);

  return (
    <KioskErrorBoundary>
      <SafeZoneContainer>
        {/* Top Header Bar */}
        <HeaderBar
          isOnline={effectiveOnline}
          onOpenAdmin={() => setSettings((prev) => ({ ...prev, showAdminOverlay: true }))}
        />

        {/* Multi-Zone Middle Layout */}
        <View style={styles.mainLayout}>
          {/* Zone 1: Main Media Canvas */}
          <View
            style={[
              styles.mediaZoneContainer,
              { flex: settings.enableEventsWidget ? LAYOUT_CONFIG.mediaZoneFlex : 1.0 },
            ]}
          >
            <MediaCanvasZone
              slide={currentSlide}
              currentIndex={currentIndex}
              totalSlides={totalSlides}
              isPaused={isPaused}
              progressPercent={progressPercent}
              remainingSeconds={remainingSeconds}
              isOnline={effectiveOnline}
              onTogglePause={togglePause}
              onNextSlide={nextSlide}
              onPrevSlide={prevSlide}
            />
          </View>

          {/* Zone 2: Side Widget Rail (Toggleable) */}
          {settings.enableEventsWidget && (
            <View style={[styles.widgetZoneContainer, { flex: LAYOUT_CONFIG.widgetRailFlex }]}>
              <WidgetRailZone
                weather={weather}
                events={events}
                onSelectEvent={(evt) => logger.info('App', `Event selected: ${evt.title}`)}
              />
            </View>
          )}
        </View>

        {/* Zone 3: Live Data Ticker (Toggleable) */}
        {settings.enableTicker && (
          <DataTickerZone
            messages={tickerMessages}
            emergencyAlert={emergencyAlert}
          />
        )}

        {/* Admin Settings Modal */}
        <AdminSettingsModal
          visible={settings.showAdminOverlay}
          settings={settings}
          emergencyAlert={emergencyAlert}
          onClose={() => setSettings((prev) => ({ ...prev, showAdminOverlay: false }))}
          onUpdateSettings={handleUpdateSettings}
          onToggleEmergencyAlert={handleToggleEmergencyAlert}
          onReloadPlaylist={handleReloadPlaylist}
        />
      </SafeZoneContainer>
    </KioskErrorBoundary>
  );
}

const styles = StyleSheet.create({
  mainLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  mediaZoneContainer: {
    height: '100%',
  },
  widgetZoneContainer: {
    height: '100%',
  },
});
