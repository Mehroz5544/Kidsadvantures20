import { useState, useCallback, useMemo } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, RotateCcw, Star, Sparkles, Trophy, Check, X, FlaskConical } from 'lucide-react';
import { scienceQuestions, type ScienceQuestion } from '../data/premiumContent';

type TopicFilter = 'all' | ScienceQuestion['topic'];

const TOPICS: { label: string; value: TopicFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Physics', value: 'physics' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Biology', value: 'biology' },
  { label: 'Earth', value: 'earth' },
  { label: 'Space', value: 'space' },
  { label: 'General', value: 'general' },
];

const TOPIC_ICONS: Record<string, string> = {
  physics: '⚛️', chemistry: '🧪', biology: '🧬', earth: '🌍', space: '🚀', general: '🔬',
};

export function ScienceGK({ onBack }: { onBack: () => void }) {
  const [topic, setTopic] = useState<TopicFilter>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const { speak } = useSound();
  const { addStars, recordAnswer } = useGame();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const filteredQuestions = useMemo(() => {
    const list = topic === 'all'
      ? scienceQuestions
      : scienceQuestions.filter(q => q.topic === topic);
    return [...list].sort(() => Math.random() - 0.5).slice(0, 15);
  }, [topic]);

  const totalQuestions = filteredQuestions.length;
  const currentQuestion = filteredQuestions[currentIndex];

  const handleAnswer = useCallback((answerIndex: number) => {
    if (answered) return;
    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const correct = answerIndex === currentQuestion.answer;
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
    } else {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  }, [currentIndex, totalQuestions]);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setAnswered(false);
    setShowResults(false);
  }, []);

  const changeTopic = useCallback((newTopic: TopicFilter) => {
    setTopic(newTopic);
    restart();
  }, [restart]);

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
          <h2 className="text-3xl font-bold text-gray-700 mb-2">Science Quiz Complete!</h2>
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
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-green-400 to-green-500 text-white font-bold hover:scale-105 transition-transform"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="kids-card bg-white p-8 rounded-3xl shadow-xl text-center">
          <FlaskConical className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">No questions available for this topic.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-green-400 text-white font-bold hover:scale-105 transition-transform">
            Go Back
          </button>
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
        <h1 className="text-2xl font-bold text-white drop-shadow flex items-center gap-2">
          <FlaskConical className="w-7 h-7" /> Science & GK
        </h1>
        <button onClick={restart} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Topic Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-md mx-auto">
        {TOPICS.map(t => (
          <button
            key={t.value}
            onClick={() => changeTopic(t.value)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              topic === t.value
                ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-lg scale-105'
                : 'bg-white/80 backdrop-blur text-gray-600 hover:scale-105'
            }`}
          >
            {t.value !== 'all' && <span className="mr-1">{TOPIC_ICONS[t.value]}</span>}
            {t.label}
          </button>
        ))}
      </div>

      {/* Score & Counter */}
      <div className="flex items-center justify-center gap-4 mb-4">
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
          style={{ width: `${(currentIndex / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="max-w-md mx-auto">
        <div className="kids-card bg-white p-6 rounded-3xl shadow-xl mb-6">
          <div className="flex items-center gap-2 mb-4 justify-center">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-600 capitalize flex items-center gap-1">
              {TOPIC_ICONS[currentQuestion.topic]} {currentQuestion.topic}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-600' :
              currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {currentQuestion.difficulty.toUpperCase()}
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
                    ? 'bg-teal-50 hover:bg-teal-100 text-teal-700 hover:scale-105'
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
            <div className="mt-4 p-4 rounded-2xl bg-teal-50 animate-slide-up">
              <p className="text-sm text-gray-600">
                <Sparkles className="w-4 h-4 inline mr-1 text-teal-400" />
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {answered && (
          <button
            onClick={nextQuestion}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-400 to-green-500 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform"
          >
            {currentIndex + 1 >= totalQuestions ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  );
}
