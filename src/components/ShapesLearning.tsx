import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useFeedback } from '../hooks/useFeedback';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

interface ShapeData {
  name: string;
  emoji: string;
  drawPath: string;
}

const shapes: ShapeData[] = [
  { name: 'Circle', emoji: '⭕', drawPath: 'M50 10 A40 40 0 1 1 49.99 10' },
  { name: 'Square', emoji: '⬛', drawPath: 'M10 10 L90 10 L90 90 L10 90 Z' },
  { name: 'Triangle', emoji: '🔺', drawPath: 'M50 10 L90 90 L10 90 Z' },
  { name: 'Rectangle', emoji: '🟩', drawPath: 'M10 25 L90 25 L90 75 L10 75 Z' },
  { name: 'Star', emoji: '⭐', drawPath: 'M50 5 L61 40 L95 40 L68 60 L79 90 L50 72 L21 90 L32 60 L5 40 L39 40 Z' },
  { name: 'Heart', emoji: '❤️', drawPath: 'M50 88 C20 60 5 35 25 20 A25 25 0 0 1 50 35 A25 25 0 0 1 75 20 C95 35 80 60 50 88Z' },
  { name: 'Diamond', emoji: '🔷', drawPath: 'M50 5 L95 50 L50 95 L5 50 Z' },
  { name: 'Oval', emoji: '🥚', drawPath: 'M50 10 A40 45 0 1 1 50 100 A40 45 0 1 1 50 10' },
];

interface ShapesLearningProps {
  onBack: () => void;
}

export function ShapesLearning({ onBack }: ShapesLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<ShapeData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<ShapeData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { correct: correctFeedback, wrong: wrongFeedback } = useFeedback();

  const currentShape = shapes[currentIndex];

  useEffect(() => {
    speak(`This is a ${currentShape.name}. Can you say ${currentShape.name}?`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...shapes].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handleShapeClick = useCallback(() => {
    speak(`${currentShape.name}. A ${currentShape.name} has ${getShapeSides(currentShape.name)}`);
    playSound('click');
  }, [currentShape, speak, playSound]);

  const handleQuizAnswer = useCallback((shape: ShapeData) => {
    setSelectedAnswer(shape.name);
    const correct = shape.name === correctAnswer?.name;
    setIsCorrect(correct);

    if (correct) {
      setScore(prev => prev + 1);
      correctFeedback('Excellent! Correct shape!');
    } else {
      wrongFeedback(`Oops! That's a ${shape.name}. Try again!`);
    }

    setTimeout(() => generateQuiz(), 1500);
  }, [correctAnswer, correctFeedback, wrongFeedback, generateQuiz]);

  function getShapeSides(name: string): string {
    const sides: Record<string, string> = {
      Circle: 'no corners and is round',
      Square: 'four equal sides',
      Triangle: 'three sides',
      Rectangle: 'four sides with two longer ones',
      Star: 'five points',
      Heart: 'a special shape for love',
      Diamond: 'four equal sides standing on a point',
      Oval: 'no corners, like an egg',
    };
    return sides[name] || 'a special shape';
  }

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Learn Shapes</h1>
        <button
          onClick={() => setQuizMode(!quizMode)}
          className={`p-3 rounded-2xl shadow-lg hover:scale-105 transition-transform ${quizMode ? 'bg-blue-500' : 'bg-white/80'}`}
        >
          {quizMode ? <RotateCcw className="w-6 h-6 text-white" /> : <Star className="w-6 h-6 text-yellow-500" />}
        </button>
      </header>

      {!quizMode ? (
        <div className="flex flex-col items-center justify-center">
          {/* Shape Display */}
          <div
            className="w-64 h-64 bg-white rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center"
            onClick={handleShapeClick}
          >
            <svg viewBox="0 0 100 100" className="w-48 h-48">
              <path d={currentShape.drawPath} fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
            </svg>
          </div>

          {/* Shape Name */}
          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <p className="text-5xl mb-4">{currentShape.emoji}</p>
            <h2 className="text-4xl font-bold text-gray-700">{currentShape.name}</h2>
            <p className="text-gray-500 mt-2">{getShapeSides(currentShape.name)}</p>
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
              onClick={() => setCurrentIndex(prev => Math.min(shapes.length - 1, prev + 1))}
              disabled={currentIndex === shapes.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === shapes.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="flex gap-2 mt-6">
            {shapes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-4 h-4 rounded-full ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
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
                {quizOptions.map((shape) => (
                  <button
                    key={shape.name}
                    onClick={() => handleQuizAnswer(shape)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === shape.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <svg viewBox="0 0 100 100" className="w-24 h-24">
                      <path d={shape.drawPath} fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                    </svg>
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
