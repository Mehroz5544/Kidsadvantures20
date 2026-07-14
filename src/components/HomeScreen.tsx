import { useCallback, useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import type { Screen } from '../App';
import {
  Type, Hash, Palette, Circle, PawPrint, Bird, Carrot, Apple, Car, User, Calendar, Dice1,
  Gift, Trophy, Settings, Volume2, VolumeX, Star, Coins, Sparkles, Pencil, Mic, Music
} from 'lucide-react';

interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  screen: Screen;
  progress?: number;
}

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

const categories: Omit<CategoryCardProps, 'progress'>[] = [
  { icon: <Type className="w-12 h-12" />, title: 'ABCD', color: 'bg-gradient-to-br from-pink-400 to-pink-500', screen: 'abc' },
  { icon: <Hash className="w-12 h-12" />, title: 'Numbers', color: 'bg-gradient-to-br from-blue-400 to-blue-500', screen: 'numbers' },
  { icon: <Palette className="w-12 h-12" />, title: 'Colors', color: 'bg-gradient-to-br from-purple-400 to-purple-500', screen: 'colors' },
  { icon: <Circle className="w-12 h-12" />, title: 'Shapes', color: 'bg-gradient-to-br from-orange-400 to-orange-500', screen: 'shapes' },
  { icon: <PawPrint className="w-12 h-12" />, title: 'Animals', color: 'bg-gradient-to-br from-amber-400 to-amber-500', screen: 'animals' },
  { icon: <Apple className="w-12 h-12" />, title: 'Fruits', color: 'bg-gradient-to-br from-red-400 to-red-500', screen: 'fruits' },
  { icon: <Carrot className="w-12 h-12" />, title: 'Veggies', color: 'bg-gradient-to-br from-green-400 to-green-500', screen: 'vegetables' },
  { icon: <Bird className="w-12 h-12" />, title: 'Birds', color: 'bg-gradient-to-br from-cyan-400 to-cyan-500', screen: 'birds' },
  { icon: <Car className="w-12 h-12" />, title: 'Vehicles', color: 'bg-gradient-to-br from-indigo-400 to-indigo-500', screen: 'vehicles' },
  { icon: <User className="w-12 h-12" />, title: 'Body Parts', color: 'bg-gradient-to-br from-rose-400 to-rose-500', screen: 'bodyparts' },
  { icon: <Calendar className="w-12 h-12" />, title: 'Months', color: 'bg-gradient-to-br from-teal-400 to-teal-500', screen: 'months' },
  { icon: <Dice1 className="w-12 h-12" />, title: 'Days', color: 'bg-gradient-to-br from-lime-400 to-lime-500', screen: 'days' },
];

const miniGames: Omit<CategoryCardProps, 'progress'>[] = [
  { icon: <Sparkles className="w-12 h-12" />, title: 'Memory', color: 'bg-gradient-to-br from-violet-400 to-violet-500', screen: 'memory' },
  { icon: <Gift className="w-12 h-12" />, title: 'Drag & Match', color: 'bg-gradient-to-br from-fuchsia-400 to-fuchsia-500', screen: 'dragdrop' },
  { icon: <Pencil className="w-12 h-12" />, title: 'Tracing', color: 'bg-gradient-to-br from-sky-400 to-sky-500', screen: 'tracing' },
  { icon: <Dice1 className="w-12 h-12" />, title: 'Math', color: 'bg-gradient-to-br from-emerald-400 to-emerald-500', screen: 'math' },
];

