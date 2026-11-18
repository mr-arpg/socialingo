import type {
  CounterKey,
  CounterTotals,
  DayContent,
  DayNumber,
  DayProgress,
  ISODate,
  MissionTier,
  NodeState,
  PacingMode,
  PersistedState,
  RepEvent,
} from '../types';
import { COUNTER_KEYS } from '../types';
import { toISODate } from '../lib/dates';

export const TOTAL_DAYS = 30;

export function emptyCounters(): CounterTotals {
  return { approaches: 0, conversations: 0, kindnesses: 0, courageReps: 0 };
}

export function tallyReps(events: readonly RepEvent[], day?: DayNumber | null): CounterTotals {
  const totals = emptyCounters();
  for (const event of events) {
    if (day === undefined || event.day === day) totals[event.counter] += 1;
  }
  return totals;
}

export function targetsMet(tier: MissionTier, tallies: CounterTotals): boolean {
  return tier.targets.every((t) => tallies[t.counter] >= t.target);
}

export function checklistMet(tier: MissionTier, checked: readonly boolean[]): boolean {
  return (tier.checklist ?? []).every((_, i) => checked[i] === true);
}

export function tierMet(tier: MissionTier, tallies: CounterTotals, checked: readonly boolean[]): boolean {
  return targetsMet(tier, tallies) && checklistMet(tier, checked);
}

export function isMastered(progress: DayProgress | undefined): boolean {
  return Boolean(progress?.completedAt && progress.hardcoreCompletedAt);
}

export function readyToComplete(state: PersistedState, day: DayNumber): boolean {
  const progress = state.days[day];
  return Boolean(progress?.briefingCompletedAt && progress.missionCompletedAt && state.logEntries[day]);
}

export function nodeState(
  day: DayNumber,
  state: Pick<PersistedState, 'days'>,
  pacing: PacingMode,
  today: ISODate,
  hasContent: boolean,
): NodeState {
  const progress = state.days[day];
  if (progress?.completedAt) return progress.hardcoreCompletedAt ? 'mastered' : 'completed';
  if (!hasContent) return 'locked';
  if (day === 1) return 'current';

  const previous = state.days[day - 1];
  if (!previous?.completedAt) return 'locked';
  if (pacing === 'daily' && toISODate(previous.completedAt) >= today) return 'cooldown';
  return 'current';
}

export interface PathNodeModel {
  day: DayNumber;
  state: NodeState;
  content: DayContent | undefined;
}

export function buildPath(
  days: readonly DayContent[],
  state: Pick<PersistedState, 'days'>,
  pacing: PacingMode,
  today: ISODate,
): PathNodeModel[] {
  const byDay = new Map(days.map((d) => [d.day, d]));
  return Array.from({ length: TOTAL_DAYS }, (_, i) => {
    const day = i + 1;
    const content = byDay.get(day);
    return { day, content, state: nodeState(day, state, pacing, today, Boolean(content)) };
  });
}

export function counterKeysOutside(tier: MissionTier): CounterKey[] {
  const used = new Set(tier.targets.map((t) => t.counter));
  return COUNTER_KEYS.filter((k) => !used.has(k));
}
