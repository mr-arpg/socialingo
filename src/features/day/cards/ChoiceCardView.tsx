import { AnimatePresence, motion } from 'framer-motion';
import { CircleCheck, CircleX, Lightbulb } from 'lucide-react';
import type { QuizCard, ScenarioCard, ScenarioRating } from '../../../types';
import { cn } from '../../../lib/text';

interface ChoiceCardProps {
  card: QuizCard | ScenarioCard;
  picks: string[];
  onPick: (optionId: string) => void;
}

const RATING_STYLES: Record<ScenarioRating, string> = {
  great: 'border-emerald-400 bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-100',
  okay: 'border-amber-400 bg-amber-50 text-amber-900 dark:bg-amber-500/15 dark:text-amber-100',
  avoid: 'border-rose-400 bg-rose-50 text-rose-900 dark:bg-rose-500/15 dark:text-rose-100',
};

export function isChoiceSolved(card: QuizCard | ScenarioCard, picks: readonly string[]): boolean {
  if (card.kind === 'scenario') return picks.length > 0;
  const correct = card.options.find((o) => o.correct);
  return Boolean(correct && picks.includes(correct.id));
}

export function ChoiceCardView({ card, picks, onPick }: ChoiceCardProps) {
  const solved = isChoiceSolved(card, picks);
  const lastPick = picks[picks.length - 1];
  const feedback = feedbackFor(card, lastPick, solved);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <p className="eyebrow text-sky-600 dark:text-sky-400">{card.kind === 'quiz' ? 'Quick check' : 'What would you do?'}</p>
      {card.kind === 'scenario' && <p className="text-[16px] text-ink-soft dark:text-slate-300">{card.situation}</p>}
      <h2 className="text-xl font-black leading-tight">{card.kind === 'quiz' ? card.question : card.prompt}</h2>

      <ul className="flex flex-col gap-2">
        {card.options.map((option) => {
          const picked = picks.includes(option.id);
          const style = !picked
            ? 'border-slate-200 bg-white hover:bg-slate-50 dark:border-night-line dark:bg-night-card dark:hover:bg-night-line/40'
            : card.kind === 'quiz'
              ? (option as QuizCard['options'][number]).correct
                ? RATING_STYLES.great
                : RATING_STYLES.avoid
              : RATING_STYLES[(option as ScenarioCard['options'][number]).rating];
          const disabled = card.kind === 'quiz' ? solved || picked : picked;
          return (
            <li key={option.id}>
              <button
                type="button"
                disabled={disabled}
                onClick={() => onPick(option.id)}
                className={cn(
                  'w-full rounded-2xl border-2 border-b-4 px-4 py-3 text-left text-[15px] font-bold transition-colors active:translate-y-[2px] active:border-b-2 disabled:active:translate-y-0',
                  style,
                  disabled && !picked && 'opacity-50',
                )}
              >
                {option.text}
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            key={lastPick + String(solved)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={cn('flex gap-3 rounded-2xl p-4 text-sm font-semibold', feedback.className)}
            role="status"
          >
            <feedback.Icon className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={3} aria-hidden="true" />
            <p>{feedback.text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function feedbackFor(card: QuizCard | ScenarioCard, optionId: string | undefined, solved: boolean) {
  if (!optionId) return null;
  if (card.kind === 'scenario') {
    const option = card.options.find((o) => o.id === optionId)!;
    const Icon = option.rating === 'great' ? CircleCheck : option.rating === 'okay' ? Lightbulb : CircleX;
    const className =
      option.rating === 'great'
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200'
        : option.rating === 'okay'
          ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-200'
          : 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200';
    return { Icon, className, text: option.feedback };
  }
  const option = card.options.find((o) => o.id === optionId)!;
  if (solved) {
    return {
      Icon: CircleCheck,
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-200',
      text: card.explanation,
    };
  }
  return {
    Icon: CircleX,
    className: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200',
    text: `${option.feedback ?? 'Not quite.'} Try another answer.`,
  };
}
