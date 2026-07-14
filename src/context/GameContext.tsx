import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

interface Progress {
  abc: number;
  numbers: number;
  colors: number;
  shapes: number;
  animals: number;
  fruits: number;
  math: number;
  memory: number;
}

interface GameStats {
  totalStars: number;
  totalCoins: number;
  lessonsCompleted: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  streakDays: number;
  lastPlayDate: string;
}

export type FeedbackType = 'correct' | 'wrong' | null;
export type MascotMood = 'idle' | 'happy' | 'sad' | 'excited';

interface GameState {
  progress: Progress;
  stats: GameStats;
  showConfetti: boolean;
  showStars: boolean;
  feedback: FeedbackType;
  mascotMood: MascotMood;
  currentCharacter: 'rabbit' | 'panda' | 'lion' | 'cat' | 'monkey' | 'elephant';
  unlockedCharacters: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GameContextType {
  state: GameState;
  addStars: (count: number) => void;
  addCoins: (count: number) => void;
  completeLesson: (category: keyof Progress) => void;
  recordAnswer: (correct: boolean) => void;
  triggerConfetti: () => void;
  hideConfetti: () => void;
  setFeedback: (type: FeedbackType) => void;
  setMascotMood: (mood: MascotMood) => void;
  setDifficulty: (level: 'easy' | 'medium' | 'hard') => void;
  setCharacter: (character: GameState['currentCharacter']) => void;
  resetProgress: () => void;
}

const initialProgress: Progress = {
  abc: 0,
  numbers: 0,
  colors: 0,
  shapes: 0,
  animals: 0,
  fruits: 0,
  math: 0,
  memory: 0,
};

const initialStats: GameStats = {
  totalStars: 0,
  totalCoins: 0,
  lessonsCompleted: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  timeSpent: 0,
  streakDays: 0,
  lastPlayDate: new Date().toISOString().split('T')[0],
};

const initialState: GameState = {
  progress: initialProgress,
  stats: initialStats,
  showConfetti: false,
  showStars: false,
  feedback: null,
  mascotMood: 'idle',
  currentCharacter: 'rabbit',
  unlockedCharacters: ['rabbit'],
  difficulty: 'easy',
};

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'kids_learning_game_state';

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return { ...initialState, ...JSON.parse(saved) };
      } catch {
        return initialState;
      }
    }
    return initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (state.stats.lastPlayDate !== today) {
      const lastDate = new Date(state.stats.lastPlayDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setState(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            streakDays: prev.stats.streakDays + 1,
            lastPlayDate: today,
          },
        }));
      } else if (diffDays > 1) {
        setState(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            streakDays: 1,
            lastPlayDate: today,
          },
        }));
      }
    }
  }, []);

  const addStars = useCallback((count: number) => {
    setState(prev => ({
      ...prev,
      showStars: true,
      stats: {
        ...prev.stats,
        totalStars: prev.stats.totalStars + count,
      },
    }));
    setTimeout(() => {
      setState(prev => ({ ...prev, showStars: false }));
    }, 2000);
  }, []);

  const addCoins = useCallback((count: number) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalCoins: prev.stats.totalCoins + count,
      },
    }));
  }, []);

  const completeLesson = useCallback((category: keyof Progress) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [category]: prev.progress[category] + 1,
      },
      stats: {
        ...prev.stats,
        lessonsCompleted: prev.stats.lessonsCompleted + 1,
        totalStars: prev.stats.totalStars + 3,
        totalCoins: prev.stats.totalCoins + 10,
      },
    }));
    addStars(3);
  }, [addStars]);

  const recordAnswer = useCallback((correct: boolean) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        correctAnswers: prev.stats.correctAnswers + (correct ? 1 : 0),
        wrongAnswers: prev.stats.wrongAnswers + (correct ? 0 : 1),
        totalCoins: prev.stats.totalCoins + (correct ? 1 : 0),
      },
    }));
  }, []);

  const triggerConfetti = useCallback(() => {
    setState(prev => ({ ...prev, showConfetti: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, showConfetti: false }));
    }, 3000);
  }, []);

  const hideConfetti = useCallback(() => {
    setState(prev => ({ ...prev, showConfetti: false }));
  }, []);

  const setFeedback = useCallback((type: FeedbackType) => {
    setState(prev => ({ ...prev, feedback: type }));
  }, []);

  const setMascotMood = useCallback((mood: MascotMood) => {
    setState(prev => ({ ...prev, mascotMood: mood }));
  }, []);

  const setDifficulty = useCallback((level: 'easy' | 'medium' | 'hard') => {
    setState(prev => ({ ...prev, difficulty: level }));
  }, []);

  const setCharacter = useCallback((character: GameState['currentCharacter']) => {
    setState(prev => {
      if (!prev.unlockedCharacters.includes(character)) {
        return prev;
      }
      return { ...prev, currentCharacter: character };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        addStars,
        addCoins,
        completeLesson,
        recordAnswer,
        triggerConfetti,
        hideConfetti,
        setFeedback,
        setMascotMood,
        setDifficulty,
        setCharacter,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}
