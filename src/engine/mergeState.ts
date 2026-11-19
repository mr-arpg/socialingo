import type {
  CardResult,
  ChapterId,
  DayNumber,
  DayProgress,
  LogEntry,
  PersistedState,
  RepEvent,
  XpEvent,
} from '../types';
import { normalizeState } from '../store/initialState';
import { countWords } from '../lib/text';

export const MAX_DISPLAY_NAME_LENGTH = 100;
export const MAX_REP_EVENTS = 5000;
export const MAX_XP_EVENTS = 5000;
export const MAX_OPENED_CHESTS = 4;

export function hasProgress(state: PersistedState): boolean {
  return (
    Object.keys(state.days).length > 0 ||
    Object.keys(state.logEntries).length > 0 ||
    state.repEvents.length > 0 ||
    state.xpEvents.length > 0 ||
    state.openedChests.length > 0 ||
    Object.keys(state.unlockedBadges).length > 0
  );
}

function earlierIso(a?: string, b?: string): string | undefined {
  if (!a) return b;
  if (!b) return a;
  return a <= b ? a : b;
}

function mergeChecklists(a: boolean[] = [], b: boolean[] = []): boolean[] {
  const len = Math.max(a.length, b.length);
  const out: boolean[] = [];
  for (let i = 0; i < len; i++) {
    out.push(Boolean(a[i] || b[i]));
  }
  return out;
}

function mergeDayProgress(a: DayProgress, b: DayProgress): DayProgress {
  const cardResults: Record<string, CardResult> = { ...a.cardResults };
  for (const [cardId, resB] of Object.entries(b.cardResults)) {
    const resA = cardResults[cardId];
    if (!resA) {
      cardResults[cardId] = resB;
    } else {
      cardResults[cardId] = {
        firstTryCorrect: resA.firstTryCorrect || resB.firstTryCorrect,
        answeredAt: earlierIso(resA.answeredAt, resB.answeredAt) ?? resA.answeredAt,
      };
    }
  }

  const merged: DayProgress = {
    day: a.day,
    unlockedAt: earlierIso(a.unlockedAt, b.unlockedAt) ?? a.unlockedAt,
    cardResults,
    standardChecklist: mergeChecklists(a.standardChecklist, b.standardChecklist),
    hardcoreChecklist: mergeChecklists(a.hardcoreChecklist, b.hardcoreChecklist),
  };

  const briefingCompletedAt = earlierIso(a.briefingCompletedAt, b.briefingCompletedAt);
  if (briefingCompletedAt) merged.briefingCompletedAt = briefingCompletedAt;

  const missionCompletedAt = earlierIso(a.missionCompletedAt, b.missionCompletedAt);
  if (missionCompletedAt) merged.missionCompletedAt = missionCompletedAt;

  const hardcoreCompletedAt = earlierIso(a.hardcoreCompletedAt, b.hardcoreCompletedAt);
  if (hardcoreCompletedAt) merged.hardcoreCompletedAt = hardcoreCompletedAt;

  const completedAt = earlierIso(a.completedAt, b.completedAt);
  if (completedAt) merged.completedAt = completedAt;

  return merged;
}

function mergeLogEntry(a: LogEntry, b: LogEntry): LogEntry {
  const newer = b.updatedAt > a.updatedAt ? b : a;
  const createdAt = earlierIso(a.createdAt, b.createdAt) ?? newer.createdAt;
  const wordCount = Object.values(newer.answers).reduce((sum, text) => sum + countWords(text), 0);
  return {
    ...newer,
    createdAt,
    wordCount,
  };
}

function mergeById<T extends { id: string; at: string }>(a: T[], b: T[], limit: number): T[] {
  const map = new Map<string, T>();
  for (const item of a) map.set(item.id, item);
  for (const item of b) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  const merged = Array.from(map.values()).sort((x, y) => x.at.localeCompare(y.at));
  return merged.length > limit ? merged.slice(merged.length - limit) : merged;
}

/**
 * Deterministically merges a local and remote PersistedState without losing progress from either device.
 */
