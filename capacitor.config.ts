import type { CapacitorConfig } from '@capacitor/cli';
import { Style } from '@capacitor/status-bar';
import { environment } from './src/environments/environment';

const config: CapacitorConfig = {
  appId: 'com.alika.mobile',
  appName: 'Alika',
  webDir: 'dist/beauty-soft-mobile/browser',
  android: {
    allowMixedContent: true,
  },
  ios: {
    handleApplicationNotifications: false
  },
  plugins: {
    StatusBar: {
      style: Style.Light
    }
  },
  server: {
    androidScheme: 'https',
    hostname: environment.hostname
  }
};

export default config;
