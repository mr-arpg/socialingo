import { AnimatePresence, motion } from 'framer-motion';
import { Gift, PackageOpen } from 'lucide-react';
import { useState } from 'react';
import type { Chapter } from '../../types';
import { useFeedback } from '../../hooks/useFeedback';
import { cn } from '../../lib/text';
import { useAppStore } from '../../store/useAppStore';
import { chestAvailable } from '../../engine/actions';

export function ChestNode({ chapter, offset }: { chapter: Chapter; offset: number }) {
  const data = useAppStore((s) => s.data);
  const openChest = useAppStore((s) => s.openChest);
  const feedback = useFeedback();
  const [reward, setReward] = useState(false);

  const opened = data.openedChests.includes(chapter.id);
  const available = chestAvailable(data, chapter.id);

  const onClick = () => {
    if (!available) return;
    if (openChest(chapter.id)) {
      feedback.celebrate();
      setReward(true);
      window.setTimeout(() => setReward(false), 2200);
    }
  };

  return (
    <div className="relative flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      <button
        type="button"
        onClick={onClick}
        disabled={!available}
        aria-label={`${chapter.chest.title}: ${opened ? 'opened' : available ? 'ready to open' : 'locked'}`}
        className={cn(
          'grid h-20 w-20 place-items-center rounded-3xl border-b-8 transition-transform active:translate-y-1 active:border-b-4',
          available && 'animate-wiggle bg-amber-400 border-b-amber-600 text-white',
          opened && 'bg-amber-100 border-b-amber-200 text-amber-500 dark:bg-amber-500/10 dark:border-b-amber-900',
          !available && !opened && 'bg-slate-200 border-b-slate-300 text-slate-400 dark:bg-night-line dark:border-b-night-card dark:text-slate-500',
        )}
      >
        {opened ? <PackageOpen className="h-10 w-10" strokeWidth={2.5} /> : <Gift className="h-10 w-10" strokeWidth={2.5} />}
      </button>
      <AnimatePresence>
        {reward && (
          <motion.span
            initial={{ opacity: 0, y: 0, scale: 0.6 }}
            animate={{ opacity: 1, y: -56, scale: 1.2 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute top-0 text-2xl font-black text-amber-500"
          >
            +{chapter.chest.xp} XP
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
