import type { Chapter } from '../../types';
import { Icon } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { ACCENTS } from '../../lib/accents';
import { cn } from '../../lib/text';

export function ChapterBanner({ chapter, completed }: { chapter: Chapter; completed: number }) {
  const total = chapter.lastDay - chapter.firstDay + 1;
  return (
    <header className={cn('rounded-3xl border-b-4 p-5', ACCENTS[chapter.accent].banner)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">
            Chapter {chapter.id} · Days {chapter.firstDay}–{chapter.lastDay}
          </p>
          <h2 className="mt-1 text-xl font-black leading-tight">{chapter.title}</h2>
          <p className="mt-1 text-sm font-semibold text-white/85">{chapter.subtitle}</p>
        </div>
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20">
          <Icon name={chapter.icon} className="h-7 w-7" strokeWidth={2.5} />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <ProgressBar
          value={completed}
          max={total}
          className="h-3 bg-black/15 dark:bg-black/25"
          barClassName="bg-white"
          label={`${chapter.title} progress`}
        />
        <span className="text-sm font-black tabular-nums">
          {completed}/{total}
        </span>
      </div>
    </header>
  );
}
