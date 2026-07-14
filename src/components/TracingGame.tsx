import { useState, useCallback, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import { ArrowLeft, RotateCcw, Star, Eraser, ChevronLeft, ChevronRight } from 'lucide-react';

interface TracingCharacter {
  char: string;
  type: 'letter' | 'number';
  path: string;
  guidePoints: { x: number; y: number }[];
}

const tracingItems: TracingCharacter[] = [
  { char: 'A', type: 'letter', path: 'M50 90 L50 10 L50 90 M50 10 L80 90 M50 40 L75 90', guidePoints: [{ x: 50, y: 10 }, { x: 50, y: 90 }, { x: 80, y: 90 }] },
  { char: 'B', type: 'letter', path: 'M20 90 L20 10 L60 10 A25 20 0 0 1 60 50 A25 20 0 0 1 60 90 L20 90', guidePoints: [{ x: 20, y: 10 }, { x: 60, y: 50 }, { x: 20, y: 90 }] },
  { char: 'C', type: 'letter', path: 'M80 30 A35 40 0 1 0 80 70', guidePoints: [{ x: 80, y: 30 }, { x: 50, y: 10 }, { x: 20, y: 50 }] },
  { char: '1', type: 'number', path: 'M50 10 L50 90', guidePoints: [{ x: 50, y: 10 }, { x: 50, y: 90 }] },
  { char: '2', type: 'number', path: 'M30 30 A25 25 0 0 1 70 30 A25 30 0 0 1 30 60 L70 90', guidePoints: [{ x: 50, y: 10 }, { x: 70, y: 90 }] },
  { char: '3', type: 'number', path: 'M20 20 A35 30 0 0 1 80 50 A35 30 0 0 1 20 80', guidePoints: [{ x: 50, y: 20 }, { x: 50, y: 50 }, { x: 50, y: 80 }] },
];

interface TracingGameProps {
  onBack: () => void;
}

export function TracingGame({ onBack }: TracingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [color, setColor] = useState('#3b82f6');
  const svgRef = useRef<SVGSVGElement>(null);

  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer } = useGame();

  const currentItem = tracingItems[currentIndex];

  useEffect(() => {
    speak(`Trace the ${currentItem.type} ${currentItem.char}. Follow the line with your finger.`);
    setPaths([]);
    setCurrentPath([]);
    setIsComplete(false);
  }, [currentIndex, speak, currentItem]);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const scaleX = 100 / rect.width;
    const scaleY = 100 / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const coords = getCoordinates(e);
    setCurrentPath([coords]);
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const coords = getCoordinates(e);
    setCurrentPath(prev => [...prev, coords]);
  };

  const handleEnd = () => {
    if (currentPath.length > 5) {
      setPaths(prev => [...prev, currentPath]);
      playSound('pop');

      if (paths.length + 1 >= 3) {
        setIsComplete(true);
        playSound('correct');
        speak('Great job! You traced it perfectly!');
        addStars(2);
        recordAnswer(true);
        triggerConfetti();
      }
    }
    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearCanvas = useCallback(() => {
    setPaths([]);
    setCurrentPath([]);
    setIsComplete(false);
    playSound('click');
  }, [playSound]);

  const handleNext = useCallback(() => {
    if (currentIndex < tracingItems.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playSound('click');
    }
  }, [currentIndex, playSound]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      playSound('click');
    }
  }, [currentIndex, playSound]);

  const colors = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="min-h-screen px-4 py-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Tracing</h1>
        <button onClick={clearCanvas} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <Eraser className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Current Character */}
      <div className="text-center mb-4">
        <p className="text-white font-bold text-xl">Trace the {currentItem.type}:</p>
        <p className="text-6xl font-bold text-white drop-shadow-lg animate-bounce">{currentItem.char}</p>
      </div>

      {/* Canvas */}
      <div className="relative mb-4">
        <div className="w-full max-w-sm mx-auto aspect-square bg-white rounded-3xl shadow-2xl overflow-hidden relative">
          <svg
            ref={svgRef}
            viewBox="0 0 100 100"
            className="w-full h-full"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
          >
            {/* Guide path */}
            <path
              d={currentItem.path}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,5"
            />

            {/* User drawn paths */}
            {paths.map((path, index) => (
              <path
                key={index}
                d={`M${path.map(p => `${p.x},${p.y}`).join(' L')}`}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Current path being drawn */}
            {currentPath.length > 1 && (
              <path
                d={`M${currentPath.map(p => `${p.x},${p.y}`).join(' L')}`}
                fill="none"
                stroke={color}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>

          {/* Finger guide animation */}
          <div className="absolute bottom-4 right-4 animate-bounce">
            <span className="text-2xl opacity-50">👆</span>
          </div>
        </div>
      </div>

      {/* Color Picker */}
      <div className="flex justify-center gap-3 mb-4">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-10 h-10 rounded-full shadow-lg transition-all ${
              color === c ? 'scale-125 ring-4 ring-white' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`p-4 rounded-full shadow-lg ${currentIndex === 0 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
        >
          <ChevronLeft className="w-8 h-8 text-gray-700" />
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === tracingItems.length - 1}
          className={`p-4 rounded-full shadow-lg ${currentIndex === tracingItems.length - 1 ? 'bg-gray-300' : 'bg-white hover:scale-110'}`}
        >
          <ChevronRight className="w-8 h-8 text-gray-700" />
        </button>
      </div>

      {/* Completion */}
      {isComplete && (
        <div className="text-center animate-slide-up">
          <Star className="w-16 h-16 text-yellow-400 mx-auto animate-sparkle" />
          <p className="text-2xl font-bold text-white mt-2">Excellent!</p>
          <button
            onClick={handleNext}
            className="mt-4 px-8 py-4 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold text-xl rounded-full shadow-lg hover:scale-105 transition-transform"
          >
            Next {currentItem.type === 'letter' ? 'Letter' : 'Number'}
          </button>
        </div>
      )}

      {/* Progress */}
      <div className="flex justify-center gap-2 mt-4">
        {tracingItems.map((item, index) => (
          <button
            key={item.char}
            onClick={() => setCurrentIndex(index)}
            className={`w-10 h-10 rounded-full font-bold transition-all ${
              index === currentIndex
                ? 'bg-blue-500 text-white scale-110'
                : 'bg-white/50 text-white hover:bg-white/70'
            }`}
          >
            {item.char}
          </button>
        ))}
      </div>
    </div>
  );
}
