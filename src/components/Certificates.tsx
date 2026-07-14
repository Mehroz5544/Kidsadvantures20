import { useMemo, useCallback } from 'react';
import { ArrowLeft, Trophy, Star, Award, Printer, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';

const CATEGORY_INFO: { key: string; label: string; icon: string; gradient: string }[] = [
  { key: 'abc', label: 'ABC Learning', icon: '🔤', gradient: 'from-blue-400 to-cyan-400' },
  { key: 'numbers', label: 'Numbers', icon: '🔢', gradient: 'from-green-400 to-teal-400' },
  { key: 'colors', label: 'Colors', icon: '🎨', gradient: 'from-pink-400 to-rose-400' },
  { key: 'shapes', label: 'Shapes', icon: '⭐', gradient: 'from-purple-400 to-indigo-400' },
  { key: 'animals', label: 'Animals', icon: '🦁', gradient: 'from-orange-400 to-amber-400' },
  { key: 'fruits', label: 'Fruits', icon: '🍎', gradient: 'from-red-400 to-pink-400' },
  { key: 'math', label: 'Math', icon: '➕', gradient: 'from-indigo-400 to-blue-400' },
  { key: 'memory', label: 'Memory Game', icon: '🧠', gradient: 'from-teal-400 to-green-400' },
];

export function Certificates({ onBack }: { onBack: () => void }) {
  const { state } = useGame();
  const { speak } = useSound();

  const earnedCertificates = useMemo(() =>
    CATEGORY_INFO
      .filter(cat => state.progress[cat.key as keyof typeof state.progress] > 0)
      .map(cat => ({
        ...cat,
        score: state.progress[cat.key as keyof typeof state.progress],
        dateEarned: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      })),
    [state.progress]
  );

  const handlePrint = useCallback((categoryName: string) => {
    speak('Certificate printed!');
  }, [speak]);

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow flex items-center gap-2">
          <Award className="w-7 h-7" /> My Certificates
        </h1>
        <div className="w-12" />
      </header>

      {earnedCertificates.length === 0 ? (
        <div className="max-w-md mx-auto mt-12">
          <div className="kids-card bg-white p-8 rounded-3xl shadow-xl text-center">
            <Trophy className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No Certificates Yet</h2>
            <p className="text-gray-500 mb-4">
              Complete lessons and quizzes to earn certificates! Each category you progress in will unlock a beautiful certificate.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <Sparkles className="w-4 h-4" /> Start learning to earn your first certificate!
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {earnedCertificates.map((cert) => (
            <div
              key={cert.key}
              className="kids-card bg-white rounded-3xl shadow-xl overflow-hidden"
            >
              {/* Decorative Gradient Border */}
              <div className={`h-3 bg-gradient-to-r ${cert.gradient}`} />

              {/* Certificate Body */}
              <div className={`p-6 bg-gradient-to-br ${cert.gradient} bg-opacity-5`}>
                {/* Certificate Header */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Trophy className="w-10 h-10 text-amber-500" />
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-700">Certificate of Achievement</h2>
                    <p className="text-sm text-gray-500">Kids Learning Adventure</p>
                  </div>
                  <Trophy className="w-10 h-10 text-amber-500" />
                </div>

                {/* Stars Decoration */}
                <div className="flex items-center justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.min(cert.score, 5)
                          ? 'text-amber-400 fill-amber-400 animate-sparkle'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Category Info */}
                <div className="text-center mb-4">
                  <div className="text-5xl mb-2">{cert.icon}</div>
                  <p className="text-lg text-gray-500">This certificate is proudly presented for completing</p>
                  <h3 className="text-2xl font-bold text-gray-700">{cert.label}</h3>
                </div>

                {/* Score & Date */}
                <div className="flex items-center justify-around bg-white/60 rounded-2xl p-4 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase">Score</p>
                    <p className="text-2xl font-bold text-gray-700">{cert.score}</p>
                  </div>
                  <div className="w-px h-12 bg-gray-300" />
                  <div className="text-center">
                    <p className="text-xs text-gray-500 font-bold uppercase">Date Earned</p>
                    <p className="text-sm font-bold text-gray-600">{cert.dateEarned}</p>
                  </div>
                </div>

                {/* Print Button */}
                <button
                  onClick={() => handlePrint(cert.label)}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <Printer className="w-5 h-5" /> Print Certificate
                </button>
              </div>

              {/* Bottom Decorative Border */}
              <div className={`h-3 bg-gradient-to-r ${cert.gradient}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
