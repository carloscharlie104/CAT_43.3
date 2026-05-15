import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cat.renting',
  appName: 'CAT Car Renting Service',
  webDir: 'dist/cat43/browser/',
  server: {
    androidScheme: 'https'
  }
};

export default config;