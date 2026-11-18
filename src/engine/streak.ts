import type { ISODate, PersistedState } from '../types';
import { addDays, toISODate } from '../lib/dates';
import { STREAK_RULES } from './progression';

export interface StreakResult {
  current: number;
  longest: number;
  freezes: number;
  frozenDates: ISODate[];
}

/** Calendar dates that count toward the streak: a day completed, or enough reps logged. */
export function activeDates(state: Pick<PersistedState, 'days' | 'repEvents'>): Set<ISODate> {
  const dates = new Set<ISODate>();
  for (const progress of Object.values(state.days)) {
    if (progress.completedAt) dates.add(toISODate(progress.completedAt));
  }
  const repsPerDate = new Map<ISODate, number>();
  for (const rep of state.repEvents) {
    const date = toISODate(rep.at);
    repsPerDate.set(date, (repsPerDate.get(date) ?? 0) + 1);
  }
  for (const [date, reps] of repsPerDate) {
    if (reps >= STREAK_RULES.practiceRepsForStreak) dates.add(date);
  }
  return dates;
}

/**
 * Replays the calendar from the first active date to `today`.
 * A missed day consumes a freeze if one is available (the streak survives but doesn't grow);
 * `today` itself never breaks the streak because the user still has time to act.
 */
export function computeStreak(active: Set<ISODate>, today: ISODate): StreakResult {
  const sorted = [...active].filter((d) => d <= today).sort();
  if (sorted.length === 0) {
    return { current: 0, longest: 0, freezes: STREAK_RULES.startingFreezes, frozenDates: [] };
  }

  let freezes: number = STREAK_RULES.startingFreezes;
  let run = 0;
  let longest = 0;
  const frozenDates: ISODate[] = [];

  for (let date = sorted[0]; date <= today; date = addDays(date, 1)) {
    if (active.has(date)) {
      run += 1;
      longest = Math.max(longest, run);
      if (run % STREAK_RULES.freezeEarnedEvery === 0) {
        freezes = Math.min(STREAK_RULES.maxFreezes, freezes + 1);
      }
    } else if (date === today) {
      break;
    } else if (run > 0 && freezes > 0) {
      freezes -= 1;
      frozenDates.push(date);
    } else {
      run = 0;
    }
  }

  return { current: run, longest, freezes, frozenDates };
}
