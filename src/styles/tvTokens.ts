/**
 * 10-Foot TV UI Design Tokens
 * Compliant with Amazon Vega OS & Fire TV Design Guidelines
 */

export const TV_SAFE_MARGINS = {
  // Title-safe area (5% horizontal, 5% vertical for 1080p / 4K)
  horizontal: 48,
  vertical: 36,
  overscanHorizontal: 64,
  overscanVertical: 48,
};

export const TV_COLORS = {
  // Deep Backgrounds
  background: '#0D1117',
  cardBackground: '#161B22',
  cardSurface: '#21262D',
  borderSubtle: '#30363D',

  // Amazon Brand & Accent Colors
  accentPrimary: '#FF9900', // Amazon Orange
  accentSecondary: '#00A8E1', // Alexa Cyan
  accentHover: '#FFB84D',

  // High-Contrast Focus Indicators (Physical & Border)
  focusBorder: '#00A8E1',
  focusGlow: 'rgba(0, 168, 225, 0.45)',
  focusBackground: '#1F2937',

  // Status & Priority Alerts
  statusOnline: '#2EA44F',
  statusOffline: '#F85149',
  statusSyncing: '#D29922',
  alertEmergency: '#DA3633',
  alertWarning: '#D29922',

  // Text Contrast Tokens
  textPrimary: '#FFFFFF',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  textInverse: '#0D1117',
};

export const TV_TYPOGRAPHY = {
  titleHero: {
    fontSize: 44,
    fontWeight: '700' as const,
    lineHeight: 52,
  },
  titleSection: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  titleCard: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  bodyRegular: {
    fontSize: 20,
    fontWeight: '400' as const,
    lineHeight: 28,
  },
  bodySecondary: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
  },
  tickerText: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
};

export const TV_FOCUS = {
  minTouchTarget: 48,
  borderWidth: 3,
  borderRadius: 8,
  scaleActive: 1.04,
  shadowRadius: 12,
};
