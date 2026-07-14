import { useState, useCallback, useEffect } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, RotateCcw, Star, Sparkles, Plus, Minus } from 'lucide-react';

interface MathProblem {
  type: 'addition' | 'subtraction' | 'comparison';
  num1: number;
  num2: number;
  answer?: number;
  options?: number[];
  comparisonSymbol?: '>' | '<' | '=';
}

interface MathLearningProps {
  onBack: () => void;
}

type ProblemType = 'addition' | 'subtraction' | 'comparison' | 'missing';

export function MathLearning({ onBack }: MathLearningProps) {
  const [problemType, setProblemType] = useState<ProblemType>('addition');
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer, completeLesson } = useGame();

  useEffect(() => {
    generateProblem();
  }, [problemType, difficulty]);

  const getMaxNumber = useCallback(() => {
    switch (difficulty) {
      case 'easy': return 10;
      case 'medium': return 20;
      case 'hard': return 50;
    }
  }, [difficulty]);

  const generateProblem = useCallback(() => {
    const max = getMaxNumber();
    const num1 = Math.floor(Math.random() * max) + 1;
    const num2 = Math.floor(Math.random() * num1);

    if (problemType === 'addition') {
      const answer = num1 + num2;
      const options = generateOptions(answer, max * 2);
      setProblem({ type: 'addition', num1, num2, answer, options });
    } else if (problemType === 'subtraction') {
      const answer = num1 - num2;
      const options = generateOptions(answer, max);
      setProblem({ type: 'subtraction', num1, num2, answer, options });
    } else if (problemType === 'comparison') {
      const symbols: ('>' | '<' | '=')[] = ['>', '<', '='];
      const comparisonSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      setProblem({ type: 'comparison', num1, num2, comparisonSymbol });
    } else if (problemType === 'missing') {
      const answer = num2;
      const options = generateOptions(answer, num1);
      setProblem({ type: 'missing', num1, num2, answer, options });
    }

    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [problemType, difficulty, getMaxNumber]);

  const generateOptions = (correct: number, max: number): number[] => {
    const options = [correct];
    while (options.length < 4) {
      const opt = Math.floor(Math.random() * (max + 1));
      if (!options.includes(opt) && opt >= 0) {
        options.push(opt);
      }
    }
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = useCallback((answer: number | '>' | '<' | '=') => {
    if (problemType === 'comparison') {
      const comparisons: Record<string, number> = { '>': 1, '<': -1, '=': 0 };
      const actualComparison = Math.sign(problem!.num1 - problem!.num2);
      const correct = comparisons[answer as string] === actualComparison;

      setIsCorrect(correct);
      setSelectedAnswer(answer as number);
      setTotalQuestions(prev => prev + 1);

      if (correct) {
        playSound('correct');
        speak('Correct! Great job!');
        setScore(prev => prev + 1);
        addStars(1);
        recordAnswer(true);
      } else {
        playSound('wrong');
        speak('Oops! Try the next one!');
        recordAnswer(false);
      }
    } else {
      const correct = answer === problem?.answer;
      setIsCorrect(correct);
      setSelectedAnswer(answer);

      if (correct) {
        playSound('correct');
        speak('Correct! Well done!');
        setScore(prev => prev + 1);
        addStars(1);
        recordAnswer(true);
        if (score + 1 >= 5) {
          triggerConfetti();
        }
      } else {
        playSound('wrong');
        speak('Oops! That is not right. Try again!');
        recordAnswer(false);
      }
    }

    setTimeout(() => {
      generateProblem();
    }, 1500);
  }, [problem, problemType, playSound, speak, score, addStars, recordAnswer, triggerConfetti, generateProblem]);

  const difficultyColors = {
    easy: 'from-green-400 to-green-500',
    medium: 'from-yellow-400 to-yellow-500',
    hard: 'from-red-400 to-red-500',
  };

  const typeColors = {
    addition: 'from-blue-400 to-blue-500',
    subtraction: 'from-purple-400 to-purple-500',
    comparison: 'from-orange-400 to-orange-500',
    missing: 'from-cyan-400 to-cyan-500',
  };

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-2xl font-bold text-white drop-shadow">Math Fun</h1>

        <button
          onClick={generateProblem}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Type Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {[
          { type: 'addition', label: 'Add', icon: <Plus className="w-4 h-4" /> },
          { type: 'subtraction', label: 'Subtract', icon: <Minus className="w-4 h-4" /> },
          { type: 'comparison', label: 'Compare' },
          { type: 'missing', label: 'Missing' },
        ].map((pt) => (
          <button
            key={pt.type}
            onClick={() => setProblemType(pt.type as ProblemType)}
            className={`px-4 py-2 rounded-full font-bold transition-all flex items-center gap-1 ${
              problemType === pt.type
                ? `bg-gradient-to-r ${typeColors[pt.type]} text-white scale-110`
                : 'bg-white/80 text-gray-700 hover:bg-white'
            }`}
          >
            {'icon' in pt && pt.icon}
            {pt.label}
          </button>
        ))}
      </div>

      {/* Difficulty Selector */}
      <div className="flex justify-center gap-2 mb-6">
        {['easy', 'medium', 'hard'].map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d as typeof difficulty)}
            className={`px-4 py-2 rounded-full font-bold transition-all ${
              difficulty === d
                ? `bg-gradient-to-r ${difficultyColors[d]} text-white`
                : 'bg-white/50 text-gray-600'
            }`}
          >
            {d.charAt(0).toUpperCase() + d.slice(1)}
          </button>
        ))}
      </div>

      {/* Score */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg">
          <Star className="w-5 h-5 text-yellow-500 animate-sparkle" />
          <span className="font-bold text-gray-700">{score} / {totalQuestions}</span>
        </div>
      </div>

      {/* Problem Card */}
      <div className="flex justify-center">
        <div className="kids-card bg-white p-6 rounded-3xl shadow-xl w-full max-w-md text-center">
          {problem && problemType === 'addition' && (
            <>
              <div className="text-6xl font-bold text-gray-700 mb-4">
                {problem.num1} + {problem.num2} = ?
              </div>
              <div className="grid grid-cols-4 gap-3">
                {problem.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className={`p-4 rounded-2xl text-2xl font-bold transition-all ${
                      selectedAnswer === opt
                        ? isCorrect
                          ? 'bg-green-500 text-white animate-pop'
                          : 'bg-red-500 text-white animate-shake'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {problem && problemType === 'subtraction' && (
            <>
              <div className="text-6xl font-bold text-gray-700 mb-4">
                {problem.num1} - {problem.num2} = ?
              </div>
              <div className="grid grid-cols-4 gap-3">
                {problem.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className={`p-4 rounded-2xl text-2xl font-bold transition-all ${
                      selectedAnswer === opt
                        ? isCorrect
                          ? 'bg-green-500 text-white animate-pop'
                          : 'bg-red-500 text-white animate-shake'
                        : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          {problem && problemType === 'comparison' && (
            <>
              <div className="text-6xl font-bold text-gray-700 mb-4">
                {problem.num1} ___ {problem.num2}
              </div>
              <div className="flex justify-center gap-4">
                {['greater than', 'less than', 'equal to'].map((symbol) => (
                  <div key={symbol} className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => handleAnswer(symbol === 'greater than' ? '>' : symbol === 'less than' ? '<' : '=')}
                      className={`p-6 rounded-2xl text-4xl font-bold transition-all ${
                        selectedAnswer === (symbol === 'greater than' ? '>' : symbol === 'less than' ? '<' : '=')
                          ? isCorrect
                            ? 'bg-green-500 text-white animate-pop'
                            : 'bg-red-500 text-white animate-shake'
                          : 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                      }`}
                    >
                      {symbol === 'greater than' ? '>' : symbol === 'less than' ? '<' : '='}
                    </button>
                    <span className="text-sm text-gray-500">{symbol}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {problem && problemType === 'missing' && (
            <>
              <div className="text-6xl font-bold text-gray-700 mb-4">
                {problem.num2} + ___ = {problem.num1}
              </div>
              <div className="grid grid-cols-4 gap-3">
                {problem.options?.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    className={`p-4 rounded-2xl text-2xl font-bold transition-all ${
                      selectedAnswer === opt
                        ? isCorrect
                          ? 'bg-green-500 text-white animate-pop'
                          : 'bg-red-500 text-white animate-shake'
                        : 'bg-cyan-100 hover:bg-cyan-200 text-cyan-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Success Animation */}
      {isCorrect && (
        <div className="flex justify-center mt-4 animate-slide-up">
          <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-green-500 text-white animate-bounce">
            <Sparkles className="w-6 h-6" />
            <span className="font-bold text-xl">Great!</span>
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      )}
    </div>
  );
}
