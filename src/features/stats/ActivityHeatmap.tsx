import { useLayoutEffect, useMemo, useRef } from 'react';
import type { DailyActivity, ISODate } from '../../types';
import type { HeatCell, HeatLevel } from '../../engine/heatmap';
import { activeDayCount, buildHeatmap, earliestDate, heatmapWeeks } from '../../engine/heatmap';
import { formatLongDate, formatMonth, toISODate } from '../../lib/dates';
import { cn } from '../../lib/text';

const LEVEL_CLASSES: Record<HeatLevel, string> = {
  0: 'bg-slate-100 dark:bg-night-line/70',
  1: 'bg-emerald-200 dark:bg-emerald-900',
  2: 'bg-emerald-300 dark:bg-emerald-700',
  3: 'bg-emerald-500 dark:bg-emerald-500',
  4: 'bg-emerald-700 dark:bg-emerald-300',
};

const WEEKDAY_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

interface ActivityHeatmapProps {
  activity: Record<ISODate, DailyActivity>;
  since: string;
  today: ISODate;
}

export function ActivityHeatmap({ activity, since, today }: ActivityHeatmapProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const weeks = useMemo(() => {
    const start = earliestDate(Object.keys(activity), toISODate(since));
    return buildHeatmap(activity, today, heatmapWeeks(start, today));
  }, [activity, since, today]);
  const activeDays = activeDayCount(activity);

  useLayoutEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks.length]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1.5">
        <div className="mt-5 grid shrink-0 grid-rows-7 gap-[3px] text-[10px] font-extrabold leading-none text-ink-soft dark:text-slate-500">
          {WEEKDAY_LABELS.map((label, i) => (
            <span key={i} className="flex h-[14px] items-center">
              {label}
            </span>
          ))}
        </div>
        <div ref={scroller} className="overflow-x-auto pb-1 [scrollbar-width:thin]">
          <div className="flex w-max gap-[3px]">
            {weeks.map((week, w) => {
              const firstOfMonth = week.cells.find((c) => c.date.endsWith('-01'));
              const monthLabel = firstOfMonth ? formatMonth(firstOfMonth.date) : w === 0 ? formatMonth(week.start) : '';
              return (
                <div key={week.start} className="flex flex-col gap-[3px]">
                  <span className="h-[17px] whitespace-nowrap text-[10px] font-extrabold leading-none text-ink-soft dark:text-slate-500">
                    {monthLabel}
                  </span>
                  {week.cells.map((cell) => (
                    <Cell key={cell.date} cell={cell} isToday={cell.date === today} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-ink-soft dark:text-slate-400">
        <span>
          {activeDays} active {activeDays === 1 ? 'day' : 'days'}
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">
          Less
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <span key={level} className={cn('h-3 w-3 rounded-[3px]', LEVEL_CLASSES[level])} />
          ))}
          More
          <span className="ml-2 h-3 w-3 rounded-[3px] bg-sky-300 dark:bg-sky-600" /> Freeze
        </span>
      </div>
    </div>
  );
}

function Cell({ cell, isToday }: { cell: HeatCell; isToday: boolean }) {
  if (cell.future) return <span className="h-[14px] w-[14px]" aria-hidden="true" />;
  const parts = [formatLongDate(cell.date)];
  if (cell.frozen) parts.push('streak freeze used');
  else if (cell.xp > 0) parts.push(`${cell.xp} XP`, `${cell.reps} reps`);
  else parts.push('no activity');
  if (cell.completedDay) parts.push(`completed Day ${cell.completedDay}`);
  const label = parts.join(', ');

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cn(
        'h-[14px] w-[14px] rounded-[3px]',
        cell.frozen && cell.xp === 0 ? 'bg-sky-300 dark:bg-sky-600' : LEVEL_CLASSES[cell.level],
        isToday && 'ring-2 ring-amber-400 ring-offset-1 ring-offset-white dark:ring-offset-night-card',
      )}
    />
  );
}
