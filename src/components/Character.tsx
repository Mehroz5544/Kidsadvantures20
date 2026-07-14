import { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { useSound } from '../context/SoundContext';
import type { MascotMood } from '../context/GameContext';

const characterEmojis = {
  rabbit: '🐰',
  panda: '🐼',
  lion: '🦁',
  cat: '🐱',
  monkey: '🐵',
  elephant: '🐘',
};

const moodEmojis: Record<MascotMood, string> = {
  idle: '😊',
  happy: '😄',
  sad: '😟',
  excited: '🤩',
};

const encouragements = [
  "You're doing great!",
  "Keep going!",
  "Awesome!",
  "Woohoo!",
  "You're a star!",
  "Amazing!",
  "Fantastic!",
  "Brilliant!",
];

export function Character() {
  const { state, setMascotMood } = useGame();
  const { speak } = useSound();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (state.mascotMood === 'idle') return;
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, state.mascotMood === 'excited' ? 2000 : 1500);
    return () => clearTimeout(timer);
  }, [state.mascotMood]);

  useEffect(() => {
    const handleClick = () => {
      setIsAnimating(true);
      setShowMessage(true);
      const msg = encouragements[Math.floor(Math.random() * encouragements.length)];
      setMessage(msg);
      speak(msg);
      setMascotMood('happy');

      setTimeout(() => {
        setIsAnimating(false);
        setShowMessage(false);
        setMascotMood('idle');
      }, 2000);
    };

    const characterEl = document.getElementById('floating-character');
    characterEl?.addEventListener('click', handleClick);

    return () => {
      characterEl?.removeEventListener('click', handleClick);
    };
  }, [speak, setMascotMood]);

  const moodClass =
    state.mascotMood === 'excited'
      ? 'animate-bounce scale-125'
      : state.mascotMood === 'sad'
      ? 'animate-shake'
      : state.mascotMood === 'happy'
      ? 'animate-bounce-slow'
      : 'animate-float';

  return (
    <div
      id="floating-character"
      className="fixed z-40 cursor-pointer character gpu-accelerated"
      style={{ bottom: '80px', right: '20px' }}
    >
      {showMessage && (
        <div className="absolute bottom-full right-0 mb-2 animate-slide-up">
          <div className="bg-white rounded-2xl px-4 py-2 shadow-lg text-center min-w-[150px]">
            <p className="text-gray-700 font-bold text-sm">{message}</p>
          </div>
          <div className="absolute bottom-0 right-4 translate-y-1/2 w-4 h-4 bg-white rotate-45" />
        </div>
      )}

      <div className="relative">
        <div
          className={`text-6xl transition-transform gpu-accelerated ${isAnimating ? moodClass : 'animate-float'}`}
          style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))' }}
        >
          {characterEmojis[state.currentCharacter]}
        </div>
        {(state.mascotMood === 'excited' || state.mascotMood === 'sad' || state.mascotMood === 'happy') && (
          <span
            className="absolute -top-2 -right-2 text-2xl gpu-accelerated"
            style={{ animation: 'pop 0.3s ease-out' }}
          >
            {moodEmojis[state.mascotMood]}
          </span>
        )}
      </div>
    </div>
  );
}
