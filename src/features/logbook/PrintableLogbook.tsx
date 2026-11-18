import { createPortal } from 'react-dom';
import type { LogbookDocEntry } from '../../engine/logbook';
import { groupByChapter, logbookTotals, moodLine, ratingLine } from '../../engine/logbook';
import { formatLongDate } from '../../lib/dates';
import { formatNumber } from '../../lib/text';

interface PrintableLogbookProps {
  entries: readonly LogbookDocEntry[];
  displayName: string;
}

/** Rendered outside #root so print CSS can hide the app and show only this document. */
export function PrintableLogbook({ entries, displayName }: PrintableLogbookProps) {
  const totals = logbookTotals(entries);
  const owner = displayName.trim();

  return createPortal(
    <div id="print-root" className="hidden bg-white font-sans text-black print:block">
      <header className="mb-8 border-b-2 border-black pb-4">
        <p className="text-xs font-extrabold uppercase tracking-widest text-neutral-500">30-Day Social Challenge</p>
        <h1 className="text-3xl font-black">Field Logbook{owner ? ` · ${owner}` : ''}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Exported {formatLongDate(new Date().toISOString())} · {totals.entries} entries · {formatNumber(totals.words)} words
          {totals.avgConfidence !== null && ` · average confidence ${totals.avgConfidence.toFixed(1)}/5`}
        </p>
      </header>

      {groupByChapter(entries).map((section) => (
        <section key={section.chapter.id} className="mb-8">
          <h2 className="mb-4 text-xl font-black">
            Chapter {section.chapter.id} · {section.chapter.title}
          </h2>
          {section.entries.map((entry) => (
            <article key={entry.day} className="mb-6 break-inside-avoid-page">
              <h3 className="text-lg font-black">
                Day {entry.day} · {entry.title}
              </h3>
              <p className="mb-3 text-xs italic text-neutral-600">
                {[formatLongDate(entry.writtenAt), ratingLine(entry), entry.moods.length ? moodLine(entry.moods) : null]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
              {entry.answers.map((answer) => (
                <div key={answer.promptId} className="mb-3">
                  <p className="text-sm font-bold">{answer.question}</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{answer.answer.trim()}</p>
                </div>
              ))}
            </article>
          ))}
        </section>
      ))}
    </div>,
    document.body,
  );
}
