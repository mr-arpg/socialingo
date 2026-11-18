import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { CounterKey } from '../../types';
import { COUNTER_META } from '../../content/chapters';
import { Icon } from '../../components/ui/Icon';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { COUNTER_STYLES } from '../../lib/accents';
import { cn } from '../../lib/text';

interface RepCounterProps {
  counter: CounterKey;
  count: number;
  onTap: () => number;
  onUndo: () => void;
  label?: string;
  target?: number;
  compact?: boolean;
}

interface Pop {
  id: number;
  xp: number;
}

export function RepCounter({ counter, count, onTap, onUndo, label, target, compact }: RepCounterProps) {
  const meta = COUNTER_META[counter];
  const styles = COUNTER_STYLES[counter];
  const [pops, setPops] = useState<Pop[]>([]);
  const met = target !== undefined && count >= target;

  const tap = () => {
    const xp = onTap();
    const id = Date.now() + Math.random();
    setPops((p) => [...p, { id, xp }]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== id)), 900);
  };

  const plusButton = (
    <button
      type="button"
      onClick={tap}
      aria-label={`Log one ${meta.shortLabel.toLowerCase()}`}
      className={cn(
        'relative grid shrink-0 place-items-center rounded-2xl border-b-4 transition-transform duration-75 active:translate-y-[2px] active:border-b-2',
        compact ? 'h-11 w-11' : 'h-16 w-16',
        styles.button,
      )}
    >
      <Plus className={compact ? 'h-5 w-5' : 'h-8 w-8'} strokeWidth={3.5} aria-hidden="true" />
      <AnimatePresence>
        {pops.map((pop) => (
          <motion.span
            key={pop.id}
            initial={{ opacity: 1, y: 0, scale: 0.8 }}
            animate={{ opacity: 0, y: -48, scale: 1.1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: 'easeOut' }}
            className="pointer-events-none absolute -top-2 whitespace-nowrap text-sm font-black text-amber-500"
          >
            {pop.xp > 0 ? `+${pop.xp} XP` : '+1'}
          </motion.span>
        ))}
      </AnimatePresence>
    </button>
  );

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border-2 border-slate-200 p-2 pl-3 dark:border-night-line">
        <Icon name={meta.icon} className={cn('h-5 w-5', styles.text)} strokeWidth={2.5} />
        <span className="flex-1 text-sm font-extrabold">{meta.shortLabel}</span>
        <span className="min-w-6 text-center text-lg font-black tabular-nums" aria-live="polite">
          {count}
        </span>
        <button
          type="button"
          onClick={onUndo}
          disabled={count === 0}
          aria-label={`Undo last ${meta.shortLabel.toLowerCase()}`}
          className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-night-line"
        >
          <Minus className="h-4 w-4" strokeWidth={3} />
        </button>
        {plusButton}
      </div>
    );
  }

  return (
    <div className={cn('rounded-3xl border-2 border-b-4 p-4', met ? 'border-emerald-300 dark:border-emerald-500/40' : 'border-slate-200 dark:border-night-line')}>
      <div className="flex items-center gap-4">
        <span className={cn('grid h-12 w-12 shrink-0 place-items-center rounded-2xl', styles.chip)}>
          <Icon name={meta.icon} className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold text-ink-soft dark:text-slate-400">{label ?? meta.label}</p>
          <p className="text-2xl font-black tabular-nums" aria-live="polite">
            {count}
            {target !== undefined && <span className="text-base text-ink-soft dark:text-slate-500"> / {target}</span>}
          </p>
        </div>
        <button
          type="button"
          onClick={onUndo}
          disabled={count === 0}
          aria-label={`Undo last ${meta.shortLabel.toLowerCase()}`}
          className="grid h-10 w-10 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 disabled:opacity-30 dark:hover:bg-night-line"
        >
          <Minus className="h-5 w-5" strokeWidth={3} />
        </button>
        {plusButton}
      </div>
      {target !== undefined && <ProgressBar value={count} max={target} className="mt-3 h-3" barClassName={styles.bar} label={label} />}
    </div>
  );
}
