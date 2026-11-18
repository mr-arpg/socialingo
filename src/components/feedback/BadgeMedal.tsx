import type { BadgeDefinition, BadgeTier } from '../../types';
import { cn } from '../../lib/text';
import { Icon } from '../ui/Icon';

const TIERS: Record<BadgeTier, string> = {
  bronze: 'bg-orange-300 border-b-orange-600 text-orange-900',
  silver: 'bg-gradient-to-b from-slate-200 to-slate-300 border-b-slate-500 text-slate-700',
  gold: 'bg-amber-300 border-b-amber-600 text-amber-900',
};

const SIZES = {
  sm: { medal: 'h-12 w-12', icon: 'h-6 w-6' },
  md: { medal: 'h-16 w-16', icon: 'h-8 w-8' },
  lg: { medal: 'h-24 w-24', icon: 'h-12 w-12' },
};

export function BadgeMedal({
  badge,
  size = 'md',
  locked = false,
}: {
  badge: BadgeDefinition;
  size?: keyof typeof SIZES;
  locked?: boolean;
}) {
  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center rounded-full border-2',
        SIZES[size].medal,
        locked
          ? 'border-dashed border-slate-300 bg-slate-50 text-slate-300 dark:border-slate-600 dark:bg-night dark:text-slate-600'
          : cn('border-transparent', size === 'lg' ? 'border-b-8' : 'border-b-4', TIERS[badge.tier]),
      )}
    >
      <Icon name={badge.icon} className={SIZES[size].icon} strokeWidth={2.5} />
    </span>
  );
}
