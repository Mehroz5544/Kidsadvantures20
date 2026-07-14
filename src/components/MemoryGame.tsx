import { useState, useCallback, useEffect } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, RotateCcw, Star, Sparkles, Clock } from 'lucide-react';

interface MemoryCard {
  id: number;
  value: string;
  display: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardSets = {
  animals: ['🐱', '🐕', '🦁', '🐘', '🐵', '🐦', '🐟', '🐄'],
  fruits: ['🍎', '🍌', '🍇', '🍊', '🍓', '🍉', '🥝', '🍍'],
  numbers: ['1', '2', '3', '4', '5', '6', '7', '8'],
  letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
};

interface MemoryGameProps {
  onBack: () => void;
}

export function MemoryGame({ onBack }: MemoryGameProps) {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameType, setGameType] = useState<keyof typeof cardSets>('animals');
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bestTime, setBestTime] = useState<number | null>(null);

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer } = useGame();

  useEffect(() => {
    initGame();
  }, [gameType]);

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const initGame = useCallback(() => {
    const values = cardSets[gameType];
    const shuffledCards = [...values, ...values]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        display: value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setTime(0);
    setIsPlaying(false);
  }, [gameType]);

  const handleCardClick = useCallback((cardId: number) => {
    if (!isPlaying) setIsPlaying(true);
    if (flippedCards.length === 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playSound('pop');
    setCards(prev =>
      prev.map(c =>
        c.id === cardId ? { ...c, isFlipped: true } : c
      )
    );

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [first, second] = newFlipped.map(id => cards.find(c => c.id === id)!);

      if (first.value === second.value) {
        setTimeout(() => {
          playSound('correct');
          speak('Match!');
          setCards(prev =>
            prev.map(c =>
              c.id === first.id || c.id === second.id
                ? { ...c, isMatched: true }
                : c
            )
          );
          setMatchedPairs(prev => {
            const newCount = prev + 1;
            if (newCount >= 8) {
              handleWin();
            }
            return newCount;
          });
          addStars(1);
          recordAnswer(true);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          setCards(prev =>
            prev.map(c =>
              c.id === first.id || c.id === second.id
                ? { ...c, isFlipped: false }
                : c
            )
          );
          setFlippedCards([]);
          recordAnswer(false);
        }, 1000);
      }
    }
  }, [cards, flippedCards, isPlaying, playSound, speak, addStars, recordAnswer]);

  const handleWin = useCallback(() => {
    setIsPlaying(false);
    triggerConfetti();
    playSound('celebration');
    speak('Amazing! You found all the matches!');
    addStars(5);
    if (!bestTime || time < bestTime) {
      setBestTime(time);
    }
  }, [time, bestTime, triggerConfetti, playSound, speak, addStars]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Memory Game</h1>
        <button onClick={initGame} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Game Type Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {Object.keys(cardSets).map((type) => (
          <button
            key={type}
            onClick={() => setGameType(type as keyof typeof cardSets)}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              gameType === type ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white scale-110' : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-bold text-gray-700">{matchedPairs}/8</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <span className="font-bold text-gray-700">{moves} moves</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full shadow">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-gray-700">{formatTime(time)}</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto mb-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            disabled={card.isMatched}
            className={`aspect-square rounded-2xl shadow-lg transform transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-white scale-100'
                : 'bg-gradient-to-br from-purple-400 to-purple-500 hover:scale-105'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="text-4xl">{card.display}</span>
            ) : (
              <span className="text-4xl text-white">?</span>
            )}
          </button>
        ))}
      </div>

      {/* Win Message */}
      {matchedPairs >= 8 && (
        <div className="text-center animate-slide-up">
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto animate-sparkle" />
          <p className="text-3xl font-bold text-white mt-2 drop-shadow">You Won!</p>
          <p className="text-xl text-white/80">Time: {formatTime(time)} | Moves: {moves}</p>
          {bestTime && <p className="text-yellow-400">Best Time: {formatTime(bestTime)}</p>}
        </div>
      )}
    </div>
  );
}
