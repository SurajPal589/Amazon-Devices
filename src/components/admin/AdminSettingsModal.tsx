import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal } from 'react-native';
import { TV_COLORS, TV_TYPOGRAPHY } from '../../styles/tvTokens';
import { FocusableButton } from '../common/FocusableButton';
import { KioskSettings, EmergencyAlert } from '../../types/kiosk';
import { APP_METADATA } from '../../config/kioskConfig';

interface AdminSettingsModalProps {
  visible: boolean;
  settings: KioskSettings;
  emergencyAlert: EmergencyAlert | null;
  onClose: () => void;
  onUpdateSettings: (newSettings: Partial<KioskSettings>) => void;
  onToggleEmergencyAlert: () => void;
  onReloadPlaylist: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  visible,
  settings,
  emergencyAlert,
  onClose,
  onUpdateSettings,
  onToggleEmergencyAlert,
  onReloadPlaylist,
}) => {
  const [selectedSpeed, setSelectedSpeed] = useState<number>(10);

  if (!visible) return null;

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.dialogCard}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Kiosk Control & Admin Panel</Text>
              <Text style={styles.modalSubtitle}>
                {APP_METADATA.terminalId} • {APP_METADATA.name} v{APP_METADATA.version}
              </Text>
            </View>
            <FocusableButton
              label="✕ CLOSE"
              onPress={onClose}
              style={styles.closeButton}
            />
          </View>

          {/* Settings Grid */}
          <View style={styles.settingsGrid}>
            {/* Column 1: Playback & Rotation Settings */}
            <View style={styles.settingSection}>
              <Text style={styles.sectionHeader}>PLAYBACK CONTROLS</Text>

              <View style={styles.rowItem}>
                <Text style={styles.itemLabel}>Rotation State:</Text>
                <FocusableButton
                  label={settings.isPaused ? '▶ RESUME' : '⏸ PAUSE'}
                  onPress={() => onUpdateSettings({ isPaused: !settings.isPaused })}
                  style={styles.smallButton}
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.itemLabel}>Slide Dwell Time:</Text>
                <View style={styles.speedButtonGroup}>
                  {[6, 10, 15].map((sec) => (
                    <FocusableButton
                      key={sec}
                      label={`${sec}s`}
                      isPrimary={selectedSpeed === sec}
                      onPress={() => {
                        setSelectedSpeed(sec);
                        onUpdateSettings({ slideTransitionDurationMs: sec * 1000 });
                      }}
                      style={styles.speedButton}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.itemLabel}>Cache & Reload:</Text>
                <FocusableButton
                  label="🔄 REFRESH ASSETS"
                  onPress={onReloadPlaylist}
                  style={styles.actionButton}
                />
              </View>
            </View>

            {/* Column 2: Layout & Ticker Settings */}
            <View style={styles.settingSection}>
              <Text style={styles.sectionHeader}>ZONE & ALERT OVERRIDES</Text>

              <View style={styles.rowItem}>
                <Text style={styles.itemLabel}>Side Widget Rail:</Text>
                <FocusableButton
                  label={settings.enableEventsWidget ? 'VISIBLE' : 'HIDDEN'}
                  onPress={() =>
                    onUpdateSettings({
                      enableEventsWidget: !settings.enableEventsWidget,
                      enableWeatherWidget: !settings.enableWeatherWidget,
                    })
                  }
                  style={styles.smallButton}
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.itemLabel}>Data Ticker Bar:</Text>
                <FocusableButton
                  label={settings.enableTicker ? 'ENABLED' : 'DISABLED'}
                  onPress={() => onUpdateSettings({ enableTicker: !settings.enableTicker })}
                  style={styles.smallButton}
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.itemLabel}>Simulate Offline:</Text>
                <FocusableButton
                  label={settings.offlineMode ? 'OFFLINE' : 'ONLINE'}
                  onPress={() => onUpdateSettings({ offlineMode: !settings.offlineMode })}
                  style={styles.smallButton}
                />
              </View>

              <View style={styles.rowItem}>
                <Text style={styles.itemLabel}>Emergency Broadcast:</Text>
                <FocusableButton
                  label={emergencyAlert?.active ? '🚨 ACTIVE' : 'CLEAR'}
                  isPrimary={!!emergencyAlert?.active}
                  onPress={onToggleEmergencyAlert}
                  style={[
                    styles.smallButton,
                    emergencyAlert?.active && styles.emergencyActiveButton,
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Footer Navigation Instructions */}
          <View style={styles.modalFooter}>
            <Text style={styles.footerHint}>
              Press BACK on your Fire TV / Vega remote to dismiss this dialog.
            </Text>
            <FocusableButton
              label="Save & Exit (BACK)"
              onPress={onClose}
              isPrimary={true}
              style={styles.doneButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  dialogCard: {
    width: 900,
    backgroundColor: TV_COLORS.cardBackground,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: TV_COLORS.focusBorder,
    padding: 32,
    elevation: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: TV_COLORS.borderSubtle,
    paddingBottom: 16,
    marginBottom: 20,
  },
  modalTitle: {
    ...TV_TYPOGRAPHY.titleSection,
    color: TV_COLORS.textPrimary,
  },
  modalSubtitle: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
    marginTop: 4,
  },
  closeButton: {
    minHeight: 38,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  settingsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingSection: {
    flex: 1,
    paddingHorizontal: 12,
  },
  sectionHeader: {
    ...TV_TYPOGRAPHY.caption,
    fontWeight: '800',
    color: TV_COLORS.accentPrimary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  rowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: TV_COLORS.cardSurface,
    padding: 10,
    borderRadius: 8,
  },
  itemLabel: {
    ...TV_TYPOGRAPHY.bodySecondary,
    color: TV_COLORS.textPrimary,
    fontWeight: '500',
  },
  smallButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  speedButtonGroup: {
    flexDirection: 'row',
  },
  speedButton: {
    minHeight: 34,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 6,
  },
  emergencyActiveButton: {
    backgroundColor: TV_COLORS.alertEmergency,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: TV_COLORS.borderSubtle,
    paddingTop: 18,
    marginTop: 20,
  },
  footerHint: {
    ...TV_TYPOGRAPHY.caption,
    color: TV_COLORS.textSecondary,
  },
  doneButton: {
    minWidth: 180,
  },
});
