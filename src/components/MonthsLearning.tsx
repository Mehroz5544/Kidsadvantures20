import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

interface MonthData {
  name: string;
  shortName: string;
  number: number;
  season: string;
  emoji: string;
}

const months: MonthData[] = [
  { name: 'January', shortName: 'Jan', number: 1, season: 'Winter', emoji: '❄️' },
  { name: 'February', shortName: 'Feb', number: 2, season: 'Winter', emoji: '💝' },
  { name: 'March', shortName: 'Mar', number: 3, season: 'Spring', emoji: '🌸' },
  { name: 'April', shortName: 'Apr', number: 4, season: 'Spring', emoji: '🌷' },
  { name: 'May', shortName: 'May', number: 5, season: 'Spring', emoji: '🌺' },
  { name: 'June', shortName: 'Jun', number: 6, season: 'Summer', emoji: '☀️' },
  { name: 'July', shortName: 'Jul', number: 7, season: 'Summer', emoji: '🏖️' },
  { name: 'August', shortName: 'Aug', number: 8, season: 'Summer', emoji: '🍦' },
  { name: 'September', shortName: 'Sep', number: 9, season: 'Fall', emoji: '🍂' },
  { name: 'October', shortName: 'Oct', number: 10, season: 'Fall', emoji: '🎃' },
  { name: 'November', shortName: 'Nov', number: 11, season: 'Fall', emoji: '🦃' },
  { name: 'December', shortName: 'Dec', number: 12, season: 'Winter', emoji: '🎄' },
];

interface MonthsLearningProps {
  onBack: () => void;
}

export function MonthsLearning({ onBack }: MonthsLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<MonthData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<MonthData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer } = useGame();

  const currentMonth = months[currentIndex];

  useEffect(() => {
    speak(`${currentMonth.name} is month number ${currentMonth.number}. It is ${currentMonth.season}.`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...months].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleMonthClick = useCallback(() => {
    speak(`${currentMonth.name}! Month ${currentMonth.number}!`);
    playSound('pop');
  }, [currentMonth, speak, playSound]);

  const handleQuizAnswer = useCallback((month: MonthData) => {
    setSelectedAnswer(month.name);
    const correct = month.name === correctAnswer?.name;
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
      speak(`Oops! That's ${month.name}. Try again!`);
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
        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Months</h1>
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
            className="w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center"
            onClick={handleMonthClick}
          >
            <span className="text-9xl">{currentMonth.emoji}</span>
          </div>

          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <div className="text-6xl font-bold text-blue-500 mb-2">{currentMonth.number}</div>
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{currentMonth.name}</h2>
            <p className="text-xl text-gray-500">{currentMonth.season}</p>
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
              onClick={() => setCurrentIndex(prev => Math.min(months.length - 1, prev + 1))}
              disabled={currentIndex === months.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === months.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2 mt-6 max-w-lg">
            {months.map((month, index) => (
              <button
                key={month.name}
                onClick={() => setCurrentIndex(index)}
                className={`p-2 rounded-xl transition-all ${index === currentIndex ? 'bg-white scale-110 shadow-lg' : 'bg-white/30 hover:bg-white/50'}`}
              >
                <span className="text-2xl">{month.emoji}</span>
              </button>
            ))}
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
                {quizOptions.map((month) => (
                  <button
                    key={month.name}
                    onClick={() => handleQuizAnswer(month)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === month.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <span className="text-5xl mb-1">{month.emoji}</span>
                    <span className="text-sm font-bold text-gray-600">{month.shortName}</span>
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
