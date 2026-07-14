import { useState, useEffect, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, RotateCcw, Star, Sparkles } from 'lucide-react';

interface BodyPartData {
  name: string;
  emoji: string;
  description: string;
}

const bodyParts: BodyPartData[] = [
  { name: 'Head', emoji: '🗣️', description: 'Top of your body' },
  { name: 'Eyes', emoji: '👀', description: 'You see with them' },
  { name: 'Ears', emoji: '👂', description: 'You hear with them' },
  { name: 'Nose', emoji: '👃', description: 'You smell with it' },
  { name: 'Mouth', emoji: '👄', description: 'You eat with it' },
  { name: 'Teeth', emoji: '🦷', description: 'You chew with them' },
  { name: 'Tongue', emoji: '👅', description: 'You taste with it' },
  { name: 'Hand', emoji: '✋', description: 'You hold things' },
  { name: 'Fingers', emoji: '🤚', description: 'Five on each hand' },
  { name: 'Arm', emoji: '💪', description: 'You lift with it' },
  { name: 'Leg', emoji: '🦵', description: 'You walk with it' },
  { name: 'Foot', emoji: '🦶', description: 'You stand on it' },
  { name: 'Heart', emoji: '❤️', description: 'Beats for you' },
  { name: 'Brain', emoji: '🧠', description: 'You think with it' },
];

interface BodyPartsLearningProps {
  onBack: () => void;
}

export function BodyPartsLearning({ onBack }: BodyPartsLearningProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quizMode, setQuizMode] = useState(false);
  const [quizOptions, setQuizOptions] = useState<BodyPartData[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<BodyPartData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer } = useGame();

  const currentPart = bodyParts[currentIndex];

  useEffect(() => {
    speak(`This is your ${currentPart.name}. ${currentPart.description}.`);
  }, [currentIndex, speak]);

  useEffect(() => {
    if (quizMode) generateQuiz();
  }, [quizMode]);

  const generateQuiz = useCallback(() => {
    const shuffled = [...bodyParts].sort(() => Math.random() - 0.5);
    const options = shuffled.slice(0, 4);
    setQuizOptions(options);
    setCorrectAnswer(options[Math.floor(Math.random() * options.length)]);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, []);

  const handlePartClick = useCallback(() => {
    speak(`${currentPart.name}! ${currentPart.description}!`);
    playSound('pop');
  }, [currentPart, speak, playSound]);

  const handleQuizAnswer = useCallback((part: BodyPartData) => {
    setSelectedAnswer(part.name);
    const correct = part.name === correctAnswer?.name;
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
      speak(`Oops! That's ${part.name}. Try again!`);
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
        <h1 className="text-2xl font-bold text-white drop-shadow">Body Parts</h1>
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
            className="w-64 h-64 bg-gradient-to-br from-pink-100 to-rose-100 rounded-3xl shadow-2xl cursor-pointer transform transition-all hover:scale-105 animate-float mb-6 flex items-center justify-center"
            onClick={handlePartClick}
          >
            <span className="text-9xl">{currentPart.emoji}</span>
          </div>

          <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6">
            <h2 className="text-4xl font-bold text-gray-700 mb-2">{currentPart.name}</h2>
            <p className="text-xl text-gray-500">{currentPart.description}</p>
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
              onClick={() => setCurrentIndex(prev => Math.min(bodyParts.length - 1, prev + 1))}
              disabled={currentIndex === bodyParts.length - 1}
              className={`p-4 rounded-full shadow-lg ${currentIndex === bodyParts.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
            >
              <ArrowLeft className="w-8 h-8 text-gray-700 rotate-180" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-md">
            {bodyParts.map((part, index) => (
              <button
                key={part.name}
                onClick={() => setCurrentIndex(index)}
                className={`text-3xl p-2 rounded-xl transition-all ${index === currentIndex ? 'bg-white scale-125 shadow-lg' : 'bg-white/30 hover:bg-white/50'}`}
              >
                {part.emoji}
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
                {quizOptions.map((part) => (
                  <button
                    key={part.name}
                    onClick={() => handleQuizAnswer(part)}
                    className={`w-32 h-32 bg-white rounded-3xl shadow-xl flex items-center justify-center transform transition-all hover:scale-105 ${
                      selectedAnswer === part.name
                        ? isCorrect ? 'ring-4 ring-green-500 animate-pop' : 'ring-4 ring-red-500 animate-shake'
                        : ''
                    }`}
                  >
                    <span className="text-6xl">{part.emoji}</span>
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
                  <span className="text-2xl font-bold">Amazing! Correct!</span>
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
