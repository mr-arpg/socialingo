import { NotebookPen, SearchX } from 'lucide-react';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { LogbookFilter } from '../../engine/logbook';
import { filterEntries, logbookToMarkdown, searchTerms, sortedEntries, toDocEntry } from '../../engine/logbook';
import { Button } from '../../components/ui/Button';
import { getDay } from '../../content/days';
import { toISODate } from '../../lib/dates';
import { downloadFile } from '../../lib/effects';
import { useAppStore } from '../../store/useAppStore';
import { EntryCard } from './EntryCard';
import { FilterBar } from './FilterBar';
import { LogbookSummary } from './LogbookSummary';
import { PrintableLogbook } from './PrintableLogbook';

export function LogbookScreen() {
  const logEntries = useAppStore((s) => s.data.logEntries);
  const displayName = useAppStore((s) => s.data.profile.displayName);
  const [filter, setFilter] = useState<LogbookFilter>({ kind: 'all' });
  const [query, setQuery] = useState('');
  const [printing, setPrinting] = useState(false);
  const deferredQuery = useDeferredValue(query);

  const entries = useMemo(() => sortedEntries(logEntries).map((e) => toDocEntry(e, getDay)), [logEntries]);
  const visible = useMemo(() => filterEntries(entries, filter, deferredQuery), [entries, filter, deferredQuery]);
  const terms = useMemo(() => searchTerms(deferredQuery), [deferredQuery]);

  useEffect(() => {
    if (!printing) return;
    const done = () => setPrinting(false);
    window.addEventListener('afterprint', done);
    const frame = requestAnimationFrame(() => window.print());
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('afterprint', done);
    };
  }, [printing]);

  const exportMarkdown = () => {
    const markdown = logbookToMarkdown(entries, { displayName, exportedAt: new Date() });
    downloadFile(`field-logbook-${toISODate(new Date())}.md`, markdown, 'text/markdown;charset=utf-8');
  };

  return (
    <div className="flex flex-col gap-5">
      <header>
        <h1 className="text-3xl font-black">Field Logbook</h1>
        <p className="mt-1 font-semibold text-ink-soft dark:text-slate-400">Your personal evolution journal, one day at a time.</p>
      </header>

      <LogbookSummary entries={entries} onExportMarkdown={exportMarkdown} onPrint={() => setPrinting(true)} />

      {entries.length === 0 ? (
        <EmptyLogbook />
      ) : (
        <>
          <FilterBar entries={entries} filter={filter} query={query} onFilterChange={setFilter} onQueryChange={setQuery} />
          {visible.length < entries.length && (
            <p role="status" className="-mt-2 text-sm font-bold text-ink-soft dark:text-slate-400">
              Showing {visible.length} of {entries.length} entries
            </p>
          )}
          {visible.length > 0 ? (
            <ol className="flex flex-col gap-4">
              {visible.map((entry) => (
                <li key={entry.day}>
                  <EntryCard entry={entry} terms={terms} />
                </li>
              ))}
            </ol>
          ) : (
            <div className="card flex flex-col items-center gap-3 p-8 text-center">
              <SearchX className="h-10 w-10 text-slate-300 dark:text-slate-600" strokeWidth={2} aria-hidden="true" />
              <p className="font-bold text-ink-soft dark:text-slate-400">No entries match. Try another word or filter.</p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setQuery('');
                  setFilter({ kind: 'all' });
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </>
      )}

      {printing && <PrintableLogbook entries={entries} displayName={displayName} />}
    </div>
  );
}

function EmptyLogbook() {
  return (
    <div className="card flex flex-col items-center gap-4 p-8 text-center">
      <span className="grid h-16 w-16 place-items-center rounded-3xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
        <NotebookPen className="h-8 w-8" strokeWidth={2.5} aria-hidden="true" />
      </span>
      <div>
        <h2 className="text-xl font-black">Your first page is waiting</h2>
        <p className="mt-1 text-ink-soft dark:text-slate-400">
          Every day ends with a short logbook entry. They'll be collected here, so you can look back and see how far you've come.
        </p>
      </div>
      <Link
        to="/"
        className="inline-flex h-12 items-center rounded-2xl border-2 border-b-4 border-transparent border-b-emerald-700 bg-emerald-500 px-5 text-sm font-extrabold uppercase tracking-wide text-white active:translate-y-[2px] active:border-b-2"
      >
        Go to today's mission
      </Link>
    </div>
  );
}
