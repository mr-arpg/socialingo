import { describe, expect, it } from 'vitest';
import {
  cappedRepXp,
  computeAttributes,
  levelForXp,
  levelProgress,
  logEntryXp,
  rankForLevel,
  streakBonusXp,
  totalXpForLevel,
} from '../progression';

const ZERO = { approaches: 0, conversations: 0, kindnesses: 0, courageReps: 0 };

describe('levels', () => {
  it('follows 50·L·(L−1) cumulative XP', () => {
    expect([1, 2, 3, 5, 10].map(totalXpForLevel)).toEqual([0, 100, 300, 1000, 4500]);
  });

  it('maps XP to levels exactly at boundaries', () => {
    expect(levelForXp(0)).toBe(1);
    expect(levelForXp(99)).toBe(1);
    expect(levelForXp(100)).toBe(2);
    expect(levelForXp(4499)).toBe(9);
    expect(levelForXp(4500)).toBe(10);
    expect(levelForXp(-50)).toBe(1);
  });

  it('reports progress within the current level', () => {
    const p = levelProgress(400);
    expect(p).toMatchObject({ level: 3, xpIntoLevel: 100, xpForNextLevel: 300 });
    expect(p.progress).toBeCloseTo(1 / 3);
  });

  it('assigns ranks by minimum level', () => {
    expect(rankForLevel(1).id).toBe('observer');
    expect(rankForLevel(4).id).toBe('icebreaker');
    expect(rankForLevel(10).title).toBe('Social Catalyst');
    expect(rankForLevel(40).id).toBe('luminary');
  });
});

describe('xp rules', () => {
  it('pays courage reps more than ordinary reps and enforces the daily cap', () => {
    expect(cappedRepXp('approaches', 0)).toBe(2);
    expect(cappedRepXp('courageReps', 0)).toBe(5);
    expect(cappedRepXp('courageReps', 58)).toBe(2);
    expect(cappedRepXp('approaches', 60)).toBe(0);
  });

  it('gives a capped word bonus for logbook entries', () => {
    expect(logEntryXp(0)).toBe(15);
    expect(logEntryXp(100)).toBe(20);
    expect(logEntryXp(10_000)).toBe(30);
  });

  it('caps the streak bonus', () => {
    expect(streakBonusXp(1)).toBe(2);
    expect(streakBonusXp(30)).toBe(20);
  });
});

describe('attributes', () => {
  it('sums curriculum rewards and only adds hardcore rewards for hardcore days', () => {
    const rewards = { xp: 50, hardcoreXp: 30, attributes: { initiative: 4 }, hardcoreAttributes: { initiative: 2 } };
    const standard = computeAttributes({ completedDays: [{ rewards, hardcore: false }], counters: ZERO, totalWords: 0 });
    const hardcore = computeAttributes({ completedDays: [{ rewards, hardcore: true }], counters: ZERO, totalWords: 0 });
    expect(standard.initiative).toBe(4);
    expect(hardcore.initiative).toBe(6);
    expect(standard.empathy).toBe(0);
  });

  it('adds practice points with diminishing returns, never above 100', () => {
    const some = computeAttributes({ completedDays: [], counters: { ...ZERO, courageReps: 12 }, totalWords: 0 });
    const lots = computeAttributes({ completedDays: [], counters: { ...ZERO, courageReps: 10_000 }, totalWords: 0 });
    expect(some.resilience).toBe(9);
    expect(lots.resilience).toBe(15);

    const maxed = computeAttributes({
      completedDays: [{ rewards: { xp: 0, hardcoreXp: 0, attributes: { presence: 200 }, hardcoreAttributes: {} }, hardcore: false }],
      counters: ZERO,
      totalWords: 0,
    });
    expect(maxed.presence).toBe(100);
  });
});
