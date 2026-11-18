import type {
  BadgeDefinition,
  BriefingCard,
  ChapterId,
  CompletionSummary,
  CounterKey,
  DayContent,
  DayNumber,
  DayProgress,
  LogDraft,
  PersistedState,
  XpSource,
} from '../types';
import { BADGES } from '../content/badges';
import { CHAPTERS } from '../content/chapters';
import { toISODate } from '../lib/dates';
import { countWords } from '../lib/text';
import { badgeProgress } from './badges';
import { readyToComplete, tallyReps, tierMet } from './day';
import { diffStats } from './diff';
import { cappedRepXp, logEntryXp, streakBonusXp, XP_RULES } from './progression';
import { computeStats } from './stats';
import { activeDates, computeStreak } from './streak';

/** Injected so transitions stay pure and testable. */
export interface ActionContext {
  now: Date;
  id: () => string;
}

export type MissionTierKey = 'standard' | 'hardcore';

function ensureDay(state: PersistedState, day: DayNumber, ctx: ActionContext): DayProgress {
  return (
    state.days[day] ?? {
      day,
      unlockedAt: ctx.now.toISOString(),
      cardResults: {},
      standardChecklist: [],
      hardcoreChecklist: [],
    }
  );
}

function withDay(state: PersistedState, progress: DayProgress): PersistedState {
  return { ...state, days: { ...state.days, [progress.day]: progress } };
}

function addXp(
  state: PersistedState,
  ctx: ActionContext,
  amount: number,
  source: XpSource,
  day: DayNumber | null,
  refId?: string,
): PersistedState {
  if (amount <= 0) return state;
  const event = { id: ctx.id(), at: ctx.now.toISOString(), amount, source, day, ...(refId ? { refId } : {}) };
  return { ...state, xpEvents: [...state.xpEvents, event] };
}

export function completeBriefing(state: PersistedState, day: DayNumber, ctx: ActionContext): PersistedState {
  const progress = ensureDay(state, day, ctx);
  if (progress.briefingCompletedAt) return state;
  const next = withDay(state, { ...progress, briefingCompletedAt: ctx.now.toISOString() });
  return addXp(next, ctx, XP_RULES.briefingComplete, 'briefing', day);
}

export function recordCardResult(
  state: PersistedState,
  day: DayNumber,
  card: BriefingCard,
  firstTryCorrect: boolean,
  ctx: ActionContext,
): PersistedState {
  const progress = ensureDay(state, day, ctx);
  if (progress.cardResults[card.id]) return state;
  const next = withDay(state, {
    ...progress,
    cardResults: { ...progress.cardResults, [card.id]: { firstTryCorrect, answeredAt: ctx.now.toISOString() } },
  });
  if (!firstTryCorrect) return next;
  if (card.kind === 'quiz') return addXp(next, ctx, XP_RULES.quizFirstTry, 'quiz', day, card.id);
  if (card.kind === 'scenario') return addXp(next, ctx, XP_RULES.scenarioGreat, 'scenario', day, card.id);
  return next;
}

export function repXpEarnedOn(state: PersistedState, date: string): number {
  return state.xpEvents
    .filter((e) => e.source === 'rep' && toISODate(e.at) === date)
    .reduce((sum, e) => sum + e.amount, 0);
}

export function tapRep(
  state: PersistedState,
  counter: CounterKey,
  day: DayNumber | null,
  ctx: ActionContext,
): { state: PersistedState; xp: number } {
  const rep = { id: ctx.id(), counter, at: ctx.now.toISOString(), day };
  const xp = cappedRepXp(counter, repXpEarnedOn(state, toISODate(ctx.now)));
  const next = { ...state, repEvents: [...state.repEvents, rep] };
  return { state: addXp(next, ctx, xp, 'rep', day, rep.id), xp };
}

export function undoRep(state: PersistedState, counter: CounterKey, day: DayNumber | null): PersistedState {
  let index = -1;
  for (let i = state.repEvents.length - 1; i >= 0; i -= 1) {
    const e = state.repEvents[i];
    if (e.counter === counter && e.day === day) {
      index = i;
      break;
    }
  }
  if (index === -1) return state;
  const removed = state.repEvents[index];
  return {
    ...state,
    repEvents: state.repEvents.filter((_, i) => i !== index),
    xpEvents: state.xpEvents.filter((e) => e.refId !== removed.id),
  };
}

export function toggleChecklist(
  state: PersistedState,
  day: DayNumber,
  tier: MissionTierKey,
  index: number,
  ctx: ActionContext,
): PersistedState {
  const progress = ensureDay(state, day, ctx);
  const key = tier === 'standard' ? 'standardChecklist' : 'hardcoreChecklist';
  const list = [...progress[key]];
  list[index] = !list[index];
  return withDay(state, { ...progress, [key]: list });
}

