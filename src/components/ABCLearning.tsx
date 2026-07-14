import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, Volume2, Star, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface LetterData {
  letter: string;
  example: string;
  image: string;
}

const letters: LetterData[] = [
  { letter: 'A', example: 'Apple', image: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?w=200' },
  { letter: 'B', example: 'Ball', image: 'https://images.pexels.com/photos/209845/pexels-photo-209845.jpeg?w=200' },
  { letter: 'C', example: 'Cat', image: 'https://images.pexels.com/photos/617278/pexels-photo-617278.jpeg?w=200' },
  { letter: 'D', example: 'Dog', image: 'https://images.pexels.com/photos/4587995/pexels-photo-4587995.jpeg?w=200' },
  { letter: 'E', example: 'Elephant', image: 'https://images.pexels.com/photos/8529965/pexels-photo-8529965.jpeg?w=200' },
  { letter: 'F', example: 'Fish', image: 'https://images.pexels.com/photos/1287435/pexels-photo-1287435.jpeg?w=200' },
  { letter: 'G', example: 'Grapes', image: 'https://images.pexels.com/photos/70842/grapes-fruit-vine-70842.jpeg?w=200' },
  { letter: 'H', example: 'House', image: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?w=200' },
  { letter: 'I', example: 'Ice Cream', image: 'https://images.pexels.com/photos/1352273/pexels-photo-1352273.jpeg?w=200' },
  { letter: 'J', example: 'Jellyfish', image: 'https://images.pexels.com/photos/64782/jellyfish-aquarium-blue-water-64782.jpeg?w=200' },
  { letter: 'K', example: 'Kite', image: 'https://images.pexels.com/photos/356962/pexels-photo-356962.jpeg?w=200' },
  { letter: 'L', example: 'Lion', image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?w=200' },
  { letter: 'M', example: 'Monkey', image: 'https://images.pexels.com/photos/39866/monkey-face-zoo-mammal-39866.jpeg?w=200' },
  { letter: 'N', example: 'Nest', image: 'https://images.pexels.com/photos/758045/pexels-photo-758045.jpeg?w=200' },
  { letter: 'O', example: 'Orange', image: 'https://images.pexels.com/photos/16154/food-oranges-orange-fruit.jpg?w=200' },
  { letter: 'P', example: 'Penguin', image: 'https://images.pexels.com/photos/56040/penguin-penguin-flock-nature-56040.jpeg?w=200' },
  { letter: 'Q', example: 'Queen', image: 'https://images.pexels.com/photos/57089/pexels-photo-56089.jpeg?w=200' },
  { letter: 'R', example: 'Rainbow', image: 'https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?w=200' },
  { letter: 'S', example: 'Sun', image: 'https://images.pexels.com/photos/3022430/pexels-photo-3022430.jpeg?w=200' },
  { letter: 'T', example: 'Tree', image: 'https://images.pexels.com/photos/17643/trees-forest-national-park-sky-17643.jpeg?w=200' },
  { letter: 'U', example: 'Umbrella', image: 'https://images.pexels.com/photos/2258242/pexels-photo-2258242.jpeg?w=200' },
  { letter: 'V', example: 'Violin', image: 'https://images.pexels.com/photos/47097/violin-instrument-bowed-stringed-instrument-bow-47097.jpeg?w=200' },
  { letter: 'W', example: 'Watermelon', image: 'https://images.pexels.com/photos/1218343/pexels-photo-1218343.jpeg?w=200' },
  { letter: 'X', example: 'Xylophone', image: 'https://images.pexels.com/photos/164873/xlyophone-toy-child-colors-164873.jpeg?w=200' },
  { letter: 'Y', example: 'Yacht', image: 'https://images.pexels.com/photos/1545983/pexels-photo-1545983.jpeg?w=200' },
  { letter: 'Z', example: 'Zebra', image: 'https://images.pexels.com/photos/247504/pexels-photo-247504.jpeg?w=200' },
];

interface ABCLearningProps {
  onBack: () => void;
}

export function ABCLearning({ onBack }: ABCLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const { speak, playSound } = useSound();
  const { addStars, triggerConfetti, recordAnswer, completeLesson } = useGame();
  const { correct: correctFeedback } = useFeedback();

  const currentLetter = letters[currentIndex];

  useEffect(() => {
    const utterance = `This is ${currentLetter.letter}. Say ${currentLetter.letter}.`;
    speak(utterance);
    setShowExample(false);
  }, [currentIndex, speak]);

  const handleLetterClick = useCallback(() => {
    const utterance = `${currentLetter.letter}. ${currentLetter.example}.`;
    speak(utterance);
    setShowExample(true);
  }, [currentLetter, speak]);

  const handleExampleClick = useCallback(() => {
    speak(`${currentLetter.letter} for ${currentLetter.example}`);
    setShowSuccess(true);
    correctFeedback('Excellent! Great job!');

    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  }, [currentLetter, speak, correctFeedback]);

  const handleNext = useCallback(() => {
    if (currentIndex < letters.length - 1) {
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
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    setTouchStart(null);
  };

  const colors = [
    'from-pink-400 to-pink-500',
    'from-blue-400 to-blue-500',
    'from-green-400 to-green-500',
    'from-yellow-400 to-yellow-500',
    'from-purple-400 to-purple-500',
    'from-red-400 to-red-500',
    'from-orange-400 to-orange-500',
    'from-cyan-400 to-cyan-500',
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

        <h1 className="text-2xl font-bold text-white drop-shadow">Learn ABC</h1>

        <button
          onClick={() => speak(`This is letter ${currentLetter.letter}`)}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <Volume2 className="w-6 h-6 text-blue-500" />
        </button>
      </header>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {letters.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-8 h-8 rounded-full font-bold transition-all ${
                index === currentIndex
                  ? `bg-gradient-to-r ${currentColor} text-white scale-110`
                  : index < currentIndex
                  ? 'bg-green-400 text-white'
                  : 'bg-white/50 text-gray-500'
              }`}
            >
              {letters[index].letter}
            </button>
          ))}
        </div>
        <p className="text-center text-white font-bold">
          {currentIndex + 1} of {letters.length}
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Letter Card */}
        <div
          className={`relative mb-8 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
            showSuccess ? 'animate-bounce' : ''
          }`}
          onClick={handleLetterClick}
        >
          <div
            className={`letter-display bg-gradient-to-br ${currentColor} text-white shadow-2xl animate-float`}
            style={{
              width: '280px',
              height: '280px',
              minWidth: '200px',
              minHeight: '200px'
            }}
          >
            {currentLetter.letter}
          </div>

          {showSuccess && (
            <div className="absolute -top-4 -right-4">
              <Star className="w-16 h-16 text-yellow-400 animate-pop" fill="currentColor" />
            </div>
          )}

          {showSuccess && (
            <div className="absolute -bottom-4 -left-4">
              <Sparkles className="w-12 h-12 text-yellow-400 animate-sparkle" />
            </div>
          )}
        </div>

        {/* Example Section */}
        <div
          className="kids-card bg-white p-6 rounded-3xl shadow-xl cursor-pointer transform transition-all hover:scale-105"
          onClick={handleExampleClick}
        >
          {showExample && (
            <img
              src={currentLetter.image}
              alt={currentLetter.example}
              className="w-40 h-40 object-cover rounded-2xl mb-4 animate-scale-up"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          <div className="text-center">
            <p className="text-4xl font-bold text-gray-700">
              <span className={`bg-gradient-to-r ${currentColor} bg-clip-text text-transparent`}>
                {currentLetter.letter}
              </span>
              {' '}for{' '}
              <span className="text-blue-500">{currentLetter.example}</span>
            </p>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mt-6 animate-slide-up">
            <p className="text-3xl font-bold text-yellow-400 drop-shadow-lg animate-bounce">
              Wow! Great Job!
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
          onClick={() => completeLesson('abc')}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-green-400 to-green-500 text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
        >
          Complete!
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === letters.length - 1}
          className={`p-4 rounded-full shadow-lg transition-all ${
            currentIndex === letters.length - 1
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
