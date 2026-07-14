import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

interface VeggieData {
  name: string;
  emoji: string;
  color: string;
}

const vegetables: VeggieData[] = [
  { name: 'Carrot', emoji: '🥕', color: 'orange' },
  { name: 'Broccoli', emoji: '🥦', color: 'green' },
  { name: 'Corn', emoji: '🌽', color: 'yellow' },
  { name: 'Tomato', emoji: '🍅', color: 'red' },
  { name: 'Potato', emoji: '🥔', color: 'brown' },
  { name: 'Cucumber', emoji: '🥒', color: 'green' },
  { name: 'Eggplant', emoji: '🍆', color: 'purple' },
  { name: 'Pepper', emoji: '🫑', color: 'green' },
  { name: 'Garlic', emoji: '🧄', color: 'white' },
  { name: 'Onion', emoji: '🧅', color: 'yellow' },
  { name: 'Lettuce', emoji: '🥬', color: 'green' },
  { name: 'Peas', emoji: '🫛', color: 'green' },
];

interface VegetablesLearningProps {
  onBack: () => void;
}

export function VegetablesLearning({ onBack }: VegetablesLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<VeggieData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<VeggieData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const currentVeggie = vegetables[currentIndex];

  useEffect(() => {
    speak(`This is a ${currentVeggie.name}. ${currentVeggie.name} is ${currentVeggie.color}.`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...vegetables].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleVeggieClick = useCallback(() => {
    speak(`${currentVeggie.name}. Healthy ${currentVeggie.color} vegetable!`);
    playSound('pop');
  }, [currentVeggie, speak, playSound]);

  const handleQuizAnswer = useCallback((veggie: VeggieData) => {
    setSelectedAnswer(veggie.name);
    const correct = veggie.name === correctAnswer?.name;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      correctFeedback('Excellent! Healthy choice!');
    } else {
      wrongFeedback(`Oops! That's ${veggie.name}. Try again!`);
    }

    setTimeout(() => generateQuiz(), 1500);
  }, [correctAnswer, correctFeedback, wrongFeedback, generateQuiz]);

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Veggies</h1>
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
            className="w-64 h-64 bg-gradient-to-br from-green-100 to-orange-100 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center"
            onClick={handleVeggieClick}
          >
            <span className="text-9xl">{currentVeggie.emoji}</span>
          </div>

          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{currentVeggie.name}</h2>
            <div className="flex items-center justify-center gap-2">
              <div className={`w-6 h-6 rounded-full`} style={{ backgroundColor: currentVeggie.color }} />
              <p className="text-xl text-gray-500">{currentVeggie.color} vegetable</p>
            </div>
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
              onClick={() => setCurrentIndex(prev => Math.min(vegetables.length - 1, prev + 1))}
              disabled={currentIndex === vegetables.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === vegetables.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
            {vegetables.map((veggie, index) => (
              <button
                key={veggie.name}
                onClick={() => setCurrentIndex(index)}
                className={`text-3xl p-2 rounded-xl transition-all ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/30 hover:bg-white/50'}`}
              >
                {veggie.emoji}
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
              <p className="text-white font-bold text-xl mb-4">Find the {correctAnswer.name}!</p>
              <div className="grid grid-cols-2 gap-4 max-w-sm">
                {quizOptions.map((veggie) => (
                  <button
                    key={veggie.name}
                    onClick={() => handleQuizAnswer(veggie)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === veggie.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <span className="text-6xl">{veggie.emoji}</span>
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
                  <span className="text-2xl font-bold">Healthy! Correct!</span>
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
