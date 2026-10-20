import {
  PlaylistConfig,
  CalendarEventItem,
  WeatherData,
  TickerMessage,
  EmergencyAlert,
} from '../types/kiosk';

export const DEFAULT_PLAYLIST: PlaylistConfig = {
  id: 'pl-amazon-showcase-2026',
  name: 'Amazon Devices Tech Showcase',
  loop: true,
  shuffle: false,
  defaultDwellSeconds: 10,
  slides: [
    {
      id: 'slide-vega-os',
      title: 'Next-Generation Amazon Vega OS',
      subtitle: 'Lightweight microkernel architecture engineered for ambient TV and smart displays',
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80',
      fallbackUri: 'assets/image/app_icon.png',
      durationSeconds: 12,
      category: 'promo',
      callToAction: 'Learn more: developer.amazon.com/vega',
      captionText: 'Featuring high-performance React Native for Vega and native Kepler runtime.',
    },
    {
      id: 'slide-fire-tv-cube',
      title: 'Fire TV Omni & Cube Series',
      subtitle: 'Hands-free 4K streaming, cinematic audio, and responsive ambient experience',
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1920&q=80',
      durationSeconds: 10,
      category: 'promo',
      callToAction: 'Explore Fire OS SDKs for 10-foot television apps',
      captionText: 'Hardware acceleration with Dolby Vision and Dolby Atmos.',
    },
    {
      id: 'slide-dev-conference',
      title: 'Amazon Devices Developer Summit',
      subtitle: 'Live Sessions: Building for Vega OS, Fire OS Leanback & Ambient IoT',
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80',
      durationSeconds: 14,
      category: 'events',
      callToAction: 'Auditorium A • Today at 2:00 PM PST',
      captionText: 'Keynote streaming live to all campus kiosk terminals.',
    },
    {
      id: 'slide-sustainability',
      title: 'The Climate Pledge & Device Sustainability',
      subtitle: '100% recycled packaging, low-power sleep modes, and carbon neutrality goals',
      type: 'image',
      uri: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=1920&q=80',
      durationSeconds: 8,
      category: 'campus',
      callToAction: 'Scan QR code in side rail to view sustainability report',
      captionText: 'Innovating responsible hardware design across all Amazon product lines.',
    },
  ],
};

export const DEFAULT_CALENDAR_EVENTS: CalendarEventItem[] = [
  {
    id: 'evt-1',
    time: '10:00 AM',
    title: 'Vega OS Architecture Deep Dive',
    room: 'Hall B • Doppler',
    speaker: 'Amazon OS Core Team',
    isLiveNow: true,
  },
  {
    id: 'evt-2',
    time: '11:30 AM',
    title: '10-Foot UI & Focus Management',
    room: 'Studio 3',
    speaker: 'Design Systems Lead',
    isLiveNow: false,
  },
  {
    id: 'evt-3',
    time: '01:15 PM',
    title: 'Ambient Display Energy Optimization',
    room: 'Lab 4A',
    speaker: 'Hardware Engineering',
    isLiveNow: false,
  },
  {
    id: 'evt-4',
    time: '03:00 PM',
    title: 'Devices Developer Town Hall & Q&A',
    room: 'Main Atrium',
    speaker: 'VP of Amazon Devices',
    isLiveNow: false,
  },
];

export const INITIAL_WEATHER: WeatherData = {
  city: 'Seattle, WA',
  temperatureF: 68,
  condition: 'Partly Cloudy',
  humidityPercent: 54,
  highF: 72,
  lowF: 56,
  lastUpdated: 'Just now',
  isCached: false,
};

export const DEFAULT_TICKER_MESSAGES: TickerMessage[] = [
  {
    id: 't-1',
    text: 'WELCOME TO AMAZON DEVICES TECH SHOWCASE 2026',
    source: 'Atrium Bulletin',
    category: 'announcement',
    priority: true,
    timestamp: '10:00 AM',
  },
  {
    id: 't-2',
    text: 'Vega SDK v0.24 now available for verified Amazon Devices developer partners',
    source: 'Developer News',
    category: 'news',
    timestamp: '10:15 AM',
  },
  {
    id: 't-3',
    text: 'Use D-pad remote controls to interact with this kiosk • Press SELECT to pause or resume rotation',
    source: 'Kiosk Guide',
    category: 'announcement',
    timestamp: '10:30 AM',
  },
  {
    id: 't-4',
    text: 'Fire TV Omni ambient mode updates rolled out with enhanced widget support',
    source: 'Product Release',
    category: 'news',
    timestamp: '11:00 AM',
  },
];

export const SAMPLE_EMERGENCY_ALERT: EmergencyAlert = {
  id: 'alert-weather-01',
  headline: 'HIGH WIND ADVISORY IN EFFECT UNTIL 6:00 PM',
  message: 'Gusts up to 45 mph expected. Please exercise caution near campus pedestrian skybridges.',
  severity: 'warning',
  active: false, // inactive by default, toggleable in admin
};
