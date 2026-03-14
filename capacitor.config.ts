import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mkr.revisionmaster',
  appName: 'Revision Master',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
    cleartext: true
  },

  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    backgroundColor: '#ffffff',
    overscrollHistoryNavigationEnabled: false
  }
};

export default config;
