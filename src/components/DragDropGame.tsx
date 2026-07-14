import { useState, useCallback, useEffect } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

type MatchType = 'letters' | 'numbers' | 'animals' | 'fruits' | 'shapes' | 'colors';

interface MatchItem {
  id: string;
  display: string;
  match: string;
}

interface DragDropGameProps {
  onBack: () => void;
}

const letterMatches: MatchItem[] = [
  { id: 'a', display: 'A', match: 'apple' },
  { id: 'b', display: 'B', match: 'ball' },
  { id: 'c', display: 'C', match: 'cat' },
  { id: 'd', display: 'D', match: 'dog' },
];

const numberMatches: MatchItem[] = [
  { id: '1', display: '1', match: 'one' },
  { id: '2', display: '2', match: 'two' },
  { id: '3', display: '3', match: 'three' },
  { id: '4', display: '4', match: 'four' },
];

const animalMatches: MatchItem[] = [
  { id: 'cat', display: '🐱', match: 'cat' },
  { id: 'dog', display: '🐕', match: 'dog' },
  { id: 'bird', display: '🐦', match: 'bird' },
  { id: 'fish', display: '🐟', match: 'fish' },
];

const fruitMatches: MatchItem[] = [
  { id: 'apple', display: '🍎', match: 'apple' },
  { id: 'banana', display: '🍌', match: 'banana' },
  { id: 'grape', display: '🍇', match: 'grape' },
  { id: 'orange', display: '🍊', match: 'orange' },
];

const shapeMatches: MatchItem[] = [
  { id: 'circle', display: '⭕', match: 'circle' },
  { id: 'square', display: '⬛', match: 'square' },
  { id: 'triangle', display: '🔺', match: 'triangle' },
  { id: 'star', display: '⭐', match: 'star' },
];

const colorMatches: MatchItem[] = [
  { id: 'red', display: '🔴', match: 'red' },
  { id: 'blue', display: '🔵', match: 'blue' },
  { id: 'green', display: '🟢', match: 'green' },
  { id: 'yellow', display: '🟡', match: 'yellow' },
];

const matchTypes: { type: MatchType; label: string; color: string }[] = [
  { type: 'letters', label: 'Letters', color: 'from-pink-400 to-pink-500' },
  { type: 'numbers', label: 'Numbers', color: 'from-blue-400 to-blue-500' },
  { type: 'animals', label: 'Animals', color: 'from-amber-400 to-amber-500' },
  { type: 'fruits', label: 'Fruits', color: 'from-red-400 to-red-500' },
  { type: 'shapes', label: 'Shapes', color: 'from-purple-400 to-purple-500' },
  { type: 'colors', label: 'Colors', color: 'from-green-400 to-green-500' },
];

const getMatches = (type: MatchType): MatchItem[] => {
  switch (type) {
    case 'letters': return letterMatches;
    case 'numbers': return numberMatches;
    case 'animals': return animalMatches;
    case 'fruits': return fruitMatches;
    case 'shapes': return shapeMatches;
    case 'colors': return colorMatches;
    default: return letterMatches;
  }
};

const getMatchLabel = (type: MatchType, id: string): string => {
  const matches = getMatches(type);
  const item = matches.find(m => m.id === id);
  return item?.match || id;
};

