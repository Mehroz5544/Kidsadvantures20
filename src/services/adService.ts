import { Capacitor } from '@capacitor/core';

const BANNER_AD_ID = 'ca-app-pub-3940256099942544/6300970111';
const INTERSTITIAL_AD_ID = 'ca-app-pub-3940256099942544/1033173712';

let admobInitialized = false;
let interstitialReady = false;
let interstitialPreparing = false;

export async function initAdMob(): Promise<void> {
  if (!Capacitor.isNativePlatform() || admobInitialized) return;
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.initialize({
      tagForChildDirectedTreatment: true,
      tagForUnderAgeOfConsent: true,
    });
    admobInitialized = true;
  } catch {
    // AdMob not available in this environment
  }
}

export async function showBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !admobInitialized) return;
  try {
    const { AdMob, BannerAdPosition, BannerAdSize } = await import('@capacitor-community/admob');
    await AdMob.showBanner({
      adId: BANNER_AD_ID,
      adSize: BannerAdSize.BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      isTesting: true,
      npa: true,
    });
  } catch {
    // Banner ad failed to show
  }
}

export async function hideBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !admobInitialized) return;
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.hideBanner();
  } catch {
    // Banner ad failed to hide
  }
}

export async function removeBannerAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !admobInitialized) return;
  try {
    const { AdMob } = await import('@capacitor-community/admob');
    await AdMob.removeBanner();
  } catch {
    // Banner ad failed to remove
  }
}

export async function prepareInterstitialAd(): Promise<void> {
  if (!Capacitor.isNativePlatform() || !admobInitialized || interstitialReady || interstitialPreparing) return;
  interstitialPreparing = true;
  try {
    const { AdMob, InterstitialAdPluginEvents } = await import('@capacitor-community/admob');
    await AdMob.prepareInterstitial({
      adId: INTERSTITIAL_AD_ID,
      isTesting: true,
      npa: true,
      immersiveMode: true,
    });

    AdMob.addListener(InterstitialAdPluginEvents.Loaded, () => {
      interstitialReady = true;
      interstitialPreparing = false;
    });
    AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => {
      interstitialReady = false;
      interstitialPreparing = false;
    });
  } catch {
    interstitialPreparing = false;
  }
}

export async function showInterstitialAd(): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || !admobInitialized || !interstitialReady) return false;
  try {
    const { AdMob, InterstitialAdPluginEvents } = await import('@capacitor-community/admob');
    await AdMob.showInterstitial();
    interstitialReady = false;

    AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
      prepareInterstitialAd();
    });

    return true;
  } catch {
    interstitialReady = false;
    return false;
  }
}

export function isInterstitialReady(): boolean {
  return interstitialReady;
}
