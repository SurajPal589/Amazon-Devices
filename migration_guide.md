# Fire OS to Vega OS Migration Guide — StreamHub

> **Document Type**: Migration Architecture & Technical Specification  
> **Source App**: StreamHub (Fire OS Web App / Portal)  
> **Source URL**: `https://amazonfiretv.github.io/sample-web-app/`  
> **Target OS**: Amazon Vega OS 1.2+ (Vega SDK v0.24+)  
> **Target Package**: `com.example.streamhub`  
> **Runtime**: React Native for Vega with `@amazon-devices/webview`  

---

## 1. Executive Summary & App Overview

This migration transitions the Fire TV / Fire OS Web Application (`StreamHub`) into a modern, native-hosted Amazon Vega OS application using the official Amazon Devices Builder Tools and Vega SDK.

In Fire OS, HTML5/hybrid television applications typically run inside an Android Activity hosting an `AmazonWebView` or Android `WebView`, relying on Android lifecycle callbacks, Cordova/custom Java bridges, and Fire OS manifest permissions.

In Vega OS, the web application runs inside a lightweight, highly optimized React Native for Vega shell powered by the `@amazon-devices/webview` package and the Vega native Web Renderer Service (`com.amazon.webview.renderer_service`).

---

## 2. Architecture Comparison

| Dimension | Fire OS Source Architecture | Vega OS Target Architecture |
|---|---|---|
| **Host Container** | Android `Activity` + `android.webkit.WebView` | React Native for Vega `<WebView>` Component |
| **Rendering Engine** | Android System WebView / Amazon WebKit | Chromium-based Vega Web Renderer Service (`com.amazon.webview.renderer_service`) |
| **Process Model** | Monolithic or Android Zygote Process | Split Process: Main UI Component (`com.example.streamhub.main`) + Web Renderer IPC |
| **Manifest Format** | `AndroidManifest.xml` | `manifest.toml` (TOML Schema v1 with `[os.version]`) |
| **Application Lifecycle** | `Activity.onCreate()`, `onPause()`, `onResume()` | React Native `AppState` ('active', 'background') + Kepler Hooks |
| **Launch Experience** | Android Window Background / Theme Drawable | Native Kepler Splash Screen (`usePreventHideSplashScreen`, `SplashScreenImages.zip`) |
| **Performance KPIs** | Android VSYNC / Choreographer Frame Metrics | Perfetto Traces, Time-to-First-Frame (TTFF), Time-to-Fully-Drawn (`useReportFullyDrawn`) |
| **Media Playback** | Android MediaPlayer / ExoPlayer / HTML5 `<video>` | Vega Hardware Accelerated W3C MSE/EME Media Pipeline |
| **D-Pad / Remote Navigation** | Android KeyEvent (`KEYCODE_DPAD_*`, `KEYCODE_BACK`) | W3C Keyboard Events (`ArrowUp`, `ArrowDown`, `ArrowLeft`, `ArrowRight`, `Enter`) + Back Button (`GoBack`, keyCode 27) |

---

## 3. Screen & Feature Mapping

### 3.1 Splash & Boot Sequence
- **Fire OS**: Android splash theme `windowBackground` XML drawable displayed until `Activity.onCreate` finishes and `loadUrl()` is invoked.
- **Vega OS Equivalent**: 
  - Packaged splash assets in `assets/raw/SplashScreenImages.zip` (1080p and 720p brand images).
  - Kepler splash hooks:
    ```typescript
    import { usePreventHideSplashScreen, useHideSplashScreenCallback } from '@amazon-devices/react-native-kepler';
    import { useReportFullyDrawn } from '@amazon-devices/kepler-performance-api';
    ```
  - Hide splash screen only when `<WebView>` triggers `onLoad` or `onLoadEnd`, simultaneously signaling TTFD.

### 3.2 Main TV Content Surface
- **Fire OS**: Fullscreen `FrameLayout` containing `WebView`.
- **Vega OS Equivalent**:
  - Fullscreen `<View style={{ flex: 1, backgroundColor: '#000000' }}>`
  - Single memoized `<WebView>` component with `hasTVPreferredFocus={true}`.
  - Mandatory focus retention so remote control D-pad navigation operates directly on DOM spatial navigation.

### 3.3 Remote Control Navigation & Key Interception
- **Fire OS**:
  - `onKeyDown(int keyCode, KeyEvent event)` in Activity.
  - Back key: `KeyEvent.KEYCODE_BACK` (code 4).