export function canCompleteTier(state: PersistedState, content: DayContent, tier: MissionTierKey): boolean {
  const progress = state.days[content.day];
  const tallies = tallyReps(state.repEvents, content.day);
  const checked = tier === 'standard' ? progress?.standardChecklist : progress?.hardcoreChecklist;
  return tierMet(content.mission[tier], tallies, checked ?? []);
}

export function completeMission(
  state: PersistedState,
  content: DayContent,
  tier: MissionTierKey,
  ctx: ActionContext,
): PersistedState {
  if (!canCompleteTier(state, content, tier)) return state;
  const progress = ensureDay(state, content.day, ctx);
  const stamp = ctx.now.toISOString();
  let next = state;

  if (!progress.missionCompletedAt) {
    next = withDay(next, { ...ensureDay(next, content.day, ctx), missionCompletedAt: stamp });
    next = addXp(next, ctx, content.rewards.xp, 'mission', content.day);
  }
  if (tier === 'hardcore' && !progress.hardcoreCompletedAt) {
    next = withDay(next, { ...ensureDay(next, content.day, ctx), hardcoreCompletedAt: stamp });
    next = addXp(next, ctx, content.rewards.hardcoreXp, 'hardcore', content.day);
  }
  return next;
}

export function saveLogEntry(
  state: PersistedState,
  day: DayNumber,
  draft: LogDraft,
  ctx: ActionContext,
): PersistedState {
  const stamp = ctx.now.toISOString();
  const existing = state.logEntries[day];
  const wordCount = Object.values(draft.answers).reduce((sum, text) => sum + countWords(text), 0);
  const entry = {
    id: existing?.id ?? ctx.id(),
    day,
    createdAt: existing?.createdAt ?? stamp,
    updatedAt: stamp,
    answers: draft.answers,
    confidence: draft.confidence,
    ...(draft.energy ? { energy: draft.energy } : {}),
    moods: draft.moods,
    wordCount,
  };
  const next = { ...withDay(state, ensureDay(state, day, ctx)), logEntries: { ...state.logEntries, [day]: entry } };

  const alreadyAwarded = state.xpEvents
    .filter((e) => e.source === 'logEntry' && e.day === day)
    .reduce((sum, e) => sum + e.amount, 0);
  return addXp(next, ctx, logEntryXp(wordCount) - alreadyAwarded, 'logEntry', day);
}

/** State as it was before this day contributed anything, for the celebration diff. */
function withoutDay(state: PersistedState, day: DayNumber): PersistedState {
  const days = { ...state.days };
  delete days[day];
  const logEntries = { ...state.logEntries };
  delete logEntries[day];
  return {
    ...state,
    days,
    logEntries,
    repEvents: state.repEvents.filter((e) => e.day !== day),
    xpEvents: state.xpEvents.filter((e) => e.day !== day),
  };
}

export function completeDay(
  state: PersistedState,
  content: DayContent,
  allDays: readonly DayContent[],
  ctx: ActionContext,
): { state: PersistedState; summary: CompletionSummary } | null {
  const progress = state.days[content.day];
  if (!progress || progress.completedAt || !readyToComplete(state, content.day)) return null;

  const today = toISODate(ctx.now);
  const before = computeStats(withoutDay(state, content.day), allDays, today);

  let next = withDay(state, { ...progress, completedAt: ctx.now.toISOString() });
  const streak = computeStreak(activeDates(next), today).current;
  next = addXp(next, ctx, streakBonusXp(streak), 'streakBonus', content.day);

  const after = computeStats(next, allDays, today);
  const badges = BADGES.filter((b) => badgeProgress(b, after).unlocked && !badgeProgress(b, before).unlocked);
  const levelUp =
    after.level.level > before.level.level
      ? { from: before.level.level, to: after.level.level, rank: after.level.rank }
      : null;

  return {
    state: next,
    summary: {
      day: content.day,
      mastered: Boolean(progress.hardcoreCompletedAt),
      deltas: diffStats(before, after),
      badges,
      levelUp,
    },
  };
}

export function chestAvailable(state: PersistedState, chapter: ChapterId): boolean {
  const def = CHAPTERS.find((c) => c.id === chapter);
  if (!def || state.openedChests.includes(chapter)) return false;
  for (let d = def.firstDay; d <= def.lastDay; d += 1) if (!state.days[d]?.completedAt) return false;
  return true;
}

export function openChest(state: PersistedState, chapter: ChapterId, ctx: ActionContext): PersistedState {
  if (!chestAvailable(state, chapter)) return state;
  const def = CHAPTERS.find((c) => c.id === chapter)!;
  const next = { ...state, openedChests: [...state.openedChests, chapter] };
  return addXp(next, ctx, def.chest.xp, 'chapterChest', null);
}

export function recordBadges(
  state: PersistedState,
  badges: readonly BadgeDefinition[],
  ctx: ActionContext,
): PersistedState {
  if (badges.length === 0) return state;
  const unlockedBadges = { ...state.unlockedBadges };
  for (const badge of badges) unlockedBadges[badge.id] ??= ctx.now.toISOString();
  return { ...state, unlockedBadges };
}
