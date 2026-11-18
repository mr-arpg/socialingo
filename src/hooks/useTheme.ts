import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

const DARK_QUERY = '(prefers-color-scheme: dark)';

/** Keeps the `dark` class on <html> in sync with the theme setting and the OS preference. */
export function useTheme(): void {
  const theme = useAppStore((s) => s.data.settings.theme);

  useEffect(() => {
    const mq = window.matchMedia(DARK_QUERY);
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && mq.matches);
      document.documentElement.classList.toggle('dark', dark);
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#12111A' : '#10B981');
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [theme]);
}
