import { describe, expect, it } from 'vitest';
import { BADGES } from '../../content/badges';
import { DAYS } from '../../content/days';
import { radarPoints, sparkline } from '../../lib/charts';
import { createInitialState } from '../../store/initialState';
import { badgeProgress, closestBadges, formatBadgeValue, progressRatio } from '../badges';
import { computeStats } from '../stats';

const TODAY = '2026-11-18';

describe('badge display helpers', () => {
  const base = computeStats(createInitialState(new Date(2026, 10, 18)), DAYS, TODAY);
  const stats = { ...base, counters: { ...base.counters, approaches: 20, courageReps: 1 }, totalInteractions: 21 };

  it('ranks locked badges by how close they are', () => {
    const closest = closestBadges(BADGES, stats, { 'first-hello': TODAY, 'brave-start': TODAY }, 3);
    expect(closest.map((c) => c.badge.id)).toEqual(['icebreaker', 'open-door', 'people-person']);
    expect(closest.every((c) => !c.progress.unlocked)).toBe(true);
  });

  it('ignores badges with no progress, including the starting level', () => {
    expect(closestBadges(BADGES, base, {}, 10)).toEqual([]);
  });

  it('clamps negative progress and formats values', () => {
    const rising = BADGES.find((b) => b.id === 'rising-confidence')!;
    const progress = badgeProgress(rising, { ...base, confidenceDelta: -0.5 });
    expect(progressRatio(progress)).toBe(0);
    expect(formatBadgeValue(rising.criterion, -0.5)).toBe('−0.5');
    expect(formatBadgeValue(rising.criterion, 1)).toBe('+1.0');
    const chronicler = BADGES.find((b) => b.id === 'chronicler')!;
    expect(formatBadgeValue(chronicler.criterion, 999.6)).toBe('999');
    expect(formatBadgeValue(chronicler.criterion, 1000)).toBe('1,000');
  });
});

describe('chart geometry', () => {
  it('places radar values along their axes', () => {
    const [top, , , , last] = radarPoints([100, 50, 0, 0, 200], 100, 100, 100, 80);
    expect(top[0]).toBeCloseTo(100);
    expect(top[1]).toBeCloseTo(20);
    expect(last[1]).toBeLessThan(100);
    const [, , zero] = radarPoints([100, 50, 0, 0, 0], 100, 100, 100, 80);
    expect(zero).toEqual([100, 100]);
  });

  it('scales sparkline points into the box', () => {
    const { points, line } = sparkline([1, 5, 3], 100, 50, 1, 5, 5);
    expect(points[0]).toEqual([5, 45]);
    expect(points[1]).toEqual([50, 5]);
    expect(points[2]).toEqual([95, 25]);
    expect(line.startsWith('M5.0 45.0')).toBe(true);
    expect(sparkline([4], 100, 50, 1, 5).points[0][0]).toBe(50);
  });
});
