import { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';

const QUERY = '(prefers-reduced-motion: reduce)';

export function useReducedMotion(): boolean {
  const preference = useAppStore((s) => s.data.settings.motion);
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia(QUERY).matches);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setSystemReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (preference === 'reduced') return true;
  if (preference === 'full') return false;
  return systemReduced;
}
