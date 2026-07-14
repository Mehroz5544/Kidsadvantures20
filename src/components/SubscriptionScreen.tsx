import { useState, useCallback } from 'react';
import { useSubscription, type SubscriptionPlan, type PremiumFeature, ALL_FEATURES } from '../context/SubscriptionContext';
import { useSound } from '../context/SoundContext';
import { ArrowLeft, Check, Crown, Sparkles, Star, Trophy, Award, BookOpen, Brain, Calendar, Zap, RotateCcw, Lock } from 'lucide-react';

interface SubscriptionScreenProps {
  onBack: () => void;
}

const featureIcons: Record<PremiumFeature, { icon: React.ReactNode; label: string; desc: string }> = {
  premium_quizzes: { icon: <Brain className="w-6 h-6" />, label: '1000+ Premium Questions', desc: 'Extra quiz content across all categories' },
  advanced_math: { icon: <Zap className="w-6 h-6" />, label: 'Advanced Math Levels', desc: 'Multiplication, division, fractions & more' },
  vocabulary: { icon: <BookOpen className="w-6 h-6" />, label: 'English Vocabulary Pack', desc: '200+ words with meanings & examples' },
  science_gk: { icon: <Sparkles className="w-6 h-6" />, label: 'Science & General Knowledge', desc: 'Physics, chemistry, biology & space' },
  daily_challenge: { icon: <Calendar className="w-6 h-6" />, label: 'Daily Challenge', desc: 'New questions every day' },
  weekly_challenge: { icon: <Trophy className="w-6 h-6" />, label: 'Weekly Challenge', desc: 'Compete for top scores' },
  achievement_badges: { icon: <Award className="w-6 h-6" />, label: 'Achievement Badges', desc: 'Unlock special badges' },
  certificates: { icon: <Star className="w-6 h-6" />, label: 'Certificates', desc: 'Earn certificates after quizzes' },
  parent_dashboard: { icon: <BookOpen className="w-6 h-6" />, label: 'Parent Dashboard', desc: 'Detailed progress tracking' },
  detailed_reports: { icon: <Trophy className="w-6 h-6" />, label: 'Detailed Reports', desc: 'In-depth learning analytics' },
  future_content: { icon: <Sparkles className="w-6 h-6" />, label: 'Future Premium Content', desc: 'All new lessons included' },
  priority_access: { icon: <Crown className="w-6 h-6" />, label: 'Priority Access', desc: 'First to try new features' },
};

