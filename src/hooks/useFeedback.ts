import { useCallback, useRef } from 'react';
import { useSound } from '../context/SoundContext';
import { useGame } from '../context/GameContext';

export function useFeedback() {
  const { playSound, speak } = useSound();
  const { addStars, triggerConfetti, recordAnswer, setFeedback, setMascotMood } = useGame();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const correct = useCallback((message = 'Excellent! Great job!') => {
    playSound('clap');
    setTimeout(() => playSound('star'), 200);
    playSound('correct');
    triggerConfetti();
    addStars(1);
    recordAnswer(true);
    setFeedback('correct');
    setMascotMood('excited');
    speak(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFeedback(null);
      setMascotMood('idle');
    }, 2000);
  }, [playSound, speak, addStars, triggerConfetti, recordAnswer, setFeedback, setMascotMood]);

  const wrong = useCallback((message = 'Oops! Try again!') => {
    playSound('wrong');
    recordAnswer(false);
    setFeedback('wrong');
    setMascotMood('sad');
    speak(message);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setFeedback(null);
      setMascotMood('idle');
    }, 1500);
  }, [playSound, speak, recordAnswer, setFeedback, setMascotMood]);

  return { correct, wrong };
}
