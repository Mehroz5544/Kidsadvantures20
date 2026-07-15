import { useState, useEffect, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { rhymes, rhymeCategories, type Rhyme, type RhymeCategory } from '../data/rhymes';
import { speak, stopSpeaking } from '../services/nativeVoice';
import { Music, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Globe, ArrowLeft } from 'lucide-react';
import './Rhymes.css';

interface RhymesProps {
  onBack: () => void;
}

export function Rhymes({ onBack }: RhymesProps) {
  const { playSound } = useSound();
  const [selectedCategory, setSelectedCategory] = useState<string>('nursery');
  const [currentRhymeIndex, setCurrentRhymeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSinging, setIsSinging] = useState(false);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [showLyrics, setShowLyrics] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const singingIntervalRef = useRef<NodeJS.Timeout>();

  const categoryRhymes = rhymes.filter(r => r.category === selectedCategory);
  const currentRhyme = categoryRhymes[currentRhymeIndex] || categoryRhymes[0];

  useEffect(() => {
    setCurrentRhymeIndex(0);
  }, [selectedCategory]);

  useEffect(() => {
    return () => {
      if (singingIntervalRef.current) {
        clearInterval(singingIntervalRef.current);
      }
      stopSpeaking();
    };
  }, []);

  const handlePlayAudio = async () => {
    playSound('click');
    if (isPlaying) {
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      setIsSinging(false);
    }
  };

  const handleSinging = async () => {
    playSound('click');
    
    if (isSinging) {
      setIsSinging(false);
      if (singingIntervalRef.current) {
        clearInterval(singingIntervalRef.current);
      }
      await stopSpeaking();
      return;
    }

    setIsSinging(true);
    setIsPlaying(false);

    const lyrics = language === 'en' ? currentRhyme.lyrics : currentRhyme.lyricsHi;
    const sentences = lyrics.split('\n\n').filter(s => s.trim());

    let sentenceIndex = 0;

    const speakNextSentence = async () => {
      if (sentenceIndex < sentences.length && isSinging) {
        const sentence = sentences[sentenceIndex];
        const words = sentence.split('\n').join(' ');
        
        try {
          await speak(words, {
            lang: language === 'en' ? 'en-US' : 'hi-IN',
            rate: 1.0,
            pitch: 1.3,
          });
        } catch {
          // Error handling
        }
        
        sentenceIndex++;
        
        // Schedule next sentence after a delay
        singingIntervalRef.current = setTimeout(
          speakNextSentence,
          2000
        );
      } else if (sentenceIndex >= sentences.length) {
        setIsSinging(false);
      }
    };

    speakNextSentence();
  };

  const handleNext = () => {
    playSound('click');
    setCurrentRhymeIndex((prev) => (prev + 1) % categoryRhymes.length);
    setIsPlaying(false);
    setIsSinging(false);
  };

  const handlePrevious = () => {
    playSound('click');
    setCurrentRhymeIndex((prev) => (prev - 1 + categoryRhymes.length) % categoryRhymes.length);
    setIsPlaying(false);
    setIsSinging(false);
  };

  const handleCategoryChange = (categoryId: string) => {
    playSound('click');
    setSelectedCategory(categoryId);
    setIsPlaying(false);
    setIsSinging(false);
  };

  const handleLanguageToggle = () => {
    playSound('click');
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const currentCategory = rhymeCategories.find(c => c.id === selectedCategory);

  return (
    <div className="rhymes-container min-h-screen px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>

        <h1 className="text-3xl font-bold text-white drop-shadow-lg flex items-center gap-2">
          <Music className="w-8 h-8" />
          Kids Rhymes
        </h1>

        <button
          onClick={handleLanguageToggle}
          className="px-4 py-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform font-bold"
        >
          <Globe className="w-5 h-5 inline mr-2" />
          {language === 'en' ? 'English' : 'हिन्दी'}
        </button>
      </div>

      {/* Categories */}
      <div className="category-selector mb-8 overflow-x-auto pb-2">
        <div className="flex gap-3 min-w-max px-2">
          {rhymeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`category-button px-4 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                selectedCategory === category.id
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-white/60 text-gray-700 shadow'
              }`}
            >
              <span className="text-2xl mr-2">{category.icon}</span>
              {language === 'en' ? category.name : category.nameHi}
            </button>
          ))}
        </div>
      </div>

      {/* Main Rhyme Display */}
      <div className="rhyme-card bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-8 shadow-2xl mb-8">
        {/* Thumbnail/Icon */}
        <div className="text-center mb-6">
          <div className="text-9xl animate-bounce-slow">
            {currentCategory?.icon}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-2 drop-shadow-lg">
          {language === 'en' ? currentRhyme.title : currentRhyme.titleHi}
        </h2>

        {/* Duration */}
        <p className="text-center text-white/80 mb-6">
          ⏱️ {currentRhyme.duration} seconds
        </p>

        {/* Lyrics Display */}
        {showLyrics && (
          <div className="lyrics-display bg-white/20 backdrop-blur rounded-2xl p-6 mb-6 max-h-64 overflow-y-auto">
            <p className="text-white text-lg leading-relaxed whitespace-pre-wrap font-medium">
              {language === 'en' ? currentRhyme.lyrics : currentRhyme.lyricsHi}
            </p>
          </div>
        )}

        {/* Toggle Lyrics */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => {
              playSound('click');
              setShowLyrics(!showLyrics);
            }}
            className="px-6 py-2 bg-white/30 hover:bg-white/50 text-white font-bold rounded-full transition-all transform hover:scale-105"
          >
            {showLyrics ? '👀 Hide Lyrics' : '👁️ Show Lyrics'}
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Play/Singing Mode */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePlayAudio}
              className={`rhyme-control-btn flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                isPlaying
                  ? 'bg-red-500 text-white'
                  : 'bg-white text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-6 h-6" />
                  Pause Audio
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Play Audio
                </>
              )}
            </button>

            <button
              onClick={handleSinging}
              className={`rhyme-control-btn flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all transform hover:scale-105 ${
                isSinging
                  ? 'bg-yellow-500 text-white'
                  : 'bg-white text-green-600 hover:bg-green-100'
              }`}
            >
              {isSinging ? (
                <>
                  <VolumeX className="w-6 h-6" />
                  Stop Singing
                </>
              ) : (
                <>
                  <Volume2 className="w-6 h-6" />
                  Sing Along
                </>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          {isPlaying || isSinging ? (
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full rounded-full animate-progress"
                style={{
                  animation: 'progress-bar 3s linear infinite',
                }}
              />
            </div>
          ) : null}

          {/* Navigation */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handlePrevious}
              className="p-4 rounded-2xl bg-white/30 hover:bg-white/50 text-white transition-all transform hover:scale-105"
            >
              <SkipBack className="w-6 h-6" />
            </button>

            <div className="px-6 py-4 rounded-2xl bg-white/30 text-white font-bold">
              {currentRhymeIndex + 1} / {categoryRhymes.length}
            </div>

            <button
              onClick={handleNext}
              className="p-4 rounded-2xl bg-white/30 hover:bg-white/50 text-white transition-all transform hover:scale-105"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Rhyme List */}
      <div className="rhyme-list mb-8">
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow">
          {language === 'en' ? 'Rhymes in this category' : 'इस श्रेणी में गीत'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryRhymes.map((rhyme, index) => (
            <button
              key={rhyme.id}
              onClick={() => {
                playSound('click');
                setCurrentRhymeIndex(index);
                setIsPlaying(false);
                setIsSinging(false);
              }}
              className={`rhyme-item-card p-4 rounded-2xl transition-all transform hover:scale-105 ${
                index === currentRhymeIndex
                  ? 'bg-white shadow-xl border-4 border-blue-500'
                  : 'bg-white/70 shadow-lg hover:bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentCategory?.icon}</span>
                <div className="text-left flex-1">
                  <p className="font-bold text-gray-800">
                    {language === 'en' ? rhyme.title : rhyme.titleHi}
                  </p>
                  <p className="text-sm text-gray-600">⏱️ {rhyme.duration}s</p>
                </div>
                {index === currentRhymeIndex && (
                  <Music className="w-5 h-5 text-blue-600 animate-bounce" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Mobile friendly bottom spacing */}
      <div className="h-20" />
    </div>
  );
}