function CategoryCard({ icon, title, color, screen, progress = 0 }: CategoryCardProps & { onClick: () => void }) {
  const { playSound } = useSound();
  const handleClick = () => {
    playSound('click');
  };

  return (
    <button
      onClick={handleClick}
      className="category-card bg-white shadow-xl border-4 border-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      style={{ borderRadius: '24px' }}
    >
      <div className={`absolute inset-0 ${color} opacity-10 rounded-3xl`} />
      <div className={`${color} rounded-2xl p-3 mb-2 animate-wiggle`}>
        {icon}
      </div>
      <span className="text-gray-700 font-bold text-lg">{title}</span>
      {progress > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${color.replace('bg-', 'bg-')} h-full rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(progress * 10, 100)}%` }}
          />
        </div>
      )}
    </button>
  );
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { state } = useGame();
  const { soundEnabled, toggleSound, voiceEnabled, toggleVoice, musicEnabled, toggleMusic, speak } = useSound();
  const [showWelcome, setShowWelcome] = useState(false);
  const hasSpokenRef = useRef(false);

  useEffect(() => {
    setShowWelcome(true);
    if (!hasSpokenRef.current) {
      hasSpokenRef.current = true;
      const timer = setTimeout(() => {
        speak('Welcome to your learning adventure! What would you like to learn today?');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [speak]);

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('parent')}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <h1 className={`text-2xl md:text-3xl font-bold text-white drop-shadow-lg ${showWelcome ? 'animate-slide-down' : 'opacity-0'}`}>
          Learning Adventure
        </h1>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleVoice}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
          >
            <Mic className={`w-6 h-6 ${voiceEnabled ? 'text-blue-500' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={toggleMusic}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
          >
            <Music className={`w-6 h-6 ${musicEnabled ? 'text-green-500' : 'text-gray-400'}`} />
          </button>
          <button
            onClick={toggleSound}
            className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
          >
            {soundEnabled ? (
              <Volume2 className="w-6 h-6 text-green-500" />
            ) : (
              <VolumeX className="w-6 h-6 text-gray-400" />
            )}
          </button>

          <button
            onClick={() => onNavigate('rewards')}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
          >
            <Star className="w-5 h-5 text-yellow-500" />
            <Coins className="w-5 h-5 text-amber-500" />
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="flex items-center justify-center gap-6 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg">
          <Star className="w-5 h-5 text-yellow-500 animate-sparkle" />
          <span className="font-bold text-gray-700">{state.stats.totalStars}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg">
          <Trophy className="w-5 h-5 text-amber-500" />
          <span className="font-bold text-gray-700">{state.stats.lessonsCompleted} lessons</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg">
          <span className="text-2xl">🔥</span>
          <span className="font-bold text-gray-700">{state.stats.streakDays} days</span>
        </div>
      </div>

      {/* Main Categories */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 text-center drop-shadow">
          Let's Learn!
        </h2>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <button
              key={category.screen}
              onClick={() => onNavigate(category.screen)}
              className={`category-card ${category.color} text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              style={{ borderRadius: '24px', animationDelay: `${index * 50}ms` }}
            >
              <div className={`${category.color} rounded-2xl p-3 mb-2 animate-wiggle`}>
                {category.icon}
              </div>
              <span className="font-bold text-lg drop-shadow">{category.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Mini Games */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-white mb-4 text-center drop-shadow">
          Fun Games!
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {miniGames.map((game) => (
            <button
              key={game.screen}
              onClick={() => onNavigate(game.screen)}
              className={`category-card ${game.color} text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              style={{ borderRadius: '24px' }}
            >
              <div className={`${game.color} rounded-2xl p-3 mb-2 animate-bounce-slow`}>
                {game.icon}
              </div>
              <span className="font-bold text-lg drop-shadow">{game.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 rounded-full bg-white/90 backdrop-blur shadow-xl">
        <button
          onClick={() => onNavigate('abc')}
          className="p-3 rounded-full bg-pink-100 hover:bg-pink-200 transition-colors"
        >
          <Type className="w-6 h-6 text-pink-500" />
        </button>
        <button
          onClick={() => onNavigate('numbers')}
          className="p-3 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
        >
          <Hash className="w-6 h-6 text-blue-500" />
        </button>
        <button
          onClick={() => onNavigate('minigames')}
          className="p-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg hover:scale-110 transition-transform"
        >
          <Gift className="w-8 h-8" />
        </button>
        <button
          onClick={() => onNavigate('math')}
          className="p-3 rounded-full bg-green-100 hover:bg-green-200 transition-colors"
        >
          <Dice1 className="w-6 h-6 text-green-500" />
        </button>
        <button
          onClick={() => onNavigate('rewards')}
          className="p-3 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
        >
          <Trophy className="w-6 h-6 text-amber-500" />
        </button>
      </nav>
    </div>
  );
}
