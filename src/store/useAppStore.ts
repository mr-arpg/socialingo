import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  BadgeDefinition,
  BriefingCard,
  ChapterId,
  CompletionSummary,
  CounterKey,
  DayNumber,
  LogDraft,
  PersistedState,
  Settings,
} from '../types';
import { SCHEMA_VERSION } from '../types';
import { BADGES } from '../content/badges';
import { DAYS, getDay } from '../content/days';
import * as actions from '../engine/actions';
import type { ActionContext, MissionTierKey } from '../engine/actions';
import { newlyUnlockedBadges } from '../engine/badges';
import { computeStats } from '../engine/stats';
import { toISODate } from '../lib/dates';
import { createId } from '../lib/text';
import { createInitialState, normalizeState } from './initialState';
import { importLegacyProgress } from './migrations';
import { idbStorage } from './storage';
import { MAX_DISPLAY_NAME_LENGTH } from '../engine/mergeState';

export const STORAGE_KEY = '30day-challenge:v1';

interface AppStore {
  data: PersistedState;
  hydrated: boolean;
  badgeQueue: BadgeDefinition[];

  completeBriefing: (day: DayNumber) => void;
  answerCard: (day: DayNumber, card: BriefingCard, firstTryCorrect: boolean) => void;
  tapRep: (counter: CounterKey, day: DayNumber | null) => number;
  undoRep: (counter: CounterKey, day: DayNumber | null) => void;
  toggleChecklist: (day: DayNumber, tier: MissionTierKey, index: number) => void;
  completeMission: (day: DayNumber, tier: MissionTierKey) => boolean;
  saveLogEntry: (day: DayNumber, draft: LogDraft) => void;
  completeDay: (day: DayNumber) => CompletionSummary | null;
  openChest: (chapter: ChapterId) => boolean;
  updateSettings: (patch: Partial<Settings>) => void;
  setDisplayName: (name: string) => void;
  replaceState: (state: PersistedState) => void;
  applyRemoteState: (state: PersistedState) => void;
  resetAll: () => void;
  dismissBadge: (id: string) => void;
}

function context(): ActionContext {
  return { now: new Date(), id: createId };
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => {
      /** Applies a transition, records any badges it unlocked, and queues them as toasts. */
      const commit = (next: PersistedState, { toast = true } = {}) => {
        const ctx = context();
        const stats = computeStats(next, DAYS, toISODate(ctx.now));
        const unlocked = newlyUnlockedBadges(BADGES, stats, next.unlockedBadges);
        set((s) => ({
          data: actions.recordBadges(next, unlocked, ctx),
          badgeQueue: toast && unlocked.length ? [...s.badgeQueue, ...unlocked] : s.badgeQueue,
        }));
      };

      return {
        data: createInitialState(),
        hydrated: false,
        badgeQueue: [],

        completeBriefing: (day) => commit(actions.completeBriefing(get().data, day, context())),

        answerCard: (day, card, firstTryCorrect) =>
          commit(actions.recordCardResult(get().data, day, card, firstTryCorrect, context())),

        tapRep: (counter, day) => {
          const result = actions.tapRep(get().data, counter, day, context());
          commit(result.state);
          return result.xp;
        },

        undoRep: (counter, day) => commit(actions.undoRep(get().data, counter, day)),

        toggleChecklist: (day, tier, index) =>
          commit(actions.toggleChecklist(get().data, day, tier, index, context())),

        completeMission: (day, tier) => {
          const content = getDay(day);
          if (!content) return false;
          const before = get().data;
          const next = actions.completeMission(before, content, tier, context());
          if (next === before) return false;
          commit(next);
          return true;
        },

        saveLogEntry: (day, draft) => commit(actions.saveLogEntry(get().data, day, draft, context())),

        completeDay: (day) => {
          const content = getDay(day);
          if (!content) return null;
          const result = actions.completeDay(get().data, content, DAYS, context());
          if (!result) return null;
          commit(result.state, { toast: false });
          const celebrated = new Set(result.summary.badges.map((b) => b.id));
          set((s) => ({ badgeQueue: s.badgeQueue.filter((b) => !celebrated.has(b.id)) }));
          return result.summary;
        },

        openChest: (chapter) => {
          const before = get().data;
          const next = actions.openChest(before, chapter, context());
          if (next === before) return false;
          commit(next);
          return true;
        },

        updateSettings: (patch) =>
          set((s) => ({ data: { ...s.data, settings: { ...s.data.settings, ...patch } } })),

        setDisplayName: (displayName) =>
          set((s) => ({
            data: {
              ...s.data,
              profile: { ...s.data.profile, displayName: displayName.slice(0, MAX_DISPLAY_NAME_LENGTH) },
            },
          })),

        replaceState: (state) => set({ data: normalizeState(state), badgeQueue: [] }),

        applyRemoteState: (state) => set({ data: normalizeState(state), badgeQueue: [] }),

        resetAll: () =>
          set((s) => ({ data: { ...createInitialState(), settings: s.data.settings }, badgeQueue: [] })),

        dismissBadge: (id) => set((s) => ({ badgeQueue: s.badgeQueue.filter((b) => b.id !== id) })),
      };
    },
    {
      name: STORAGE_KEY,
      version: SCHEMA_VERSION,
      storage: createJSONStorage(() => idbStorage),
      partialize: (s) => ({ data: s.data }),
      merge: (persisted, current) => ({
        ...current,
        data: normalizeState((persisted as { data?: Partial<PersistedState> } | undefined)?.data),
      }),
      onRehydrateStorage: () => (state) => {
        const data = importLegacyProgress(state?.data ?? createInitialState());
        useAppStore.setState({ data, hydrated: true });
      },
    },
  ),
);
