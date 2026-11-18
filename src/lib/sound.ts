/** Tiny Web Audio synth: no audio files to download or cache. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === 'undefined' || !('AudioContext' in window)) return null;
  ctx ??= new AudioContext();
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

interface Note {
  freq: number;
  start: number;
  duration: number;
  type?: OscillatorType;
  gain?: number;
}

function play(notes: Note[]): void {
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime;
  for (const { freq, start, duration, type = 'sine', gain = 0.18 } of notes) {
    const osc = ac.createOscillator();
    const amp = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0 + start);
    amp.gain.setValueAtTime(0.0001, t0 + start);
    amp.gain.exponentialRampToValueAtTime(gain, t0 + start + 0.012);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + start + duration);
    osc.connect(amp).connect(ac.destination);
    osc.start(t0 + start);
    osc.stop(t0 + start + duration + 0.02);
  }
}

export const sounds = {
  tap: () => play([{ freq: 880, start: 0, duration: 0.08, type: 'triangle', gain: 0.12 }]),
  courage: () =>
    play([
      { freq: 523, start: 0, duration: 0.09, type: 'triangle' },
      { freq: 784, start: 0.07, duration: 0.14, type: 'triangle' },
    ]),
  correct: () =>
    play([
      { freq: 660, start: 0, duration: 0.1 },
      { freq: 990, start: 0.09, duration: 0.18 },
    ]),
  wrong: () => play([{ freq: 220, start: 0, duration: 0.18, type: 'sawtooth', gain: 0.06 }]),
  success: () =>
    play([
      { freq: 523, start: 0, duration: 0.12 },
      { freq: 659, start: 0.1, duration: 0.12 },
      { freq: 784, start: 0.2, duration: 0.22 },
    ]),
  fanfare: () =>
    play([
      { freq: 523, start: 0, duration: 0.14, type: 'triangle' },
      { freq: 659, start: 0.12, duration: 0.14, type: 'triangle' },
      { freq: 784, start: 0.24, duration: 0.14, type: 'triangle' },
      { freq: 1047, start: 0.36, duration: 0.45, type: 'triangle', gain: 0.22 },
      { freq: 784, start: 0.36, duration: 0.45, type: 'sine', gain: 0.1 },
    ]),
};

export type SoundName = keyof typeof sounds;
