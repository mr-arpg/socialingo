import { describe, expect, it } from 'vitest';
import { createInitialState } from '../../store/initialState';
import { clampStateForCloud, hasProgress, mergePersistedStates, stripUndefinedDeep } from '../mergeState';

describe('mergeState', () => {
  it('detects progress accurately', () => {
    const empty = createInitialState(new Date('2026-11-01T10:00:00Z'));
    expect(hasProgress(empty)).toBe(false);

    const withRep = {
      ...empty,
      repEvents: [{ id: 'r1', counter: 'approaches' as const, at: '2026-11-01T10:05:00Z', day: 1 }],
    };
    expect(hasProgress(withRep)).toBe(true);
  });

  it('merges days, log entries, events, chests, and badges from two devices without loss', () => {
    const base = createInitialState(new Date('2026-11-01T10:00:00Z'));
    const local = {
      ...base,
      profile: { displayName: 'LocalName', createdAt: '2026-11-01T10:00:00Z' },
      days: {
        1: {
          day: 1,
          unlockedAt: '2026-11-01T10:00:00Z',
          cardResults: { c1: { firstTryCorrect: false, answeredAt: '2026-11-01T10:02:00Z' } },
          standardChecklist: [true, false],
          hardcoreChecklist: [false],
          completedAt: '2026-11-01T12:00:00Z',
        },
      },
      logEntries: {
        1: {
          id: 'l1',
          day: 1,
          createdAt: '2026-11-01T11:00:00Z',
          updatedAt: '2026-11-01T11:00:00Z',
          answers: { q1: 'old local answer' },
          confidence: 3 as const,
          moods: ['nervous' as const],
          wordCount: 3,
        },
      },
      repEvents: [{ id: 'rep-1', counter: 'approaches' as const, at: '2026-11-01T10:10:00Z', day: 1 }],
      xpEvents: [{ id: 'xp-1', at: '2026-11-01T10:10:00Z', amount: 15, source: 'rep' as const, day: 1 }],
      openedChests: [1 as const],
      unlockedBadges: { first_step: '2026-11-01T12:00:00Z' },
    };

    const remote = {
      ...base,
      profile: { displayName: 'CloudName', createdAt: '2026-11-02T10:00:00Z' },
      days: {
        1: {
          day: 1,
          unlockedAt: '2026-11-01T09:00:00Z',
          cardResults: { c1: { firstTryCorrect: true, answeredAt: '2026-11-01T10:03:00Z' } },
          standardChecklist: [false, true],
          hardcoreChecklist: [true],
        },
        2: {
          day: 2,
          unlockedAt: '2026-11-02T09:00:00Z',
          cardResults: {},
          standardChecklist: [true],
          hardcoreChecklist: [],
        },
      },
      logEntries: {
        1: {
          id: 'l1',
          day: 1,
          createdAt: '2026-11-01T11:30:00Z',
          updatedAt: '2026-11-02T08:00:00Z',
          answers: { q1: 'newer cloud answer here' },
          confidence: 4 as const,
          moods: ['brave' as const],
          wordCount: 4,
        },
      },
      repEvents: [
        { id: 'rep-1', counter: 'approaches' as const, at: '2026-11-01T10:10:00Z', day: 1 },
        { id: 'rep-2', counter: 'kindnesses' as const, at: '2026-11-02T10:10:00Z', day: 2 },
      ],
      xpEvents: [
        { id: 'xp-1', at: '2026-11-01T10:10:00Z', amount: 15, source: 'rep' as const, day: 1 },
        { id: 'xp-2', at: '2026-11-02T10:10:00Z', amount: 25, source: 'mission' as const, day: 2 },
      ],
      openedChests: [1 as const, 2 as const],
      unlockedBadges: { streak_3: '2026-11-02T12:00:00Z' },
    };

    const merged = mergePersistedStates(local, remote);
    expect(merged.profile.displayName).toBe('CloudName');
    expect(merged.profile.createdAt).toBe('2026-11-01T10:00:00Z');
    expect(Object.keys(merged.days)).toEqual(['1', '2']);
    expect(merged.days[1].unlockedAt).toBe('2026-11-01T09:00:00Z');
    expect(merged.days[1].standardChecklist).toEqual([true, true]);
    expect(merged.days[1].hardcoreChecklist).toEqual([true]);
    expect(merged.days[1].cardResults.c1.firstTryCorrect).toBe(true);
    expect(merged.days[1].completedAt).toBe('2026-11-01T12:00:00Z');
    expect(merged.logEntries[1].answers.q1).toBe('newer cloud answer here');
    expect(merged.logEntries[1].createdAt).toBe('2026-11-01T11:00:00Z');
    expect(merged.repEvents).toHaveLength(2);
    expect(merged.xpEvents).toHaveLength(2);
    expect(merged.openedChests).toEqual([1, 2]);
    expect(Object.keys(merged.unlockedBadges)).toEqual(['first_step', 'streak_3']);
  });

  it('strips undefined fields and clamps displayName for Firestore', () => {
    const base = createInitialState();
    const dirty = {
      ...base,
      profile: { ...base.profile, displayName: 'A'.repeat(150) },
      xpEvents: [{ id: 'x1', at: '2026-11-01T00:00:00Z', amount: 10, source: 'rep' as const, day: null, refId: undefined }],
    };
    const cleaned = clampStateForCloud(dirty);
    expect(cleaned.profile.displayName).toHaveLength(100);
    expect('refId' in cleaned.xpEvents[0]).toBe(false);
    expect(stripUndefinedDeep({ a: 1, b: undefined, c: [{ d: undefined, e: 2 }] })).toEqual({ a: 1, c: [{ e: 2 }] });
  });

  it('eliminates sparse checklist holes and strips extra nested keys for Firestore', () => {
    const base = createInitialState(new Date('2026-11-01T10:00:00Z'));
    const sparseArr: boolean[] = [];
    sparseArr[2] = true;
    const dirty = {
      ...base,
      profile: { ...base.profile, extraKey: 'bad' } as unknown as typeof base.profile,
      settings: { ...base.settings, extraSetting: 123 } as unknown as typeof base.settings,
      days: {
        1: {
          day: 1,
          unlockedAt: '2026-11-01T10:00:00Z',
          cardResults: {},
          standardChecklist: sparseArr,
          hardcoreChecklist: [],
        },
      },
    };
    const cleaned = clampStateForCloud(dirty);
    expect(Object.keys(cleaned.profile)).toEqual(['displayName', 'createdAt']);
    expect(Object.keys(cleaned.settings)).toEqual(['theme', 'sound', 'haptics', 'motion']);
    expect(cleaned.days[1].standardChecklist).toEqual([false, false, true]);
  });
});
