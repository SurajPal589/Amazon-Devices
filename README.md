# Amazon Devices Digital Signage & Content Kiosk

A modular, television-optimized digital signage and content kiosk application built for **Amazon Vega OS** (Kepler microkernel runtime) and **Amazon Fire TV / Fire OS** (Android Leanback).

---

## 1. Project Overview & Multi-Zone Layout

The application implements a 1080p / 4K television-optimized layout divided into 3 responsive zones designed for 10-foot viewing:

```
+---------------------------------------------------------------------------------------+
|  SAFE ZONE HEADER: [AMZN] Amazon Devices Signage Kiosk • Seattle HQ   [ONLINE]  12:45 |
+-------------------------------------------------------------+-------------------------+
|                                                             |                         |
|   ZONE 1: HERO MEDIA CANVAS (72% Width)                     |  ZONE 2: SIDE WIDGETS   |
|                                                             |  (28% Width)            |
|   - Automated playlist rotation (images & promos)           |                         |
|   - Configurable dwell time with bottom progress bar        |  [ Live Weather ]       |
|   - Smooth cross-fade visual state & category tags          |    Seattle 68°F Cloudy  |
|   - Interactive transport controls: [PREV] [PAUSE] [NEXT]   |                         |
|   - Offline fallback asset resolution (AssetCache)          |  [ Today's Schedule ]   |
|                                                             |    10:00 Vega OS Live   |
|                                                             |                         |
|                                                             |  [ Mobile QR Scan ]     |
|                                                             |    Interactive Map      |
+-------------------------------------------------------------+-------------------------+
|   ZONE 3: LIVE DATA TICKER (Full-Width Bottom Bar)                                    |
|   [LIVE • ATRIUM] Welcome to Amazon Devices Showcase • Vega SDK v0.24 Available       |
+---------------------------------------------------------------------------------------+
```

### Zone Breakdown
1. **Header Bar**:
   - Organization badge, terminal identification (`KIOSK-BLDG-SEA-04`), live 12h/24h clock, connectivity status badge (Online/Offline), and remote-accessible Admin Panel button.
2. **Zone 1: Hero Media Canvas (72% Flex)**:
   - Automated slide rotation with dwell countdown timer.
   - Real-time progress bar tracking time remaining until next slide.
   - Slide counter pill (`Slide X of Y`), category tags, title, subtitle, and location CTA.
   - Interactive TV transport buttons: `◀ PREV`, `⏸ PAUSE` / `▶ RESUME`, and `NEXT ▶`.
   - AssetCache integration: automatically provides local fallbacks when offline or on image load failure.
3. **Zone 2: Side Widget Rail (28% Flex)**:
   - **Live Weather Widget**: Current temperature, high/low, humidity, and condition with automatic cached fallback when offline.
   - **Today's Schedule Widget**: Interactive upcoming agenda with time badges and "LIVE NOW" indicators.
   - **Mobile QR Interaction Tile**: Quick-action card prompting users to scan for campus maps.
4. **Zone 3: Live Data Ticker (Bottom Bar)**:
   - Continuous marquee news and bulletin ticker.
   - Priority alert insertion (places high-priority items at the top of the queue).
   - Emergency Broadcast Mode: When triggered, overrides normal ticker with a prominent red emergency notice.
5. **Admin & Settings Overlay (Modal)**:
   - Focus-trapped TV dialog for adjusting slide dwell speed (6s, 10s, 15s), toggling zones, simulating offline mode, triggering emergency broadcasts, and reloading caches.

---

## 2. 10-Foot UI & Focus Management

This application follows the official Amazon Devices Focus and Accessibility guidelines:
* **Cartesian Navigation**: Focus moves smoothly along a 2D grid based on spatial proximity.
* **Physical Focus Indicators**: Focus states include a 3px high-contrast Alexa Cyan border (`#00A8E1`), scale enlargement (`transform: [{ scale: 1.04 }]`), and background shifts.
* **Minimum Touch/Focus Target**: Every selectable element exceeds 48×48dp (`TV_FOCUS.minTouchTarget`).
* **Title-Safe Margins**: 5% horizontal (48px) and vertical (36px) margins prevent overscan clipping on television screens.
* **Back Button Handling**: The Fire TV / Vega remote `BACK` button dismisses open modals cleanly without exiting the app unexpectedly.

### Remote Control Key Mappings

