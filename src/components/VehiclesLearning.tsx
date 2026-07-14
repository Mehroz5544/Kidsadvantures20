import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

interface VehicleData {
  name: string;
  emoji: string;
  color: string;
  sound: string;
}

const vehicles: VehicleData[] = [
  { name: 'Car', emoji: '🚗', color: 'red', sound: 'vroom vroom' },
  { name: 'Bus', emoji: '🚌', color: 'yellow', sound: 'honk honk' },
  { name: 'Truck', emoji: '🚚', color: 'blue', sound: 'rumble' },
  { name: 'Bicycle', emoji: '🚲', color: 'green', sound: 'ring ring' },
  { name: 'Motorcycle', emoji: '🏍️', color: 'black', sound: 'vroom' },
  { name: 'Airplane', emoji: '✈️', color: 'white', sound: 'whoosh' },
  { name: 'Helicopter', emoji: '🚁', color: 'red', sound: 'chop chop' },
  { name: 'Boat', emoji: '⛵', color: 'white', sound: 'splash' },
  { name: 'Ship', emoji: '🚢', color: 'blue', sound: 'honk' },
  { name: 'Train', emoji: '🚂', color: 'red', sound: 'choo choo' },
  { name: 'Fire Truck', emoji: '🚒', color: 'red', sound: 'wee woo' },
  { name: 'Ambulance', emoji: '🚑', color: 'white', sound: 'wee woo' },
];

interface VehiclesLearningProps {
  onBack: () => void;
}

export function VehiclesLearning({ onBack }: VehiclesLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<VehicleData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<VehicleData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const currentVehicle = vehicles[currentIndex];

  useEffect(() => {
    speak(`This is a ${currentVehicle.name}. It goes ${currentVehicle.sound}!`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...vehicles].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleVehicleClick = useCallback(() => {
    speak(`${currentVehicle.name}! ${currentVehicle.sound}!`);
    playSound('pop');
  }, [currentVehicle, speak, playSound]);

  const handleQuizAnswer = useCallback((vehicle: VehicleData) => {
    setSelectedAnswer(vehicle.name);
    const correct = vehicle.name === correctAnswer?.name;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      correctFeedback('Excellent! Vroom vroom!');
    } else {
      wrongFeedback(`Oops! That's a ${vehicle.name}. Try again!`);
    }

    setTimeout(() => generateQuiz(), 1500);
  }, [correctAnswer, correctFeedback, wrongFeedback, generateQuiz]);

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Vehicles</h1>
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
            className="w-64 h-64 bg-gradient-to-br from-gray-100 to-blue-100 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center"
            onClick={handleVehicleClick}
          >
            <span className="text-9xl">{currentVehicle.emoji}</span>
          </div>

          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{currentVehicle.name}</h2>
            <p className="text-xl text-gray-500">Goes: {currentVehicle.sound}</p>
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
              onClick={() => setCurrentIndex(prev => Math.min(vehicles.length - 1, prev + 1))}
              disabled={currentIndex === vehicles.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === vehicles.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
            {vehicles.map((vehicle, index) => (
              <button
                key={vehicle.name}
                onClick={() => setCurrentIndex(index)}
                className={`text-3xl p-2 rounded-xl transition-all ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/30 hover:bg-white/50'}`}
              >
                {vehicle.emoji}
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
                {quizOptions.map((vehicle) => (
                  <button
                    key={vehicle.name}
                    onClick={() => handleQuizAnswer(vehicle)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === vehicle.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <span className="text-6xl">{vehicle.emoji}</span>
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
                  <span className="text-2xl font-bold">Vroom! Correct!</span>
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
