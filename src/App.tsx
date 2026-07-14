import { useState, useEffect, useCallback } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { ABCLearning } from './components/ABCLearning';
import { NumbersLearning } from './components/NumbersLearning';
import { DragDropGame } from './components/DragDropGame';
import { MiniGames } from './components/MiniGames';
import { MathLearning } from './components/MathLearning';
import { RewardsScreen } from './components/RewardsScreen';
import { ParentDashboard } from './components/ParentDashboard';
import { ColorsLearning } from './components/ColorsLearning';
import { ShapesLearning } from './components/ShapesLearning';
import { AnimalsLearning } from './components/AnimalsLearning';
import { FruitsLearning } from './components/FruitsLearning';
import { VegetablesLearning } from './components/VegetablesLearning';
import { BirdsLearning } from './components/BirdsLearning';
import { VehiclesLearning } from './components/VehiclesLearning';
import { BodyPartsLearning } from './components/BodyPartsLearning';
import { MonthsLearning } from './components/MonthsLearning';
import { DaysLearning } from './components/DaysLearning';
import { MemoryGame } from './components/MemoryGame';
import { TracingGame } from './components/TracingGame';
import { SpeakingGame } from './components/SpeakingGame';
import { Confetti } from './components/Confetti';
import { FeedbackOverlay } from './components/FeedbackOverlay';
import { Character } from './components/Character';
import { SubscriptionScreen } from './components/SubscriptionScreen';
import { PremiumQuiz } from './components/PremiumQuiz';
import { AdvancedMath } from './components/AdvancedMath';
import { VocabularyLearning } from './components/VocabularyLearning';
import { ScienceGK } from './components/ScienceGK';
import { DailyChallenge } from './components/DailyChallenge';
import { WeeklyChallenge } from './components/WeeklyChallenge';
import { AchievementBadges } from './components/AchievementBadges';
import { Certificates } from './components/Certificates';
import { SoundProvider } from './context/SoundContext';
import { GameProvider, useGame } from './context/GameContext';
import { SubscriptionProvider, useSubscription } from './context/SubscriptionContext';
import { premiumQuestions } from './data/premiumContent';
import { initAdMob, showBannerAd, hideBannerAd, prepareInterstitialAd, showInterstitialAd } from './services/adService';

export type Screen =
  | 'home'
  | 'abc'
  | 'numbers'
  | 'dragdrop'
  | 'minigames'
  | 'math'
  | 'rewards'
  | 'parent'
  | 'colors'
  | 'shapes'
  | 'animals'
  | 'fruits'
  | 'memory'
  | 'tracing'
  | 'speaking'
  | 'counting'
  | 'vegetables'
  | 'birds'
  | 'vehicles'
  | 'bodyparts'
  | 'months'
  | 'days'
  | 'words'
  | 'urdu'
  | 'subscription'
  | 'premium_quiz'
  | 'advanced_math'
  | 'vocabulary'
  | 'science_gk'
  | 'daily_challenge'
  | 'weekly_challenge'
  | 'achievement_badges'
  | 'certificates';

const PREMIUM_SCREENS: Screen[] = [
  'premium_quiz',
  'advanced_math',
  'vocabulary',
  'science_gk',
  'daily_challenge',
  'weekly_challenge',
  'achievement_badges',
  'certificates',
];

function AppContent() {
  const { showConfetti } = useGame();
  const { isPremium, showSubscriptionScreen } = useSubscription();

  useEffect(() => {
    if (!isPremium) {
      initAdMob().then(() => {
        showBannerAd();
        prepareInterstitialAd();
      });
    } else {
      hideBannerAd();
    }
  }, [isPremium]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-200" />
        <div className="absolute top-10 left-10 w-32 h-20 bg-white rounded-full opacity-80 animate-float" />
        <div className="absolute top-20 right-20 w-40 h-24 bg-white rounded-full opacity-70 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-5 left-1/3 w-24 h-16 bg-white rounded-full opacity-60 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-8 right-8 w-20 h-20 bg-yellow-300 rounded-full shadow-lg animate-pulse-slow" />
      </div>

      <main className="relative z-10">
        <MainRouter />
      </main>

      {showConfetti && <Confetti />}
      <FeedbackOverlay />

      <Character />

      {showSubscriptionScreen && (
        <div className="fixed inset-0 z-[100] bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 overflow-y-auto">
          <SubscriptionScreen onBack={() => window.location.reload()} />
        </div>
      )}
    </div>
  );
}

