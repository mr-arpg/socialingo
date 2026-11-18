import { useEffect, useMemo, useState } from 'react';
import type { UserStats } from '../types';
import { DAYS } from '../content/days';
import { computeStats } from '../engine/stats';
import { toISODate } from '../lib/dates';
import { useAppStore } from '../store/useAppStore';

/** Current time, refreshed each minute and when the tab regains focus. */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const refresh = () => setNow(new Date());
    const interval = window.setInterval(refresh, 60_000);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  return now;
}

/** Today's local date, refreshed when the tab regains focus or the clock passes midnight. */
export function useToday(): string {
  const now = useNow();
  return toISODate(now);
}

export function useStats(): UserStats {
  const data = useAppStore((s) => s.data);
  const today = useToday();
  return useMemo(() => computeStats(data, DAYS, today), [data, today]);
}
