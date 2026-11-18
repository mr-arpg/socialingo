import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';
import { burstConfetti, vibrate } from '../lib/effects';
import { sounds, type SoundName } from '../lib/sound';
import { useReducedMotion } from './useReducedMotion';

/** Sound + haptics + confetti, each respecting the user's settings. */
export function useFeedback() {
  const sound = useAppStore((s) => s.data.settings.sound);
  const haptics = useAppStore((s) => s.data.settings.haptics);
  const reducedMotion = useReducedMotion();

  return useMemo(() => {
    const play = (name: SoundName) => sound && sounds[name]();
    const buzz = (pattern: number | number[]) => haptics && vibrate(pattern);
    return {
      tap: () => {
        play('tap');
        buzz(8);
      },
      courage: () => {
        play('courage');
        buzz([10, 40, 10]);
      },
      correct: () => {
        play('correct');
        buzz(15);
      },
      wrong: () => {
        play('wrong');
        buzz([30, 30, 30]);
      },
      success: () => {
        play('success');
        buzz(20);
        if (!reducedMotion) burstConfetti('small');
      },
      celebrate: () => {
        play('fanfare');
        buzz([20, 60, 20, 60, 40]);
        if (!reducedMotion) burstConfetti('big');
      },
    };
  }, [sound, haptics, reducedMotion]);
}
