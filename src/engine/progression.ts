import type {
  AttributeKey,
  AttributeScores,
  CounterKey,
  CounterTotals,
  DayRewards,
  LevelProgress,
  Rank,
} from '../types';
import { ATTRIBUTE_KEYS } from '../types';

/* ----------------------------------------------------------------------------
 * XP
 * -------------------------------------------------------------------------- */

export const XP_RULES = {
  briefingComplete: 10,
  quizFirstTry: 5,
  scenarioGreat: 5,
  repTap: 2,
  courageRepTap: 5,
  /** Per calendar day, across all rep taps, so tapping can't be farmed. */
  repDailyCap: 60,
  logEntryBase: 15,
  logWordsPerBonusXp: 20,
  logBonusCap: 15,
  streakBonusPerDay: 2,
  streakBonusCap: 20,
} as const;

export function repXp(counter: CounterKey): number {
  return counter === 'courageReps' ? XP_RULES.courageRepTap : XP_RULES.repTap;
}

export function cappedRepXp(counter: CounterKey, repXpEarnedToday: number): number {
  const remaining = Math.max(0, XP_RULES.repDailyCap - repXpEarnedToday);
  return Math.min(repXp(counter), remaining);
}

export function logEntryXp(wordCount: number): number {
  const bonus = Math.floor(Math.max(0, wordCount) / XP_RULES.logWordsPerBonusXp);
  return XP_RULES.logEntryBase + Math.min(bonus, XP_RULES.logBonusCap);
}

/** Awarded once per curriculum day completion, using the streak including that day. */
export function streakBonusXp(streak: number): number {
  return Math.min(Math.max(0, streak) * XP_RULES.streakBonusPerDay, XP_RULES.streakBonusCap);
}

/* ----------------------------------------------------------------------------
 * Levels — cumulative XP to reach level L is 50·L·(L−1)
 * L2 100 · L3 300 · L4 600 · L5 1000 · L7 2100 · L10 4500 · L13 7800
 * -------------------------------------------------------------------------- */

const LEVEL_STEP = 50;

export function totalXpForLevel(level: number): number {
  const l = Math.max(1, Math.floor(level));
  return LEVEL_STEP * l * (l - 1);
}

export function levelForXp(totalXp: number): number {
  const xp = Math.max(0, totalXp);
  let level = Math.max(1, Math.floor((1 + Math.sqrt(1 + (4 * xp) / LEVEL_STEP)) / 2));
  // Guards against floating-point drift at exact level boundaries.
  while (totalXpForLevel(level + 1) <= xp) level += 1;
  while (level > 1 && totalXpForLevel(level) > xp) level -= 1;
  return level;
}

export const RANKS: readonly Rank[] = [
  {
    id: 'observer',
    title: 'Observer',
    minLevel: 1,
    description: 'Watching, noticing, getting ready to step in.',
  },
  {
    id: 'icebreaker',
    title: 'Icebreaker',
    minLevel: 3,
    description: 'You start interactions instead of waiting for them.',
  },
  {
    id: 'conversationalist',
    title: 'Conversationalist',
    minLevel: 5,
    description: 'You turn openers into real back-and-forth.',
  },
  {
    id: 'connector',
    title: 'Connector',
    minLevel: 7,
    description: 'People leave conversations with you feeling heard.',
  },
  {
    id: 'catalyst',
    title: 'Social Catalyst',
    minLevel: 10,
    description: 'You bring energy to groups and bring people together.',
  },
  {
    id: 'luminary',
    title: 'Luminary',
    minLevel: 13,
    description: 'Beyond the challenge: connection is simply how you live.',
  },
];

export function rankForLevel(level: number): Rank {
  let current = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
  }
  return current;
}

export function levelProgress(totalXp: number): LevelProgress {
  const level = levelForXp(totalXp);
  const floor = totalXpForLevel(level);
  const span = totalXpForLevel(level + 1) - floor;
  const xpIntoLevel = Math.max(0, totalXp - floor);
  return {
    level,
    totalXp,
    xpIntoLevel,
    xpForNextLevel: span,
    progress: span > 0 ? xpIntoLevel / span : 0,
    rank: rankForLevel(level),
  };
}

/* ----------------------------------------------------------------------------
 * Streaks
 * -------------------------------------------------------------------------- */

export const STREAK_RULES = {
  startingFreezes: 1,
  maxFreezes: 2,
  /** A freeze is earned each time the running streak hits a multiple of this. */
  freezeEarnedEvery: 7,
  /** Reps logged on a calendar day that keep the streak alive without completing a day. */
  practiceRepsForStreak: 3,
} as const;

/* ----------------------------------------------------------------------------
 * Charisma attributes (0–100)
 * score = curriculum points (day rewards) + practice points (diminishing returns)
 * Curriculum budget across 30 days ≈ 70 standard + 15 hardcore per attribute.
 * -------------------------------------------------------------------------- */

export type PracticeSource = CounterKey | 'words';

interface PracticeRule {
  weights: Partial<Record<PracticeSource, number>>;
  /** Weighted volume at which ~63% of the practice maximum is reached. */
  scale: number;
}

export const ATTRIBUTE_MAX = 100;
export const PRACTICE_MAX = 15;

export const ATTRIBUTE_PRACTICE: Record<AttributeKey, PracticeRule> = {
  initiative: { weights: { approaches: 1 }, scale: 40 },
  empathy: { weights: { kindnesses: 1, conversations: 0.5 }, scale: 25 },
  presence: { weights: { conversations: 1 }, scale: 20 },
  storytelling: { weights: { words: 1 }, scale: 1500 },
  resilience: { weights: { courageReps: 1 }, scale: 12 },
};

export interface AttributeInput {
  completedDays: Array<{ rewards: DayRewards; hardcore: boolean }>;
  counters: CounterTotals;
  totalWords: number;
}

export function practicePoints(attribute: AttributeKey, counters: CounterTotals, totalWords: number): number {
  const { weights, scale } = ATTRIBUTE_PRACTICE[attribute];
  let volume = 0;
  for (const source of Object.keys(weights) as PracticeSource[]) {
    const raw = source === 'words' ? totalWords : counters[source];
    volume += raw * (weights[source] ?? 0);
  }
  return PRACTICE_MAX * (1 - Math.exp(-volume / scale));
}

export function computeAttributes({ completedDays, counters, totalWords }: AttributeInput): AttributeScores {
  const scores = {} as AttributeScores;
  for (const key of ATTRIBUTE_KEYS) {
    let curriculum = 0;
    for (const { rewards, hardcore } of completedDays) {
      curriculum += rewards.attributes[key] ?? 0;
      if (hardcore) curriculum += rewards.hardcoreAttributes[key] ?? 0;
    }
    const total = curriculum + practicePoints(key, counters, totalWords);
    scores[key] = Math.min(ATTRIBUTE_MAX, Math.round(total));
  }
  return scores;
}
