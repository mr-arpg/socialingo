import { describe, expect, it } from 'vitest';
import type { DailyActivity } from '../../types';
import { buildHeatmap, earliestDate, heatLevel, heatmapWeeks, MAX_HEATMAP_WEEKS, MIN_HEATMAP_WEEKS } from '../heatmap';

const TODAY = '2026-11-18'; // a Wednesday

function day(date: string, xp: number, extra: Partial<DailyActivity> = {}): DailyActivity {
  return { date, xp, reps: 0, completedDay: null, frozen: false, ...extra };
}

describe('heatmap', () => {
  it('buckets daily XP into five levels', () => {
    expect([0, 1, 29, 30, 79, 80, 149, 150, 900].map(heatLevel)).toEqual([0, 1, 1, 2, 2, 3, 3, 4, 4]);
  });

  it('builds Monday-first columns ending with the current week', () => {
    const weeks = buildHeatmap({}, TODAY, 3);
    expect(weeks).toHaveLength(3);
    expect(weeks.every((w) => w.cells.length === 7)).toBe(true);
    expect(weeks[2].start).toBe('2026-11-16');
    expect(weeks[0].start).toBe('2026-11-02');
    const last = weeks[2].cells;
    expect(last[2]).toMatchObject({ date: TODAY, future: false });
    expect(last[3]).toMatchObject({ date: '2026-11-19', future: true });
  });

  it('places activity on the right cells', () => {
    const weeks = buildHeatmap(
      { '2026-11-17': day('2026-11-17', 94, { reps: 6, completedDay: 1 }), '2026-11-10': day('2026-11-10', 0, { frozen: true }) },
      TODAY,
      2,
    );
    expect(weeks[1].cells[1]).toMatchObject({ level: 3, xp: 94, reps: 6, completedDay: 1 });
    expect(weeks[0].cells[1]).toMatchObject({ level: 0, frozen: true });
  });

  it('shows enough weeks to reach the first day, within bounds', () => {
    expect(heatmapWeeks('2026-11-01', TODAY)).toBe(MIN_HEATMAP_WEEKS);
    expect(heatmapWeeks('2026-01-05', TODAY)).toBe(46);
    expect(buildHeatmap({}, TODAY, 46)[0].start).toBe('2026-01-05');
    expect(heatmapWeeks('2024-01-01', TODAY)).toBe(MAX_HEATMAP_WEEKS);
  });

  it('finds the earliest date', () => {
    expect(earliestDate(['2026-11-10', '2026-10-02'], '2026-11-01')).toBe('2026-10-02');
    expect(earliestDate([], '2026-11-01')).toBe('2026-11-01');
  });
});
