import type { LegacyProgressV0, PersistedState } from '../types';

export const LEGACY_STORAGE_KEY = 'social-challenge-progress';

/** Imports completion flags from the original CRA build. No XP is granted for them. */
export function importLegacyProgress(state: PersistedState, storage: Storage = localStorage): PersistedState {
  const raw = storage.getItem(LEGACY_STORAGE_KEY);
  if (!raw || Object.keys(state.days).length > 0) return state;

  let legacy: LegacyProgressV0;
  try {
    legacy = JSON.parse(raw) as LegacyProgressV0;
  } catch {
    return state;
  }
  if (!Array.isArray(legacy.completedDays) || legacy.completedDays.length === 0) return state;

  const stamp = new Date(legacy.lastCompletionTime ?? Date.now()).toISOString();
  const days = { ...state.days };
  for (const day of legacy.completedDays) {
    if (!Number.isInteger(day) || day < 1 || day > 30) continue;
    days[day] = {
      day,
      unlockedAt: stamp,
      cardResults: {},
      standardChecklist: [],
      hardcoreChecklist: [],
      briefingCompletedAt: stamp,
      missionCompletedAt: stamp,
      completedAt: stamp,
    };
  }
  storage.removeItem(LEGACY_STORAGE_KEY);
  return { ...state, days };
}
