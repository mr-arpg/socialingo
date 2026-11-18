import { motion } from 'framer-motion';
import { cn } from '../../lib/text';

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  label?: string;
}

export function ProgressBar({ value, max = 1, className, barClassName = 'bg-emerald-500', label }: ProgressBarProps) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={Math.min(value, max)}
      className={cn('h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-night-line', className)}
    >
      <motion.div
        className={cn('relative h-full rounded-full', barClassName)}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 140, damping: 22 }}
      >
        {pct > 6 && <div className="absolute inset-x-2 top-[3px] h-[30%] rounded-full bg-white/30" />}
      </motion.div>
    </div>
  );
}
