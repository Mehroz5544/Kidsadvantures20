import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, Volume2, RotateCcw, Star, Sparkles } from 'lucide-react';

interface ColorData {
  name: string;
  color: string;
  emoji: string;
}

const colors: ColorData[] = [
  { name: 'Red', color: '#ef4444', emoji: '🔴' },
  { name: 'Orange', color: '#f97316', emoji: '🟠' },
  { name: 'Yellow', color: '#fbbf24', emoji: '🟡' },
  { name: 'Green', color: '#22c55e', emoji: '🟢' },
  { name: 'Blue', color: '#3b82f6', emoji: '🔵' },
  { name: 'Purple', color: '#a855f7', emoji: '🟣' },
  { name: 'Pink', color: '#ec4899', emoji: '💗' },
  { name: 'Brown', color: '#92400e', emoji: '🟤' },
  { name: 'Black', color: '#171717', emoji: '⚫' },
  { name: 'White', color: '#ffffff', emoji: '⚪' },
];

interface ColorsLearningProps {
  onBack: () => void;
}

export function ColorsLearning({ onBack }: ColorsLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<ColorData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<ColorData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer, completeLesson } = useGame();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const currentColor = colors[currentIndex];

  useEffect(() => {
    speak(`This is ${currentColor.name}. ${currentColor.name} like ${getColorExample(currentColor.name)}`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) {
      generateQuiz();
    }
  }, [quizMode]);

  function getColorExample(name: string): string {
    const examples: Record<string, string> = {
      Red: 'apple',
      Orange: 'carrot',
      Yellow: 'banana',
      Green: 'grass',
      Blue: 'sky',
      Purple: 'grape',
      Pink: 'flower',
      Brown: 'chocolate',
      Black: 'cat',
      White: 'cloud',
    };
    return examples[name] || 'this color';
  }

  const generateQuiz = useCallback(() => {
    const shuffled = [...colors].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    const answer = options[Math.floor(Math.random() * options.length)];
    setQuizOptions(options);
    setCorrectAnswer(answer);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleColorClick = useCallback(() => {
    speak(`${currentColor.name}. Can you say ${currentColor.name}?`);
    playSound('click');
  }, [currentColor, speak, playSound]);

  const handleQuizAnswer = useCallback((color: ColorData) => {
    setSelectedAnswer(color.name);
    const correct = color.name === correctAnswer?.name;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      correctFeedback('Excellent! Correct color!');
    } else {
      wrongFeedback(`Oops! That's ${color.name}. Try again!`);
    }

    setTimeout(() => {
      generateQuiz();
    }, 1500);
  }, [correctAnswer, score, correctFeedback, wrongFeedback, generateQuiz]);

  const handleNext = useCallback(() => {
    if (currentIndex < colors.length - 1) {
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

        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Colors</h1>

        <button
          onClick={() => setQuizMode(!quizMode)}
          className={`p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform ${
            quizMode ? 'bg-blue-500' : 'bg-white/80'
          }`}
        >
          {quizMode ? (
            <RotateCcw className="w-6 h-6 text-white" />
          ) : (
            <Star className="w-6 h-6 text-yellow-500" />
          )}
        </button>
      </header>

      {!quizMode ? (
        <>
          {/* Color Learning Mode */}
          <div className="flex flex-col items-center justify-center">
            {/* Color Display */}
            <div
              className={`w-64 h-64 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6`}
              style={{ backgroundColor: currentColor.color, border: currentColor.name === 'White' ? '4px solid #e5e7eb' : 'none' }}
              onClick={handleColorClick}
            />

            {/* Color Name */}
            <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
              <p className="text-5xl mb-4">{currentColor.emoji}</p>
              <h2 className="text-4xl font-bold text-gray-700">{currentColor.name}</h2>
              <p className="text-gray-500 mt-2">
                Like a {getColorExample(currentColor.name)}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className={`p-4 rounded-full shadow-lg transition-all ${
                  currentIndex === 0 ? 'bg-gray-300' : 'bg-white hover:scale-110'
                }`}
              >
                <ArrowLeft className="w-8 h-8 text-gray-700" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentIndex === colors.length - 1}
                className={`p-4 rounded-full shadow-lg transition-all ${
                  currentIndex === colors.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'
                }`}
              >
                <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
              </button>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 mt-6">
              {colors.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all ${
                    index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Quiz Mode */}
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 animate-sparkle" />
              <span className="text-2xl font-bold text-white">Score: {score}</span>
            </div>
          </div>

          {correctAnswer && (
            <div className="flex flex-col items-center">
              <p className="text-white font-bold text-xl mb-4">Find the {correctAnswer.name} color!</p>

              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {quizOptions.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => handleQuizAnswer(color)}
                    className={`w-32 h-32 rounded-3xl shadow-xl transform transition-all hover:scale-105 ${
                      selectedAnswer === color.name
                        ? isCorrect
                          ? 'ring-4 ring-green-500 animate-pop'
                          : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                    style={{ backgroundColor: color.color, border: color.name === 'White' ? '4px solid #e5e7eb' : 'none' }}
                  />
                ))}
              </div>
            </div>
          )}

          {isCorrect !== null && (
            <div className="text-center mt-6 animate-slide-up">
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Sparkles className="w-8 h-8" />
                  <span className="text-2xl font-bold">Awesome!</span>
                  <Sparkles className="w-8 h-8" />
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">Keep trying!</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
