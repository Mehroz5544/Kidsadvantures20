import { useState, useCallback } from 'react';
import { ArrowLeft, Lock, Trash2, BarChart3, TrendingUp, Target, Calendar, Volume2, VolumeX, Music, Mic, RefreshCw } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';

interface ParentDashboardProps {
  onBack: () => void;
}

const DEFAULT_PIN = '1234';

export function ParentDashboard({ onBack }: ParentDashboardProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [showReset, setShowReset] = useState(false);

  const { state, resetProgress, setDifficulty } = useGame();
  const { soundEnabled, toggleSound, voiceEnabled, toggleVoice, musicEnabled, toggleMusic } = useSound();

  const handlePinSubmit = useCallback(() => {
    if (pin === DEFAULT_PIN || pin.length === 4) {
      setIsUnlocked(true);
      setPinError('');
    } else {
      setPinError('Please enter a 4-digit PIN');
    }
  }, [pin]);

  const handlePinDigit = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handlePinDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen px-4 py-6 flex flex-col items-center justify-center">
        <div className="kids-card bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
          <Lock className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-700 mb-2">Parent Zone</h1>
          <p className="text-gray-500 mb-6">Enter PIN to access</p>

          {/* PIN Display */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-bold ${
                  i < pin.length ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {i < pin.length ? '•' : '_'}
              </div>
            ))}
          </div>

          {/* PIN Pad */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'].map((digit) => (
              digit === '' ? (
                <div key="empty" />
              ) : (
                <button
                  key={digit}
                  onClick={() => digit === 'del' ? handlePinDelete() : handlePinDigit(digit)}
                  className={`p-4 rounded-xl text-2xl font-bold transition-all ${
                    digit === 'del'
                      ? 'bg-red-100 text-red-500 hover:bg-red-200'
                      : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                  }`}
                >
                  {digit === 'del' ? '←' : digit}
                </button>
              )
            ))}
          </div>

          {pinError && (
            <p className="text-red-500 text-sm mb-4">{pinError}</p>
          )}

          <button
            onClick={handlePinSubmit}
            disabled={pin.length !== 4}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              pin.length === 4
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Unlock
          </button>

          <button
            onClick={onBack}
            className="mt-4 text-gray-500 hover:text-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

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

        <h1 className="text-2xl font-bold text-white drop-shadow">Parent Dashboard</h1>

        <button
          onClick={toggleSound}
          className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform"
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6 text-green-500" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </header>

      {/* Overview Stats */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow">Progress Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="kids-card bg-white p-4 rounded-2xl shadow-lg">
            <BarChart3 className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">{state.stats.lessonsCompleted}</p>
            <p className="text-sm text-gray-500">Lessons Done</p>
          </div>
          <div className="kids-card bg-white p-4 rounded-2xl shadow-lg">
            <Target className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">
              {state.stats.correctAnswers + state.stats.wrongAnswers > 0
                ? Math.round((state.stats.correctAnswers / (state.stats.correctAnswers + state.stats.wrongAnswers)) * 100)
                : 0}%
            </p>
            <p className="text-sm text-gray-500">Accuracy</p>
          </div>
          <div className="kids-card bg-white p-4 rounded-2xl shadow-lg">
            <TrendingUp className="w-8 h-8 text-purple-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">{state.stats.correctAnswers}</p>
            <p className="text-sm text-gray-500">Correct Answers</p>
          </div>
          <div className="kids-card bg-white p-4 rounded-2xl shadow-lg">
            <Calendar className="w-8 h-8 text-orange-500 mb-2" />
            <p className="text-2xl font-bold text-gray-700">{state.stats.streakDays}</p>
            <p className="text-sm text-gray-500">Day Streak</p>
          </div>
        </div>
      </section>

      {/* Learning Progress */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow">Category Progress</h2>
        <div className="kids-card bg-white p-6 rounded-2xl shadow-lg">
          {Object.entries(state.progress).map(([category, value]) => (
            <div key={category} className="mb-4 last:mb-0">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-gray-700">{category.toUpperCase()}</span>
                <span className="text-gray-500">{value} lessons</span>
              </div>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all"
                  style={{ width: `${Math.min(value * 10, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weak Areas */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow">Areas to Improve</h2>
        <div className="kids-card bg-white p-6 rounded-2xl shadow-lg">
          {state.stats.wrongAnswers > 0 ? (
            <div>
              <p className="text-gray-600 mb-4">
                Your child has made {state.stats.wrongAnswers} mistake(s). These are learning opportunities!
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(state.progress)
                  .filter(([_, value]) => value === 0)
                  .map(([category]) => (
                    <span
                      key={category}
                      className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 font-medium"
                    >
                      {category.toUpperCase()}
                    </span>
                  ))}
              </div>
            </div>
          ) : (
            <p className="text-green-500 font-bold">Excellent! No mistakes yet!</p>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow">Settings</h2>
        <div className="kids-card bg-white p-6 rounded-2xl shadow-lg">
          {/* Difficulty */}
          <div className="mb-6">
            <p className="font-bold text-gray-700 mb-2">Difficulty Level</p>
            <div className="flex gap-2">
              {['easy', 'medium', 'hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level as any)}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                    state.difficulty === level
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Effects */}
          <div className="flex items-center justify-between mb-4">
            <p className="font-bold text-gray-700">Sound Effects</p>
            <button
              onClick={toggleSound}
              className={`px-4 py-2 rounded-xl font-bold ${
                soundEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Voice */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-blue-500" />
              <p className="font-bold text-gray-700">Voice</p>
            </div>
            <button
              onClick={toggleVoice}
              className={`px-4 py-2 rounded-xl font-bold ${
                voiceEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {voiceEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Background Music */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-500" />
              <p className="font-bold text-gray-700">Background Music</p>
            </div>
            <button
              onClick={toggleMusic}
              className={`px-4 py-2 rounded-xl font-bold ${
                musicEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              {musicEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Reset Progress */}
          <div className="border-t pt-4">
            <button
              onClick={() => setShowReset(true)}
              className="flex items-center gap-2 text-red-500 hover:text-red-600"
            >
              <Trash2 className="w-5 h-5" />
              <span className="font-bold">Reset All Progress</span>
            </button>
          </div>
        </div>
      </section>

      {/* Reset Confirmation Modal */}
      {showReset && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="kids-card bg-white p-6 rounded-2xl shadow-xl max-w-sm mx-4">
            <h3 className="text-xl font-bold text-gray-700 mb-4">Reset Progress?</h3>
            <p className="text-gray-500 mb-6">
              This will delete all learning progress, stars, and coins. This cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowReset(false)}
                className="flex-1 py-3 rounded-xl bg-gray-200 text-gray-600 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetProgress();
                  setShowReset(false);
                }}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
