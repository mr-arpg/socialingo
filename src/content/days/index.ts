import type { DayContent, DayNumber } from '../../types';
import { ATTRIBUTE_KEYS } from '../../types';
import { chapterForDay } from '../chapters';
import { DAYS_1_TO_10 } from './days_1_to_10';

export const DAYS: readonly DayContent[] = [...DAYS_1_TO_10];

export function getDay(day: DayNumber): DayContent | undefined {
  return DAYS.find((d) => d.day === day);
}

/** Structural checks that the type system can't express. Returns human-readable problems. */
export function validateCurriculum(days: readonly DayContent[]): string[] {
  const problems: string[] = [];
  const cardIds = new Set<string>();
  const promptIds = new Set<string>();

  days.forEach((d, index) => {
    const where = `Day ${d.day}`;
    if (d.day !== index + 1) problems.push(`${where}: expected day ${index + 1} at this position`);
    if (chapterForDay(d.day).id !== d.chapter) problems.push(`${where}: chapter ${d.chapter} doesn't match day range`);
    if (d.briefing.length < 5 || d.briefing.length > 10) problems.push(`${where}: briefing should have 5–10 cards`);
    if (d.briefing[0]?.kind !== 'hook') problems.push(`${where}: briefing must open with a hook card`);
    if (d.briefing[d.briefing.length - 1]?.kind !== 'takeaway') problems.push(`${where}: briefing must end with a takeaway card`);
    if (d.logbook.length < 2 || d.logbook.length > 3) problems.push(`${where}: needs 2–3 logbook prompts`);

    for (const card of d.briefing) {
      if (cardIds.has(card.id)) problems.push(`${where}: duplicate card id ${card.id}`);
      cardIds.add(card.id);
      if (card.kind === 'quiz' && card.options.filter((o) => o.correct).length !== 1) {
        problems.push(`${where}: quiz ${card.id} must have exactly one correct option`);
      }
      if (card.kind === 'scenario' && card.options.filter((o) => o.rating === 'great').length !== 1) {
        problems.push(`${where}: scenario ${card.id} must have exactly one 'great' option`);
      }
    }

    for (const prompt of d.logbook) {
      if (promptIds.has(prompt.id)) problems.push(`${where}: duplicate prompt id ${prompt.id}`);
      promptIds.add(prompt.id);
    }

    const { standard, hardcore } = d.mission;
    for (const t of [...standard.targets, ...hardcore.targets]) {
      if (!Number.isInteger(t.target) || t.target < 1) problems.push(`${where}: invalid target for ${t.counter}`);
    }
    for (const s of standard.targets) {
      const h = hardcore.targets.find((t) => t.counter === s.counter);
      if (!h || h.target < s.target) problems.push(`${where}: hardcore must meet or exceed standard ${s.counter} target`);
    }

    for (const key of Object.keys({ ...d.rewards.attributes, ...d.rewards.hardcoreAttributes })) {
      if (!(ATTRIBUTE_KEYS as readonly string[]).includes(key)) problems.push(`${where}: unknown attribute ${key}`);
    }
    if (d.rewards.hardcoreXp <= 0 || d.rewards.xp <= 0) problems.push(`${where}: rewards must be positive`);
  });

  return problems;
}
