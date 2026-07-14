import { useState, useCallback, useMemo } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, RotateCcw, Star, Sparkles, Trophy, Check, X } from 'lucide-react';
import type { PremiumQuestion } from '../data/premiumContent';

interface PremiumQuizProps {
  title: string;
  questions: PremiumQuestion[];
  onBack: () => void;
  onComplete?: (score: number, total: number) => void;
}

export function PremiumQuiz({ title, questions, onBack, onComplete }: PremiumQuizProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [shuffledQuestions] = useState(() => [...questions].sort(() => Math.random() - 0.5));

  const { speak } = useSound();
  const { addStars, recordAnswer } = useGame();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const currentQuestion = shuffledQuestions[currentIndex];
  const totalQuestions = Math.min(shuffledQuestions.length, 20);

  const handleAnswer = useCallback((answerIndex: number) => {
    if (answered) return;
    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const correct = answerIndex === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      addStars(1);
      recordAnswer(true);
      correctFeedback('Excellent! Correct answer!');
    } else {
      recordAnswer(false);
      wrongFeedback('Oops! Try the next one!');
    }

    if (currentQuestion.explanation) {
      setTimeout(() => speak(currentQuestion.explanation), 1500);
    }
  }, [answered, currentQuestion, addStars, recordAnswer, correctFeedback, wrongFeedback, speak]);

  const nextQuestion = useCallback(() => {
    if (currentIndex + 1 >= totalQuestions) {
      setShowResults(true);
      onComplete?.(score, totalQuestions);
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setAnswered(false);
    }
  }, [currentIndex, totalQuestions, score, onComplete]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setScore(0);
    setAnswered(false);
    setShowResults(false);
  }, []);

  if (showResults) {
    const percentage = Math.round((score / totalQuestions) * 100);
    return (
      <div className="min-h-screen px-4 py-6 flex flex-col items-center justify-center">
        <div className="kids-card bg-white p-8 rounded-3xl shadow-xl w-full max-w-md text-center">
          {percentage >= 80 ? (
            <Trophy className="w-20 h-20 text-amber-400 mx-auto mb-4 animate-bounce" />
          ) : percentage >= 50 ? (
            <Star className="w-20 h-20 text-yellow-400 mx-auto mb-4 animate-sparkle" />
          ) : (
            <Sparkles className="w-20 h-20 text-blue-400 mx-auto mb-4" />
          )}
          <h2 className="text-3xl font-bold text-gray-700 mb-2">Quiz Complete!</h2>
          <p className="text-5xl font-bold text-gray-700 mb-2">{score}/{totalQuestions}</p>
          <p className="text-xl text-gray-500 mb-6">{percentage}% Correct</p>
          <div className="flex gap-4">
            <button
              onClick={restart}
              className="flex-1 py-3 rounded-2xl bg-blue-100 text-blue-600 font-bold hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" /> Try Again
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold hover:scale-105 transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">{title}</h1>
        <button onClick={restart} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Progress & Score */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg">
          <Star className="w-5 h-5 text-yellow-500 animate-sparkle" />
          <span className="font-bold text-gray-700">{score} correct</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg">
          <span className="font-bold text-gray-700">{currentIndex + 1} / {totalQuestions}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-md mx-auto bg-white/50 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex) / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="max-w-md mx-auto">
        <div className="kids-card bg-white p-6 rounded-3xl shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-600 capitalize">
              {currentQuestion.category}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">{currentQuestion.question}</h2>

          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`p-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-between ${
                  !answered
                    ? 'bg-blue-50 hover:bg-blue-100 text-blue-700 hover:scale-105'
                    : index === currentQuestion.answer
                    ? 'bg-green-500 text-white animate-pop'
                    : index === selectedAnswer
                    ? 'bg-red-500 text-white animate-shake'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                <span>{option}</span>
                {answered && index === currentQuestion.answer && <Check className="w-6 h-6" />}
                {answered && index === selectedAnswer && index !== currentQuestion.answer && <X className="w-6 h-6" />}
              </button>
            ))}
          </div>

          {answered && currentQuestion.explanation && (
            <div className="mt-4 p-4 rounded-2xl bg-blue-50 animate-slide-up">
              <p className="text-sm text-gray-600">
                <Sparkles className="w-4 h-4 inline mr-1 text-blue-400" />
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-400 to-blue-500 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform"
          >
            {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
