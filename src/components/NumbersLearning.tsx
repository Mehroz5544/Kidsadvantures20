import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Volume2, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface NumberData {
  digit: string;
  word: string;
  count: number;
  items: string[];
}

const numbers: NumberData[] = [
  { digit: '1', word: 'One', count: 1, items: ['🍎'] },
  { digit: '2', word: 'Two', count: 2, items: ['🍎', '🍎'] },
  { digit: '3', word: 'Three', count: 3, items: ['🍎', '🍎', '🍎'] },
  { digit: '4', word: 'Four', count: 4, items: ['🍎', '🍎', '🍎', '🍎'] },
  { digit: '5', word: 'Five', count: 5, items: ['🍎', '🍎', '🍎', '🍎', '🍎'] },
  { digit: '6', word: 'Six', count: 6, items: ['⭐', '⭐', '⭐', '⭐', '⭐', '⭐'] },
  { digit: '7', word: 'Seven', count: 7, items: ['🌟', '🌟', '🌟', '🌟', '🌟', '🌟', '🌟'] },
  { digit: '8', word: 'Eight', count: 8, items: ['🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈', '🎈'] },
  { digit: '9', word: 'Nine', count: 9, items: ['🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀', '🎀'] },
  { digit: '10', word: 'Ten', count: 10, items: Array(10).fill('💎') },
];

interface NumbersLearningProps {
  onBack: () => void;
}

export function NumbersLearning({ onBack }: NumbersLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countingProgress, setCountingProgress] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { speak, playSound } = useSound();
  const { addStars, triggerConfetti, recordAnswer, completeLesson } = useGame();

  const currentNumber = numbers[currentIndex];

  useEffect(() => {
    const utterance = `This is ${currentNumber.digit}. ${currentNumber.word}.`;
    speak(utterance);
    setCountingProgress(0);
    setIsCounting(false);
  }, [currentIndex, speak]);

  const handleNumberClick = useCallback(() => {
    speak(`${currentNumber.digit}. ${currentNumber.word}`);
  }, [currentNumber, speak]);

  const handleCountItems = useCallback(() => {
    if (isCounting) return;
    setIsCounting(true);
    setCountingProgress(0);

    let count = 0;
    const interval = setInterval(() => {
      count++;
      speak(count.toString());

      if (count >= currentNumber.count) {
        clearInterval(interval);
        setIsCounting(false);

        setTimeout(() => {
          setShowSuccess(true);
          playSound('celebration');
          addStars(1);
          recordAnswer(true);
          triggerConfetti();

          setTimeout(() => setShowSuccess(false), 2000);
        }, 300);
      }
    }, 600);

    interval;
    return () => clearInterval(interval);
  }, [currentNumber, speak, playSound, addStars, recordAnswer, triggerConfetti, isCounting]);

  const handleNext = useCallback(() => {
    if (currentIndex < numbers.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound('click');
    }
  }, [currentIndex, playSound]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      playSound('click');
    }
  }, [currentIndex, playSound]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) handleNext();
      else handlePrev();
    }
    setTouchStart(null);
  };

  const colors = [
    'from-blue-400 to-blue-500',
    'from-green-400 to-green-500',
    'from-purple-400 to-purple-500',
    'from-orange-400 to-orange-500',
    'from-red-400 to-red-500',
    'from-cyan-400 to-cyan-500',
    'from-pink-400 to-pink-500',
    'from-yellow-400 to-yellow-500',
    'from-indigo-400 to-indigo-500',
    'from-teal-400 to-teal-500',
  ];

  const currentColor = colors[currentIndex % colors.length];

  return (
    <div
      className="min-h-screen px-4 py-6 flex flex-col"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Numbers</h1>

        <button
          onClick={() => speak(`This is number ${currentNumber.digit}`)}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <Volume2 className="w-6 h-6 text-blue-500" />
        </button>
      </header>

      {/* Number selector */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          {numbers.map((num, index) => (
            <button
              key={num.digit}
              onClick={() => setCurrentIndex(index)}
              className={`w-10 h-10 rounded-full font-bold transition-all flex-shrink-0 ${
                index === currentIndex
                  ? `bg-gradient-to-r ${currentColor} text-white scale-125`
                  : index < currentIndex
                  ? 'bg-green-400 text-white'
                  : 'bg-white/50 text-gray-600'
              }`}
            >
              {num.digit}
            </button>
          ))}
        </div>
        <p className="text-center text-white font-bold">
          {currentIndex + 1} of {numbers.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Number Display */}
        <div
          className={`relative mb-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
            showSuccess ? 'animate-bounce' : ''
          }`}
          onClick={handleNumberClick}
        >
          <div
            className={`number-display bg-gradient-to-br ${currentColor} text-white shadow-2xl animate-float`}
            style={{
              width: '220px',
              height: '220px',
            }}
          >
            {currentNumber.digit}
          </div>

          {showSuccess && (
            <>
              <div className="absolute -top-4 -right-4">
                <Star className="w-16 h-16 text-yellow-400 animate-pop" fill="currentColor" />
              </div>
              <div className="absolute -bottom-4 -left-4">
                <Sparkles className="w-12 h-12 text-yellow-400 animate-sparkle" />
              </div>
            </>
          )}
        </div>

        {/* Word */}
        <div className="mb-6 text-center">
          <p className="text-3xl font-bold text-white drop-shadow-lg">
            {currentNumber.word}
          </p>
        </div>

        {/* Counting Area */}
        <div className="kids-card bg-white p-6 rounded-3xl shadow-xl w-full max-w-md">
          <p className="text-center text-gray-500 mb-4">Tap to count!</p>
          <div className="flex flex-wrap justify-center gap-3 mb-4 min-h-[80px]">
            {currentNumber.items.map((item, index) => (
              <span
                key={index}
                className={`text-4xl transition-all duration-300 ${
                  index < countingProgress || !isCounting
                    ? 'opacity-100 scale-100'
                    : 'opacity-30 scale-75'
                } ${index === countingProgress - 1 && isCounting ? 'animate-pop' : ''}`}
              >
                {item}
              </span>
            ))}
          </div>
          <button
            onClick={handleCountItems}
            disabled={isCounting}
            className={`w-full py-4 rounded-2xl font-bold text-xl transition-all ${
              isCounting
                ? 'bg-gray-300 cursor-wait'
                : 'bg-gradient-to-r from-green-400 to-green-500 text-white hover:scale-105'
            }`}
          >
            {isCounting ? `Counting... ${countingProgress}` : `Count ${currentNumber.count} items!`}
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-6 animate-slide-up">
            <p className="text-3xl font-bold text-yellow-400 drop-shadow-lg animate-bounce">
              Excellent! {currentNumber.count} is correct!
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-6 mb-20">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full shadow-lg transition-all ${
            currentIndex === 0
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-white hover:scale-110'
          }`}
        >
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>

        <button
          onClick={() => completeLesson('numbers')}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
        >
          Complete!
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === numbers.length - 1}
          className={`p-4 rounded-full shadow-lg transition-all ${
            currentIndex === numbers.length - 1
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-white hover:scale-110'
          }`}
        >
          <ChevronRight className="w-8 h-8 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
