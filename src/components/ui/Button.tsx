import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/text';

export type ButtonVariant = 'primary' | 'secondary' | 'amber' | 'indigo' | 'rose' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-emerald-500 text-white border-transparent border-b-emerald-700 hover:bg-emerald-400',
  secondary:
    'bg-white text-ink border-slate-200 hover:bg-slate-50 dark:bg-night-card dark:text-slate-100 dark:border-night-line dark:hover:bg-night-line/40',
  amber: 'bg-amber-400 text-amber-950 border-transparent border-b-amber-600 hover:bg-amber-300',
  indigo: 'bg-indigo-500 text-white border-transparent border-b-indigo-700 hover:bg-indigo-400',
  rose: 'bg-rose-500 text-white border-transparent border-b-rose-700 hover:bg-rose-400',
  ghost:
    'bg-transparent text-ink-soft border-transparent hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-night-line/50',
};

const SIZES: Record<Size, string> = {
  sm: 'h-10 px-4 text-xs',
  md: 'h-12 px-5 text-sm',
  lg: 'h-14 px-6 text-base',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: Size;
  block?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', block, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-2xl border-2 font-extrabold uppercase tracking-wide transition-[transform,background-color,border-width] duration-75',
        variant !== 'ghost' && 'border-b-4 active:translate-y-[2px] active:border-b-2',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANTS[variant],
        SIZES[size],
        block && 'w-full',
        className,
      )}
      {...props}
    />
  );
});
