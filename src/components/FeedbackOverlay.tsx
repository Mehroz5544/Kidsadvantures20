import { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';

interface StarPiece {
  id: number;
  x: number;
  y: number;
  delay: number;
  size: number;
  rotate: number;
  tx: number;
}

export function FeedbackOverlay() {
  const { state } = useGame();
  const { feedback } = state;
  const [stars, setStars] = useState<StarPiece[]>([]);

  useEffect(() => {
    if (feedback === 'correct') {
      const pieces: StarPiece[] = [];
      for (let i = 0; i < 12; i++) {
        const tx = (Math.random() - 0.5) * 300;
        pieces.push({
          id: i,
          x: 50 + (Math.random() - 0.5) * 30,
          y: 50,
          delay: Math.random() * 0.3,
          size: 24 + Math.random() * 20,
          rotate: Math.random() * 360,
          tx,
        });
      }
      setStars(pieces);
    } else {
      setStars([]);
    }
  }, [feedback]);

  if (feedback === null) return null;

  if (feedback === 'correct') {
    return (
      <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
        {stars.map((s) => (
          <div
            key={s.id}
            className="absolute gpu-accelerated"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: 'translate(-50%, -50%)',
              animation: `flyStarFixed 1.2s ease-out ${s.delay}s forwards`,
              ['--tx' as string]: `${s.tx}px`,
            }}
          >
            <svg width={s.size} height={s.size} viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(251,191,36,0.6))' }}>
              <path
                d="M12 2 L14.85 8.97 L22 9.27 L16.18 13.97 L18.18 21 L12 17.27 L5.82 21 L7.82 13.97 L2 9.27 L9.15 8.97 Z"
                fill="#fbbf24"
                stroke="#f59e0b"
                strokeWidth="1"
                transform={`rotate(${s.rotate})`}
              />
            </svg>
          </div>
        ))}
        <div className="animate-bounce-in" style={{ animationDuration: '0.5s' }}>
          <p className="text-6xl font-bold text-green-400 drop-shadow-2xl" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>
            Excellent!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] flex items-center justify-center">
      <div className="animate-shake" style={{ animationIterationCount: 2 }}>
        <p className="text-5xl font-bold text-rose-400 drop-shadow-2xl" style={{ textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff' }}>
          Try Again!
        </p>
      </div>
    </div>
  );
}
