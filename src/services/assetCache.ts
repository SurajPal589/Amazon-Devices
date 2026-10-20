import { SlideItem } from '../types/kiosk';
import { logger } from './logger';

export interface CacheEntry {
  uri: string;
  cachedAt: number;
  availableOffline: boolean;
}

class AssetCacheManager {
  private cacheRegistry: Map<string, CacheEntry> = new Map();
  private failedUris: Set<string> = new Set();
  private defaultFallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80';

  /**
   * Resolves the safest URI to display for a slide.
   * If the primary URI has previously failed or is invalid, returns fallback URI.
   */
  public resolveSlideUri(slide: SlideItem, isOnline: boolean): string {
    if (!isOnline && this.failedUris.has(slide.uri)) {
      logger.warn('AssetCache', `Using fallback for offline slide ${slide.id}`);
      return slide.fallbackUri || this.defaultFallbackImage;
    }

    if (this.failedUris.has(slide.uri)) {
      logger.warn('AssetCache', `Using fallback for broken URI on slide ${slide.id}`);
      return slide.fallbackUri || this.defaultFallbackImage;
    }

    return slide.uri;
  }

  /**
   * Reports an image loading error, registering it in failed URIs list
   */
  public markUriFailed(uri: string): void {
    logger.error('AssetCache', `Failed loading asset: ${uri}`);
    this.failedUris.add(uri);
  }

  /**
   * Clears the failed URI registry when network reconnects
   */
  public resetFailures(): void {
    logger.info('AssetCache', 'Resetting asset failure registry after network recovery');
    this.failedUris.clear();
  }

  /**
   * Pre-registers an asset into cache registry
   */
  public registerAsset(uri: string, availableOffline: boolean = false): void {
    this.cacheRegistry.set(uri, {
      uri,
      cachedAt: Date.now(),
      availableOffline,
    });
  }

  public isCached(uri: string): boolean {
    return this.cacheRegistry.has(uri);
  }
}

export const assetCache = new AssetCacheManager();
