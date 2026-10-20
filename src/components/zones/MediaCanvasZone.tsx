import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SlideItem } from '../../types/kiosk';
import { TV_COLORS, TV_TYPOGRAPHY, TV_FOCUS } from '../../styles/tvTokens';
import { assetCache } from '../../services/assetCache';

interface MediaCanvasZoneProps {
  slide: SlideItem | null;
  currentIndex: number;
  totalSlides: number;
  isPaused: boolean;
  progressPercent: number;
  remainingSeconds: number;
  isOnline: boolean;
  onTogglePause: () => void;
  onNextSlide: () => void;
  onPrevSlide: () => void;
}

export const MediaCanvasZone: React.FC<MediaCanvasZoneProps> = ({
  slide,
  currentIndex,
  totalSlides,
  isPaused,
  progressPercent,
  remainingSeconds,
  isOnline,
  onTogglePause,
  onNextSlide,
  onPrevSlide,
}) => {
  const [imageError, setImageError] = useState<boolean>(false);
  const [focusedControl, setFocusedControl] = useState<string | null>(null);

  if (!slide) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Media Content Available</Text>
        <Text style={styles.emptySubtitle}>Awaiting playlist broadcast...</Text>
      </View>
    );
  }

  const resolvedUri = imageError
    ? slide.fallbackUri || 'assets/image/app_icon.png'
    : assetCache.resolveSlideUri(slide, isOnline);

  const handleImageError = () => {
    setImageError(true);
    assetCache.markUriFailed(slide.uri);
  };

  return (
    <View style={styles.container}>
      {/* Background Hero Media with Vignette Overlay */}
      <Image
        source={{ uri: resolvedUri }}
        style={styles.mediaImage}
        onError={handleImageError}
        resizeMode="cover"
      />
      <View style={styles.vignetteOverlay} />

      {/* Top Media Badges */}
      <View style={styles.topBadgeRow}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{(slide.category || 'FEATURED').toUpperCase()}</Text>
        </View>

        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>
            SLIDE {currentIndex + 1} OF {totalSlides}
          </Text>
          {isPaused && (
            <View style={styles.pausePill}>
              <Text style={styles.pausePillText}>⏸ PAUSED</Text>
            </View>
          )}
        </View>
      </View>

      {/* Slide Text Content & Call To Action */}
      <View style={styles.contentContainer}>
        <Text style={styles.titleText} numberOfLines={2}>
          {slide.title}
        </Text>
        {slide.subtitle && (
          <Text style={styles.subtitleText} numberOfLines={3}>
            {slide.subtitle}
          </Text>
        )}

        {slide.callToAction && (
          <View style={styles.ctaContainer}>
            <Text style={styles.ctaText}>📍 {slide.callToAction}</Text>
          </View>
        )}
      </View>

      {/* Bottom Transport Controls Bar & Dwell Progress */}
      <View style={styles.footerBar}>
        {/* Interactive TV Remote Controls */}
        <View style={styles.controlsGroup}>
          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            onFocus={() => setFocusedControl('prev')}
            onBlur={() => setFocusedControl(null)}
            onPress={onPrevSlide}
            style={[
              styles.controlButton,
              focusedControl === 'prev' && styles.controlButtonFocused,
            ]}
          >
            <Text style={[styles.controlText, focusedControl === 'prev' && styles.controlTextFocused]}>
              ◀ PREV
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            onFocus={() => setFocusedControl('pause')}
            onBlur={() => setFocusedControl(null)}
            onPress={onTogglePause}
            style={[
              styles.controlButton,
              focusedControl === 'pause' && styles.controlButtonFocused,
            ]}
          >
            <Text style={[styles.controlText, focusedControl === 'pause' && styles.controlTextFocused]}>
              {isPaused ? '▶ RESUME' : '⏸ PAUSE'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            accessible={true}
            accessibilityRole="button"
            onFocus={() => setFocusedControl('next')}
            onBlur={() => setFocusedControl(null)}
            onPress={onNextSlide}
            style={[
              styles.controlButton,
              focusedControl === 'next' && styles.controlButtonFocused,
            ]}
          >
            <Text style={[styles.controlText, focusedControl === 'next' && styles.controlTextFocused]}>
              NEXT ▶
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.timerHint}>
          {isPaused ? 'Rotation paused' : `Next in ${remainingSeconds}s`}
        </Text>
      </View>

      {/* Progress Bar Line */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: TV_COLORS.cardBackground,
    position: 'relative',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: TV_COLORS.borderSubtle,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: TV_COLORS.cardBackground,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    ...TV_TYPOGRAPHY.titleSection,
    color: TV_COLORS.textPrimary,
  },
  emptySubtitle: {
    ...TV_TYPOGRAPHY.bodyRegular,
    color: TV_COLORS.textSecondary,
    marginTop: 8,
  },
  mediaImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  vignetteOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 17, 23, 0.70)',
  },
  topBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  categoryBadge: {
    backgroundColor: TV_COLORS.accentPrimary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  categoryText: {
    color: TV_COLORS.textInverse,
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 1,
  },
  counterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  counterText: {
    color: TV_COLORS.textPrimary,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  pausePill: {
    backgroundColor: TV_COLORS.alertWarning,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  pausePillText: {
    color: TV_COLORS.textInverse,
    fontSize: 11,
    fontWeight: '800',
  },
  contentContainer: {
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  titleText: {
    ...TV_TYPOGRAPHY.titleHero,
    color: TV_COLORS.textPrimary,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitleText: {
    ...TV_TYPOGRAPHY.bodyRegular,
    color: '#E6EDF3',
    marginBottom: 18,
    maxWidth: '85%',
    textShadowColor: 'rgba(0, 0, 0, 0.85)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  ctaContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 168, 225, 0.25)',
    borderColor: TV_COLORS.accentSecondary,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  ctaText: {
    color: TV_COLORS.textPrimary,
    fontWeight: '600',
    fontSize: 16,
  },
  footerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    backgroundColor: 'rgba(13, 17, 23, 0.85)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  controlsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: TV_FOCUS.borderRadius,
    backgroundColor: TV_COLORS.cardSurface,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 10,
  },
  controlButtonFocused: {
    borderColor: TV_COLORS.focusBorder,
    backgroundColor: TV_COLORS.focusBackground,
    transform: [{ scale: 1.05 }],
  },
  controlText: {
    ...TV_TYPOGRAPHY.caption,
    fontWeight: '700',
    color: TV_COLORS.textPrimary,
  },
  controlTextFocused: {
    color: TV_COLORS.accentSecondary,
  },
  timerHint: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
    fontWeight: '600',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: TV_COLORS.accentPrimary,
  },
});
