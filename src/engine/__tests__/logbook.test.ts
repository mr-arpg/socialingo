import { describe, expect, it } from 'vitest';
import type { LogEntry } from '../../types';
import { getDay } from '../../content/days';
import {
  filterEntries,
  groupByChapter,
  logbookToMarkdown,
  logbookTotals,
  matchesQuery,
  sortedEntries,
  toDocEntry,
  weekForDay,
  weekRange,
} from '../logbook';

function entry(day: number, answer: string, overrides: Partial<LogEntry> = {}): LogEntry {
  const prompts = getDay(day)?.logbook ?? [];
  return {
    id: `e${day}`,
    day,
    createdAt: new Date(2026, 10, day, 21).toISOString(),
    updatedAt: new Date(2026, 10, day, 21).toISOString(),
    answers: Object.fromEntries(prompts.map((p, i) => [p.id, i === 0 ? answer : 'Fine.'])),
    confidence: 3,
    moods: [],
    wordCount: 10,
    ...overrides,
  };
}

const docs = (entries: LogEntry[]) =>
  sortedEntries(Object.fromEntries(entries.map((e) => [e.day, e]))).map((e) => toDocEntry(e, getDay));

describe('logbook document', () => {
  it('orders entries by day and answers by prompt order', () => {
    const result = docs([entry(9, 'Threads everywhere'), entry(2, 'Said something real')]);
    expect(result.map((e) => e.day)).toEqual([2, 9]);
    const prompts = getDay(2)!.logbook;
    expect(result[0].answers.map((a) => a.question)).toEqual(prompts.map((p) => p.question));
    expect(result[0].title).toBe(getDay(2)!.title);
  });

  it('keeps answers to prompts that no longer exist and drops blank ones', () => {
    const e = entry(1, 'Hello world', { answers: { ...entry(1, 'Hello world').answers, retired: 'Old answer', [getDay(1)!.logbook[1].id]: '   ' } });
    const [doc] = docs([e]);
    expect(doc.answers.some((a) => a.promptId === 'retired' && a.question === 'retired')).toBe(true);
    expect(doc.answers.some((a) => a.promptId === getDay(1)!.logbook[1].id)).toBe(false);
  });

  it('maps days to weeks, with a short fifth week', () => {
    expect([1, 7, 8, 14, 28, 29, 30].map(weekForDay)).toEqual([1, 1, 2, 2, 4, 5, 5]);
    expect(weekRange(5)).toEqual([29, 30]);
  });
});

describe('logbook filter and search', () => {
  const all = docs([
    entry(1, 'The barista smiled back', { moods: ['brave'] }),
    entry(5, 'A man said no and I survived', { moods: ['nervous'] }),
    entry(8, 'Café chat about hiking'),
  ]);

  it('filters by chapter and by week', () => {
    expect(filterEntries(all, { kind: 'chapter', chapter: 1 }, '').map((e) => e.day)).toEqual([1, 5]);
    expect(filterEntries(all, { kind: 'chapter', chapter: 2 }, '').map((e) => e.day)).toEqual([8]);
    expect(filterEntries(all, { kind: 'week', week: 2 }, '').map((e) => e.day)).toEqual([8]);
  });

  it('matches every term, case- and accent-insensitively, across answers, titles and moods', () => {
    expect(filterEntries(all, { kind: 'all' }, 'BARISTA smiled').map((e) => e.day)).toEqual([1]);
    expect(filterEntries(all, { kind: 'all' }, 'cafe').map((e) => e.day)).toEqual([8]);
    expect(filterEntries(all, { kind: 'all' }, 'nervous').map((e) => e.day)).toEqual([5]);
    expect(matchesQuery(all[0], 'barista hiking')).toBe(false);
    expect(matchesQuery(all[0], `day 1 ${getDay(1)!.title}`)).toBe(true);
    expect(filterEntries(all, { kind: 'chapter', chapter: 2 }, 'barista')).toEqual([]);
  });
});

describe('logbook export', () => {
  const all = docs([
    entry(1, 'The barista smiled back', { moods: ['brave', 'proud'], confidence: 2, energy: 4, wordCount: 20 }),
    entry(9, 'Followed a thread about climbing', { confidence: 4, wordCount: 30 }),
  ]);

  it('computes totals', () => {
    expect(logbookTotals(all)).toEqual({ entries: 2, words: 50, avgConfidence: 3 });
    expect(logbookTotals([]).avgConfidence).toBeNull();
  });

  it('groups by chapter, skipping empty chapters', () => {
    expect(groupByChapter(all).map((s) => s.chapter.id)).toEqual([1, 2]);
  });

  it('renders a clean Markdown document', () => {
    const md = logbookToMarkdown(all, { displayName: 'Rafael', exportedAt: new Date(2026, 10, 20) });
    expect(md.startsWith('# Field Logbook · Rafael\n')).toBe(true);
    expect(md).toContain('**Entries:** 2 · **Words:** 50 · **Average confidence:** 3.0/5');
    expect(md).toContain('## Chapter 1 · Breaking Inertia & Warm Presence');
    expect(md).toContain(`### Day 1 · ${getDay(1)!.title}`);
    expect(md).toContain('Confidence 2/5 (Uneasy) · Energy 4/5 (Energized)');
    expect(md).toContain('🦁 Brave, 🏅 Proud');
    expect(md).toContain(`**${getDay(1)!.logbook[0].question}**\n\nThe barista smiled back`);
    expect(md.indexOf('Day 1 ·')).toBeLessThan(md.indexOf('Day 9 ·'));
    expect(md).not.toContain('Chapter 3');
  });

  it('omits the owner when no name is set', () => {
    expect(logbookToMarkdown([], { displayName: '  ', exportedAt: new Date() }).split('\n')[0]).toBe('# Field Logbook');
  });
});
