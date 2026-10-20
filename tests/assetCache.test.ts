import { assetCache } from '../src/services/assetCache';
import { SlideItem } from '../src/types/kiosk';

describe('AssetCacheManager', () => {
  const testSlide: SlideItem = {
    id: 'slide-test',
    title: 'Testing Slide',
    type: 'image',
    uri: 'https://cdn.example.com/promo.png',
    fallbackUri: 'assets/image/app_icon.png',
    durationSeconds: 10,
  };

  beforeEach(() => {
    assetCache.resetFailures();
  });

  test('should return primary URI when online and asset is healthy', () => {
    const uri = assetCache.resolveSlideUri(testSlide, true);
    expect(uri).toBe('https://cdn.example.com/promo.png');
  });

  test('should return fallback URI when asset is marked failed', () => {
    assetCache.markUriFailed(testSlide.uri);
    const uri = assetCache.resolveSlideUri(testSlide, true);
    expect(uri).toBe('assets/image/app_icon.png');
  });

  test('should return fallback URI when offline and asset previously failed', () => {
    assetCache.markUriFailed(testSlide.uri);
    const uri = assetCache.resolveSlideUri(testSlide, false);
    expect(uri).toBe('assets/image/app_icon.png');
  });

  test('should clear failed URIs when resetFailures is called', () => {
    assetCache.markUriFailed(testSlide.uri);
    assetCache.resetFailures();
    const uri = assetCache.resolveSlideUri(testSlide, true);
    expect(uri).toBe('https://cdn.example.com/promo.png');
  });
});
