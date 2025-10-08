import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.NutriKid.app',
  appName: 'HealthKidz',
  webDir: 'dist',
  ios: {
    scheme: 'App',
    bundleId: 'com.NutriKid.app',
    teamId: process.env.TEAM_ID || '',
    buildNumber: process.env.BUILD_NUMBER || '1',
    version: process.env.APP_VERSION || '1.0.0'
  },
  android: {
    package: 'com.NutriKid.app'
  }
};

export default config;