| Remote Key | Action |
|---|---|
| **D-Pad Up / Down / Left / Right** | Moves focus across buttons, controls, and widgets |
| **SELECT (Center D-Pad)** | Toggles Play/Pause on media canvas or activates focused button |
| **LEFT / RIGHT (in media zone)** | Jumps to Previous or Next slide |
| **MENU (Context Key)** | Opens / Toggles the Admin Settings Panel |
| **BACK (Escape)** | Dismisses Admin Panel; returns focus to primary canvas |

---

## 3. Amazon Devices Builder Tools & MCP Integration

This project was built and verified using the **Amazon Devices Builder Tools MCP Server**:
* **MCP Package**: `@amazon-devices/amazon-devices-buildertools-mcp`
* **Status Check**:
  ```bash
  npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest check-status
  ```
* **Context Initialization**:
  ```bash
  npx -y @amazon-devices/amazon-devices-buildertools-mcp@latest init-context
  ```

---

## 4. Platform Specifications & Configurations

### A. Amazon Vega OS Target
* **Manifest**: `manifest.toml`
  - Declares `schema-version = 1`, `os.version` (`min = "1.2"`, `target = "1.2"`).
  - Component ID: `com.amazon.devices.kiosk.main`.
  - Services: `com.amazon.media.server`, `com.amazon.audio.stream`, `com.amazon.mediametrics.service`, `com.amazon.inputmethod.service`.
  - Privileges: `com.amazon.system.audio`.
* **Runtime**: React Native for Vega with native Kepler bindings.

### B. Amazon Fire TV / Fire OS Target
* **Manifest**: `android/app/src/main/AndroidManifest.xml`
  - Leanback TV mode: `<uses-feature android:name="android.software.leanback" android:required="false" />`.
  - Touchscreen optional: `<uses-feature android:name="android.hardware.touchscreen" android:required="false" />`.
  - Launcher: `android.intent.category.LEANBACK_LAUNCHER`.

---

## 5. Getting Started & Development

### Prerequisites
* Node.js v18+ (tested on Node v24.20.0, npm 11.19.0)
* TypeScript 5.0.4+
* Vega SDK v0.24+ (for Vega OS packaging) or Android SDK / ADB (for Fire TV deployment)

### Installation
```bash
npm install
```

### Type Checking
```bash
npm run typecheck
```

### Running Automated Tests
```bash
npm test
```

### Test Coverage Report
```bash
npm run test:coverage
```

---

## 6. Build & Device Deployment

### A. Deploying to Amazon Vega OS Device
1. Enable Developer Mode on the Vega device.
2. Verify VDA connectivity:
   ```bash
   vda devices
   ```
3. Build the Vega package (`.vpkg`):
   ```bash
   vega project build
   ```
4. Install and run on target device:
   ```bash
   vega project run --device <DEVICE_ID>
   ```

### B. Deploying to Amazon Fire TV Device
1. On Fire TV, go to **Settings > My Fire TV > Developer Options** and enable:
   - **ADB Debugging**: ON
   - **Apps from Unknown Sources**: ON
2. Connect via ADB over Wi-Fi:
   ```bash
   adb connect <FIRE_TV_IP>:5555
   ```
3. Verify connection:
   ```bash
   adb devices
   ```
4. Build and install Android APK:
   ```bash
   ./gradlew assembleDebug
   adb install -r android/app/build/outputs/apk/debug/app-debug.apk
   ```
5. Launch the application:
   ```bash
   adb shell am start -n com.amazon.devices.kiosk/.MainActivity
   ```

---

## 7. Verification Summary

* **Static Analysis**: TypeScript compilation verified with 0 errors (`npx tsc --noEmit`).
* **Automated Unit Tests**: 7 test suites, 23 tests executed and 100% passing:
  - `tests/playlistEngine.test.ts` (Slide transitions, looping, dwell calculations)
  - `tests/tickerService.test.ts` (Headline formatting, priority alert injection, emergency banner)
  - `tests/assetCache.test.ts` (Online/offline resolution, fallback recovery)
  - `tests/weatherService.test.ts` (Live weather, cached offline mode)
  - `tests/logger.test.ts` (Structured log levels, heartbeat telemetry payload)
  - `tests/remoteControl.test.ts` (D-pad key dispatch, remote events)
  - `tests/kioskConfig.test.ts` (TV design tokens, touch targets, overscan safe margins)
