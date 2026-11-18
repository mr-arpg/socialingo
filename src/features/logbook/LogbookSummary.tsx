import { Download, Printer } from 'lucide-react';
import type { LogbookDocEntry } from '../../engine/logbook';
import { logbookTotals } from '../../engine/logbook';
import { Sparkline } from '../../components/charts/Sparkline';
import { Button } from '../../components/ui/Button';
import { CONFIDENCE_LABELS } from '../../content/chapters';
import { formatNumber } from '../../lib/text';

interface LogbookSummaryProps {
  entries: readonly LogbookDocEntry[];
  onExportMarkdown: () => void;
  onPrint: () => void;
}

export function LogbookSummary({ entries, onExportMarkdown, onPrint }: LogbookSummaryProps) {
  const totals = logbookTotals(entries);
  const series = entries.map((e) => e.confidence);
  const latest = series.at(-1);

  return (
    <section aria-label="Logbook summary" className="card flex flex-col gap-4 p-5">
      <dl className="grid grid-cols-3 gap-2 text-center">
        <Metric label="Words" value={formatNumber(totals.words)} />
        <Metric label="Entries" value={String(totals.entries)} />
        <Metric label="Avg confidence" value={totals.avgConfidence === null ? '–' : totals.avgConfidence.toFixed(1)} />
      </dl>

      <div className="rounded-2xl bg-emerald-50/70 p-3 text-emerald-500 dark:bg-emerald-500/5">
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <p className="eyebrow">Confidence by day</p>
          {latest && (
            <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
              Latest: {latest}/5 · {CONFIDENCE_LABELS[latest - 1]}
            </p>
          )}
        </div>
        {series.length > 0 ? (
          <>
            <Sparkline
              values={series}
              min={1}
              max={5}
              label={`Confidence across ${series.length} logged days: ${series.join(', ')} out of 5`}
            />
            <div className="mt-1 flex justify-between text-[11px] font-extrabold text-ink-soft dark:text-slate-500">
              <span>Day {entries[0].day}</span>
              {entries.length > 1 && <span>Day {entries[entries.length - 1].day}</span>}
            </div>
          </>
        ) : (
          <p className="py-4 text-center text-sm font-bold text-ink-soft dark:text-slate-400">
            Your confidence line starts with your first entry.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" size="sm" onClick={onExportMarkdown} disabled={!entries.length}>
          <Download className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> Markdown
        </Button>
        <Button variant="secondary" size="sm" onClick={onPrint} disabled={!entries.length}>
          <Printer className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> PDF / Print
        </Button>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col-reverse gap-0.5">
      <dt className="text-[11px] font-extrabold uppercase tracking-wide text-ink-soft dark:text-slate-400">{label}</dt>
      <dd className="text-2xl font-black tabular-nums">{value}</dd>
    </div>
  );
}
