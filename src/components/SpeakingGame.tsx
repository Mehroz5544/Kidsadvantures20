import { useState, useCallback, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';
import {
  requestMicPermission,
  checkMicPermission,
  isRecognitionAvailable,
  startListening,
  stopListening,
  isRunningNatively,
} from '../services/nativeVoice';
import { ArrowLeft, Volume2, Mic, MicOff, RotateCcw, Star, Sparkles } from 'lucide-react';

interface SpeakingWord {
  word: string;
  emoji: string;
  category: string;
}

const words: SpeakingWord[] = [
  { word: 'Apple', emoji: '🍎', category: 'fruit' },
  { word: 'Ball', emoji: '⚽', category: 'toy' },
  { word: 'Cat', emoji: '🐱', category: 'animal' },
  { word: 'Dog', emoji: '🐕', category: 'animal' },
  { word: 'Elephant', emoji: '🐘', category: 'animal' },
  { word: 'Fish', emoji: '🐟', category: 'animal' },
  { word: 'Grapes', emoji: '🍇', category: 'fruit' },
  { word: 'House', emoji: '🏠', category: 'place' },
  { word: 'Ice Cream', emoji: '🍦', category: 'food' },
  { word: 'Juice', emoji: '🧃', category: 'drink' },
  { word: 'Kite', emoji: '🪁', category: 'toy' },
  { word: 'Lion', emoji: '🦁', category: 'animal' },
  { word: 'Moon', emoji: '🌙', category: 'nature' },
  { word: 'Nest', emoji: '🪺', category: 'nature' },
  { word: 'Orange', emoji: '🍊', category: 'fruit' },
  { word: 'Penguin', emoji: '🐧', category: 'animal' },
  { word: 'Queen', emoji: '👸', category: 'people' },
  { word: 'Rainbow', emoji: '🌈', category: 'nature' },
  { word: 'Sun', emoji: '☀️', category: 'nature' },
  { word: 'Tree', emoji: '🌳', category: 'nature' },
];

interface SpeakingGameProps {
  onBack: () => void;
}

export function SpeakingGame({ onBack }: SpeakingGameProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [score, setScore] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recognitionAvailable, setRecognitionAvailable] = useState<boolean | null>(null);
  const [showTryAgain, setShowTryAgain] = useState(false);
  const [native] = useState(isRunningNatively());
  const listeningRef = useRef(false);

  const { speak, playSound } = useSound();
  const { addStars, triggerConfetti, recordAnswer } = useGame();

  const currentWord = words[currentIndex];

  useEffect(() => {
    async function init() {
      const available = await isRecognitionAvailable();
      setRecognitionAvailable(available);
      if (!available) return;
      const perm = await checkMicPermission();
      setHasPermission(perm);
    }
    init();
  }, []);

  useEffect(() => {
    speak(`Can you say ${currentWord.word}?`);
  }, [currentIndex, speak]);

  const requestPerm = useCallback(async () => {
    const granted = await requestMicPermission();
    setHasPermission(granted);
    return granted;
  }, []);

  const similarity = (s1: string, s2: string): number => {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    if (longer.length === 0) return 1.0;
    const matrix: number[][] = [];
    for (let i = 0; i <= longer.length; i++) matrix[i] = [i];
    for (let j = 0; j <= shorter.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= longer.length; i++) {
      for (let j = 1; j <= shorter.length; j++) {
        const cost = longer[i - 1] === shorter[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    return (longer.length - matrix[longer.length][shorter.length]) / longer.length;
  };

  const handleSpeechResult = useCallback((spoken: string) => {
    const target = currentWord.word.toLowerCase();
    const isMatch = spoken.includes(target) || similarity(spoken, target) > 0.6;

    if (isMatch) {
      setIsCorrect(true);
      playSound('clap');
      setTimeout(() => playSound('star'), 200);
      playSound('correct');
      speak('Excellent! Great job!');
      setScore(prev => prev + 1);
      addStars(2);
      recordAnswer(true);
      triggerConfetti();
      setTimeout(() => nextWord(), 2000);
    } else {
      setIsCorrect(false);
      setAttempts(prev => prev + 1);
      playSound('wrong');
      if (attempts >= 2) {
        speak(`Let me help you. The word is ${currentWord.word}.`);
        setShowTryAgain(true);
        recordAnswer(false);
      } else {
        speak('Oops! Try again!');
      }
      setTimeout(() => setIsCorrect(null), 1500);
    }
  }, [currentWord, attempts, playSound, speak, addStars, recordAnswer, triggerConfetti]);

  const startNativeListening = useCallback(async () => {
    if (listeningRef.current) return;

    let perm = hasPermission;
    if (!perm) {
      perm = await requestPerm();
      if (!perm) {
        speak('Please allow microphone access to play this game.');
        return;
      }
    }

    listeningRef.current = true;
    setIsListening(true);
    setTranscript('');

    try {
      const result = await startListening({ language: 'en-US' });
      const spoken = (result.matches[0] ?? '').toLowerCase();
      setTranscript(spoken || '(nothing heard)');
      if (spoken) handleSpeechResult(spoken);
    } catch {
      speak('Sorry, I could not hear you. Please try again.');
    } finally {
      listeningRef.current = false;
      setIsListening(false);
    }
  }, [hasPermission, requestPerm, speak, handleSpeechResult]);

  const stopNativeListening = useCallback(async () => {
    await stopListening();
    listeningRef.current = false;
    setIsListening(false);
  }, []);

  const nextWord = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % words.length);
    setTranscript('');
    setIsCorrect(null);
    setAttempts(0);
    setShowTryAgain(false);
  }, []);

  const replayWord = useCallback(() => {
    speak(`${currentWord.word}. Say ${currentWord.word}.`);
    playSound('click');
  }, [currentWord, speak, playSound]);

  const colors = [
    'from-pink-400 to-pink-500',
    'from-blue-400 to-blue-500',
    'from-green-400 to-green-500',
    'from-yellow-400 to-yellow-500',
    'from-purple-400 to-purple-500',
  ];
  const currentColor = colors[currentIndex % colors.length];

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow">Speaking Game</h1>
        <button onClick={nextWord} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      <div className="flex items-center justify-center gap-2 mb-6">
        <Star className="w-6 h-6 text-yellow-400 animate-sparkle" />
        <span className="text-2xl font-bold text-white">Score: {score}</span>
      </div>

      <div className="flex flex-col items-center">
        <div className={`w-64 h-64 bg-gradient-to-br ${currentColor} rounded-3xl shadow-2xl flex flex-col items-center justify-center mb-6 animate-float gpu-accelerated`}>
          <span className="text-8xl mb-4">{currentWord.emoji}</span>
          <span className="text-5xl font-bold text-white drop-shadow">{currentWord.word}</span>
        </div>

        <div className="kids-card bg-white p-6 rounded-3xl shadow-xl text-center mb-6 w-full max-w-sm">
          <p className="text-gray-500 mb-4">Category: {currentWord.category}</p>
          <button onClick={replayWord} className="p-4 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors mb-4">
            <Volume2 className="w-8 h-8 text-blue-600" />
          </button>
          <p className="text-sm text-gray-400">Tap to hear the word again</p>
        </div>

        {recognitionAvailable === false && (
          <div className="kids-card bg-amber-50 p-4 rounded-2xl mb-6 max-w-sm text-center">
            <MicOff className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <p className="text-gray-600 text-sm font-semibold">Speech recognition requires the Android app.</p>
            <p className="text-gray-400 text-xs mt-1">Voice input is not available in the browser.</p>
          </div>
        )}

        {recognitionAvailable !== false && isCorrect === null && !showTryAgain && (
          <button
            onClick={isListening ? stopNativeListening : startNativeListening}
            disabled={!native && recognitionAvailable !== true}
            className={`w-32 h-32 rounded-full shadow-xl flex items-center justify-center transform transition-all gpu-accelerated ${
              isListening
                ? 'bg-red-500 animate-pulse scale-110'
                : 'bg-gradient-to-r from-green-400 to-green-500 hover:scale-105 active:scale-95'
            }`}
          >
            {isListening ? (
              <MicOff className="w-16 h-16 text-white" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </button>
        )}

        {isListening && (
          <p className="text-white font-bold text-xl mt-4 animate-pulse">Listening...</p>
        )}

        {transcript && (
          <div className="mt-4 text-center">
            <p className="text-gray-400">You said:</p>
            <p className="text-2xl font-bold text-white">{transcript}</p>
          </div>
        )}

        {isCorrect === true && (
          <div className="mt-6 animate-slide-up">
            <Sparkles className="w-16 h-16 text-yellow-400 mx-auto animate-sparkle" />
            <p className="text-3xl font-bold text-green-400 mt-2">Excellent!</p>
          </div>
        )}

        {isCorrect === false && (
          <div className="mt-6 animate-shake">
            <p className="text-2xl font-bold text-white">Oops! Try Again!</p>
          </div>
        )}

        {showTryAgain && (
          <div className="mt-4 animate-slide-up">
            <div className="kids-card bg-white p-4 rounded-2xl">
              <p className="text-gray-600">
                Hint: Say <span className="font-bold text-blue-600">{currentWord.word}</span>
              </p>
              <button
                onClick={() => { setShowTryAgain(false); setAttempts(0); }}
                className="mt-4 px-6 py-3 bg-green-500 text-white font-bold rounded-full"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {hasPermission === false && recognitionAvailable !== false && (
          <div className="kids-card bg-white p-4 rounded-2xl mt-6 max-w-sm text-center">
            <MicOff className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-gray-600 mb-4">Microphone permission needed.</p>
            <button onClick={requestPerm} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-full">
              Allow Microphone
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {words.slice(0, 10).map((word, index) => (
          <button
            key={word.word}
            onClick={() => setCurrentIndex(index)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
              index === currentIndex ? 'bg-blue-500 text-white scale-125' : 'bg-white/50 text-white'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
