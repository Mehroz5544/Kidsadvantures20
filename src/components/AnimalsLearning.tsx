import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, RotateCcw, Star, Sparkles, Volume2 } from 'lucide-react';

interface AnimalData {
  name: string;
  emoji: string;
  sound: string;
  habitat: string;
}

const animals: AnimalData[] = [
  { name: 'Cat', emoji: '🐱', sound: 'Meow', habitat: 'house' },
  { name: 'Dog', emoji: '🐕', sound: 'Woof', habitat: 'house' },
  { name: 'Lion', emoji: '🦁', sound: 'Roar', habitat: 'jungle' },
  { name: 'Elephant', emoji: '🐘', sound: 'Trumpet', habitat: 'jungle' },
  { name: 'Monkey', emoji: '🐵', sound: 'Ooh ooh', habitat: 'jungle' },
  { name: 'Bird', emoji: '🐦', sound: 'Tweet', habitat: 'tree' },
  { name: 'Fish', emoji: '🐟', sound: 'Blub blub', habitat: 'water' },
  { name: 'Cow', emoji: '🐄', sound: 'Moo', habitat: 'farm' },
  { name: 'Pig', emoji: '🐷', sound: 'Oink', habitat: 'farm' },
  { name: 'Horse', emoji: '🐴', sound: 'Neigh', habitat: 'farm' },
  { name: 'Sheep', emoji: '🐑', sound: 'Baa', habitat: 'farm' },
  { name: 'Duck', emoji: '🦆', sound: 'Quack', habitat: 'pond' },
];

interface AnimalsLearningProps {
  onBack: () => void;
}

export function AnimalsLearning({ onBack }: AnimalsLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<AnimalData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<AnimalData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showSound, setShowSound] = useState(false);

  const { playSound, speak } = useSound();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const currentAnimal = animals[currentIndex];

  useEffect(() => {
    speak(`This is a ${currentAnimal.name}. The ${currentAnimal.name} says ${currentAnimal.sound}.`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...animals].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleAnimalClick = useCallback(() => {
    speak(`${currentAnimal.name}. ${currentAnimal.sound}!`);
    setShowSound(true);
    playSound('pop');
    setTimeout(() => setShowSound(false), 1000);
  }, [currentAnimal, speak, playSound]);

  const handleQuizAnswer = useCallback((animal: AnimalData) => {
    setSelectedAnswer(animal.name);
    const correct = animal.name === correctAnswer?.name;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      correctFeedback('Excellent! Correct animal!');
    } else {
      wrongFeedback(`Oops! That's a ${animal.name}. Try again!`);
    }

    setTimeout(() => generateQuiz(), 1500);
  }, [correctAnswer, correctFeedback, wrongFeedback, generateQuiz]);

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Animals</h1>
        <button
          onClick={() => setQuizMode(!quizMode)}
          className={`p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform ${quizMode ? 'bg-blue-500' : 'bg-white/80'}`}
        >
          {quizMode ? <RotateCcw className="w-6 h-6 text-white" /> : <Star className="w-6 h-6 text-yellow-500" />}
        </button>
      </header>

      {!quizMode ? (
        <div className="flex flex-col items-center justify-center">
          {/* Animal Display */}
          <div
            className="w-64 h-64 bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center"
            onClick={handleAnimalClick}
          >
            <span className="text-9xl">{currentAnimal.emoji}</span>
          </div>

          {showSound && (
            <div className="bg-white rounded-full px-6 py-3 shadow-lg mb-4 animate-pop">
              <p className="text-2xl font-bold text-amber-600">{currentAnimal.sound}!</p>
            </div>
          )}

          {/* Animal Info */}
          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{currentAnimal.name}</h2>
            <p className="text-amber-600 text-xl mb-2">Says: {currentAnimal.sound}</p>
            <p className="text-gray-500">Lives on the {currentAnimal.habitat}</p>
            <button
              onClick={handleAnimalClick}
              className="mt-4 p-3 rounded-full bg-amber-100 hover:bg-amber-200 transition-colors"
            >
              <Volume2 className="w-8 h-8 text-amber-600" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className={`p-4 rounded-full shadow-lg ${currentIndex === 0 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700" />
            </button>
            <button
              onClick={() => setCurrentIndex(prev => Math.min(animals.length - 1, prev + 1))}
              disabled={currentIndex === animals.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === animals.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
            {animals.map((animal, index) => (
              <button
                key={animal.name}
                onClick={() => setCurrentIndex(index)}
                className={`text-3xl p-2 rounded-xl transition-all ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/30 hover:bg-white/50'}`}
              >
                {animal.emoji}
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
                {quizOptions.map((animal) => (
                  <button
                    key={animal.name}
                    onClick={() => handleQuizAnswer(animal)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === animal.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <span className="text-6xl">{animal.emoji}</span>
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
                  <span className="text-2xl font-bold">Awesome!</span>
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
