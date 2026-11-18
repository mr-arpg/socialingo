import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useFeedback } from '../../hooks/useFeedback';
import { useAppStore } from '../../store/useAppStore';
import { BadgeMedal } from './BadgeMedal';

const TOAST_MS = 3000;

export function BadgeToaster() {
  const badge = useAppStore((s) => s.badgeQueue[0]);
  const dismiss = useAppStore((s) => s.dismissBadge);
  const feedback = useFeedback();

  useEffect(() => {
    if (!badge) return;
    feedback.success();
    const timer = window.setTimeout(() => dismiss(badge.id), TOAST_MS);
    return () => window.clearTimeout(timer);
  }, [badge, dismiss, feedback]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[60] flex justify-center px-4" aria-live="polite">
      <AnimatePresence>
        {badge && (
          <motion.button
            key={badge.id}
            type="button"
            onClick={() => dismiss(badge.id)}
            className="card pointer-events-auto flex w-full max-w-sm items-center gap-4 p-3 text-left shadow-xl"
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          >
            <BadgeMedal badge={badge} size="sm" />
            <div>
              <p className="eyebrow text-amber-600 dark:text-amber-400">Badge unlocked</p>
              <p className="font-black">{badge.name}</p>
              <p className="text-sm text-ink-soft dark:text-slate-400">{badge.description}</p>
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