- **Vega OS Equivalent**:
  - Remote control keys propagate as W3C standard events into the DOM:
    - Up: `event.key === "ArrowUp"` (code 38)
    - Down: `event.key === "ArrowDown"` (code 40)
    - Left: `event.key === "ArrowLeft"` (code 37)
    - Right: `event.key === "ArrowRight"` (code 39)
    - Select: `event.key === "Enter"` (code 13)
    - Back: `event.key === "GoBack"` or `keyCode === 27` (Escape / GoBack)
  - Intercept back navigation via `injectJavaScript` or React Native `BackHandler` to support in-app history (`history.back()`).

### 3.4 Media Streaming & Video Acceleration
- **Fire OS**: Hardware codecs accessed via Android MediaCodec or HTML5 video tag.
- **Vega OS Equivalent**:
  - Vega Media Services integrated via manifest dependencies:
    - `com.amazon.media.server`: Low-latency video pipeline.
    - `com.amazon.audio.stream` & `com.amazon.audio.control`: Audio focus and volume management.
    - `com.amazon.mediametrics.service`: Video playback telemetry.
    - `com.amazon.drm.key` & `com.amazon.drm.crypto`: Encrypted media playback (Widevine / PlayReady).

---

## 4. API & Manifest Translation

### 4.1 Android Manifest to `manifest.toml` Translation

| Android Declaration (`AndroidManifest.xml`) | Vega Manifest Declaration (`manifest.toml`) | Purpose |
|---|---|---|
| `<manifest package="com.example.streamhub">` | `[package]`<br>`id = "com.example.streamhub"` | Application unique package ID |
| `<application android:label="StreamHub">` | `[package]`<br>`title = "StreamHub"` | Human-readable app name |
| `<activity android:name=".MainActivity">` | `[[components.interactive]]`<br>`id = "com.example.streamhub.main"` | Main launchable interactive UI component |
| `<uses-permission android:name="android.permission.INTERNET" />` | Core system network capability | Unconditional in Vega webview |
| Native WebKit initialization | `[[wants.service]]`<br>`id = "com.amazon.webview.renderer_service"` | **CRITICAL**: Enables Vega Webview Renderer service; prevents blank screen |
| SoftInput / Virtual Keyboard | `[[wants.service]]`<br>`id = "com.amazon.inputmethod.service"` | Vega virtual onscreen keyboard support |
| Audio & Media Server | `[[wants.service]]`<br>`id = "com.amazon.media.server"`<br>`[[wants.service]]`<br>`id = "com.amazon.audio.stream"` | Video & audio streaming hardware acceleration |
| Hardware Video DRM | `[[wants.service]]`<br>`id = "com.amazon.drm.key"`<br>`[[wants.service]]`<br>`id = "com.amazon.drm.crypto"` | DRM decryption |
| Min SDK / Target SDK (e.g. 28 / 34) | `[os.version]`<br>`min = "1.2"`<br>`target = "1.2"` | Declares target Vega OS version |

---

## 5. File & Asset Inventory

```
StreamHub/
├── manifest.toml                # Vega OS Package & Capabilities Declaration
├── package.json                 # Node dependencies (@amazon-devices/*)
├── app.json                     # Kepler app descriptor
├── index.js                     # AppRegistry entry point
├── metro.config.js              # Metro bundler config
├── tsconfig.json                # TypeScript compiler options
├── src/
│   ├── App.tsx                  # Main WebView Host Component
│   └── constants/
│       └── config.ts            # App configuration & URL endpoints
└── assets/
    ├── image/
    │   └── app_icon.png         # 512x512 app icon
    └── raw/
        └── SplashScreenImages.zip # 1080p and 720p splash images
```

---

## 6. Anti-Pattern & Quality Checklist

1. **No Conditional WebView Mounting**: The `<WebView>` component must never be unmounted or conditionally rendered (`{hasLoaded && <WebView />}` is strictly prohibited). Use `display: 'none'` or overlays if needed.
2. **Memoized Source**: The URL source must use `useMemo(() => ({ uri: WEB_URL }), [])` to prevent reload loops on re-render.
3. **No Unhandled Blank Screens**: Ensure `com.amazon.webview.renderer_service` is explicitly declared in `[wants]` of `manifest.toml`.
4. **TTFD Measurement**: Ensure `useReportFullyDrawn` is called once the web content has finished rendering.
