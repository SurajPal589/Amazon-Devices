import { weatherService } from '../src/services/weatherService';

describe('WeatherService', () => {
  test('should return live weather data when online', async () => {
    const data = await weatherService.getWeather(true);
    expect(data.city).toBe('Seattle, WA');
    expect(data.temperatureF).toBeGreaterThan(0);
    expect(data.isCached).toBe(false);
  });

  test('should return cached weather data when offline', async () => {
    const data = await weatherService.getWeather(false);
    expect(data.city).toBe('Seattle, WA');
    expect(data.isCached).toBe(true);
    expect(data.lastUpdated).toContain('Cached');
  });

  test('should return synchronous cached snapshot', () => {
    const cached = weatherService.getCached();
    expect(cached.city).toBe('Seattle, WA');
    expect(cached).toHaveProperty('temperatureF');
  });
});
