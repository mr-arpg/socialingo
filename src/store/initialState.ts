import type { PersistedState, Settings } from '../types';
import { SCHEMA_VERSION } from '../types';

export const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  sound: true,
  haptics: true,
  motion: 'system',
};

export function createInitialState(now: Date = new Date()): PersistedState {
  return {
    schemaVersion: SCHEMA_VERSION,
    profile: { displayName: '', createdAt: now.toISOString() },
    settings: { ...DEFAULT_SETTINGS },
    days: {},
    logEntries: {},
    repEvents: [],
    xpEvents: [],
    openedChests: [],
    unlockedBadges: {},
  };
}

/** Fills fields added after the state was first saved, so older saves keep loading. */
export function normalizeState(partial: Partial<PersistedState> | undefined): PersistedState {
  const base = createInitialState();
  if (!partial) return base;
  return {
    ...base,
    ...partial,
    schemaVersion: SCHEMA_VERSION,
    profile: { ...base.profile, ...partial.profile },
    settings: {
      theme: partial.settings?.theme ?? base.settings.theme,
      sound: partial.settings?.sound ?? base.settings.sound,
      haptics: partial.settings?.haptics ?? base.settings.haptics,
      motion: partial.settings?.motion ?? base.settings.motion,
    },
  };
}
