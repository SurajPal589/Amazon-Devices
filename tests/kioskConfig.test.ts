import { KIOSK_TIMERS, LAYOUT_CONFIG, APP_METADATA } from '../src/config/kioskConfig';
import { TV_SAFE_MARGINS, TV_FOCUS } from '../src/styles/tvTokens';

describe('Kiosk Configuration & TV Tokens Compliance', () => {
  test('should satisfy TV accessibility minimum touch target (>= 48dp)', () => {
    expect(TV_FOCUS.minTouchTarget).toBeGreaterThanOrEqual(48);
  });

  test('should enforce TV title-safe margins for overscan protection', () => {
    expect(TV_SAFE_MARGINS.horizontal).toBeGreaterThanOrEqual(40);
    expect(TV_SAFE_MARGINS.vertical).toBeGreaterThanOrEqual(30);
  });

  test('should define valid multi-zone flex layout proportions', () => {
    const totalFlex = LAYOUT_CONFIG.mediaZoneFlex + LAYOUT_CONFIG.widgetRailFlex;
    expect(totalFlex).toBeCloseTo(1.0, 2);
    expect(LAYOUT_CONFIG.mediaZoneFlex).toBeGreaterThan(0.6);
  });

  test('should specify valid dwell time thresholds', () => {
    expect(KIOSK_TIMERS.defaultSlideDwellSeconds).toBeGreaterThanOrEqual(KIOSK_TIMERS.minSlideDwellSeconds);
    expect(KIOSK_TIMERS.defaultSlideDwellSeconds).toBeLessThanOrEqual(KIOSK_TIMERS.maxSlideDwellSeconds);
  });

  test('should contain valid Amazon Devices metadata', () => {
    expect(APP_METADATA.packageId).toBe('com.amazon.devices.kiosk');
    expect(APP_METADATA.targetOsVersion).toBe('1.2');
  });
});
