import { useState, useMemo, useCallback } from 'react';
import { useSound } from '../context/SoundContext';
import { ArrowLeft, RotateCcw, Volume2, ChevronRight, ChevronLeft, BookOpen, Sparkles } from 'lucide-react';
import { vocabularyWords, type VocabularyWord } from '../data/premiumContent';

type Level = 'all' | VocabularyWord['level'];

const LEVELS: { label: string; value: Level }[] = [
  { label: 'All', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

export function VocabularyLearning({ onBack }: { onBack: () => void }) {
  const [level, setLevel] = useState<Level>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const { speak } = useSound();

  const filteredWords = useMemo(() => {
    const list = level === 'all'
      ? vocabularyWords
      : vocabularyWords.filter(w => w.level === level);
    return list;
  }, [level]);

  const totalWords = filteredWords.length;
  const currentWord = filteredWords[currentIndex];

  const goNext = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % totalWords);
    }, 150);
  }, [totalWords]);

  const goPrev = useCallback(() => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + totalWords) % totalWords);
    }, 150);
  }, [totalWords]);

  const changeLevel = useCallback((newLevel: Level) => {
    setLevel(newLevel);
    setCurrentIndex(0);
    setFlipped(false);
  }, []);

  const handleSpeak = useCallback(() => {
    if (currentWord) speak(currentWord.word);
  }, [currentWord, speak]);

  if (!currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="kids-card bg-white p-8 rounded-3xl shadow-xl text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl text-gray-600 mb-4">No words available for this level.</p>
          <button onClick={onBack} className="px-6 py-3 rounded-2xl bg-blue-400 text-white font-bold hover:scale-105 transition-transform">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const levelColors: Record<string, string> = {
    beginner: 'bg-green-100 text-green-600',
    intermediate: 'bg-yellow-100 text-yellow-600',
    advanced: 'bg-red-100 text-red-600',
  };

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow flex items-center gap-2">
          <BookOpen className="w-7 h-7" /> Vocabulary
        </h1>
        <button onClick={() => { setFlipped(false); setCurrentIndex(0); }} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <RotateCcw className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* Level Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-md mx-auto">
        {LEVELS.map(l => (
          <button
            key={l.value}
            onClick={() => changeLevel(l.value)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              level === l.value
                ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white/80 backdrop-blur text-gray-600 hover:scale-105'
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      {/* Progress Counter */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur shadow-lg">
          <span className="font-bold text-gray-700">{currentIndex + 1} / {totalWords}</span>
        </div>
      </div>

      {/* Flashcard */}
      <div className="max-w-md mx-auto" style={{ perspective: '1000px' }}>
        <div
          onClick={() => setFlipped(!flipped)}
          className="relative w-full cursor-pointer transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            minHeight: '320px',
          }}
        >
          {/* Front - Word */}
          <div
            className="kids-card bg-white p-8 rounded-3xl shadow-xl absolute inset-0 flex flex-col items-center justify-center"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <span className={`px-3 py-1 rounded-full text-xs font-bold mb-4 ${levelColors[currentWord.level]}`}>
              {currentWord.level.toUpperCase()}
            </span>
            <h2 className="text-5xl font-bold text-gray-700 mb-6 text-center">{currentWord.word}</h2>
            <button
              onClick={(e) => { e.stopPropagation(); handleSpeak(); }}
              className="p-4 rounded-full bg-blue-100 text-blue-500 hover:bg-blue-200 transition-colors flex items-center gap-2 font-bold"
            >
              <Volume2 className="w-6 h-6" /> Pronounce
            </button>
            <p className="text-sm text-gray-400 mt-4">Tap card to flip</p>
          </div>

          {/* Back - Meaning */}
          <div
            className="kids-card bg-gradient-to-br from-pink-50 to-purple-50 p-6 rounded-3xl shadow-xl absolute inset-0 flex flex-col justify-center"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="mb-3">
              <h3 className="text-lg font-bold text-purple-600 mb-1">Meaning</h3>
              <p className="text-gray-700">{currentWord.meaning}</p>
            </div>
            <div className="mb-3">
              <h3 className="text-lg font-bold text-purple-600 mb-1">Example</h3>
              <p className="text-gray-600 italic text-sm">"{currentWord.example}"</p>
            </div>
            <div className="mb-3">
              <h3 className="text-lg font-bold text-green-600 mb-1">Synonyms</h3>
              <div className="flex flex-wrap gap-2">
                {currentWord.synonyms.map((syn, i) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">{syn}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-600 mb-1">Antonyms</h3>
              <div className="flex flex-wrap gap-2">
                {currentWord.antonyms.map((ant, i) => (
                  <span key={i} className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">{ant}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center gap-4 mt-8 max-w-md mx-auto">
        <button
          onClick={goPrev}
          className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        <button
          onClick={handleSpeak}
          className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-pink-400 to-purple-400 text-white font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center gap-2"
        >
          <Volume2 className="w-5 h-5" /> Say Word
        </button>
        <button
          onClick={goNext}
          className="p-4 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <ChevronRight className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <p className="text-center text-white/70 text-sm mt-4 flex items-center justify-center gap-1">
        <Sparkles className="w-4 h-4" /> Tap the card to flip between word and meaning
      </p>
    </div>
  );
}
