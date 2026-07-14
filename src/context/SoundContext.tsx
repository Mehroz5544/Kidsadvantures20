import { createContext, useContext, useState, useRef, useEffect, useCallback, ReactNode } from 'react';
import { speak as nativeSpeak, stopSpeaking, isRunningNatively } from '../services/nativeVoice';

type SfxName = 'correct' | 'wrong' | 'click' | 'celebration' | 'pop' | 'clap' | 'star';

interface SoundContextType {
  soundEnabled: boolean;
  voiceEnabled: boolean;
  musicEnabled: boolean;
  toggleSound: () => void;
  toggleVoice: () => void;
  toggleMusic: () => void;
  playSound: (sound: SfxName) => void;
  speak: (text: string) => void;
  stopSpeak: () => void;
  isSpeaking: boolean;
  isNative: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isNative] = useState(isRunningNatively());

  const audioContextRef = useRef<AudioContext | null>(null);
  const musicTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastSpokenRef = useRef<string>('');

  useEffect(() => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = ctx;
    return () => {
      ctx.close();
      if (musicTimerRef.current) clearInterval(musicTimerRef.current);
    };
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', delay = 0, volume = 0.18) => {
    if (!soundEnabled) return;
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const start = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(frequency, start);
    osc.type = type;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  }, [soundEnabled]);

  const playNoiseBurst = useCallback((duration: number, volume = 0.12) => {
    if (!soundEnabled) return;
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1500;
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }, [soundEnabled]);

  const playSound = useCallback((sound: SfxName) => {
    if (!soundEnabled) return;
    switch (sound) {
      case 'correct':
        playTone(523.25, 0.12);
        playTone(659.25, 0.12, 'sine', 0.1);
        playTone(783.99, 0.2, 'sine', 0.2);
        break;
      case 'wrong':
        playTone(196, 0.3, 'sawtooth', 0, 0.14);
        playTone(155.56, 0.25, 'sawtooth', 0.12, 0.12);
        break;
      case 'click':
        playTone(880, 0.06, 'square', 0, 0.1);
        break;
      case 'celebration':
        [523.25, 587.33, 659.25, 783.99, 880, 987.77, 1046.5].forEach((f, i) => playTone(f, 0.15, 'sine', i * 0.1, 0.15));
        break;
      case 'pop':
        playTone(1000, 0.05, 'sine', 0, 0.12);
        break;
      case 'clap':
        playNoiseBurst(0.12, 0.16);
        setTimeout(() => playNoiseBurst(0.1, 0.13), 90);
        setTimeout(() => playNoiseBurst(0.08, 0.1), 180);
        break;
      case 'star':
        playTone(1568, 0.08, 'sine', 0, 0.1);
        playTone(2093, 0.12, 'sine', 0.06, 0.1);
        break;
    }
  }, [soundEnabled, playTone, playNoiseBurst]);

  const speak = useCallback(async (text: string) => {
    if (!soundEnabled || !voiceEnabled || !text) return;

    if (lastSpokenRef.current === text) return;
    lastSpokenRef.current = text;

    setIsSpeaking(true);

    try {
      await stopSpeaking();
      await nativeSpeak(text, {
        rate: 1.15,
        pitch: 1.25,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSpeaking(false);
      setTimeout(() => {
        lastSpokenRef.current = '';
      }, 200);
    }
  }, [soundEnabled, voiceEnabled]);

  const stopSpeak = useCallback(() => {
    setIsSpeaking(false);
    lastSpokenRef.current = '';
    void stopSpeaking();
  }, []);

  const toggleSound = useCallback(() => setSoundEnabled(p => !p), []);
  const toggleVoice = useCallback(() => setVoiceEnabled(p => !p), []);
  const toggleMusic = useCallback(() => {
    setMusicEnabled(p => !p);
  }, []);

  const startMusic = useCallback(() => {
    if (musicTimerRef.current) clearInterval(musicTimerRef.current);
    const ctx = audioContextRef.current;
    if (!ctx) return;
    const melody = [
      [523.25, 0.4], [659.25, 0.4], [783.99, 0.4], [659.25, 0.4],
      [587.33, 0.4], [698.46, 0.4], [880, 0.4], [698.46, 0.4],
    ];
    let step = 0;
    musicTimerRef.current = setInterval(() => {
      if (!musicEnabled || !soundEnabled) return;
      const [freq, dur] = melody[step % melody.length];
      playTone(freq, dur, 'triangle', 0, 0.06);
      playTone(freq / 2, dur, 'sine', 0, 0.04);
      step++;
    }, 450);
  }, [musicEnabled, soundEnabled, playTone]);

  useEffect(() => {
    if (!musicEnabled) {
      if (musicTimerRef.current) clearInterval(musicTimerRef.current);
      return;
    }
    startMusic();
  }, [musicEnabled, startMusic]);

  useEffect(() => {
    if (!soundEnabled && musicTimerRef.current) clearInterval(musicTimerRef.current);
    if (soundEnabled && musicEnabled) startMusic();
  }, [soundEnabled, musicEnabled, startMusic]);

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        voiceEnabled,
        musicEnabled,
        toggleSound,
        toggleVoice,
        toggleMusic,
        playSound,
        speak,
        stopSpeak,
        isSpeaking,
        isNative,
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
}
