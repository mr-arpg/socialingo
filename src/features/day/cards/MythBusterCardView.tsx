import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import type { MythBusterCard } from '../../../types';
import { RichText } from '../../../components/ui/RichText';

export function MythBusterCardView({ card }: { card: MythBusterCard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={flipped ? 'Show the myth' : 'Reveal the reality'}
      className="relative flex flex-1 [perspective:1200px]"
    >
      <motion.div
        className="preserve-3d relative min-h-[260px] w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
      >
        <Face className="bg-rose-50 text-rose-900 dark:bg-rose-500/10 dark:text-rose-100">
          <p className="eyebrow text-rose-500">Myth</p>
          <p className="text-2xl font-black leading-snug">“{card.myth}”</p>
          <Hint>Tap to bust it</Hint>
        </Face>
        <Face back className="bg-emerald-50 text-emerald-950 dark:bg-emerald-500/10 dark:text-emerald-50">
          <p className="eyebrow text-emerald-600 dark:text-emerald-400">Reality</p>
          <p className="text-[17px] leading-relaxed">
            <RichText text={card.reality} />
          </p>
          <Hint>Tap to flip back</Hint>
        </Face>
      </motion.div>
    </button>
  );
}

function Face({ children, className, back }: { children: ReactNode; className: string; back?: boolean }) {
  return (
    <div
      className={`backface-hidden absolute inset-0 flex flex-col gap-4 rounded-3xl p-6 text-left ${className}`}
      style={back ? { transform: 'rotateY(180deg)' } : undefined}
    >
      {children}
    </div>
  );
}

function Hint({ children }: { children: ReactNode }) {
  return (
    <span className="mt-auto flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest opacity-60">
      <RefreshCw className="h-4 w-4" strokeWidth={3} aria-hidden="true" /> {children}
    </span>
  );
}
