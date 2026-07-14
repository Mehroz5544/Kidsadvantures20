import { ArrowLeft, Puzzle, Gamepad2, Target, Fish, Candy } from 'lucide-react';
import type { Screen } from '../App';
import { useSound } from '../context/SoundContext';

interface MiniGamesProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
}

interface MiniGameCard {
  title: string;
  icon: React.ReactNode;
  color: string;
  screen: Screen;
}

const miniGames: MiniGameCard[] = [
  { title: 'Balloon Pop', icon: '🎈', color: 'from-pink-400 to-pink-500', screen: 'memory' },
  { title: 'Memory Cards', icon: <Puzzle className="w-12 h-12" />, color: 'from-purple-400 to-purple-500', screen: 'memory' },
  { title: 'Letter Trace', icon: <Gamepad2 className="w-12 h-12" />, color: 'from-blue-400 to-blue-500', screen: 'tracing' },
  { title: 'Speaking Game', icon: '🎤', color: 'from-green-400 to-green-500', screen: 'speaking' },
  { title: 'Find & Match', icon: <Target className="w-12 h-12" />, color: 'from-orange-400 to-orange-500', screen: 'dragdrop' },
  { title: 'Number Run', icon: '🔢', color: 'from-cyan-400 to-cyan-500', screen: 'numbers' },
  { title: 'Fishing Fun', icon: <Fish className="w-12 h-12" />, color: 'from-teal-400 to-teal-500', screen: 'animals' },
  { title: 'Candy Count', icon: <Candy className="w-12 h-12" />, color: 'from-rose-400 to-rose-500', screen: 'counting' },
];

export function MiniGames({ onBack, onNavigate }: MiniGamesProps) {
  const { playSound } = useSound();

  const handleGameClick = (screen: Screen) => {
    playSound('click');
    onNavigate(screen);
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-2xl font-bold text-white drop-shadow">Fun Games</h1>

        <div className="w-12" />
      </header>

      {/* Games Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {miniGames.map((game, index) => (
          <button
            key={game.title}
            onClick={() => handleGameClick(game.screen)}
            className={`category-card bg-gradient-to-br ${game.color} text-white shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
            style={{
              borderRadius: '24px',
              animationDelay: `${index * 50}ms`,
            }}
          >
            <div className="text-5xl mb-2 animate-bounce-slow">
              {typeof game.icon === 'string' ? game.icon : (
                <div className={`${game.color} rounded-full p-3`}>{game.icon}</div>
              )}
            </div>
            <span className="font-bold text-lg drop-shadow">{game.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
