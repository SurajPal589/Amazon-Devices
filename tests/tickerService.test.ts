import { tickerService } from '../src/services/tickerService';
import { EmergencyAlert } from '../src/types/kiosk';

describe('TickerService', () => {
  beforeEach(() => {
    tickerService.setEmergencyAlert(null);
  });

  test('should return default marquee messages', () => {
    const messages = tickerService.getMessages();
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0]).toHaveProperty('text');
    expect(messages[0]).toHaveProperty('source');
  });

  test('should generate properly formatted marquee text', () => {
    const marquee = tickerService.getMarqueeText();
    expect(typeof marquee).toBe('string');
    expect(marquee).toContain('[');
    expect(marquee).toContain('•••');
  });

  test('should add priority message to the front of queue', () => {
    const priorityMsg = tickerService.addMessage({
      text: 'CRITICAL CAMPUS UPDATE',
      source: 'Security Office',
      category: 'emergency',
      priority: true,
    });

    const messages = tickerService.getMessages();
    expect(messages[0].id).toBe(priorityMsg.id);
    expect(messages[0].text).toBe('CRITICAL CAMPUS UPDATE');
    expect(messages[0].priority).toBe(true);
  });

  test('should activate and clear emergency alerts', () => {
    expect(tickerService.getEmergencyAlert()).toBeNull();

    const alert: EmergencyAlert = {
      id: 'alert-test-01',
      headline: 'TEST SEVERE WEATHER WARNING',
      message: 'Take shelter immediately',
      severity: 'critical',
      active: true,
    };

    tickerService.setEmergencyAlert(alert);
    const active = tickerService.getEmergencyAlert();
    expect(active).not.toBeNull();
    expect(active?.headline).toBe('TEST SEVERE WEATHER WARNING');

    // Clear alert
    tickerService.setEmergencyAlert(null);
    expect(tickerService.getEmergencyAlert()).toBeNull();
  });
});
