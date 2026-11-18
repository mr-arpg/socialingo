import { NavLink } from 'react-router';
import { cn } from '../../lib/text';
import { NAV_ITEMS } from './navItems';

export function BottomNav() {
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-slate-200 bg-white/95 pb-safe backdrop-blur dark:border-night-line dark:bg-night-card/95 md:hidden"
    >
      <ul className="mx-auto flex max-w-md justify-around px-2 pt-2">
        {NAV_ITEMS.map(({ to, label, icon: IconComponent }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-w-16 flex-col items-center gap-0.5 rounded-2xl border-2 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wide transition-colors',
                  isActive
                    ? 'border-sky-300 bg-sky-50 text-sky-600 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-500',
                )
              }
            >
              <IconComponent className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
