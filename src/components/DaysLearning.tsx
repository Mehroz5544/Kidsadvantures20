import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

interface DayData {
  name: string;
  shortName: string;
  number: number;
  isWeekend: boolean;
  emoji: string;
}

const days: DayData[] = [
  { name: 'Monday', shortName: 'Mon', number: 1, isWeekend: false, emoji: '📚' },
  { name: 'Tuesday', shortName: 'Tue', number: 2, isWeekend: false, emoji: '🎨' },
  { name: 'Wednesday', shortName: 'Wed', number: 3, isWeekend: false, emoji: '🎭' },
  { name: 'Thursday', shortName: 'Thu', number: 4, isWeekend: false, emoji: '⚽' },
  { name: 'Friday', shortName: 'Fri', number: 5, isWeekend: false, emoji: '🎵' },
  { name: 'Saturday', shortName: 'Sat', number: 6, isWeekend: true, emoji: '🎉' },
  { name: 'Sunday', shortName: 'Sun', number: 7, isWeekend: true, emoji: '☀️' },
];

interface DaysLearningProps {
  onBack: () => void;
}

export function DaysLearning({ onBack }: DaysLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<DayData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<DayData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer } = useGame();

  const currentDay = days[currentIndex];

  useEffect(() => {
    const weekendText = currentDay.isWeekend ? 'It is a weekend!' : 'It is a weekday.';
    speak(`${currentDay.name} is day number ${currentDay.number}. ${weekendText}`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...days].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleDayClick = useCallback(() => {
    speak(`${currentDay.name}! Day ${currentDay.number}!`);
    playSound('pop');
  }, [currentDay, speak, playSound]);

  const handleQuizAnswer = useCallback((day: DayData) => {
    setSelectedAnswer(day.name);
    const correct = day.name === correctAnswer?.name;
    setIsCorrect(correct);

    if (correct) {
      playSound('correct');
      speak('Correct! Great job!');
      setScore(prev => prev + 1);
      addStars(1);
      recordAnswer(true);
      if (score + 1 >= 5) triggerConfetti();
    } else {
      playSound('wrong');
      speak(`Oops! That's ${day.name}. Try again!`);
      recordAnswer(false);
    }

    setTimeout(() => generateQuiz(), 1500);
  }, [correctAnswer, playSound, speak, score, addStars, recordAnswer, triggerConfetti, generateQuiz]);

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Days</h1>
        <button
          onClick={() => setQuizMode(!quizMode)}
          className={`p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform ${quizMode ? 'bg-red-500' : 'bg-white/80'}`}
        >
          {quizMode ? <RotateCcw className="w-6 h-6 text-white" /> : <Star className="w-6 h-6 text-yellow-500" />}
        </button>
      </header>

      {!quizMode ? (
        <div className="flex flex-col items-center justify-center">
          <div
            className={`w-64 h-64 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center ${
              currentDay.isWeekend ? 'bg-gradient-to-br from-amber-100 to-orange-100' : 'bg-gradient-to-br from-blue-100 to-cyan-100'
            }`}
            onClick={handleDayClick}
          >
            <span className="text-9xl">{currentDay.emoji}</span>
          </div>

          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <div className="text-6xl font-bold text-blue-500 mb-2">{currentDay.number}</div>
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{currentDay.name}</h2>
            <p className={`text-xl font-semibold ${currentDay.isWeekend ? 'text-orange-500' : 'text-blue-500'}`}>
              {currentDay.isWeekend ? 'Weekend!' : 'Weekday'}
            </p>
          </div>

          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`p-4 rounded-full shadow-lg ${currentIndex === 0 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700" />
            </button>
            <button
              onClick={() => setCurrentIndex(prev => Math.min(days.length - 1, prev + 1))}
              disabled={currentIndex === days.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === days.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mt-6">
            {days.map((day, index) => (
              <button
                key={day.name}
                onClick={() => setCurrentIndex(index)}
                className={`p-3 rounded-xl transition-all ${index === currentIndex ? 'bg-white scale-110 shadow-lg' : 'bg-white/30 hover:bg-white/50'}`}
              >
                <span className="text-2xl">{day.emoji}</span>
              </button>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
              <div className="w-3 h-3 bg-blue-400 rounded-full" />
              <span className="text-sm text-blue-700">Weekday</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
              <div className="w-3 h-3 bg-orange-400 rounded-full" />
              <span className="text-sm text-orange-700">Weekend</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2">
              <Star className="w-6 h-6 text-yellow-400 animate-sparkle" />
              <span className="text-2xl font-bold text-white">Score: {score}</span>
            </div>
          </div>

          {correctAnswer && (
            <>
              <p className="text-white font-bold text-xl mb-4">Find {correctAnswer.name}!</p>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {quizOptions.map((day) => (
                  <button
                    key={day.name}
                    onClick={() => handleQuizAnswer(day)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === day.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <span className="text-5xl mb-1">{day.emoji}</span>
                    <span className="text-sm font-bold text-gray-600">{day.shortName}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {isCorrect !== null && (
            <div className="text-center mt-6 animate-slide-up">
              {isCorrect ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <Sparkles className="w-8 h-8" />
                  <span className="text-2xl font-bold">Wonderful! Correct!</span>
                </div>
              ) : (
                <p className="text-2xl font-bold text-white">Keep trying!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
