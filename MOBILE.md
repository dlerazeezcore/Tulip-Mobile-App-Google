# Mobile Deployment Guide for Tulip Booking

This project is built using React and Vite, making it perfect for native mobile deployment on iOS and Android.

## Method 1: Capacitor (Recommend for App Stores)
Capacitor is the modern industry standard for turning web apps into native mobile apps.

### 1. Pre-requisites
- **Node.js**: Installed on your machine.
- **Xcode**: For iOS development (Mac only).
- **Android Studio**: For Android development.

### 2. Setup
Inside this project directory on your local machine:
```bash
npm install @capacitor/core @capacitor/cli
npx cap init com.tulip.booking "Tulip Booking" --web-dir dist
```

### 3. Add Platforms
```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

### 4. Build and Sync
Every time you make changes to the web code:
```bash
npm run sync
```

### 5. Generate Icons & Splash (One-time or if branding changes)
1. Create an `assets` folder in your project root.
2. Put `icon-only.png` (1024x1024) and `splash.png` (2732x2732) inside it.
3. Run:
```bash
npm run assets
```

### 6. Open in Native IDEs
```bash
npx cap open ios
npx cap open android
```

## 🛠 Troubleshooting Xcode "AppIcon" Errors
If you see errors like `The app icon set named "AppIcon" did not have any applicable content` or `Distill failed`:

1. **Remove Icon Transparency (Most Likely)**: iOS App Icons **cannot** have any transparency (alpha channel). 
   - Open your icon image in Preview (on Mac) or another editor.
   - Export it as a PNG and **uncheck** the "Alpha" box.
   - Ensure the image is exactly 1024x1024.
2. **Use Capacitor Assets**: For a full set of icons, we recommend using the generation tool:
   - Create an `assets` folder in your project root.
   - Put your 1024x1024 icon as `assets/icon-only.png`.
   - Run: `npx @capacitor/assets generate --ios`
3. **Xcode Settings**: In Xcode, ensure `App` -> `Build Settings` -> `Primary App Icon Set Name` matches `AppIcon`.

## Method 2: PWA (Progressive Web App)
I have already prepared the `manifest.json` and mobile meta-tags in this project.
- **Android**: Open the URL in Chrome -> "Add to Home Screen".
- **iOS**: Open the URL in Safari -> Share Icon -> "Add to Home Screen".

The app will behave like a native app, with a standalone window and its own icon.
