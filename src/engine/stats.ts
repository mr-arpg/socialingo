import type {
  ChapterId,
  DailyActivity,
  DayContent,
  ISODate,
  LogEntry,
  MoodTag,
  PersistedState,
  Rating,
  UserStats,
} from '../types';
import { MOOD_TAGS } from '../types';
import { CHAPTERS } from '../content/chapters';
import { toISODate } from '../lib/dates';
import { tallyReps } from './day';
import { computeAttributes, levelProgress } from './progression';
import { activeDates, computeStreak } from './streak';

const WEEK_ONE_LAST_DAY = 7;
const RECENT_ENTRIES_FOR_DELTA = 3;

function mean(values: number[]): number | null {
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
}

export function confidenceDelta(entries: readonly LogEntry[]): number | null {
  const weekOne = entries.filter((e) => e.day <= WEEK_ONE_LAST_DAY).map((e) => e.confidence);
  const recent = entries
    .filter((e) => e.day > WEEK_ONE_LAST_DAY)
    .sort((a, b) => a.day - b.day)
    .slice(-RECENT_ENTRIES_FOR_DELTA)
    .map((e) => e.confidence);
  const before = mean(weekOne);
  const after = mean(recent);
  return before === null || after === null ? null : after - before;
}

export function topMood(entries: readonly LogEntry[]): MoodTag | null {
  const counts = new Map<MoodTag, number>();
  for (const entry of entries) {
    for (const mood of entry.moods) counts.set(mood, (counts.get(mood) ?? 0) + 1);
  }
  let best: MoodTag | null = null;
  let bestCount = 0;
  for (const mood of MOOD_TAGS) {
    const count = counts.get(mood) ?? 0;
    if (count > bestCount) {
      best = mood;
      bestCount = count;
    }
  }
  return best;
}

function buildActivity(state: PersistedState, frozenDates: ISODate[]): Record<ISODate, DailyActivity> {
  const activity: Record<ISODate, DailyActivity> = {};
  const at = (date: ISODate): DailyActivity =>
    (activity[date] ??= { date, xp: 0, reps: 0, completedDay: null, frozen: false });

  for (const event of state.xpEvents) at(toISODate(event.at)).xp += event.amount;
  for (const rep of state.repEvents) at(toISODate(rep.at)).reps += 1;
  for (const progress of Object.values(state.days)) {
    if (progress.completedAt) at(toISODate(progress.completedAt)).completedDay = progress.day;
  }
  for (const date of frozenDates) at(date).frozen = true;
  return activity;
}

export function computeStats(state: PersistedState, days: readonly DayContent[], today: ISODate): UserStats {
  const contentByDay = new Map(days.map((d) => [d.day, d]));
  const progressList = Object.values(state.days);
  const completed = progressList.filter((p) => p.completedAt);
  const entries = Object.values(state.logEntries);

  const totalXp = state.xpEvents.reduce((sum, e) => sum + e.amount, 0);
  const counters = tallyReps(state.repEvents);
  const totalWords = entries.reduce((sum, e) => sum + e.wordCount, 0);
  const streak = computeStreak(activeDates(state), today);

  const completedDayNumbers = new Set(completed.map((p) => p.day));
  const chaptersCompleted: ChapterId[] = CHAPTERS.filter((c) => {
    for (let d = c.firstDay; d <= c.lastDay; d += 1) if (!completedDayNumbers.has(d)) return false;
    return true;
  }).map((c) => c.id);

  const attributes = computeAttributes({
    completedDays: completed.flatMap((p) => {
      const content = contentByDay.get(p.day);
      return content ? [{ rewards: content.rewards, hardcore: Boolean(p.hardcoreCompletedAt) }] : [];
    }),
    counters,
    totalWords,
  });

  const confidenceSeries = entries
    .map((e) => ({ day: e.day, confidence: e.confidence as Rating }))
    .sort((a, b) => a.day - b.day);

  return {
    totalXp,
    level: levelProgress(totalXp),
    currentStreak: streak.current,
    longestStreak: streak.longest,
    streakFreezes: streak.freezes,
    daysCompleted: completed.length,
    daysMastered: completed.filter((p) => p.hardcoreCompletedAt).length,
    chaptersCompleted,

    counters,
    totalInteractions: counters.approaches + counters.kindnesses + counters.courageReps,
    hardcoreCompleted: progressList.filter((p) => p.hardcoreCompletedAt).length,

    logEntries: entries.length,
    totalWords,
    avgConfidence: mean(entries.map((e) => e.confidence)),
    confidenceDelta: confidenceDelta(entries),
    topMood: topMood(entries),
    confidenceSeries,

    attributes,
    activity: buildActivity(state, streak.frozenDates),
  };
}
