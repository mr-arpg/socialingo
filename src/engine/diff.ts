import type { StatDelta, UserStats } from '../types';
import { ATTRIBUTE_KEYS, COUNTER_KEYS } from '../types';
import { ATTRIBUTE_META, COUNTER_META } from '../content/chapters';

/** Positive changes between two stat snapshots, ordered for the celebration modal. */
export function diffStats(before: UserStats, after: UserStats): StatDelta[] {
  const deltas: StatDelta[] = [];
  const push = (kind: StatDelta['kind'], key: string, label: string, b: number, a: number) => {
    if (a > b) deltas.push({ kind, key, label, before: b, after: a, delta: a - b });
  };

  push('xp', 'xp', 'XP', before.totalXp, after.totalXp);
  push('streak', 'streak', 'Day Streak', before.currentStreak, after.currentStreak);
  for (const key of COUNTER_KEYS) {
    push('counter', key, COUNTER_META[key].label, before.counters[key], after.counters[key]);
  }
  for (const key of ATTRIBUTE_KEYS) {
    push('attribute', key, ATTRIBUTE_META[key].label, before.attributes[key], after.attributes[key]);
  }
  return deltas;
}
