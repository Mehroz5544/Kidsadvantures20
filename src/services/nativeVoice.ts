import { TextToSpeech, QueueStrategy } from '@capacitor-community/text-to-speech';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';
import { Capacitor } from '@capacitor/core';

export interface VoiceOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
}

const isNative = (): boolean => Capacitor.isNativePlatform();

let femaleVoiceIndex: number | null = null;
let voiceInitialized = false;

async function pickFemaleVoice(): Promise<void> {
  if (!isNative() || voiceInitialized) return;
  voiceInitialized = true;
  try {
    const { voices } = await TextToSpeech.getSupportedVoices();
    const englishVoices = voices.filter(v => /^en[-_]/i.test(v.lang));
    const female =
      englishVoices.find(v => /female|zira|samantha|karen|tessa|moira|fiona|google uk english female|emma|allison/i.test(v.name)) ||
      englishVoices.find(v => v.default) ||
      englishVoices[0];
    if (female) {
      femaleVoiceIndex = voices.indexOf(female);
    }
  } catch {
    femaleVoiceIndex = null;
  }
}

export async function speak(text: string, opts: VoiceOptions = {}): Promise<void> {
  if (!text) return;
  if (isNative()) {
    await pickFemaleVoice();
    await TextToSpeech.speak({
      text,
      lang: opts.lang ?? 'en-US',
      rate: opts.rate ?? 1.15,
      pitch: opts.pitch ?? 1.25,
      volume: 1.0,
      voice: femaleVoiceIndex ?? undefined,
      queueStrategy: QueueStrategy.Flush,
    });
  } else {
    try {
      const synth = window.speechSynthesis;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = opts.lang ?? 'en-US';
      u.rate = opts.rate ?? 1.15;
      u.pitch = opts.pitch ?? 1.25;
      const voices = synth.getVoices();
      const fv =
        voices.find(v => /female|zira|samantha|karen|tessa|moira|fiona|emma|allison/i.test(v.name) && /^en/i.test(v.lang)) ||
        voices.find(v => /^en/i.test(v.lang));
      if (fv) u.voice = fv;
      synth.speak(u);
    } catch {
      /* no-op */
    }
  }
}

export async function stopSpeaking(): Promise<void> {
  if (isNative()) {
    await TextToSpeech.stop().catch(() => {});
  } else {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* no-op */
    }
  }
}

export async function openTtsInstall(): Promise<void> {
  if (isNative()) {
    await TextToSpeech.openInstall().catch(() => {});
  }
}

export interface ListenResult {
  matches: string[];
}

export async function requestMicPermission(): Promise<boolean> {
  if (!isNative()) return true;
  try {
    const status = await SpeechRecognition.requestPermissions();
    return status.speechRecognition === 'granted';
  } catch {
    return false;
  }
}

export async function checkMicPermission(): Promise<boolean | null> {
  if (!isNative()) return true;
  try {
    const status = await SpeechRecognition.checkPermissions();
    if (status.speechRecognition === 'granted') return true;
    if (status.speechRecognition === 'denied') return false;
    return null;
  } catch {
    return null;
  }
}

export async function isRecognitionAvailable(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const { available } = await SpeechRecognition.available();
    return available;
  } catch {
    return false;
  }
}

export async function startListening(opts: { language?: string } = {}): Promise<ListenResult> {
  if (!isNative()) return { matches: [] };
  await SpeechRecognition.start({
    language: opts.language ?? 'en-US',
    maxResults: 5,
    popup: false,
    partialResults: false,
  }).then((res) => {
    lastResult = { matches: res.matches ?? [] };
  });
  return lastResult;
}

let lastResult: ListenResult = { matches: [] };

export async function stopListening(): Promise<void> {
  if (!isNative()) return;
  await SpeechRecognition.stop().catch(() => {});
}

export async function warmupTTS(): Promise<void> {
  if (!isNative()) return;
  try {
    await TextToSpeech.speak({
      text: ' ',
      lang: 'en-US',
      volume: 0,
      queueStrategy: QueueStrategy.Flush,
    });
  } catch {
    /* no-op */
  }
}

export function isRunningNatively(): boolean {
  return isNative();
}
