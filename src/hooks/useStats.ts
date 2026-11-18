import { useEffect, useMemo, useState } from 'react';
import type { UserStats } from '../types';
import { DAYS } from '../content/days';
import { computeStats } from '../engine/stats';
import { toISODate } from '../lib/dates';
import { useAppStore } from '../store/useAppStore';

/** Today's local date, refreshed when the tab regains focus or the clock passes midnight. */
export function useToday(): string {
  const [today, setToday] = useState(() => toISODate(new Date()));

  useEffect(() => {
    const refresh = () => setToday(toISODate(new Date()));
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return today;
}

export function useStats(): UserStats {
  const data = useAppStore((s) => s.data);
  const today = useToday();
  return useMemo(() => computeStats(data, DAYS, today), [data, today]);
}
