import { APP_METADATA, DEFAULT_KIOSK_SETTINGS } from '../config/kioskConfig';

export const APP_CONFIG = {
  appName: APP_METADATA.name,
  packageId: APP_METADATA.packageId,
  version: APP_METADATA.version,
  targetOsVersion: APP_METADATA.targetOsVersion,
  terminalId: APP_METADATA.terminalId,
  hasTVPreferredFocus: true,
  settings: DEFAULT_KIOSK_SETTINGS,
};
