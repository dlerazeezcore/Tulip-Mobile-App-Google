import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tulip.booking',
  appName: 'Tulip Booking',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
