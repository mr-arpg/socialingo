import { AnimatePresence, motion } from 'framer-motion';
import { Check, Crown, Lock, Moon, Star, Trophy } from 'lucide-react';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router';
import type { AccentColor, NodeState } from '../../types';
import { Button } from '../../components/ui/Button';
import type { PathNodeModel } from '../../engine/day';
import { ACCENTS } from '../../lib/accents';
import { formatDateTime } from '../../lib/dates';
import { cn } from '../../lib/text';

interface PathNodeProps {
  node: PathNodeModel;
  accent: AccentColor;
  offset: number;
  open: boolean;
  onToggle: () => void;
}

function nodeClasses(state: NodeState, accent: AccentColor): string {
  switch (state) {
    case 'mastered':
      return 'bg-amber-400 border-b-amber-600 text-white';
    case 'completed':
    case 'current':
      return ACCENTS[accent].node;
    case 'cooldown':
      return 'bg-sky-100 border-b-sky-300 text-sky-500 dark:bg-sky-500/15 dark:border-b-sky-700';
    case 'locked':
      return 'bg-slate-200 border-b-slate-300 text-slate-400 dark:bg-night-line dark:border-b-night-card dark:text-slate-500';
  }
}

function NodeIcon({ state, milestone }: { state: NodeState; milestone: boolean }) {
  const props = { className: milestone ? 'h-9 w-9' : 'h-8 w-8', strokeWidth: 3, 'aria-hidden': true } as const;
  if (state === 'mastered') return <Crown {...props} fill="currentColor" />;
  if (state === 'completed') return <Check {...props} />;
  if (state === 'cooldown') return <Moon {...props} />;
  if (state === 'locked') return <Lock {...props} />;
  return milestone ? <Trophy {...props} fill="currentColor" /> : <Star {...props} fill="currentColor" />;
}

const STATE_LABEL: Record<NodeState, string> = {
  locked: 'locked',
  cooldown: 'opens in 24 hours',
  current: 'ready to start',
  completed: 'completed',
  mastered: 'mastered',
};

export const PathNode = forwardRef<HTMLDivElement, PathNodeProps>(function PathNode(
  { node, accent, offset, open, onToggle },
  ref,
) {
  const navigate = useNavigate();
  const { day, state, content } = node;
  const milestone = Boolean(content?.isMilestone);
  const playable = state === 'current' || state === 'completed' || state === 'mastered';

  return (
    <div ref={ref} className="relative flex flex-col items-center" style={{ transform: `translateX(${offset}px)` }}>
      {state === 'current' && !open && (
        <div className="absolute -top-11 left-1/2 z-10 animate-bob whitespace-nowrap rounded-xl border-2 border-slate-200 bg-white px-3 py-1.5 text-xs font-black uppercase tracking-wide text-emerald-600 shadow-sm dark:border-night-line dark:bg-night-card">
          {day === 1 ? 'Start' : 'Next up'}
          <span className="absolute -bottom-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-slate-200 bg-white dark:border-night-line dark:bg-night-card" />
        </div>
      )}

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`Day ${day}${content ? `: ${content.title}` : ''}, ${STATE_LABEL[state]}`}
        className={cn(
          'relative grid place-items-center rounded-full border-b-8 transition-transform duration-75 active:translate-y-1 active:border-b-4',
          milestone ? 'h-24 w-24' : 'h-[76px] w-[76px]',
          nodeClasses(state, accent),
          state === 'current' && 'animate-node-pulse',
        )}
      >
        <NodeIcon state={state} milestone={milestone} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="card absolute top-full z-20 mt-3 w-72 p-4 text-left shadow-xl"
            style={{ left: '50%', marginLeft: -144 - offset / 2 }}
          >
            <p className={cn('eyebrow', ACCENTS[accent].text)}>Day {day}</p>
            <h3 className="mt-1 text-lg font-black leading-tight">{content?.title ?? 'Coming soon'}</h3>
            <p className="mt-1 text-sm text-ink-soft dark:text-slate-400">
              {content?.tagline ?? 'This day is still being written. Check back after the next content drop.'}
            </p>
            {playable && content && (
              <Button block className="mt-4" onClick={() => navigate(`/day/${day}`)}>
                {state === 'current' ? `Start · +${content.rewards.xp} XP` : 'Review'}
              </Button>
            )}
            {state === 'locked' && content && (
              <p className="mt-3 rounded-2xl bg-slate-100 p-3 text-sm font-bold text-ink-soft dark:bg-night-line dark:text-slate-300">
                Complete Day {day - 1} to unlock.
              </p>
            )}
            {state === 'cooldown' && (
              <p className="mt-3 rounded-2xl bg-sky-50 p-3 text-sm font-bold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                {node.opensAt
                  ? `Opens ${formatDateTime(node.opensAt)}, 24 hours after you finished Day ${day - 1}.`
                  : 'This opens 24 hours after you finish the previous day.'}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
