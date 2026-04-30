import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mkr.revisionmaster',
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
      launchShowDuration: 500,
      launchAutoHide: true,
      backgroundColor: '#0e0820',
      androidScaleType: 'CENTER',
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true,
    },
    StatusBar: {
      backgroundColor: '#0e0820',
      style: 'DARK',
      overlaysWebView: false,
    },
  },
};

export default config;
