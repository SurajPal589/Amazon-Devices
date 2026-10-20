import { useState, useEffect, useCallback } from 'react';
import { BackHandler } from 'react-native';
import { logger } from '../services/logger';

export type FocusZone = 'media_canvas' | 'widget_rail' | 'admin_modal';

export interface UseRemoteControlOptions {
  onSelect?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
  onUp?: () => void;
  onDown?: () => void;
  onMenu?: () => void;
  onBack?: () => boolean;
  isAdminOpen?: boolean;
}

export function useRemoteControl(options: UseRemoteControlOptions) {
  const [activeZone, setActiveZone] = useState<FocusZone>('media_canvas');

  // Hardware Back Button listener (Fire OS & Vega OS BackHandler)
  useEffect(() => {
    const handleBack = () => {
      logger.info('RemoteControl', 'BACK key pressed');
      if (options.onBack) {
        return options.onBack();
      }
      return false;
    };

    const backSub = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backSub.remove();
  }, [options]);

  // Key event dispatcher for web/TV DOM events
  const handleKeyDown = useCallback(
    (e: { key?: string; keyCode?: number; preventDefault?: () => void }) => {
      const key = e.key;
      const code = e.keyCode;

      if (key === 'ArrowLeft' || code === 37) {
        options.onLeft?.();
        e.preventDefault?.();
      } else if (key === 'ArrowRight' || code === 39) {
        options.onRight?.();
        e.preventDefault?.();
      } else if (key === 'ArrowUp' || code === 38) {
        options.onUp?.();
        e.preventDefault?.();
      } else if (key === 'ArrowDown' || code === 40) {
        options.onDown?.();
        e.preventDefault?.();
      } else if (key === 'Enter' || code === 13) {
        options.onSelect?.();
        e.preventDefault?.();
      } else if (key === 'Menu' || key === 'ContextMenu' || code === 93) {
        options.onMenu?.();
        e.preventDefault?.();
      } else if (key === 'GoBack' || key === 'Escape' || code === 27) {
        options.onBack?.();
        e.preventDefault?.();
      }
    },
    [options]
  );

  return {
    activeZone,
    setActiveZone,
    handleKeyDown,
  };
}
