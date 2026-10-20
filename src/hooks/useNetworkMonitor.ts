import { useState, useEffect, useCallback } from 'react';
import { assetCache } from '../services/assetCache';
import { logger } from '../services/logger';
import { KIOSK_TIMERS } from '../config/kioskConfig';

export function useNetworkMonitor() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [lastCheck, setLastCheck] = useState<string>('Connected');

  const checkConnectivity = useCallback(async () => {
    try {
      // In kiosk environments, probe endpoint or rely on standard navigator/state
      const onlineStatus = typeof navigator !== 'undefined' ? Boolean((navigator as any).onLine) : true;
      setIsOnline(onlineStatus);
      setLastCheck(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      if (onlineStatus) {
        assetCache.resetFailures();
      }
    } catch (e) {
      logger.warn('NetworkMonitor', 'Network check exception, setting offline', e);
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    checkConnectivity();
    const interval = setInterval(checkConnectivity, KIOSK_TIMERS.networkProbeIntervalMs);
    return () => clearInterval(interval);
  }, [checkConnectivity]);

  const toggleMockOffline = useCallback(() => {
    setIsOnline((prev) => {
      const next = !prev;
      logger.info('NetworkMonitor', `Simulated network status: ${next ? 'ONLINE' : 'OFFLINE'}`);
      if (next) assetCache.resetFailures();
      return next;
    });
  }, []);

  return {
    isOnline,
    lastCheck,
    checkConnectivity,
    toggleMockOffline,
  };
}