export function mergePersistedStates(localRaw: PersistedState, remoteRaw: PersistedState): PersistedState {
  const local = normalizeState(localRaw);
  const remote = normalizeState(remoteRaw);

  const days: Record<DayNumber, DayProgress> = {};
  const allDayKeys = new Set([...Object.keys(local.days), ...Object.keys(remote.days)]);
  for (const key of allDayKeys) {
    const dayNum = Number(key) as DayNumber;
    const a = local.days[dayNum];
    const b = remote.days[dayNum];
    if (a && b) days[dayNum] = mergeDayProgress(a, b);
    else if (a) days[dayNum] = a;
    else if (b) days[dayNum] = b;
  }

  const logEntries: Record<DayNumber, LogEntry> = {};
  const allLogKeys = new Set([...Object.keys(local.logEntries), ...Object.keys(remote.logEntries)]);
  for (const key of allLogKeys) {
    const dayNum = Number(key) as DayNumber;
    const a = local.logEntries[dayNum];
    const b = remote.logEntries[dayNum];
    if (a && b) logEntries[dayNum] = mergeLogEntry(a, b);
    else if (a) logEntries[dayNum] = a;
    else if (b) logEntries[dayNum] = b;
  }

  const repEvents = mergeById<RepEvent>(local.repEvents, remote.repEvents, MAX_REP_EVENTS);
  const xpEvents = mergeById<XpEvent>(local.xpEvents, remote.xpEvents, MAX_XP_EVENTS);

  const chestSet = new Set<ChapterId>([...local.openedChests, ...remote.openedChests]);
  const openedChests = Array.from(chestSet)
    .sort((x, y) => x - y)
    .slice(0, MAX_OPENED_CHESTS);

  const unlockedBadges: Record<string, string> = { ...local.unlockedBadges };
  for (const [badgeId, unlockedAt] of Object.entries(remote.unlockedBadges)) {
    unlockedBadges[badgeId] = earlierIso(unlockedBadges[badgeId], unlockedAt) ?? unlockedAt;
  }

  const displayName = (remote.profile.displayName || local.profile.displayName).slice(0, MAX_DISPLAY_NAME_LENGTH);
  const createdAt = earlierIso(local.profile.createdAt, remote.profile.createdAt) ?? local.profile.createdAt;

  return normalizeState({
    schemaVersion: local.schemaVersion,
    profile: { displayName, createdAt },
    settings: remote.settings,
    days,
    logEntries,
    repEvents,
    xpEvents,
    openedChests,
    unlockedBadges,
  });
}

/** Recursively removes `undefined` properties and sparse array holes so Firestore writes never reject optional fields. */
export function stripUndefinedDeep<T>(value: T): T {
  if (Array.isArray(value)) {
    const out: unknown[] = [];
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] !== undefined) {
        out.push(stripUndefinedDeep(value[i]));
      }
    }
    return out as unknown as T;
  }
  if (value !== null && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = stripUndefinedDeep(v);
      }
    }
    return out as T;
  }
  return value;
}

export function clampStateForCloud(state: PersistedState): PersistedState {
  const normalized = normalizeState(state);

  const days: Record<DayNumber, DayProgress> = {};
  for (const [k, dayProgress] of Object.entries(normalized.days).slice(0, 30)) {
    const dayNum = Number(k) as DayNumber;
    days[dayNum] = {
      ...dayProgress,
      standardChecklist: Array.from(dayProgress.standardChecklist ?? [], (v) => Boolean(v)),
      hardcoreChecklist: Array.from(dayProgress.hardcoreChecklist ?? [], (v) => Boolean(v)),
    };
  }

  const logEntries: Record<DayNumber, LogEntry> = {};
  for (const [k, entry] of Object.entries(normalized.logEntries).slice(0, 30)) {
    logEntries[Number(k) as DayNumber] = entry;
  }

  const repEvents = (
    normalized.repEvents.length > MAX_REP_EVENTS
      ? normalized.repEvents.slice(normalized.repEvents.length - MAX_REP_EVENTS)
      : normalized.repEvents
  ).map((e) => ({
    id: String(e.id).slice(0, 128),
    counter: e.counter,
    at: String(e.at).slice(0, 64),
    day: e.day ?? null,
  }));

  const xpEvents = (
    normalized.xpEvents.length > MAX_XP_EVENTS
      ? normalized.xpEvents.slice(normalized.xpEvents.length - MAX_XP_EVENTS)
      : normalized.xpEvents
  ).map((e) => ({
    id: String(e.id).slice(0, 128),
    at: String(e.at).slice(0, 64),
    amount: e.amount,
    source: e.source,
    day: e.day ?? null,
    ...(typeof e.refId === 'string' && e.refId.length > 0 ? { refId: e.refId.slice(0, 128) } : {}),
  }));

  const unlockedBadges: Record<string, string> = {};
  for (const [badgeId, at] of Object.entries(normalized.unlockedBadges).slice(0, 100)) {
    unlockedBadges[badgeId] = at;
  }

  return stripUndefinedDeep({
    schemaVersion: normalized.schemaVersion,
    profile: {
      displayName: String(normalized.profile.displayName ?? '').slice(0, MAX_DISPLAY_NAME_LENGTH),
      createdAt: String(normalized.profile.createdAt ?? new Date().toISOString()).slice(0, 64),
    },
    settings: {
      theme: normalized.settings.theme,
      sound: Boolean(normalized.settings.sound),
      haptics: Boolean(normalized.settings.haptics),
      motion: normalized.settings.motion,
    },
    days,
    logEntries,
    repEvents,
    xpEvents,
    openedChests: normalized.openedChests.slice(0, MAX_OPENED_CHESTS),
    unlockedBadges,
  });
}

export function statesEqual(a: PersistedState, b: PersistedState): boolean {
  return JSON.stringify(stripUndefinedDeep(normalizeState(a))) === JSON.stringify(stripUndefinedDeep(normalizeState(b)));
}
