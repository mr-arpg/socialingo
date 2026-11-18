import { PenLine } from 'lucide-react';
import { Fragment } from 'react';
import { Link } from 'react-router';
import type { LogbookDocEntry } from '../../engine/logbook';
import { CHAPTERS, CONFIDENCE_LABELS, ENERGY_LABELS, MOOD_META } from '../../content/chapters';
import { ACCENTS } from '../../lib/accents';
import { formatLongDate } from '../../lib/dates';
import { cn } from '../../lib/text';

interface EntryCardProps {
  entry: LogbookDocEntry;
  terms: readonly string[];
}

export function EntryCard({ entry, terms }: EntryCardProps) {
  const chapter = CHAPTERS[entry.chapter - 1];
  const accent = ACCENTS[chapter.accent];

  return (
    <article aria-labelledby={`entry-${entry.day}`} className="card flex flex-col gap-4 p-5">
      <header className="flex items-start gap-3">
        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl border-b-4 text-lg font-black', accent.node)}>
          {entry.day}
        </span>
        <div className="min-w-0 flex-1">
          <p className={cn('eyebrow', accent.text)}>
            Day {entry.day} · {formatLongDate(entry.writtenAt)}
          </p>
          <h2 id={`entry-${entry.day}`} className="text-lg font-black leading-tight">
            <Highlight text={entry.title} terms={terms} />
          </h2>
        </div>
        <span
          className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
          title={`Confidence: ${CONFIDENCE_LABELS[entry.confidence - 1]}`}
        >
          {entry.confidence}/5
        </span>
      </header>

      {(entry.moods.length > 0 || entry.energy) && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Moods and energy">
          {entry.moods.map((mood) => (
            <li key={mood} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-ink-soft dark:bg-night-line dark:text-slate-300">
              <span aria-hidden="true">{MOOD_META[mood].emoji}</span> <Highlight text={MOOD_META[mood].label} terms={terms} />
            </li>
          ))}
          {entry.energy && (
            <li className="rounded-full bg-sky-50 px-2.5 py-1 text-xs font-extrabold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
              Energy {entry.energy}/5 · {ENERGY_LABELS[entry.energy - 1]}
            </li>
          )}
        </ul>
      )}

      <div className="flex flex-col gap-4">
        {entry.answers.map((answer) => (
          <div key={answer.promptId}>
            <p className="mb-1 text-sm font-extrabold text-ink-soft dark:text-slate-400">{answer.question}</p>
            <p className="whitespace-pre-wrap break-words text-[16px] leading-relaxed">
              <Highlight text={answer.answer.trim()} terms={terms} />
            </p>
          </div>
        ))}
      </div>

      <footer className="flex items-center justify-between border-t-2 border-slate-100 pt-3 dark:border-night-line">
        <span className="text-xs font-extrabold text-ink-soft dark:text-slate-500">{entry.wordCount} words</span>
        <Link
          to={`/day/${entry.day}`}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-sky-600 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10"
        >
          <PenLine className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> Edit
        </Link>
      </footer>
    </article>
  );
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function Highlight({ text, terms }: { text: string; terms: readonly string[] }) {
  if (!terms.length) return <>{text}</>;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join('|')})`, 'gi');
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-amber-200 px-0.5 text-inherit dark:bg-amber-400/40">
            {part}
          </mark>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
