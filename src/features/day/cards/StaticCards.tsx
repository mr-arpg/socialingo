import { CheckCircle2, FlaskConical, MessageSquareQuote } from 'lucide-react';
import type { ConceptCard, HookCard, ScienceCard, ScriptCard, TakeawayCard } from '../../../types';
import { Icon } from '../../../components/ui/Icon';
import { RichText } from '../../../components/ui/RichText';

const bodyClass = 'text-[17px] leading-relaxed text-ink-soft dark:text-slate-300';

export function HookCardView({ card }: { card: HookCard }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      {card.icon && (
        <span className="grid h-20 w-20 place-items-center rounded-3xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
          <Icon name={card.icon} className="h-10 w-10" strokeWidth={2.5} />
        </span>
      )}
      <h2 className="text-2xl font-black leading-tight">{card.title}</h2>
      <p className={bodyClass}>
        <RichText text={card.body} />
      </p>
    </div>
  );
}

export function ConceptCardView({ card }: { card: ConceptCard }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        {card.icon && (
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Icon name={card.icon} className="h-6 w-6" strokeWidth={2.5} />
          </span>
        )}
        <h2 className="text-xl font-black leading-tight">{card.title}</h2>
      </div>
      <p className={bodyClass}>
        <RichText text={card.body} />
      </p>
    </div>
  );
}

export function ScienceCardView({ card }: { card: ScienceCard }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="eyebrow flex items-center gap-2 text-violet-600 dark:text-violet-300">
        <FlaskConical className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> What the research says
      </p>
      <h2 className="text-xl font-black leading-tight">{card.title}</h2>
      <p className={bodyClass}>
        <RichText text={card.finding} />
      </p>
      <p className="mt-auto rounded-2xl bg-violet-50 p-3 text-xs font-bold text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
        {card.source}
      </p>
    </div>
  );
}

export function ScriptCardView({ card }: { card: ScriptCard }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="eyebrow flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
        <MessageSquareQuote className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> Try saying
      </p>
      <h2 className="text-xl font-black leading-tight">{card.title}</h2>
      <ul className="flex flex-col gap-2">
        {card.lines.map((line) => (
          <li
            key={line}
            className="rounded-2xl rounded-bl-md border-2 border-slate-200 bg-slate-50 px-4 py-2.5 text-[15px] font-semibold dark:border-night-line dark:bg-night"
          >
            {line}
          </li>
        ))}
      </ul>
      {card.note && <p className="text-sm text-ink-soft dark:text-slate-400">{card.note}</p>}
    </div>
  );
}

export function TakeawayCardView({ card }: { card: TakeawayCard }) {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="eyebrow text-amber-600 dark:text-amber-400">Key takeaways</p>
      <h2 className="text-xl font-black leading-tight">{card.title}</h2>
      <ul className="flex flex-col gap-3">
        {card.points.map((point) => (
          <li key={point} className="flex items-start gap-3 text-[16px] font-semibold">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" strokeWidth={3} aria-hidden="true" />
            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}