function MainRouter() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const { isPremium, setShowSubscriptionScreen } = useSubscription();
  const interstitialCounterRef = useState({ count: 0 })[0];

  useEffect(() => {
    const handleBack = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && currentScreen !== 'home') {
        setCurrentScreen('home');
      }
    };
    window.addEventListener('keydown', handleBack);
    return () => window.removeEventListener('keydown', handleBack);
  }, [currentScreen]);

  const goToScreen = useCallback((screen: Screen) => {
    if (PREMIUM_SCREENS.includes(screen) && !isPremium) {
      setShowSubscriptionScreen(true);
      return;
    }
    setCurrentScreen(screen);
  }, [isPremium, setShowSubscriptionScreen]);

  const goHome = useCallback(() => {
    interstitialCounterRef.count++;
    if (!isPremium && interstitialCounterRef.count % 3 === 0) {
      showInterstitialAd();
    }
    setCurrentScreen('home');
  }, [isPremium, interstitialCounterRef]);

  switch (currentScreen) {
    case 'home':
      return <HomeScreen onNavigate={goToScreen} />;
    case 'abc':
      return <ABCLearning onBack={goHome} />;
    case 'numbers':
      return <NumbersLearning onBack={goHome} />;
    case 'dragdrop':
      return <DragDropGame onBack={goHome} />;
    case 'minigames':
      return <MiniGames onBack={goHome} onNavigate={goToScreen} />;
    case 'math':
      return <MathLearning onBack={goHome} />;
    case 'rewards':
      return <RewardsScreen onBack={goHome} />;
    case 'parent':
      return <ParentDashboard onBack={goHome} onNavigatePremium={() => setShowSubscriptionScreen(true)} />;
    case 'colors':
      return <ColorsLearning onBack={goHome} />;
    case 'shapes':
      return <ShapesLearning onBack={goHome} />;
    case 'animals':
      return <AnimalsLearning onBack={goHome} />;
    case 'fruits':
      return <FruitsLearning onBack={goHome} />;
    case 'vegetables':
      return <VegetablesLearning onBack={goHome} />;
    case 'birds':
      return <BirdsLearning onBack={goHome} />;
    case 'vehicles':
      return <VehiclesLearning onBack={goHome} />;
    case 'bodyparts':
      return <BodyPartsLearning onBack={goHome} />;
    case 'months':
      return <MonthsLearning onBack={goHome} />;
    case 'days':
      return <DaysLearning onBack={goHome} />;
    case 'memory':
      return <MemoryGame onBack={goHome} />;
    case 'tracing':
      return <TracingGame onBack={goHome} />;
    case 'speaking':
      return <SpeakingGame onBack={goHome} />;
    case 'subscription':
      return <SubscriptionScreen onBack={goHome} />;
    case 'premium_quiz':
      return <PremiumQuiz title="Premium Quiz" questions={premiumQuestions} onBack={goHome} />;
    case 'advanced_math':
      return <AdvancedMath onBack={goHome} />;
    case 'vocabulary':
      return <VocabularyLearning onBack={goHome} />;
    case 'science_gk':
      return <ScienceGK onBack={goHome} />;
    case 'daily_challenge':
      return <DailyChallenge onBack={goHome} />;
    case 'weekly_challenge':
      return <WeeklyChallenge onBack={goHome} />;
    case 'achievement_badges':
      return <AchievementBadges onBack={goHome} />;
    case 'certificates':
      return <Certificates onBack={goHome} />;
    default:
      return <HomeScreen onNavigate={goToScreen} />;
  }
}

function App() {
  return (
    <SoundProvider>
      <GameProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </GameProvider>
    </SoundProvider>
  );
}

export default App;
