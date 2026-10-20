/**
 * Data models for Amazon Devices Digital Signage & Content Kiosk
 */

export type MediaType = 'image' | 'video' | 'html_widget';

export interface SlideItem {
  id: string;
  title: string;
  subtitle?: string;
  type: MediaType;
  uri: string;
  fallbackUri?: string;
  durationSeconds: number;
  callToAction?: string;
  priority?: number;
  category?: 'promo' | 'announcement' | 'events' | 'campus';
  captionText?: string;
}

export interface PlaylistConfig {
  id: string;
  name: string;
  slides: SlideItem[];
  loop: boolean;
  shuffle: boolean;
  defaultDwellSeconds: number;
}

export interface WeatherData {
  city: string;
  temperatureF: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Rain' | 'Thunderstorm' | 'Snow';
  humidityPercent: number;
  highF: number;
  lowF: number;
  lastUpdated: string;
  isCached: boolean;
}

export interface CalendarEventItem {
  id: string;
  time: string;
  title: string;
  room: string;
  speaker?: string;
  isLiveNow?: boolean;
}

export interface TickerMessage {
  id: string;
  text: string;
  source: string;
  category: 'news' | 'announcement' | 'emergency';
  priority?: boolean;
  timestamp: string;
}

export interface EmergencyAlert {
  id: string;
  headline: string;
  message: string;
  severity: 'warning' | 'critical';
  active: boolean;
  expiresAt?: string;
}

export interface KioskSettings {
  kioskId: string;
  kioskName: string;
  locationTag: string;
  slideTransitionDurationMs: number;
  enableWeatherWidget: boolean;
  enableEventsWidget: boolean;
  enableQrWidget: boolean;
  enableTicker: boolean;
  tickerSpeedMs: number;
  theme: 'dark' | 'deep_navy' | 'high_contrast';
  isPaused: boolean;
  showAdminOverlay: boolean;
  offlineMode: boolean;
}

export interface HeartbeatTelemetry {
  kioskId: string;
  appVersion: string;
  os: 'VegaOS' | 'FireOS' | 'WebKiosk';
  uptimeSeconds: number;
  currentSlideId: string;
  isOnline: boolean;
  memoryUsageMb?: number;
  timestamp: string;
}
