import { z } from 'zod';
import type { BackupFile, PersistedState } from '../types';
import { COUNTER_KEYS, MOOD_TAGS, SCHEMA_VERSION } from '../types';
import { countWords } from '../lib/text';
import { normalizeState } from './initialState';

const rating = z.number().int().min(1).max(5);
const chapterId = z.number().int().min(1).max(4);
const dayNumber = z.number().int().min(1).max(30);

const dayProgress = z.object({
  day: dayNumber,
  unlockedAt: z.string(),
  briefingCompletedAt: z.string().optional(),
  cardResults: z.record(z.string(), z.object({ firstTryCorrect: z.boolean(), answeredAt: z.string() })),
  standardChecklist: z.array(z.boolean()),
  hardcoreChecklist: z.array(z.boolean()),
  missionCompletedAt: z.string().optional(),
  hardcoreCompletedAt: z.string().optional(),
  completedAt: z.string().optional(),
});

const logEntry = z.object({
  id: z.string(),
  day: dayNumber,
  createdAt: z.string(),
  updatedAt: z.string(),
  answers: z.record(z.string(), z.string()),
  confidence: rating,
  energy: rating.optional(),
  moods: z.array(z.enum(MOOD_TAGS)),
  wordCount: z.number().int().min(0),
});

const persistedState = z.object({
  schemaVersion: z.number().int(),
  profile: z.object({ displayName: z.string(), createdAt: z.string() }),
  settings: z.object({
    theme: z.enum(['light', 'dark', 'system']),
    sound: z.boolean(),
    haptics: z.boolean(),
    motion: z.enum(['system', 'reduced', 'full']),
    pacing: z.enum(['daily', 'free']),
  }),
  days: z.record(z.string(), dayProgress),
  logEntries: z.record(z.string(), logEntry),
  repEvents: z.array(
    z.object({ id: z.string(), counter: z.enum(COUNTER_KEYS), at: z.string(), day: dayNumber.nullable() }),
  ),
  xpEvents: z.array(
    z.object({
      id: z.string(),
      at: z.string(),
      amount: z.number(),
      source: z.enum([
        'briefing',
        'quiz',
        'scenario',
        'mission',
        'hardcore',
        'rep',
        'logEntry',
        'streakBonus',
        'chapterChest',
      ]),
      day: dayNumber.nullable(),
      refId: z.string().optional(),
    }),
  ),
  openedChests: z.array(chapterId),
  unlockedBadges: z.record(z.string(), z.string()),
});

const backupFile = z.object({
  app: z.literal('30day-challenge'),
  schemaVersion: z.number().int(),
  exportedAt: z.string(),
  state: persistedState,
});

export function createBackup(state: PersistedState, now: Date = new Date()): BackupFile {
  return { app: '30day-challenge', schemaVersion: SCHEMA_VERSION, exportedAt: now.toISOString(), state };
}

export type ParseResult = { ok: true; state: PersistedState } | { ok: false; error: string };

export function parseBackup(json: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return { ok: false, error: 'This file is not valid JSON.' };
  }
  const parsed = backupFile.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `This doesn't look like a 30-Day Challenge backup (${issue?.path.join('.') || 'root'}).` };
  }
  if (parsed.data.schemaVersion > SCHEMA_VERSION) {
    return { ok: false, error: 'This backup was made by a newer version of the app. Update the app and try again.' };
  }

  const state = normalizeState(parsed.data.state as PersistedState);
  for (const entry of Object.values(state.logEntries)) {
    entry.wordCount = Object.values(entry.answers).reduce((sum, text) => sum + countWords(text), 0);
  }
  return { ok: true, state };
}
