import type { Chapter, ChapterId, DayContent, DayNumber, ISODateTime, LogEntry, MoodTag, Rating } from '../types';
import { CHAPTERS, CONFIDENCE_LABELS, ENERGY_LABELS, MOOD_META, chapterForDay } from '../content/chapters';
import { formatLongDate } from '../lib/dates';
import { formatNumber } from '../lib/text';

export type ContentLookup = (day: DayNumber) => DayContent | undefined;

export type LogbookFilter =
  | { kind: 'all' }
  | { kind: 'chapter'; chapter: ChapterId }
  | { kind: 'week'; week: number };

/** Days 29–30 make up a short fifth week. */
export const WEEK_COUNT = 5;

export function weekForDay(day: DayNumber): number {
  return Math.ceil(day / 7);
}

export function weekRange(week: number): [DayNumber, DayNumber] {
  return [(week - 1) * 7 + 1, Math.min(week * 7, 30)];
}

export interface LogbookAnswer {
  promptId: string;
  question: string;
  answer: string;
}

export interface LogbookDocEntry {
  day: DayNumber;
  title: string;
  chapter: ChapterId;
  writtenAt: ISODateTime;
  confidence: Rating;
  energy?: Rating;
  moods: MoodTag[];
  wordCount: number;
  answers: LogbookAnswer[];
}

export interface LogbookDocSection {
  chapter: Chapter;
  entries: LogbookDocEntry[];
}

export function sortedEntries(entries: Record<DayNumber, LogEntry>): LogEntry[] {
  return Object.values(entries).sort((a, b) => a.day - b.day);
}

/** Answers in prompt order; answers to prompts no longer in the content keep their id as the question. */
export function toDocEntry(entry: LogEntry, getContent: ContentLookup): LogbookDocEntry {
  const content = getContent(entry.day);
  const prompts = content?.logbook ?? [];
  const known = new Set(prompts.map((p) => p.id));
  const answers: LogbookAnswer[] = [
    ...prompts.map((p) => ({ promptId: p.id, question: p.question, answer: entry.answers[p.id] ?? '' })),
    ...Object.keys(entry.answers)
      .filter((id) => !known.has(id))
      .map((id) => ({ promptId: id, question: id, answer: entry.answers[id] })),
  ].filter((a) => a.answer.trim().length > 0);

  return {
    day: entry.day,
    title: content?.title ?? `Day ${entry.day}`,
    chapter: chapterForDay(entry.day).id,
    writtenAt: entry.createdAt,
    confidence: entry.confidence,
    energy: entry.energy,
    moods: entry.moods,
    wordCount: entry.wordCount,
    answers,
  };
}

export function matchesFilter(entry: LogbookDocEntry, filter: LogbookFilter): boolean {
  if (filter.kind === 'chapter') return entry.chapter === filter.chapter;
  if (filter.kind === 'week') return weekForDay(entry.day) === filter.week;
  return true;
}

function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
}

export function searchTerms(query: string): string[] {
  return normalize(query).split(/\s+/).filter(Boolean);
}

/** Every term must appear somewhere in the entry: title, answers, or mood labels. */
export function matchesQuery(entry: LogbookDocEntry, query: string): boolean {
  const terms = searchTerms(query);
  if (!terms.length) return true;
  const haystack = normalize(
    [
      `day ${entry.day}`,
      entry.title,
      ...entry.answers.map((a) => a.answer),
      ...entry.moods.map((m) => MOOD_META[m].label),
    ].join('\n'),
  );
  return terms.every((term) => haystack.includes(term));
}

export function filterEntries(entries: readonly LogbookDocEntry[], filter: LogbookFilter, query: string): LogbookDocEntry[] {
  return entries.filter((e) => matchesFilter(e, filter) && matchesQuery(e, query));
}

export function groupByChapter(entries: readonly LogbookDocEntry[]): LogbookDocSection[] {
  return CHAPTERS.map((chapter) => ({ chapter, entries: entries.filter((e) => e.chapter === chapter.id) })).filter(
    (s) => s.entries.length > 0,
  );
}

export interface LogbookTotals {
  entries: number;
  words: number;
  avgConfidence: number | null;
}

export function logbookTotals(entries: readonly LogbookDocEntry[]): LogbookTotals {
  const words = entries.reduce((sum, e) => sum + e.wordCount, 0);
  const avgConfidence = entries.length ? entries.reduce((sum, e) => sum + e.confidence, 0) / entries.length : null;
  return { entries: entries.length, words, avgConfidence };
}

export function ratingLine(entry: LogbookDocEntry): string {
  const parts = [`Confidence ${entry.confidence}/5 (${CONFIDENCE_LABELS[entry.confidence - 1]})`];
  if (entry.energy) parts.push(`Energy ${entry.energy}/5 (${ENERGY_LABELS[entry.energy - 1]})`);
  return parts.join(' · ');
}

export function moodLine(moods: readonly MoodTag[]): string {
  return moods.map((m) => `${MOOD_META[m].emoji} ${MOOD_META[m].label}`).join(', ');
}

export interface MarkdownOptions {
  displayName: string;
  exportedAt: Date;
}

export function logbookToMarkdown(entries: readonly LogbookDocEntry[], { displayName, exportedAt }: MarkdownOptions): string {
  const totals = logbookTotals(entries);
  const owner = displayName.trim();
  const lines: string[] = [
    `# Field Logbook${owner ? ` · ${owner}` : ''}`,
    '',
    `_Socialingo · exported ${formatLongDate(exportedAt.toISOString())}_`,
    '',
    `**Entries:** ${totals.entries} · **Words:** ${formatNumber(totals.words)} · **Average confidence:** ${
      totals.avgConfidence === null ? 'n/a' : `${totals.avgConfidence.toFixed(1)}/5`
    }`,
  ];

  for (const section of groupByChapter(entries)) {
    lines.push('', '---', '', `## Chapter ${section.chapter.id} · ${section.chapter.title}`);
    for (const entry of section.entries) {
      const meta = [formatLongDate(entry.writtenAt), ratingLine(entry)];
      if (entry.moods.length) meta.push(moodLine(entry.moods));
      lines.push('', `### Day ${entry.day} · ${entry.title}`, '', `_${meta.join(' · ')}_`);
      for (const answer of entry.answers) {
        lines.push('', `**${answer.question}**`, '', answer.answer.trim());
      }
    }
  }

  return `${lines.join('\n')}\n`;
}
