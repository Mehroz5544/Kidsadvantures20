import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

export type SubscriptionPlan = 'monthly' | 'yearly';
export type SubscriptionStatus = 'free' | 'premium' | 'restoring';

interface SubscriptionContextType {
  isPremium: boolean;
  status: SubscriptionStatus;
  plan: SubscriptionPlan | null;
  purchaseDate: string | null;
  showSubscriptionScreen: boolean;
  setShowSubscriptionScreen: (show: boolean) => void;
  purchase: (plan: SubscriptionPlan) => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
  continueFree: () => void;
  hasFeatureAccess: (feature: PremiumFeature) => boolean;
}

export type PremiumFeature =
  | 'premium_quizzes'
  | 'advanced_math'
  | 'vocabulary'
  | 'science_gk'
  | 'daily_challenge'
  | 'weekly_challenge'
  | 'achievement_badges'
  | 'certificates'
  | 'parent_dashboard'
  | 'detailed_reports'
  | 'future_content'
  | 'priority_access';

const ALL_FEATURES: PremiumFeature[] = [
  'premium_quizzes',
  'advanced_math',
  'vocabulary',
  'science_gk',
  'daily_challenge',
  'weekly_challenge',
  'achievement_badges',
  'certificates',
  'parent_dashboard',
  'detailed_reports',
  'future_content',
  'priority_access',
];

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const PREMIUM_KEY = 'kids_learning_premium';
export const MONTHLY_PRODUCT_ID = 'kids_learning_premium_monthly';
export const YEARLY_PRODUCT_ID = 'kids_learning_premium_yearly';

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [status, setStatus] = useState<SubscriptionStatus>('free');
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [purchaseDate, setPurchaseDate] = useState<string | null>(null);
  const [showSubscriptionScreen, setShowSubscriptionScreen] = useState(false);

  useEffect(() => {
    loadPremiumState();
  }, []);

  const loadPremiumState = async () => {
    try {
      const { value } = await Preferences.get({ key: PREMIUM_KEY });
      if (value) {
        const data = JSON.parse(value);
        if (data.isPremium && data.expiryDate) {
          const expiry = new Date(data.expiryDate);
          if (expiry > new Date()) {
            setIsPremium(true);
            setStatus('premium');
            setPlan(data.plan);
            setPurchaseDate(data.purchaseDate);
          } else {
            await Preferences.remove({ key: PREMIUM_KEY });
          }
        } else if (data.isPremium) {
          setIsPremium(true);
          setStatus('premium');
          setPlan(data.plan);
          setPurchaseDate(data.purchaseDate);
        }
      }
    } catch {
      // Non-native or first launch — stay free
    }
  };

  const savePremiumState = async (premium: boolean, planType: SubscriptionPlan | null) => {
    const now = new Date();
    const expiry = new Date(now);
    if (planType === 'monthly') expiry.setMonth(expiry.getMonth() + 1);
    else if (planType === 'yearly') expiry.setFullYear(expiry.getFullYear() + 1);

    const data = {
      isPremium: premium,
      plan: planType,
      purchaseDate: now.toISOString(),
      expiryDate: premium ? expiry.toISOString() : null,
    };
    try {
      await Preferences.set({ key: PREMIUM_KEY, value: JSON.stringify(data) });
    } catch {
      localStorage.setItem(PREMIUM_KEY, JSON.stringify(data));
    }
  };

  const purchase = useCallback(async (selectedPlan: SubscriptionPlan): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      setIsPremium(true);
      setStatus('premium');
      setPlan(selectedPlan);
      setPurchaseDate(new Date().toISOString());
      await savePremiumState(true, selectedPlan);
      setShowSubscriptionScreen(false);
      return true;
    }

    try {
      const { BillingPlugin } = await import('capacitor-billing');
      const productId = selectedPlan === 'monthly' ? MONTHLY_PRODUCT_ID : YEARLY_PRODUCT_ID;
      const result = await BillingPlugin.launchBillingFlow({
        product: productId,
        type: 'subs',
      });

      if (result.value === 'success' || result.value === 'already_owned') {
        setIsPremium(true);
        setStatus('premium');
        setPlan(selectedPlan);
        setPurchaseDate(new Date().toISOString());
        await savePremiumState(true, selectedPlan);
        setShowSubscriptionScreen(false);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) {
      return false;
    }

    setStatus('restoring');
    try {
      const { BillingPlugin } = await import('capacitor-billing');
      const monthlyResult = await BillingPlugin.querySkuDetails({
        product: MONTHLY_PRODUCT_ID,
        type: 'subs',
      });
      const yearlyResult = await BillingPlugin.querySkuDetails({
        product: YEARLY_PRODUCT_ID,
        type: 'subs',
      });

      if (monthlyResult.value === 'already_owned' || yearlyResult.value === 'already_owned') {
        const restoredPlan: SubscriptionPlan = yearlyResult.value === 'already_owned' ? 'yearly' : 'monthly';
        setIsPremium(true);
        setStatus('premium');
        setPlan(restoredPlan);
        setPurchaseDate(new Date().toISOString());
        await savePremiumState(true, restoredPlan);
        setShowSubscriptionScreen(false);
        return true;
      }

      setStatus('free');
      return false;
    } catch {
      setStatus('free');
      return false;
    }
  }, []);

  const continueFree = useCallback(() => {
    setShowSubscriptionScreen(false);
  }, []);

  const hasFeatureAccess = useCallback((feature: PremiumFeature): boolean => {
    if (isPremium) return true;
    return false;
  }, [isPremium]);

  return (
    <SubscriptionContext.Provider
      value={{
        isPremium,
        status,
        plan,
        purchaseDate,
        showSubscriptionScreen,
        setShowSubscriptionScreen,
        purchase,
        restorePurchases,
        continueFree,
        hasFeatureAccess,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}

export { ALL_FEATURES };
