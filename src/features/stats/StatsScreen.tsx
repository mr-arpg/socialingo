import {
  CalendarCheck,
  Crown,
  Feather,
  Flame,
  Gauge,
  NotebookPen,
  Snowflake,
  Target,
  TrendingUp,
  Trophy,
  type LucideIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { ATTRIBUTE_KEYS, COUNTER_KEYS } from '../../types';
import { RadarChart } from '../../components/charts/RadarChart';
import { Icon } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ATTRIBUTE_META, COUNTER_META, MOOD_META } from '../../content/chapters';
import { RANKS } from '../../engine/progression';
import { useStats, useToday } from '../../hooks/useStats';
import { COUNTER_STYLES } from '../../lib/accents';
import { cn, formatNumber } from '../../lib/text';
import { useAppStore } from '../../store/useAppStore';
import { ActivityHeatmap } from './ActivityHeatmap';

export function StatsScreen() {
  const stats = useStats();
  const today = useToday();
  const createdAt = useAppStore((s) => s.data.profile.createdAt);
  const { level } = stats;
  const nextRank = RANKS.find((r) => r.minLevel > level.level);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black">Stats & Charisma</h1>
        <p className="mt-1 font-semibold text-ink-soft dark:text-slate-400">Every rep you log out there shows up in here.</p>
      </header>

      <section aria-label="Level and rank" className="flex flex-col gap-4 rounded-3xl border-b-4 border-indigo-700 bg-indigo-500 p-5 text-white">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-4 border-white/30 bg-white/15 text-2xl font-black">
            {level.level}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-extrabold uppercase tracking-widest text-white/75">Level {level.level}</p>
            <p className="text-2xl font-black leading-tight">{level.rank.title}</p>
            <p className="text-sm font-semibold text-white/80">{level.rank.description}</p>
          </div>
        </div>
        <div>
          <ProgressBar
            value={level.xpIntoLevel}
            max={level.xpForNextLevel}
            className="bg-white/20 dark:bg-white/20"
            barClassName="bg-amber-300"
            label="Progress to next level"
          />
          <div className="mt-2 flex justify-between gap-2 text-xs font-extrabold text-white/85">
            <span>
              {formatNumber(level.xpIntoLevel)} / {formatNumber(level.xpForNextLevel)} XP
            </span>
            <span>{nextRank ? `${nextRank.title} at Level ${nextRank.minLevel}` : 'Top rank reached'}</span>
          </div>
        </div>
      </section>

      <section aria-label="Consistency" className="grid grid-cols-3 gap-3">
        <Tile icon={Flame} tone="text-orange-500" value={stats.currentStreak} label="Day streak" fill />
        <Tile icon={Trophy} tone="text-amber-500" value={stats.longestStreak} label="Longest streak" fill />
        <Tile icon={Snowflake} tone="text-sky-500" value={stats.streakFreezes} label="Freezes ready" />
      </section>

      <Section title="Real-world reps" subtitle={`${formatNumber(stats.totalInteractions)} interactions in total`}>
        <div className="grid grid-cols-2 gap-3">
          {COUNTER_KEYS.map((key) => (
            <div key={key} className="flex flex-col gap-2 rounded-2xl border-2 border-slate-200 p-3 dark:border-night-line">
              <div className="flex items-center justify-between gap-2">
                <span className={cn('grid h-10 w-10 shrink-0 place-items-center rounded-xl', COUNTER_STYLES[key].chip)}>
                  <Icon name={COUNTER_META[key].icon} className="h-5 w-5" strokeWidth={2.5} />
                </span>
                <p className="text-3xl font-black leading-none tabular-nums">{formatNumber(stats.counters[key])}</p>
              </div>
              <p className="text-xs font-bold leading-tight text-ink-soft dark:text-slate-400">{COUNTER_META[key].label}</p>
              <p className="text-[11px] font-semibold leading-snug text-ink-soft/80 dark:text-slate-500">{COUNTER_META[key].description}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MiniStat icon={CalendarCheck} value={`${stats.daysCompleted}/30`} label="Days done" />
          <MiniStat icon={Crown} value={String(stats.daysMastered)} label="Mastered" />
          <MiniStat icon={Target} value={String(stats.hardcoreCompleted)} label="Hardcore" />
        </div>
      </Section>

      <Section title="Charisma radar" subtitle="Five core attributes, each on a 0–100 scale">
        <RadarChart
          label={`Charisma attributes: ${ATTRIBUTE_KEYS.map((k) => `${ATTRIBUTE_META[k].label} ${Math.round(stats.attributes[k])}`).join(', ')}`}
          axes={ATTRIBUTE_KEYS.map((key) => ({ key, label: ATTRIBUTE_META[key].shortLabel, value: stats.attributes[key] }))}
        />
        <ul className="flex flex-col gap-3">
          {ATTRIBUTE_KEYS.map((key) => (
            <li key={key} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300">
                <Icon name={ATTRIBUTE_META[key].icon} className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-extrabold">{ATTRIBUTE_META[key].label}</p>
                  <p className="font-black tabular-nums text-violet-600 dark:text-violet-300">{Math.round(stats.attributes[key])}</p>
                </div>
                <ProgressBar value={stats.attributes[key]} max={100} className="h-2.5" barClassName="bg-violet-500" label={ATTRIBUTE_META[key].label} />
                <p className="mt-1 text-xs font-semibold text-ink-soft dark:text-slate-400">{ATTRIBUTE_META[key].description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Activity" subtitle="Daily XP: darker squares mean bigger days">
        <ActivityHeatmap activity={stats.activity} since={createdAt} today={today} />
      </Section>

      <Section title="Mindset" subtitle="From your Field Logbook">
        <div className="grid grid-cols-2 gap-3">
          <MiniStat icon={NotebookPen} value={String(stats.logEntries)} label="Entries" />
          <MiniStat icon={Feather} value={formatNumber(stats.totalWords)} label="Words written" />
          <MiniStat
            icon={Gauge}
            value={stats.avgConfidence === null ? '–' : `${stats.avgConfidence.toFixed(1)}/5`}
            label="Avg confidence"
          />
          <MiniStat
            icon={TrendingUp}
            value={stats.confidenceDelta === null ? '–' : `${stats.confidenceDelta >= 0 ? '+' : '−'}${Math.abs(stats.confidenceDelta).toFixed(1)}`}
            label="Growth since Week 1"
            tone={stats.confidenceDelta !== null && stats.confidenceDelta > 0 ? 'text-emerald-500' : undefined}
          />
        </div>
        {stats.confidenceDelta === null && (
          <p className="text-xs font-semibold text-ink-soft dark:text-slate-400">
            Growth compares your Week 1 entries with your latest entries after Day 7.
          </p>
        )}
        <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 dark:bg-amber-500/10">
          <span className="text-3xl" aria-hidden="true">
            {stats.topMood ? MOOD_META[stats.topMood].emoji : '📝'}
          </span>
          <div>
            <p className="eyebrow">Most frequent mood</p>
            <p className="text-lg font-black">{stats.topMood ? MOOD_META[stats.topMood].label : 'Not enough entries yet'}</p>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  return (
    <section className="card flex flex-col gap-4 p-5">
      <div>
        <h2 className="text-xl font-black">{title}</h2>
        {subtitle && <p className="text-sm font-semibold text-ink-soft dark:text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function Tile({ icon: TileIcon, tone, value, label, fill }: { icon: LucideIcon; tone: string; value: number; label: string; fill?: boolean }) {
  return (
    <div className="card flex flex-col items-center gap-1 p-3 text-center">
      <TileIcon className={cn('h-7 w-7', value > 0 ? tone : 'text-slate-300 dark:text-slate-600')} fill={fill && value > 0 ? 'currentColor' : 'none'} strokeWidth={2.5} aria-hidden="true" />
      <p className="text-2xl font-black tabular-nums">{value}</p>
      <p className="text-[11px] font-extrabold uppercase leading-tight tracking-wide text-ink-soft dark:text-slate-400">{label}</p>
    </div>
  );
}

function MiniStat({ icon: StatIcon, value, label, tone }: { icon: LucideIcon; value: string; label: string; tone?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-slate-50 p-3 dark:bg-night-line/40">
      <StatIcon className={cn('h-5 w-5', tone ?? 'text-ink-soft dark:text-slate-400')} strokeWidth={2.5} aria-hidden="true" />
      <p className={cn('text-xl font-black tabular-nums', tone)}>{value}</p>
      <p className="text-xs font-bold leading-tight text-ink-soft dark:text-slate-400">{label}</p>
    </div>
  );
}
