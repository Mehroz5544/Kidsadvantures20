import { ArrowLeft, Star, Trophy, Coins, Gift, Flame, Award, Lock, Unlock } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';

interface RewardsScreenProps {
  onBack: () => void;
}

const achievements = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', requirement: 1 },
  { id: 'ten_lessons', name: 'Super Learner', description: 'Complete 10 lessons', icon: '📚', requirement: 10 },
  { id: 'fifty_correct', name: 'Perfect Score', description: 'Get 50 correct answers', icon: '💯', requirement: 50 },
  { id: 'week_streak', name: 'Weekly Champion', description: '7 day streak', icon: '🔥', requirement: 7 },
  { id: 'hundred_stars', name: 'Star Collector', description: 'Earn 100 stars', icon: '⭐', requirement: 100 },
  { id: 'math_master', name: 'Math Master', description: 'Complete 20 math problems', icon: '🔢', requirement: 20 },
];

const characters = [
  { id: 'rabbit', name: 'Bunny', emoji: '🐰', cost: 0 },
  { id: 'panda', name: 'Panda', emoji: '🐼', cost: 100 },
  { id: 'lion', name: 'Leo', emoji: '🦁', cost: 200 },
  { id: 'cat', name: 'Whiskers', emoji: '🐱', cost: 150 },
  { id: 'monkey', name: 'Momo', emoji: '🐵', cost: 250 },
  { id: 'elephant', name: 'Ellie', emoji: '🐘', cost: 300 },
];

export function RewardsScreen({ onBack }: RewardsScreenProps) {
  const { state, setCharacter } = useGame();
  const { playSound } = useSound();

  const getAchievementProgress = (requirement: number) => {
    return Math.min((state.stats.lessonsCompleted / requirement) * 100, 100);
  };

  const isAchievementUnlocked = (requirement: number) => {
    return state.stats.lessonsCompleted >= requirement;
  };

  const handleCharacterSelect = (characterId: string, cost: number) => {
    if (state.unlockedCharacters.includes(characterId)) {
      playSound('click');
      setCharacter(characterId as any);
    } else if (state.stats.totalCoins >= cost) {
      playSound('correct');
    }
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

        <h1 className="text-2xl font-bold text-white drop-shadow">My Rewards</h1>

        <div className="flex items-center gap-2">
          <Coins className="w-6 h-6 text-amber-400" />
          <span className="font-bold text-white">{state.stats.totalCoins}</span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="kids-card bg-white p-4 rounded-2xl shadow-lg text-center">
          <Star className="w-10 h-10 text-yellow-400 mx-auto animate-sparkle" />
          <p className="text-3xl font-bold text-gray-700 mt-2">{state.stats.totalStars}</p>
          <p className="text-sm text-gray-500">Stars</p>
        </div>
        <div className="kids-card bg-white p-4 rounded-2xl shadow-lg text-center">
          <Trophy className="w-10 h-10 text-amber-500 mx-auto" />
          <p className="text-3xl font-bold text-gray-700 mt-2">{state.stats.lessonsCompleted}</p>
          <p className="text-sm text-gray-500">Lessons</p>
        </div>
        <div className="kids-card bg-white p-4 rounded-2xl shadow-lg text-center">
          <Flame className="w-10 h-10 text-orange-500 mx-auto" />
          <p className="text-3xl font-bold text-gray-700 mt-2">{state.stats.streakDays}</p>
          <p className="text-sm text-gray-500">Day Streak</p>
        </div>
        <div className="kids-card bg-white p-4 rounded-2xl shadow-lg text-center">
          <Award className="w-10 h-10 text-blue-500 mx-auto" />
          <p className="text-3xl font-bold text-gray-700 mt-2">
            {Math.round((state.stats.correctAnswers / Math.max(state.stats.correctAnswers + state.stats.wrongAnswers, 1)) * 100)}%
          </p>
          <p className="text-sm text-gray-500">Accuracy</p>
        </div>
      </div>

      {/* Characters */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow">Characters</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {characters.map((char) => {
            const isUnlocked = state.unlockedCharacters.includes(char.id);
            const isSelected = state.currentCharacter === char.id;

            return (
              <button
                key={char.id}
                onClick={() => handleCharacterSelect(char.id, char.cost)}
                className={`kids-card bg-white p-4 rounded-2xl shadow-lg text-center transition-all ${
                  isSelected ? 'ring-4 ring-yellow-400 scale-110' : ''
                } ${!isUnlocked ? 'opacity-75' : 'hover:scale-105'}`}
              >
                <div className="text-4xl mb-2">
                  {isUnlocked ? char.emoji : '🔒'}
                </div>
                <p className="text-sm font-bold text-gray-700">{char.name}</p>
                {!isUnlocked && (
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <Coins className="w-3 h-3" /> {char.cost}
                  </p>
                )}
                {isSelected && (
                  <div className="text-xs text-green-500 font-bold">Selected</div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Achievements */}
      <section className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4 drop-shadow">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const unlocked = isAchievementUnlocked(achievement.requirement);
            const progress = getAchievementProgress(achievement.requirement);

            return (
              <div
                key={achievement.id}
                className={`kids-card bg-white p-4 rounded-2xl shadow-lg flex items-center gap-4 ${
                  unlocked ? 'ring-2 ring-yellow-400' : 'opacity-75'
                }`}
              >
                <div className={`text-4xl ${unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-700">{achievement.name}</p>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                  <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        unlocked ? 'bg-green-500' : 'bg-blue-400'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div>
                  {unlocked ? (
                    <Unlock className="w-8 h-8 text-green-500" />
                  ) : (
                    <Lock className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Reward */}
      <section className="mb-20">
        <div className="kids-card bg-gradient-to-r from-amber-100 to-yellow-100 p-6 rounded-2xl shadow-lg text-center">
          <Gift className="w-16 h-16 text-amber-500 mx-auto animate-bounce mb-4" />
          <h3 className="text-xl font-bold text-gray-700 mb-2">Daily Reward!</h3>
          <p className="text-gray-500 mb-4">Come back every day for bonus coins!</p>
          <button
            className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 text-white font-bold shadow-lg hover:scale-105 transition-transform"
            onClick={() => playSound('correct')}
          >
            Claim 10 Coins!
          </button>
        </div>
      </section>
    </div>
  );
}
