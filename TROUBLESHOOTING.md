# Troubleshooting Guide — Amazon Devices Signage Kiosk

This guide covers common issues, root causes, and verified fixes for developing, testing, and deploying to **Amazon Vega OS** and **Amazon Fire TV**.

---

## 1. Amazon Vega OS Issues

### Issue 1.1: Missing `[os.version]` Table in `manifest.toml`
* **Symptom**: Build or packaging fails with error:
  `OS-prefixed module entries are declared but the manifest does not declare an [os.version] table`
* **Root Cause**: As of Vega SDK 0.24, the `[os.version]` table is mandatory.
* **Fix**: Ensure `manifest.toml` declares:
  ```toml
  [os.version]
  min = "1.2"
  target = "1.2"
  ```

### Issue 1.2: VDA Device Not Found or Disconnected
* **Symptom**: `vda devices` returns empty or `connection refused`.
* **Fix**:
  1. Verify Fire TV / Vega device has Developer Mode turned ON.
  2. Verify your development host and the device are on the same Wi-Fi subnet.
  3. Reconnect VDA:
     ```bash
     vda connect <DEVICE_IP>:5555
     ```

### Issue 1.3: Port Forwarding for Metro Bundler
* **Symptom**: The app boots into a white/black screen or reports `Could not connect to development server`.
* **Fix**: Forward port 8081 using VDA or ADB:
  ```bash
  vda forward tcp:8081 tcp:8081
  # Or for ADB:
  adb reverse tcp:8081 tcp:8081
  ```

---

## 2. Remote Control & Focus Management Issues

### Issue 2.1: Focus Indicator Is Invisible or Fails Accessibility
* **Symptom**: Remote navigation moves focus, but the user cannot identify which button or card is active.
* **Root Cause**: Color-only or low-contrast focus indicators violate Amazon accessibility guidelines.
* **Fix**: Always apply physical changes on focus:
  ```typescript
  // Applied in FocusableButton.tsx & MediaCanvasZone.tsx
  buttonFocused: {
    borderColor: '#00A8E1', // Alexa Cyan 3px border
    borderWidth: 3,
    backgroundColor: '#1F2937',
    transform: [{ scale: 1.04 }], // Physical scale expansion
  }
  ```

### Issue 2.2: Focus Becomes Trapped in Background During Modal Display
* **Symptom**: Opening the Admin Settings modal allows D-pad focus to leak to background slide controls.
* **Fix**: Use React Native `<Modal transparent={true}>` with `onRequestClose` and dedicated focusable controls inside the dialog card.

### Issue 2.3: Back Button Exits the App Unexpectedly
* **Symptom**: Pressing the Back key on the remote while the Admin Modal is open terminates the entire application.
* **Fix**: In `src/App.tsx`, intercept the back press in `useRemoteControl`:
  ```typescript
  const handleBackPress = useCallback((): boolean => {
    if (settings.showAdminOverlay) {
      setSettings((prev) => ({ ...prev, showAdminOverlay: false }));
      return true; // Stop propagation
    }
    return false; // Exit app only if on root canvas
  }, [settings.showAdminOverlay]);
  ```

---

## 3. Network & Offline Resilience

### Issue 3.1: Broken Image or Offline Network Drop Causes Blank Screen
* **Symptom**: When network connectivity is lost, the main media zone renders an empty black rectangle.
* **Fix**: The application utilizes `AssetCacheManager` (`src/services/assetCache.ts`) and `Image.onError` handlers:
  1. Any image load error immediately marks the URI as failed.
  2. The slide automatically falls back to `slide.fallbackUri` or bundled `assets/image/app_icon.png`.
  3. When network connectivity resumes, `assetCache.resetFailures()` automatically clears the failed registry.

### Issue 3.2: Weather Service Timeout
* **Symptom**: Weather API call freezes or causes lag during slide transitions.
* **Fix**: `weatherService.getWeather(isOnline)` checks connectivity first. When offline or on timeout, it returns the local cached snapshot (`INITIAL_WEATHER`) with `{ isCached: true }` without blocking UI rendering.

---

## 4. Fire TV / Fire OS Specific Issues

### Issue 4.1: App Does Not Appear on Fire TV Home Screen
* **Symptom**: APK installs successfully via ADB, but does not appear in "Your Apps & Channels".
* **Root Cause**: Missing Leanback Launcher intent filter in `AndroidManifest.xml`.
* **Fix**: Ensure `android/app/src/main/AndroidManifest.xml` includes:
  ```xml
  <intent-filter>
      <action android:name="android.intent.action.MAIN" />
      <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
  </intent-filter>
  ```

### Issue 4.2: Content Clipped by Television Edges (Overscan)
* **Symptom**: Text or buttons on the screen periphery are cut off by the television frame.
* **Fix**: All layouts are wrapped in `SafeZoneContainer` (`src/components/common/SafeZoneContainer.tsx`), which enforces a 5% title-safe margin (48px horizontal, 36px vertical).
