import { Lock, Medal } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { BadgeDefinition } from '../../types';
import type { BadgeWithProgress } from '../../engine/badges';
import { badgeProgress, closestBadges, formatBadgeValue, progressRatio } from '../../engine/badges';
import { BadgeMedal } from '../../components/feedback/BadgeMedal';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { BADGE_CATEGORIES, BADGES, TIER_LABELS } from '../../content/badges';
import { useStats } from '../../hooks/useStats';
import { formatLongDate } from '../../lib/dates';
import { cn } from '../../lib/text';
import { useAppStore } from '../../store/useAppStore';

const NEW_FOR_MS = 3 * 86_400_000;
const CLOSEST_LIMIT = 3;

export function BadgesScreen() {
  const stats = useStats();
  const unlocked = useAppStore((s) => s.data.unlockedBadges);
  const [selected, setSelected] = useState<BadgeDefinition | null>(null);

  const all = useMemo<BadgeWithProgress[]>(() => BADGES.map((badge) => ({ badge, progress: badgeProgress(badge, stats) })), [stats]);
  const closest = useMemo(() => closestBadges(BADGES, stats, unlocked, CLOSEST_LIMIT), [stats, unlocked]);
  const unlockedCount = BADGES.filter((b) => unlocked[b.id]).length;
  const selectedProgress = selected ? all.find((x) => x.badge.id === selected.id)!.progress : null;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black">Badges</h1>
        <p className="mt-1 font-semibold text-ink-soft dark:text-slate-400">Medals for the moments that took courage.</p>
      </header>

      <section aria-label="Badge collection progress" className="card flex items-center gap-4 p-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-500 dark:bg-amber-500/15">
          <Medal className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="text-lg font-black">
            {unlockedCount} of {BADGES.length} unlocked
          </p>
          <ProgressBar value={unlockedCount} max={BADGES.length} barClassName="bg-amber-400" label="Badges unlocked" className="mt-2" />
        </div>
      </section>

      {closest.length > 0 && (
        <section className="card flex flex-col gap-3 p-5">
          <h2 className="text-xl font-black">Almost there</h2>
          <ul className="flex flex-col gap-3">
            {closest.map(({ badge, progress }) => (
              <li key={badge.id}>
                <button
                  type="button"
                  onClick={() => setSelected(badge)}
                  className="flex w-full items-center gap-3 rounded-2xl p-1 text-left hover:bg-slate-50 dark:hover:bg-night-line/40"
                >
                  <BadgeMedal badge={badge} size="sm" locked />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate font-extrabold">{badge.name}</p>
                      <p className="shrink-0 text-xs font-black tabular-nums text-ink-soft dark:text-slate-400">
                        {formatBadgeValue(badge.criterion, progress.current)} / {formatBadgeValue(badge.criterion, progress.target)}
                      </p>
                    </div>
                    <ProgressBar value={progressRatio(progress)} className="mt-1 h-2.5" barClassName="bg-amber-400" label={`${badge.name} progress`} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {BADGE_CATEGORIES.map((category) => {
        const items = all.filter((x) => x.badge.category === category.id);
        const earned = items.filter((x) => unlocked[x.badge.id]).length;
        return (
          <section key={category.id} aria-labelledby={`cat-${category.id}`} className="flex flex-col gap-3">
            <div className="flex items-end justify-between gap-2 px-1">
              <div>
                <h2 id={`cat-${category.id}`} className="text-xl font-black">
                  {category.title}
                </h2>
                <p className="text-sm font-semibold text-ink-soft dark:text-slate-400">{category.description}</p>
              </div>
              <span className="shrink-0 text-sm font-black tabular-nums text-ink-soft dark:text-slate-400">
                {earned}/{items.length}
              </span>
            </div>
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map(({ badge, progress }) => (
                <li key={badge.id}>
                  <BadgeTile badge={badge} progress={progress} unlockedAt={unlocked[badge.id]} onSelect={() => setSelected(badge)} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <Modal open={selected !== null} onClose={() => setSelected(null)} labelledBy="badge-title">
        {selected && selectedProgress && (
          <BadgeDetail badge={selected} progress={selectedProgress} unlockedAt={unlocked[selected.id]} onClose={() => setSelected(null)} />
        )}
      </Modal>
    </div>
  );
}

interface BadgeTileProps {
  badge: BadgeDefinition;
  progress: BadgeWithProgress['progress'];
  unlockedAt?: string;
  onSelect: () => void;
}

function BadgeTile({ badge, progress, unlockedAt, onSelect }: BadgeTileProps) {
  const isNew = unlockedAt !== undefined && Date.now() - new Date(unlockedAt).getTime() < NEW_FOR_MS;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`${badge.name}: ${unlockedAt ? 'unlocked' : 'locked'}`}
      className="card relative flex h-full w-full flex-col items-center gap-2 p-3 text-center transition-transform active:translate-y-[2px] active:border-b-2"
    >
      {isNew && (
        <span className="absolute -right-1 -top-2 rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-white">New</span>
      )}
      <span className="relative">
        <BadgeMedal badge={badge} locked={!unlockedAt} />
        {!unlockedAt && (
          <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-slate-400 text-white dark:border-night-card dark:bg-slate-600">
            <Lock className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          </span>
        )}
      </span>
      <span className={cn('text-xs font-extrabold leading-tight', !unlockedAt && 'text-ink-soft dark:text-slate-400')}>{badge.name}</span>
      {!unlockedAt && <ProgressBar value={progressRatio(progress)} className="mt-auto h-1.5" barClassName="bg-amber-400" />}
    </button>
  );
}

function BadgeDetail({ badge, progress, unlockedAt, onClose }: Omit<BadgeTileProps, 'onSelect'> & { onClose: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <BadgeMedal badge={badge} size="lg" locked={!unlockedAt} />
      <div>
        <p className="eyebrow">{TIER_LABELS[badge.tier]} medal</p>
        <h2 id="badge-title" className="text-2xl font-black">
          {badge.name}
        </h2>
        <p className="mt-1 text-ink-soft dark:text-slate-400">{badge.description}</p>
      </div>
      {unlockedAt ? (
        <p className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-extrabold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          Unlocked on {formatLongDate(unlockedAt)}
        </p>
      ) : (
        <div className="w-full">
          <ProgressBar value={progressRatio(progress)} barClassName="bg-amber-400" label={`${badge.name} progress`} />
          <p className="mt-2 text-sm font-extrabold tabular-nums text-ink-soft dark:text-slate-400">
            {formatBadgeValue(badge.criterion, progress.current)} / {formatBadgeValue(badge.criterion, progress.target)}
          </p>
        </div>
      )}
      <Button block onClick={onClose}>
        Got it
      </Button>
    </div>
  );
}
