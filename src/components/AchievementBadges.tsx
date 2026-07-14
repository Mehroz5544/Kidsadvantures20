import { useMemo } from 'react';
import { ArrowLeft, Lock, Star, Award, Zap, Flame, Target, Brain, Trophy, BookOpen, Sparkles, Crown, Rocket, Medal } from 'lucide-react';
import { useGame } from '../context/GameContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: (stats: { totalStars: number; lessonsCompleted: number; correctAnswers: number; streakDays: number }) => number;
  goal: number;
}

const BADGES: Badge[] = [
  { id: 'first-star', name: 'First Star', description: 'Earn your first star', icon: '⭐', requirement: (s) => Math.min(s.totalStars, 1), goal: 1 },
  { id: 'star-collector', name: 'Star Collector', description: 'Earn 10 stars', icon: '🌟', requirement: (s) => Math.min(s.totalStars, 10), goal: 10 },
  { id: 'star-master', name: 'Star Master', description: 'Earn 50 stars', icon: '✨', requirement: (s) => Math.min(s.totalStars, 50), goal: 50 },
  { id: 'star-legend', name: 'Star Legend', description: 'Earn 100 stars', icon: '💫', requirement: (s) => Math.min(s.totalStars, 100), goal: 100 },
  { id: 'first-lesson', name: 'First Lesson', description: 'Complete your first lesson', icon: '📚', requirement: (s) => Math.min(s.lessonsCompleted, 1), goal: 1 },
  { id: 'lesson-warrior', name: 'Lesson Warrior', description: 'Complete 5 lessons', icon: '⚔️', requirement: (s) => Math.min(s.lessonsCompleted, 5), goal: 5 },
  { id: 'lesson-champion', name: 'Lesson Champion', description: 'Complete 10 lessons', icon: '🏆', requirement: (s) => Math.min(s.lessonsCompleted, 10), goal: 10 },
  { id: 'lesson-hero', name: 'Lesson Hero', description: 'Complete 25 lessons', icon: '🦸', requirement: (s) => Math.min(s.lessonsCompleted, 25), goal: 25 },
  { id: 'first-correct', name: 'Smart Cookie', description: 'Answer 1 question correctly', icon: '🍪', requirement: (s) => Math.min(s.correctAnswers, 1), goal: 1 },
  { id: 'brainiac', name: 'Brainiac', description: 'Answer 25 questions correctly', icon: '🧠', requirement: (s) => Math.min(s.correctAnswers, 25), goal: 25 },
  { id: 'genius', name: 'Genius', description: 'Answer 100 questions correctly', icon: '🎓', requirement: (s) => Math.min(s.correctAnswers, 100), goal: 100 },
  { id: 'know-it-all', name: 'Know-It-All', description: 'Answer 250 questions correctly', icon: '💡', requirement: (s) => Math.min(s.correctAnswers, 250), goal: 250 },
  { id: 'streak-starter', name: 'On Fire', description: 'Play 2 days in a row', icon: '🔥', requirement: (s) => Math.min(s.streakDays, 2), goal: 2 },
  { id: 'streak-master', name: 'Consistent', description: 'Play 5 days in a row', icon: '🎯', requirement: (s) => Math.min(s.streakDays, 5), goal: 5 },
  { id: 'streak-legend', name: 'Unstoppable', description: 'Play 10 days in a row', icon: '⚡', requirement: (s) => Math.min(s.streakDays, 10), goal: 10 },
  { id: 'rocket-launch', name: 'Rocket Launch', description: 'Earn 200 stars', icon: '🚀', requirement: (s) => Math.min(s.totalStars, 200), goal: 200 },
  { id: 'crown-jewel', name: 'Crown Jewel', description: 'Complete 50 lessons', icon: '👑', requirement: (s) => Math.min(s.lessonsCompleted, 50), goal: 50 },
];

const ICON_MAP: Record<string, typeof Star> = {
  Star, Award, Zap, Flame, Target, Brain, Trophy, BookOpen, Sparkles, Crown, Rocket, Medal, Lock,
};

export function AchievementBadges({ onBack }: { onBack: () => void }) {
  const { state } = useGame();
  const stats = state.stats;

  const badgeData = useMemo(() =>
    BADGES.map(badge => {
      const progress = badge.requirement(stats);
      const unlocked = progress >= badge.goal;
      const pct = Math.round((progress / badge.goal) * 100);
      return { ...badge, progress, unlocked, pct };
    }),
    [stats]
  );

  const unlockedCount = badgeData.filter(b => b.unlocked).length;

  return (
    <div className="min-h-screen px-4 py-6">
      <header className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="p-3 rounded-2xl bg-white/80 backdrop-blur shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-white drop-shadow flex items-center gap-2">
          <Trophy className="w-7 h-7" /> Achievement Badges
        </h1>
        <div className="w-12" />
      </header>

      {/* Summary */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="kids-card bg-white p-4 rounded-3xl shadow-xl text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Medal className="w-6 h-6 text-amber-400" />
            <span className="text-xl font-bold text-gray-700">{unlockedCount} / {BADGES.length} Unlocked</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / BADGES.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badge Grid */}
      <div className="max-w-2xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4">
        {badgeData.map((badge) => (
          <div
            key={badge.id}
            className={`kids-card p-4 rounded-3xl shadow-xl text-center transition-all ${
              badge.unlocked
                ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border-amber-300 animate-scale-up'
                : 'bg-gray-50 border-gray-200 opacity-70'
            }`}
          >
            {/* Badge Icon */}
            <div className={`relative mx-auto mb-3 w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
              badge.unlocked
                ? 'bg-gradient-to-br from-amber-300 to-orange-400 shadow-lg'
                : 'bg-gray-200 grayscale'
            }`}>
              {badge.unlocked ? (
                <span className="animate-sparkle">{badge.icon}</span>
              ) : (
                <>
                  <span className="opacity-30">{badge.icon}</span>
                  <Lock className="absolute inset-0 m-auto w-6 h-6 text-gray-500" />
                </>
              )}
            </div>

            {/* Badge Name */}
            <h3 className={`font-bold text-sm mb-1 ${badge.unlocked ? 'text-gray-700' : 'text-gray-400'}`}>
              {badge.name}
            </h3>

            {/* Badge Description */}
            <p className={`text-xs mb-2 ${badge.unlocked ? 'text-gray-500' : 'text-gray-400'}`}>
              {badge.description}
            </p>

            {/* Progress or Unlocked */}
            {badge.unlocked ? (
              <div className="flex items-center justify-center gap-1 text-green-500 text-xs font-bold">
                <Star className="w-3 h-3 fill-current" /> Unlocked!
              </div>
            ) : (
              <div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${badge.pct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 font-bold">{badge.progress} / {badge.goal}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
