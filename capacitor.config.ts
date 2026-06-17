import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaif.master',
  appName: 'Revision Master',
  webDir: 'dist',
  android: {
    backgroundColor: '#0e0820',
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: '#0e0820'
    },
    StatusBar: {
      backgroundColor: '#0e0820',
      style: 'DARK',
      overlaysWebView: false,
    },
  },
};

export default config;
