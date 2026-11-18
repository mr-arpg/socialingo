import { describe, expect, it } from 'vitest';
import { addDays } from '../../lib/dates';
import { computeStreak } from '../streak';

const START = '2026-11-01';
const run = (offsets: number[]) => new Set(offsets.map((o) => addDays(START, o)));

describe('computeStreak', () => {
  it('is empty with no activity', () => {
    expect(computeStreak(new Set(), START)).toEqual({ current: 0, longest: 0, freezes: 1, frozenDates: [] });
  });

  it('counts consecutive days and keeps the streak alive until today ends', () => {
    const result = computeStreak(run([0, 1, 2]), addDays(START, 3));
    expect(result.current).toBe(3);
    expect(result.frozenDates).toEqual([]);
  });

  it('consumes a freeze for a single missed day', () => {
    const result = computeStreak(run([0, 1, 3]), addDays(START, 3));
    expect(result.current).toBe(3);
    expect(result.freezes).toBe(0);
    expect(result.frozenDates).toEqual([addDays(START, 2)]);
  });

  it('breaks the streak once freezes run out', () => {
    const result = computeStreak(run([0, 1, 4]), addDays(START, 4));
    expect(result.current).toBe(1);
    expect(result.longest).toBe(2);
  });

  it('earns a freeze every 7 streak days, capped at 2', () => {
    const fourteen = run(Array.from({ length: 14 }, (_, i) => i));
    expect(computeStreak(fourteen, addDays(START, 13)).freezes).toBe(2);
    const twentyOne = run(Array.from({ length: 21 }, (_, i) => i));
    expect(computeStreak(twentyOne, addDays(START, 20)).freezes).toBe(2);
  });

  it('ignores activity dated after today', () => {
    expect(computeStreak(run([0, 5]), START).current).toBe(1);
  });
});