export function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const { purchase, restorePurchases, continueFree, isPremium, plan } = useSubscription();
  const { playSound, speak } = useSound();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('yearly');
  const [purchasing, setPurchasing] = useState(false);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);

  const handlePurchase = useCallback(async () => {
    setPurchasing(true);
    playSound('click');
    speak('Processing your subscription');
    const success = await purchase(selectedPlan);
    setPurchasing(false);
    if (success) {
      playSound('correct');
      speak('Welcome to premium! Enjoy all the features!');
    } else {
      playSound('wrong');
      speak('Subscription could not be completed. Please try again.');
    }
  }, [selectedPlan, purchase, playSound, speak]);

  const handleRestore = useCallback(async () => {
    playSound('click');
    setRestoreStatus('Restoring...');
    const success = await restorePurchases();
    if (success) {
      setRestoreStatus('Purchases restored! Premium activated.');
      playSound('correct');
      speak('Your purchases have been restored!');
    } else {
      setRestoreStatus('No previous purchases found.');
      playSound('wrong');
    }
    setTimeout(() => setRestoreStatus(null), 3000);
  }, [restorePurchases, playSound, speak]);

  const handleContinueFree = useCallback(() => {
    playSound('click');
    continueFree();
  }, [continueFree, playSound]);

  if (isPremium) {
    return (
      <div className="min-h-screen px-4 py-6 flex flex-col items-center justify-center">
        <div className="kids-card bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          <Crown className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
          <h1 className="text-3xl font-bold text-gray-700 mb-2">Premium Active!</h1>
          <p className="text-gray-500 mb-4">You have access to all premium features.</p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span className="text-lg font-bold text-amber-500 capitalize">{plan} Plan</span>
          </div>
          <button
            onClick={onBack}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Back to Learning
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Premium</h1>
        <div className="w-12" />
      </header>

      <div className="max-w-lg mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-amber-300 to-yellow-400 rounded-full shadow-xl mb-4 animate-bounce-slow">
            <Crown className="w-14 h-14 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">Unlock Premium!</h2>
          <p className="text-white/80 text-lg">Give your child the best learning experience</p>
        </div>

        {/* Benefits Grid */}
        <div className="kids-card bg-white p-6 rounded-3xl shadow-xl mb-6">
          <h3 className="text-xl font-bold text-gray-700 mb-4 text-center">Premium Benefits</h3>
          <div className="grid grid-cols-1 gap-3">
            {ALL_FEATURES.map((feature) => {
              const info = featureIcons[feature];
              return (
                <div key={feature} className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-200 to-yellow-300 rounded-xl flex items-center justify-center text-amber-600">
                    {info.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-700">{info.label}</p>
                    <p className="text-sm text-gray-500">{info.desc}</p>
                  </div>
                  <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Plan Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Monthly Plan */}
          <button
            onClick={() => { setSelectedPlan('monthly'); playSound('click'); }}
            className={`p-6 rounded-3xl shadow-xl transition-all text-left ${
              selectedPlan === 'monthly'
                ? 'bg-white ring-4 ring-blue-400 scale-105'
                : 'bg-white/90 hover:scale-105'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-6 h-6 text-blue-500" />
              <span className="font-bold text-gray-700 text-lg">Monthly</span>
            </div>
            <p className="text-3xl font-bold text-gray-700">$4.99</p>
            <p className="text-sm text-gray-500">per month</p>
            {selectedPlan === 'monthly' && (
              <div className="mt-2 flex items-center gap-1 text-blue-500 font-bold text-sm">
                <Check className="w-4 h-4" /> Selected
              </div>
            )}
          </button>

          {/* Yearly Plan */}
          <button
            onClick={() => { setSelectedPlan('yearly'); playSound('click'); }}
            className={`p-6 rounded-3xl shadow-xl transition-all text-left relative ${
              selectedPlan === 'yearly'
                ? 'bg-white ring-4 ring-amber-400 scale-105'
                : 'bg-white/90 hover:scale-105'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-amber-400 to-yellow-400 text-white text-xs font-bold rounded-full shadow-lg">
              BEST VALUE
            </div>
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-amber-500" />
              <span className="font-bold text-gray-700 text-lg">Yearly</span>
            </div>
            <p className="text-3xl font-bold text-gray-700">$29.99</p>
            <p className="text-sm text-gray-500">per year</p>
            <p className="text-xs text-green-500 font-bold mt-1">Save 50%!</p>
            {selectedPlan === 'yearly' && (
              <div className="mt-2 flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Check className="w-4 h-4" /> Selected
              </div>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-4">
          <button
            onClick={handlePurchase}
            disabled={purchasing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {purchasing ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="w-6 h-6" />
                Subscribe Now
              </>
            )}
          </button>

          <button
            onClick={handleRestore}
            className="w-full py-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg text-gray-600 font-bold hover:bg-white transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Restore Purchases
          </button>

          {restoreStatus && (
            <p className="text-center text-sm text-white/80">{restoreStatus}</p>
          )}

          <button
            onClick={handleContinueFree}
            className="w-full py-3 text-white/70 font-bold hover:text-white transition-colors"
          >
            Continue with Free Version
          </button>
        </div>

        {/* Free vs Premium Note */}
        <div className="kids-card bg-white/80 p-4 rounded-2xl text-center mb-20">
          <p className="text-sm text-gray-500">
            <Lock className="w-4 h-4 inline mr-1" />
            Free version includes all current features with ads. Premium removes ads and unlocks extra content.
          </p>
        </div>
      </div>
    </div>
  );
}
