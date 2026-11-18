import { Flame, Settings, Snowflake, Zap } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useStats } from '../../hooks/useStats';
import { cn, formatNumber } from '../../lib/text';

export function TopBar() {
  const stats = useStats();
  const { level, currentStreak, streakFreezes, totalXp } = stats;

  return (
    <header className="sticky top-0 z-20 border-b-2 border-slate-200 bg-cream/90 backdrop-blur dark:border-night-line dark:bg-night/90">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between gap-2 px-4">
        <div
          className="flex items-center gap-2"
          title={`Level ${level.level}: ${level.xpIntoLevel}/${level.xpForNextLevel} XP to next level`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-b-4 border-indigo-600 bg-indigo-500 text-sm font-black text-white">
            {level.level}
          </span>
          <span className="hidden text-sm font-extrabold text-indigo-600 dark:text-indigo-300 sm:inline">
            {level.rank.title}
          </span>
        </div>

        <div className="flex items-center gap-1 sm:gap-3">
          <Stat
            label={`${currentStreak}-day streak`}
            className={currentStreak > 0 ? 'text-orange-500' : 'text-slate-400'}
            icon={<Flame className="h-6 w-6" fill={currentStreak > 0 ? 'currentColor' : 'none'} strokeWidth={2.5} />}
            value={currentStreak}
          />
          <Stat
            label={`${streakFreezes} streak freezes`}
            className="text-sky-500"
            icon={<Snowflake className="h-5 w-5" strokeWidth={2.5} />}
            value={streakFreezes}
          />
          <Stat
            label={`${totalXp} total XP`}
            className="text-amber-500"
            icon={<Zap className="h-6 w-6" fill="currentColor" strokeWidth={2} />}
            value={formatNumber(totalXp)}
          />
          <Link
            to="/settings"
            aria-label="Settings"
            className="ml-1 rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-night-line/50 md:hidden"
          >
            <Settings className="h-6 w-6" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </header>
  );
}

function Stat({ icon, value, label, className }: { icon: ReactNode; value: number | string; label: string; className: string }) {
  return (
    <span className={cn('flex items-center gap-1 rounded-xl px-2 py-1 text-base font-black', className)} title={label}>
      <span aria-hidden="true">{icon}</span>
      <span aria-hidden="true">{value}</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
