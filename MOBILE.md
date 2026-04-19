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
npm run build
npx cap sync
```

### 5. Open in Native IDEs
```bash
npx cap open ios
npx cap open android
```

## Method 2: PWA (Progressive Web App)
I have already prepared the `manifest.json` and mobile meta-tags in this project.
- **Android**: Open the URL in Chrome -> "Add to Home Screen".
- **iOS**: Open the URL in Safari -> Share Icon -> "Add to Home Screen".

The app will behave like a native app, with a standalone window and its own icon.
