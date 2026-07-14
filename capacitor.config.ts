import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kidslearning.adventure',
  appName: 'Kids Learning Adventure',
  webDir: 'dist',
  android: {
    allowMixedContent: true,
  },
  plugins: {
    SpeechRecognition: {
      androidForegroundService: false,
    },
  },
};

export default config;