export function DragDropGame({ onBack }: DragDropGameProps) {
  const [matchType, setMatchType] = useState<MatchType>('letters');
  const [items, setItems] = useState<MatchItem[]>([]);
  const [targets, setTargets] = useState<{ id: string; matched: boolean; matchedWith?: string }[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [completedCount, setCompletedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer } = useGame();

  useEffect(() => {
    initializeGame();
  }, [matchType]);

  const initializeGame = useCallback(() => {
    const matches = getMatches(matchType);
    setItems([...matches].sort(() => Math.random() - 0.5));
    setTargets(matches.map(m => ({ id: m.match, matched: false })).sort(() => Math.random() - 0.5));
    setCompletedCount(0);
    setShowSuccess(false);
  }, [matchType]);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
    playSound('click');
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDrop = (targetId: string) => {
    if (!draggedItem) return;

    const item = items.find(i => i.id === draggedItem);
    if (!item) return;

    const isCorrect = item.match === targetId;

    if (isCorrect) {
      playSound('correct');
      speak('Correct!');
      setTargets(prev =>
        prev.map(t =>
          t.id === targetId ? { ...t, matched: true, matchedWith: draggedItem } : t
        )
      );
      setItems(prev => prev.filter(i => i.id !== draggedItem));
      setCompletedCount(prev => prev + 1);
      addStars(1);
      recordAnswer(true);

      if (completedCount + 1 >= getMatches(matchType).length) {
        setTimeout(() => {
          setShowSuccess(true);
          triggerConfetti();
          playSound('celebration');
          speak('Amazing! You matched everything!');
        }, 500);
      }
    } else {
      playSound('wrong');
      speak('Oops! Try again!');
      recordAnswer(false);
    }

    setDraggedItem(null);
  };

  const handleTouchStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleTouchEnd = (e: React.TouchEvent, targetId: string) => {
    e.preventDefault();
    handleDrop(targetId);
  };

  const currentTypeConfig = matchTypes.find(t => t.type === matchType);

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

        <h1 className="text-2xl font-bold text-white drop-shadow">Drag & Match</h1>

        <button
          onClick={initializeGame}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Match Type Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {matchTypes.map((mt) => (
          <button
            key={mt.type}
            onClick={() => setMatchType(mt.type)}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              matchType === mt.type
                ? `bg-gradient-to-r ${mt.color} text-white scale-110`
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            {mt.label}
          </button>
        ))}
      </div>

      {/* Game Area */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
        {/* Drag Items */}
        <div className="kids-card bg-white p-4 rounded-3xl shadow-xl">
          <p className="text-center text-gray-500 mb-4 font-bold">Drag these!</p>
          <div className="grid grid-cols-2 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragEnd={handleDragEnd}
                onTouchStart={() => handleTouchStart(item.id)}
                className={`w-20 h-20 flex items-center justify-center rounded-2xl text-3xl font-bold cursor-grab transform transition-all hover:scale-110 ${
                  draggedItem === item.id
                    ? `bg-gradient-to-r ${currentTypeConfig?.color} text-white scale-110 opacity-50`
                    : `bg-gradient-to-r ${currentTypeConfig?.color} text-white`
                }`}
              >
                {item.display}
              </div>
            ))}
          </div>
        </div>

        {/* Target Area */}
        <div className="kids-card bg-white p-4 rounded-3xl shadow-xl">
          <p className="text-center text-gray-500 mb-4 font-bold">Drop here!</p>
          <div className="grid grid-cols-2 gap-4">
            {targets.map((target) => (
              <div
                key={target.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(target.id)}
                onTouchEnd={(e) => handleTouchEnd(e, target.id)}
                className={`drop-zone w-20 h-20 flex items-center justify-center rounded-2xl text-xl font-bold transition-all ${
                  target.matched
                    ? 'bg-green-100 border-green-500 text-green-600'
                    : 'bg-gray-100 border-gray-300 text-gray-600'
                }`}
              >
                {target.matched ? (
                  <div className="animate-pop">
                    {items.find(i => i.id === target.matchedWith as string)?.display || target.id}
                  </div>
                ) : (
                  target.id
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          {Array.from({ length: getMatches(matchType).length }).map((_, i) => (
            <Star
              key={i}
              className={`w-8 h-8 transition-all ${
                i < completedCount ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <p className="text-white font-bold">
          {completedCount} of {getMatches(matchType).length} matched!
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="text-center mt-6 animate-slide-up">
          <Sparkles className="w-16 h-16 text-yellow-400 mx-auto animate-sparkle" />
          <p className="text-3xl font-bold text-white drop-shadow-lg mt-2">
            Amazing Work!
          </p>
        </div>
      )}
    </div>
  );
}
