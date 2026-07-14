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
import { SoundProvider } from './context/SoundContext';
import { GameProvider, useGame } from './context/GameContext';

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
  | 'urdu';

function AppContent() {
  const { showConfetti } = useGame();

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
    </div>
  );
}

function MainRouter() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');

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
    setCurrentScreen(screen);
  }, []);

  const goHome = useCallback(() => {
    setCurrentScreen('home');
  }, []);

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
      return <ParentDashboard onBack={goHome} />;
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
    default:
      return <HomeScreen onNavigate={goToScreen} />;
  }
}

function App() {
  return (
    <SoundProvider>
      <GameProvider>
        <AppContent />
      </GameProvider>
    </SoundProvider>
  );
}

export default App;
