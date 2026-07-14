import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

interface BirdData {
  name: string;
  emoji: string;
  color: string;
  sound: string;
}

const birds: BirdData[] = [
  { name: 'Sparrow', emoji: '🐦', color: 'brown', sound: 'chirp chirp' },
  { name: 'Eagle', emoji: '🦅', color: 'brown', sound: 'screech' },
  { name: 'Owl', emoji: '🦉', color: 'brown', sound: 'hoo hoo' },
  { name: 'Duck', emoji: '🦆', color: 'yellow', sound: 'quack quack' },
  { name: 'Penguin', emoji: '🐧', color: 'black', sound: 'squawk' },
  { name: 'Parrot', emoji: '🦜', color: 'green', sound: 'squawk' },
  { name: 'Swan', emoji: '🦢', color: 'white', sound: 'honk' },
  { name: 'Flamingo', emoji: '🦩', color: 'pink', sound: 'honk' },
  { name: 'Rooster', emoji: '🐓', color: 'red', sound: 'cock-a-doodle-doo' },
  { name: 'Turkey', emoji: '🦃', color: 'brown', sound: 'gobble gobble' },
  { name: 'Peacock', emoji: '🦚', color: 'blue', sound: 'scream' },
  { name: 'Dove', emoji: '🕊️', color: 'white', sound: 'coo coo' },
];

interface BirdsLearningProps {
  onBack: () => void;
}

export function BirdsLearning({ onBack }: BirdsLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<BirdData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<BirdData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const currentBird = birds[currentIndex];

  useEffect(() => {
    speak(`This is a ${currentBird.name}. It says ${currentBird.sound}!`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...birds].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleBirdClick = useCallback(() => {
    speak(`${currentBird.name}! ${currentBird.sound}!`);
    playSound('pop');
  }, [currentBird, speak, playSound]);

  const handleQuizAnswer = useCallback((bird: BirdData) => {
    setSelectedAnswer(bird.name);
    const correct = bird.name === correctAnswer?.name;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      correctFeedback('Excellent! Tweet tweet!');
    } else {
      wrongFeedback(`Oops! That's a ${bird.name}. Try again!`);
    }

    setTimeout(() => generateQuiz(), 1500);
  }, [correctAnswer, correctFeedback, wrongFeedback, generateQuiz]);

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Birds</h1>
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
            className="w-64 h-64 bg-gradient-to-br from-sky-100 to-cyan-100 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center"
            onClick={handleBirdClick}
          >
            <span className="text-9xl">{currentBird.emoji}</span>
          </div>

          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{currentBird.name}</h2>
            <p className="text-xl text-gray-500">Says: {currentBird.sound}</p>
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
              onClick={() => setCurrentIndex(prev => Math.min(birds.length - 1, prev + 1))}
              disabled={currentIndex === birds.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === birds.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
            {birds.map((bird, index) => (
              <button
                key={bird.name}
                onClick={() => setCurrentIndex(index)}
                className={`text-3xl p-2 rounded-xl transition-all ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/30 hover:bg-white/50'}`}
              >
                {bird.emoji}
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
                {quizOptions.map((bird) => (
                  <button
                    key={bird.name}
                    onClick={() => handleQuizAnswer(bird)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === bird.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <span className="text-6xl">{bird.emoji}</span>
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
                  <span className="text-2xl font-bold">Tweet! Correct!</span>
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
