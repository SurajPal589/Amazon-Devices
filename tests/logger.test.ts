import { logger } from '../src/services/logger';

describe('KioskLogger and Telemetry', () => {
  test('should record log entries with structured tags and levels', () => {
    logger.info('TestTag', 'Information message', { key: 'value' });
    logger.warn('TestTag', 'Warning message');
    logger.error('TestTag', 'Error message');

    const logs = logger.getRecentLogs();
    expect(logs.length).toBeGreaterThanOrEqual(3);

    const lastLog = logs[logs.length - 1];
    expect(lastLog.level).toBe('error');
    expect(lastLog.tag).toBe('TestTag');
    expect(lastLog.message).toBe('Error message');
  });

  test('should generate valid Heartbeat telemetry payload', () => {
    const heartbeat = logger.createHeartbeat('slide-vega-os', true);
    expect(heartbeat).toHaveProperty('kioskId');
    expect(heartbeat).toHaveProperty('uptimeSeconds');
    expect(heartbeat.currentSlideId).toBe('slide-vega-os');
    expect(heartbeat.isOnline).toBe(true);
    expect(heartbeat.os).toBe('VegaOS');
    expect(typeof heartbeat.timestamp).toBe('string');
  });
});
