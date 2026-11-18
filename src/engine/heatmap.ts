import type { DailyActivity, DayNumber, ISODate } from '../types';
import { addDays, daysBetween, weekdayIndex } from '../lib/dates';

export type HeatLevel = 0 | 1 | 2 | 3 | 4;

/** Minimum daily XP for levels 1–4. */
export const HEAT_THRESHOLDS = [1, 30, 80, 150] as const;

export const MIN_HEATMAP_WEEKS = 16;
export const MAX_HEATMAP_WEEKS = 53;

export interface HeatCell {
  date: ISODate;
  level: HeatLevel;
  xp: number;
  reps: number;
  completedDay: DayNumber | null;
  frozen: boolean;
  future: boolean;
}

export interface HeatWeek {
  /** Monday of the week. */
  start: ISODate;
  cells: HeatCell[];
}

export function heatLevel(xp: number): HeatLevel {
  let level: HeatLevel = 0;
  HEAT_THRESHOLDS.forEach((min, i) => {
    if (xp >= min) level = (i + 1) as HeatLevel;
  });
  return level;
}

/** Enough weeks to reach back to the user's first day, within the min/max bounds. */
export function heatmapWeeks(since: ISODate, today: ISODate): number {
  const daysBeforeThisWeek = daysBetween(since, today) - weekdayIndex(today);
  const weeks = 1 + Math.max(0, Math.ceil(daysBeforeThisWeek / 7));
  return Math.min(MAX_HEATMAP_WEEKS, Math.max(MIN_HEATMAP_WEEKS, weeks));
}

/** Monday-first columns ending with the week that contains `today`. */
export function buildHeatmap(activity: Record<ISODate, DailyActivity>, today: ISODate, weeks: number): HeatWeek[] {
  const firstMonday = addDays(today, -weekdayIndex(today) - (weeks - 1) * 7);
  return Array.from({ length: weeks }, (_, w) => {
    const start = addDays(firstMonday, w * 7);
    const cells = Array.from({ length: 7 }, (_, d): HeatCell => {
      const date = addDays(start, d);
      const day = activity[date];
      const xp = day?.xp ?? 0;
      return {
        date,
        level: heatLevel(xp),
        xp,
        reps: day?.reps ?? 0,
        completedDay: day?.completedDay ?? null,
        frozen: day?.frozen ?? false,
        future: date > today,
      };
    });
    return { start, cells };
  });
}

export function activeDayCount(activity: Record<ISODate, DailyActivity>): number {
  return Object.values(activity).filter((d) => d.xp > 0).length;
}

export function earliestDate(dates: Iterable<ISODate>, fallback: ISODate): ISODate {
  let earliest = fallback;
  for (const date of dates) if (date < earliest) earliest = date;
  return earliest;
}
