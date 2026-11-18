import type { BadgeCriterion, BadgeDefinition, BadgeProgress, UserStats } from '../types';
import { formatNumber } from '../lib/text';

function criterionValue(criterion: BadgeCriterion, stats: UserStats): number {
  switch (criterion.type) {
    case 'counter':
      return stats.counters[criterion.counter];
    case 'totalInteractions':
      return stats.totalInteractions;
    case 'longestStreak':
      return stats.longestStreak;
    case 'logEntries':
      return stats.logEntries;
    case 'words':
      return stats.totalWords;
    case 'hardcore':
      return stats.hardcoreCompleted;
    case 'daysCompleted':
      return stats.daysCompleted;
    case 'daysMastered':
      return stats.daysMastered;
    case 'chapterCompleted':
      return stats.chaptersCompleted.includes(criterion.chapter) ? 1 : 0;
    case 'level':
      return stats.level.level;
    case 'attribute':
      return stats.attributes[criterion.attribute];
    case 'confidenceDelta':
      return stats.confidenceDelta ?? 0;
  }
}

function criterionTarget(criterion: BadgeCriterion): number {
  return criterion.type === 'chapterCompleted' ? 1 : criterion.threshold;
}

export function badgeProgress(badge: BadgeDefinition, stats: UserStats): BadgeProgress {
  const current = criterionValue(badge.criterion, stats);
  const target = criterionTarget(badge.criterion);
  const start = badge.criterion.type === 'level' ? 1 : 0;
  return { current: Math.min(current, target), target, start, unlocked: current >= target };
}

/** 0–1 share of the way from the starting value to the target. */
export function progressRatio(progress: BadgeProgress): number {
  if (progress.unlocked) return 1;
  const span = progress.target - progress.start;
  return span > 0 ? Math.min(1, Math.max(0, (progress.current - progress.start) / span)) : 0;
}

export function formatBadgeValue(criterion: BadgeCriterion, value: number): string {
  if (criterion.type === 'confidenceDelta') return `${value >= 0 ? '+' : '−'}${Math.abs(value).toFixed(1)}`;
  return formatNumber(Math.floor(value));
}

export interface BadgeWithProgress {
  badge: BadgeDefinition;
  progress: BadgeProgress;
}

/** Locked badges with some progress, closest to unlocking first. */
export function closestBadges(
  badges: readonly BadgeDefinition[],
  stats: UserStats,
  unlocked: Record<string, string>,
  limit: number,
): BadgeWithProgress[] {
  return badges
    .filter((badge) => !unlocked[badge.id])
    .map((badge) => ({ badge, progress: badgeProgress(badge, stats) }))
    .filter(({ progress }) => progressRatio(progress) > 0)
    .sort((a, b) => progressRatio(b.progress) - progressRatio(a.progress))
    .slice(0, limit);
}

/** Badges whose criteria are met but that aren't yet recorded as unlocked. */
export function newlyUnlockedBadges(
  badges: readonly BadgeDefinition[],
  stats: UserStats,
  alreadyUnlocked: Record<string, string>,
): BadgeDefinition[] {
  return badges.filter((badge) => !alreadyUnlocked[badge.id] && badgeProgress(badge, stats).unlocked);
}
