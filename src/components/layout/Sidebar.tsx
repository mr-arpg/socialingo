import { Settings } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '../../lib/text';
import { NAV_ITEMS } from './navItems';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-4 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold uppercase tracking-wide transition-colors',
    isActive
      ? 'border-sky-300 bg-sky-50 text-sky-600 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300'
      : 'border-transparent text-ink-soft hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-night-line/50',
  );

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-2 border-slate-200 bg-white px-4 py-6 dark:border-night-line dark:bg-night-card md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="h-10 w-10" />
        <div className="leading-tight">
          <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">30-Day</p>
          <p className="text-xs font-bold uppercase tracking-widest text-ink-soft dark:text-slate-400">
            Social Challenge
          </p>
        </div>
      </div>
      <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: IconComponent }) => (
          <NavLink key={to} to={to} end={to === '/'} className={linkClass}>
            <IconComponent className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
      <NavLink to="/settings" className={linkClass}>
        <Settings className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
        Settings
      </NavLink>
    </aside>
  );
}
