import { KioskSettings } from '../types/kiosk';

export const APP_METADATA = {
  name: 'Amazon Devices Signage Kiosk',
  packageId: 'com.amazon.devices.kiosk',
  version: '1.0.0',
  sdkVersion: '0.24.0',
  targetOsVersion: '1.2',
  terminalId: 'KIOSK-BLDG-SEA-04',
  organization: 'Amazon Devices Experience Center',
  location: 'Seattle Campus - Main Atrium',
};

export const DEFAULT_KIOSK_SETTINGS: KioskSettings = {
  kioskId: 'KIOSK-BLDG-SEA-04',
  kioskName: 'Main Atrium Display',
  locationTag: 'Seattle HQ • Building Doppler',
  slideTransitionDurationMs: 600,
  enableWeatherWidget: true,
  enableEventsWidget: true,
  enableQrWidget: true,
  enableTicker: true,
  tickerSpeedMs: 25, // Marquee tick rate
  theme: 'dark',
  isPaused: false,
  showAdminOverlay: false,
  offlineMode: false,
};

export const KIOSK_TIMERS = {
  defaultSlideDwellSeconds: 10,
  minSlideDwellSeconds: 4,
  maxSlideDwellSeconds: 60,
  clockUpdateIntervalMs: 1000,
  weatherRefreshIntervalMs: 300000, // 5 minutes
  tickerRefreshIntervalMs: 60000,   // 1 minute
  heartbeatIntervalMs: 30000,       // 30 seconds
  adminOverlayIdleTimeoutMs: 20000, // 20 seconds auto-dismiss
  networkProbeIntervalMs: 15000,    // 15 seconds
};

export const LAYOUT_CONFIG = {
  headerHeight: 64,
  footerTickerHeight: 64,
  mediaZoneFlex: 0.72,
  widgetRailFlex: 0.28,
  cardSpacing: 16,
};
