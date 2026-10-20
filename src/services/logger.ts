import { HeartbeatTelemetry } from '../types/kiosk';
import { APP_METADATA } from '../config/kioskConfig';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  tag: string;
  message: string;
  data?: any;
}

class KioskLogger {
  private logs: LogEntry[] = [];
  private maxLogs: number = 200;
  private startTime: number = Date.now();

  public log(level: LogLevel, tag: string, message: string, data?: any): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      tag,
      message,
      data,
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    const prefix = `[${entry.timestamp}] [${level.toUpperCase()}] [${tag}]`;
    if (level === 'error') {
      console.error(prefix, message, data || '');
    } else if (level === 'warn') {
      console.warn(prefix, message, data || '');
    } else {
      console.log(prefix, message, data || '');
    }
  }

  public info(tag: string, message: string, data?: any): void {
    this.log('info', tag, message, data);
  }

  public warn(tag: string, message: string, data?: any): void {
    this.log('warn', tag, message, data);
  }

  public error(tag: string, message: string, data?: any): void {
    this.log('error', tag, message, data);
  }

  public getRecentLogs(): LogEntry[] {
    return [...this.logs];
  }

  public createHeartbeat(currentSlideId: string, isOnline: boolean): HeartbeatTelemetry {
    const uptimeSeconds = Math.floor((Date.now() - this.startTime) / 1000);
    return {
      kioskId: APP_METADATA.terminalId,
      appVersion: APP_METADATA.version,
      os: 'VegaOS',
      uptimeSeconds,
      currentSlideId,
      isOnline,
      timestamp: new Date().toISOString(),
    };
  }
}

export const logger = new KioskLogger();
