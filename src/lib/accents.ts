import type { AccentColor, CounterKey } from '../types';

interface AccentClasses {
  banner: string;
  node: string;
  soft: string;
  text: string;
  bar: string;
}

/** Full class names so Tailwind's scanner can see them. */
export const ACCENTS: Record<AccentColor, AccentClasses> = {
  emerald: {
    banner: 'bg-emerald-500 border-b-emerald-700 text-white',
    node: 'bg-emerald-500 border-b-emerald-700 text-white',
    soft: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    bar: 'bg-emerald-500',
  },
  amber: {
    banner: 'bg-amber-500 border-b-amber-700 text-white',
    node: 'bg-amber-500 border-b-amber-700 text-white',
    soft: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
    bar: 'bg-amber-500',
  },
  indigo: {
    banner: 'bg-indigo-500 border-b-indigo-700 text-white',
    node: 'bg-indigo-500 border-b-indigo-700 text-white',
    soft: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300',
    text: 'text-indigo-600 dark:text-indigo-400',
    bar: 'bg-indigo-500',
  },
  rose: {
    banner: 'bg-rose-500 border-b-rose-700 text-white',
    node: 'bg-rose-500 border-b-rose-700 text-white',
    soft: 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
    text: 'text-rose-600 dark:text-rose-400',
    bar: 'bg-rose-500',
  },
};

export const COUNTER_STYLES: Record<CounterKey, { chip: string; text: string; button: string; bar: string }> = {
  approaches: {
    chip: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
    text: 'text-emerald-500',
    button: 'bg-emerald-500 border-b-emerald-700 text-white',
    bar: 'bg-emerald-500',
  },
  conversations: {
    chip: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
    text: 'text-indigo-500',
    button: 'bg-indigo-500 border-b-indigo-700 text-white',
    bar: 'bg-indigo-500',
  },
  kindnesses: {
    chip: 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
    text: 'text-rose-500',
    button: 'bg-rose-500 border-b-rose-700 text-white',
    bar: 'bg-rose-500',
  },
  courageReps: {
    chip: 'bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
    text: 'text-orange-500',
    button: 'bg-orange-500 border-b-orange-700 text-white',
    bar: 'bg-orange-500',
  },
};
