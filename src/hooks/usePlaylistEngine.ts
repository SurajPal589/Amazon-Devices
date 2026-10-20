import { useState, useEffect, useRef, useCallback } from 'react';
import { SlideItem, PlaylistConfig } from '../types/kiosk';
import { logger } from '../services/logger';

export interface UsePlaylistEngineResult {
  currentSlide: SlideItem | null;
  currentIndex: number;
  totalSlides: number;
  isPaused: boolean;
  progressPercent: number;
  remainingSeconds: number;
  togglePause: () => void;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  setDwellDuration: (seconds: number) => void;
}

export function usePlaylistEngine(playlist: PlaylistConfig): UsePlaylistEngineResult {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [customDwell, setCustomDwell] = useState<number | null>(null);

  const slides = playlist.slides || [];
  const totalSlides = slides.length;
  const currentSlide = totalSlides > 0 ? slides[currentIndex] : null;

  const currentDwellSeconds =
    customDwell || (currentSlide ? currentSlide.durationSeconds : playlist.defaultDwellSeconds);

  const nextSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => {
      const nextIdx = (prev + 1) % totalSlides;
      logger.info('PlaylistEngine', `Advanced to slide ${nextIdx}: ${slides[nextIdx]?.title}`);
      return nextIdx;
    });
    setElapsedSeconds(0);
  }, [totalSlides, slides]);

  const prevSlide = useCallback(() => {
    if (totalSlides === 0) return;
    setCurrentIndex((prev) => {
      const prevIdx = (prev - 1 + totalSlides) % totalSlides;
      logger.info('PlaylistEngine', `Reverted to slide ${prevIdx}: ${slides[prevIdx]?.title}`);
      return prevIdx;
    });
    setElapsedSeconds(0);
  }, [totalSlides, slides]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setCurrentIndex(index);
      setElapsedSeconds(0);
    }
  }, [totalSlides]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const newState = !prev;
      logger.info('PlaylistEngine', `Playlist rotation ${newState ? 'PAUSED' : 'RESUMED'}`);
      return newState;
    });
  }, []);

  const setDwellDuration = useCallback((seconds: number) => {
    if (seconds >= 3 && seconds <= 120) {
      setCustomDwell(seconds);
      logger.info('PlaylistEngine', `Custom dwell duration set to ${seconds}s`);
    }
  }, []);

  // Timer loop for auto-advance
  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    const interval = setInterval(() => {
      setElapsedSeconds((prev) => {
        const nextSec = prev + 1;
        if (nextSec >= currentDwellSeconds) {
          nextSlide();
          return 0;
        }
        return nextSec;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, currentDwellSeconds, nextSlide, totalSlides]);

  const progressPercent = currentDwellSeconds > 0
    ? Math.min(100, Math.floor((elapsedSeconds / currentDwellSeconds) * 100))
    : 0;

  const remainingSeconds = Math.max(0, currentDwellSeconds - elapsedSeconds);

  return {
    currentSlide,
    currentIndex,
    totalSlides,
    isPaused,
    progressPercent,
    remainingSeconds,
    togglePause,
    nextSlide,
    prevSlide,
    goToSlide,
    setDwellDuration,
  };
}
