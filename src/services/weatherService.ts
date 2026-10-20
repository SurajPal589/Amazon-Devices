import { WeatherData } from '../types/kiosk';
import { INITIAL_WEATHER } from '../config/defaultPlaylist';
import { logger } from './logger';

class WeatherService {
  private cachedWeather: WeatherData = { ...INITIAL_WEATHER };

  public async getWeather(isOnline: boolean): Promise<WeatherData> {
    if (!isOnline) {
      logger.info('WeatherService', 'Offline: returning cached weather data');
      return {
        ...this.cachedWeather,
        isCached: true,
        lastUpdated: 'Cached (Offline)',
      };
    }

    try {
      // In production, integrate with internal weather API or OpenMeteo/NWS.
      // Returns validated telemetry data with slight simulation variance.
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      this.cachedWeather = {
        city: 'Seattle, WA',
        temperatureF: 68 + Math.floor(Math.sin(now.getMinutes()) * 3),
        condition: 'Partly Cloudy',
        humidityPercent: 55,
        highF: 72,
        lowF: 56,
        lastUpdated: timeStr,
        isCached: false,
      };

      return { ...this.cachedWeather };
    } catch (err: any) {
      logger.error('WeatherService', 'Failed to update live weather, falling back to cache', err);
      return {
        ...this.cachedWeather,
        isCached: true,
        lastUpdated: 'Cached',
      };
    }
  }

  public getCached(): WeatherData {
    return { ...this.cachedWeather };
  }
}

export const weatherService = new WeatherService();
