import { describe, expect, it } from 'vitest';
import { BADGES } from '../../content/badges';
import { DAYS, validateCurriculum } from '../../content/days';
import { createBackup, parseBackup } from '../../store/backup';
import { createInitialState } from '../../store/initialState';
import { importLegacyProgress, LEGACY_STORAGE_KEY } from '../../store/migrations';
import { badgeProgress } from '../badges';
import { computeStats } from '../stats';

describe('curriculum', () => {
  it('passes structural validation', () => {
    expect(validateCurriculum(DAYS)).toEqual([]);
  });

  it('has unique badge ids', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });

  it('reports badge progress against fresh stats', () => {
    const stats = computeStats(createInitialState(), DAYS, '2026-11-18');
    const firstHello = BADGES.find((b) => b.id === 'first-hello')!;
    expect(badgeProgress(firstHello, stats)).toEqual({ current: 0, target: 1, start: 0, unlocked: false });
    const catalyst = BADGES.find((b) => b.id === 'social-catalyst')!;
    expect(badgeProgress(catalyst, stats)).toMatchObject({ current: 1, start: 1, target: 10 });
  });
});

describe('backup', () => {
  it('round-trips a state and recomputes word counts', () => {
    const state = createInitialState();
    state.logEntries[1] = {
      id: 'x',
      day: 1,
      createdAt: '2026-11-18T09:00:00.000Z',
      updatedAt: '2026-11-18T09:00:00.000Z',
      answers: { a: 'three little words' },
      confidence: 4,
      moods: ['proud'],
      wordCount: 999,
    };
    const result = parseBackup(JSON.stringify(createBackup(state)));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state.logEntries[1].wordCount).toBe(3);
  });

  it('rejects files that are not backups', () => {
    expect(parseBackup('not json').ok).toBe(false);
    expect(parseBackup(JSON.stringify({ hello: 'world' })).ok).toBe(false);
  });
});

describe('legacy migration', () => {
  it('imports completed days from the original app once', () => {
    const store = new Map<string, string>([[LEGACY_STORAGE_KEY, JSON.stringify({ completedDays: [1, 2], lastCompletionTime: 0 })]]);
    const storage = {
      getItem: (k: string) => store.get(k) ?? null,
      removeItem: (k: string) => void store.delete(k),
    } as unknown as Storage;

    const state = importLegacyProgress(createInitialState(), storage);
    expect(Object.keys(state.days)).toEqual(['1', '2']);
    expect(state.days[1].completedAt).toBeDefined();
    expect(state.xpEvents).toEqual([]);
    expect(store.has(LEGACY_STORAGE_KEY)).toBe(false);
  });
});
