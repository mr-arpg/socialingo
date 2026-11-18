import { Search, X } from 'lucide-react';
import type { LogbookDocEntry, LogbookFilter } from '../../engine/logbook';
import { WEEK_COUNT, matchesFilter, weekRange } from '../../engine/logbook';
import { CHAPTERS } from '../../content/chapters';
import { cn } from '../../lib/text';

interface FilterBarProps {
  entries: readonly LogbookDocEntry[];
  filter: LogbookFilter;
  query: string;
  onFilterChange: (filter: LogbookFilter) => void;
  onQueryChange: (query: string) => void;
}

const sameFilter = (a: LogbookFilter, b: LogbookFilter) => JSON.stringify(a) === JSON.stringify(b);

export function FilterBar({ entries, filter, query, onFilterChange, onQueryChange }: FilterBarProps) {
  const options: Array<{ filter: LogbookFilter; label: string; title: string }> = [
    { filter: { kind: 'all' }, label: 'All', title: 'All entries' },
    ...CHAPTERS.map((c) => ({ filter: { kind: 'chapter', chapter: c.id } as LogbookFilter, label: `Ch ${c.id}`, title: c.title })),
    ...Array.from({ length: WEEK_COUNT }, (_, i) => {
      const [first, last] = weekRange(i + 1);
      return { filter: { kind: 'week', week: i + 1 } as LogbookFilter, label: `Wk ${i + 1}`, title: `Days ${first}–${last}` };
    }),
  ];

  return (
    <div className="flex flex-col gap-3">
      <label className="relative block">
        <span className="sr-only">Search your logbook</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" strokeWidth={2.5} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search entries, moods, days…"
          className="h-12 w-full rounded-2xl border-2 border-slate-200 bg-white pl-12 pr-11 font-semibold placeholder:text-slate-400 focus:border-sky-400 focus:outline-none dark:border-night-line dark:bg-night-card [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-night-line"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>
        )}
      </label>

      <div role="radiogroup" aria-label="Filter by chapter or week" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
        {options.map((option, i) => {
          const active = sameFilter(option.filter, filter);
          const count = entries.filter((e) => matchesFilter(e, option.filter)).length;
          return (
            <button
              key={option.label}
              type="button"
              role="radio"
              aria-checked={active}
              title={option.title}
              onClick={() => onFilterChange(option.filter)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border-2 border-b-4 px-3 py-1.5 text-sm font-extrabold transition-colors active:translate-y-[1px] active:border-b-2',
                i === CHAPTERS.length + 1 && 'ml-2',
                active
                  ? 'border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200'
                  : 'border-slate-200 bg-white text-ink-soft dark:border-night-line dark:bg-night-card dark:text-slate-300',
                count === 0 && !active && 'opacity-50',
              )}
            >
              {option.label}
              <span className="rounded-full bg-black/5 px-1.5 text-xs tabular-nums dark:bg-white/10">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
