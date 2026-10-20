import { TickerMessage, EmergencyAlert } from '../types/kiosk';
import { DEFAULT_TICKER_MESSAGES, SAMPLE_EMERGENCY_ALERT } from '../config/defaultPlaylist';
import { logger } from './logger';

class TickerService {
  private messages: TickerMessage[] = [...DEFAULT_TICKER_MESSAGES];
  private activeAlert: EmergencyAlert | null = null;

  constructor() {
    if (SAMPLE_EMERGENCY_ALERT.active) {
      this.activeAlert = { ...SAMPLE_EMERGENCY_ALERT };
    }
  }

  public getMessages(): TickerMessage[] {
    return [...this.messages];
  }

  public getMarqueeText(): string {
    if (this.messages.length === 0) {
      return 'AMAZON DEVICES DIGITAL SIGNAGE KIOSK • LIVE INFORMATION SYSTEM';
    }

    return this.messages
      .map((m) => {
        const tag = m.priority ? '★ [ALERT]' : `[${m.source.toUpperCase()}]`;
        return `${tag} ${m.text}`;
      })
      .join('   •••   ');
  }

  public addMessage(message: Omit<TickerMessage, 'id' | 'timestamp'>): TickerMessage {
    const newMessage: TickerMessage = {
      ...message,
      id: `ticker-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (message.priority) {
      this.messages.unshift(newMessage);
      logger.info('TickerService', `Priority ticker item added: ${newMessage.text}`);
    } else {
      this.messages.push(newMessage);
    }

    return newMessage;
  }

  public setEmergencyAlert(alert: EmergencyAlert | null): void {
    this.activeAlert = alert;
    if (alert && alert.active) {
      logger.warn('TickerService', `EMERGENCY ALERT ACTIVATED: ${alert.headline}`);
    } else {
      logger.info('TickerService', 'Emergency alert cleared');
    }
  }

  public getEmergencyAlert(): EmergencyAlert | null {
    return this.activeAlert && this.activeAlert.active ? { ...this.activeAlert } : null;
  }
}

export const tickerService = new TickerService();
