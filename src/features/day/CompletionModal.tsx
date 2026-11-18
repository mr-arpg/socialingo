import { motion } from 'framer-motion';
import { Crown, Flame, Sparkles, Trophy, Zap } from 'lucide-react';
import type { AttributeKey, CompletionSummary, CounterKey, StatDelta } from '../../types';
import { ATTRIBUTE_META, COUNTER_META } from '../../content/chapters';
import { BadgeMedal } from '../../components/feedback/BadgeMedal';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Modal } from '../../components/ui/Modal';
import { COUNTER_STYLES } from '../../lib/accents';
import { cn } from '../../lib/text';

interface CompletionModalProps {
  summary: CompletionSummary | null;
  title: string;
  onClose: () => void;
}

export function CompletionModal({ summary, title, onClose }: CompletionModalProps) {
  return (
    <Modal open={summary !== null} onClose={onClose} labelledBy="completion-title" dismissible={false}>
      {summary && <Body summary={summary} title={title} onClose={onClose} />}
    </Modal>
  );
}

function Body({ summary, title, onClose }: { summary: CompletionSummary; title: string; onClose: () => void }) {
  const { day, mastered, deltas, badges, levelUp } = summary;
  const HeroIcon = mastered ? Crown : Trophy;

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <motion.span
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 0.1 }}
        className={cn(
          'grid h-20 w-20 place-items-center rounded-full border-b-8',
          mastered ? 'bg-amber-400 border-b-amber-600 text-white' : 'bg-emerald-500 border-b-emerald-700 text-white',
        )}
      >
        <HeroIcon className="h-10 w-10" fill="currentColor" strokeWidth={2} aria-hidden="true" />
      </motion.span>

      <div>
        <h2 id="completion-title" className="text-3xl font-black">
          Day {day} {mastered ? 'mastered!' : 'complete!'}
        </h2>
        <p className="mt-1 font-bold text-ink-soft dark:text-slate-400">{title}</p>
      </div>

      {levelUp && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex w-full items-center gap-3 rounded-2xl bg-indigo-500 p-4 text-left text-white"
        >
          <Sparkles className="h-8 w-8 shrink-0" strokeWidth={2.5} aria-hidden="true" />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-white/80">Level up!</p>
            <p className="text-lg font-black">
              Level {levelUp.to} · {levelUp.rank.title}
            </p>
          </div>
        </motion.div>
      )}

      <ul className="grid w-full grid-cols-2 gap-2">
        {deltas.map((delta, i) => (
          <motion.li
            key={`${delta.kind}-${delta.key}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.07, type: 'spring', stiffness: 300, damping: 20 }}
            className={cn('flex items-center gap-3 rounded-2xl border-2 p-3 text-left', delta.kind === 'xp' && 'col-span-2', 'border-slate-200 dark:border-night-line')}
          >
            <DeltaIcon delta={delta} />
            <div className="min-w-0">
              <p className="text-lg font-black leading-none tabular-nums">+{delta.delta}</p>
              <p className="mt-0.5 line-clamp-2 text-xs font-bold leading-tight text-ink-soft dark:text-slate-400">{delta.label}</p>
            </div>
          </motion.li>
        ))}
      </ul>

      {badges.length > 0 && (
        <div className="w-full">
          <p className="eyebrow mb-2 text-amber-600 dark:text-amber-400">Badges unlocked</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {badges.map((badge) => (
              <li key={badge.id} className="flex w-24 flex-col items-center gap-1">
                <BadgeMedal badge={badge} />
                <span className="text-xs font-extrabold leading-tight">{badge.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <Button size="lg" block onClick={onClose}>
        Continue
      </Button>
    </div>
  );
}

function DeltaIcon({ delta }: { delta: StatDelta }) {
  const base = 'grid h-10 w-10 shrink-0 place-items-center rounded-xl';
  if (delta.kind === 'xp') {
    return (
      <span className={cn(base, 'bg-amber-100 text-amber-500 dark:bg-amber-500/15')}>
        <Zap className="h-5 w-5" fill="currentColor" aria-hidden="true" />
      </span>
    );
  }
  if (delta.kind === 'streak') {
    return (
      <span className={cn(base, 'bg-orange-100 text-orange-500 dark:bg-orange-500/15')}>
        <Flame className="h-5 w-5" fill="currentColor" aria-hidden="true" />
      </span>
    );
  }
  if (delta.kind === 'counter') {
    const key = delta.key as CounterKey;
    return (
      <span className={cn(base, COUNTER_STYLES[key].chip)}>
        <Icon name={COUNTER_META[key].icon} className="h-5 w-5" strokeWidth={2.5} />
      </span>
    );
  }
  return (
    <span className={cn(base, 'bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-300')}>
      <Icon name={ATTRIBUTE_META[delta.key as AttributeKey].icon} className="h-5 w-5" strokeWidth={2.5} />
    </span>
  );
}
