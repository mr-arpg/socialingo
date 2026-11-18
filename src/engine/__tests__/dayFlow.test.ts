import { describe, expect, it } from 'vitest';
import type { DayContent, PersistedState } from '../../types';
import { DAYS } from '../../content/days';
import { createInitialState } from '../../store/initialState';
import * as actions from '../actions';
import type { ActionContext } from '../actions';
import { buildPath, nodeState, tallyReps } from '../day';
import { computeStats } from '../stats';

function makeCtx(start = new Date(2026, 10, 18, 9, 0)) {
  let n = 0;
  const ctx: ActionContext & { advanceDays: (days: number) => void } = {
    now: start,
    id: () => `id-${++n}`,
    advanceDays(days) {
      ctx.now = new Date(ctx.now.getTime() + days * 86_400_000);
    },
  };
  return ctx;
}

function tapTimes(state: PersistedState, content: DayContent, ctx: ActionContext, counter: Parameters<typeof actions.tapRep>[1], times: number) {
  let next = state;
  for (let i = 0; i < times; i += 1) next = actions.tapRep(next, counter, content.day, ctx).state;
  return next;
}

/** Plays a day through briefing → standard mission → logbook → completion. */
function playDay(state: PersistedState, content: DayContent, ctx: ActionContext) {
  let next = actions.completeBriefing(state, content.day, ctx);
  for (const t of content.mission.standard.targets) next = tapTimes(next, content, ctx, t.counter, t.target);
  (content.mission.standard.checklist ?? []).forEach((_, i) => {
    next = actions.toggleChecklist(next, content.day, 'standard', i, ctx);
  });
  next = actions.completeMission(next, content, 'standard', ctx);
  const answers = Object.fromEntries(content.logbook.map((p) => [p.id, 'It went better than I expected today.']));
  next = actions.saveLogEntry(next, content.day, { answers, confidence: 3, moods: ['brave'] }, ctx);
  const result = actions.completeDay(next, content, DAYS, ctx);
  if (!result) throw new Error(`Day ${content.day} could not be completed`);
  return result;
}

const day1 = DAYS[0];
const day7 = DAYS[6];

describe('day flow', () => {
  it('unlocks only day 1 at the start', () => {
    const path = buildPath(DAYS, createInitialState(), 'free', '2026-11-18');
    expect(path).toHaveLength(30);
    expect(path[0].state).toBe('current');
    expect(path.slice(1).every((n) => n.state === 'locked')).toBe(true);
    expect(path[10].content).toBeUndefined();
  });

  it('refuses to complete a mission until targets and checklist are met', () => {
    const ctx = makeCtx();
    let state = actions.completeBriefing(createInitialState(), 1, ctx);
    state = tapTimes(state, day1, ctx, 'approaches', 4);
    expect(actions.completeMission(state, day1, 'standard', ctx)).toBe(state);

    state = tapTimes(state, day1, ctx, 'approaches', 6);
    expect(actions.canCompleteTier(state, day1, 'hardcore')).toBe(false);
    state = actions.toggleChecklist(state, 1, 'hardcore', 0, ctx);
    expect(actions.canCompleteTier(state, day1, 'hardcore')).toBe(true);

    state = actions.completeMission(state, day1, 'hardcore', ctx);
    expect(state.days[1].missionCompletedAt).toBeDefined();
    expect(state.days[1].hardcoreCompletedAt).toBeDefined();
  });

  it('completes day 1 and reports what the day contributed', () => {
    const ctx = makeCtx();
    const { state, summary } = playDay(createInitialState(), day1, ctx);

    const counterDelta = summary.deltas.find((d) => d.key === 'approaches');
    expect(counterDelta?.delta).toBe(5);
    const xp = summary.deltas.find((d) => d.kind === 'xp')!;
    // briefing 10 + 5 reps × 2 + mission 50 + log (15 + 1 word-bonus floor(21/20)=1) + streak 2
    expect(xp.delta).toBe(10 + 10 + 50 + 16 + 2);
    expect(summary.levelUp).toBeNull();
    expect(summary.deltas.some((d) => d.kind === 'attribute' && d.key === 'initiative')).toBe(true);
    expect(summary.badges.map((b) => b.id)).toEqual(expect.arrayContaining(['first-hello', 'first-page']));

    expect(nodeState(1, state, 'free', '2026-11-18', true)).toBe('completed');
    expect(nodeState(2, state, 'free', '2026-11-18', true)).toBe('current');
    expect(nodeState(2, state, 'daily', '2026-11-18', true)).toBe('cooldown');
    expect(nodeState(2, state, 'daily', '2026-11-19', true)).toBe('current');
  });

  it('does not award XP twice for repeated actions', () => {
    const ctx = makeCtx();
    let state = actions.completeBriefing(createInitialState(), 1, ctx);
    const once = state.xpEvents.length;
    state = actions.completeBriefing(state, 1, ctx);
    expect(state.xpEvents.length).toBe(once);

    const quiz = day1.briefing.find((c) => c.kind === 'quiz')!;
    state = actions.recordCardResult(state, 1, quiz, true, ctx);
    state = actions.recordCardResult(state, 1, quiz, true, ctx);
    expect(state.xpEvents.filter((e) => e.source === 'quiz')).toHaveLength(1);
  });

  it('only tops up logbook XP when an edit earns more', () => {
    const ctx = makeCtx();
    const short = { answers: { a: 'one two' }, confidence: 3 as const, moods: [] };
    const long = { ...short, answers: { a: Array(100).fill('word').join(' ') } };
    let state = actions.saveLogEntry(createInitialState(), 1, short, ctx);
    state = actions.saveLogEntry(state, 1, long, ctx);
    state = actions.saveLogEntry(state, 1, short, ctx);
    const logXp = state.xpEvents.filter((e) => e.source === 'logEntry').reduce((s, e) => s + e.amount, 0);
    expect(logXp).toBe(20);
    expect(state.logEntries[1].wordCount).toBe(2);
  });

  it('undo removes the rep and its XP together', () => {
    const ctx = makeCtx();
    let state = actions.tapRep(createInitialState(), 'courageReps', 5, ctx).state;
    state = actions.tapRep(state, 'courageReps', 5, ctx).state;
    state = actions.undoRep(state, 'courageReps', 5);
    expect(tallyReps(state.repEvents, 5).courageReps).toBe(1);
    expect(state.xpEvents.reduce((s, e) => s + e.amount, 0)).toBe(5);
  });

  it('builds a streak, completes chapter 1, and opens its chest once', () => {
    const ctx = makeCtx();
    let state = createInitialState();
    for (const content of DAYS.slice(0, 7)) {
      state = playDay(state, content, ctx).state;
      ctx.advanceDays(1);
    }
    const today = '2026-11-25';
    const stats = computeStats(state, DAYS, today);
    expect(stats.daysCompleted).toBe(7);
    expect(stats.chaptersCompleted).toEqual([1]);
    expect(stats.currentStreak).toBe(7);
    expect(stats.streakFreezes).toBe(2);
    expect(stats.avgConfidence).toBe(3);
    expect(stats.topMood).toBe('brave');

    expect(actions.chestAvailable(state, 1)).toBe(true);
    const opened = actions.openChest(state, 1, ctx);
    expect(opened.xpEvents.at(-1)).toMatchObject({ source: 'chapterChest', amount: 100 });
    expect(actions.openChest(opened, 1, ctx)).toBe(opened);
    expect(day7.isMilestone).toBe(true);
  });
});
