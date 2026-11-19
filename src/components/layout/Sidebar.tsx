import { Cloud, CloudOff, Settings } from 'lucide-react';
import { NavLink } from 'react-router';
import { cn } from '../../lib/text';
import { useCloudSyncStore } from '../../store/cloudSync';
import { NAV_ITEMS } from './navItems';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-4 rounded-2xl border-2 px-4 py-3 text-sm font-extrabold uppercase tracking-wide transition-colors',
    isActive
      ? 'border-sky-300 bg-sky-50 text-sky-600 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300'
      : 'border-transparent text-ink-soft hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-night-line/50',
  );

export function Sidebar() {
  const user = useCloudSyncStore((s) => s.user);
  const syncStatus = useCloudSyncStore((s) => s.syncStatus);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r-2 border-slate-200 bg-white px-4 py-6 dark:border-night-line dark:bg-night-card md:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="" className="h-10 w-10" />
        <div className="leading-tight">
          <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">Socialingo</p>
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
      <div className="flex flex-col gap-1">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-2xl border-2 border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-extrabold transition-colors hover:bg-slate-100 dark:border-night-line dark:bg-night dark:hover:bg-night-line/40"
        >
          {user ? (
            <>
              {user.photoURL ? (
                <img src={user.photoURL} alt="" referrerPolicy="no-referrer" className="h-7 w-7 rounded-full" />
              ) : (
                <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-black text-white">
                  {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                </span>
              )}
              <span className="min-w-0 flex-1 truncate text-ink dark:text-slate-100">
                {user.displayName || user.email || 'Synced'}
              </span>
              {syncStatus === 'offline' ? (
                <CloudOff className="h-4 w-4 shrink-0 text-amber-500" strokeWidth={2.5} aria-label="Offline" />
              ) : (
                <Cloud className="h-4 w-4 shrink-0 text-emerald-500" strokeWidth={2.5} aria-label="Cloud synced" />
              )}
            </>
          ) : (
            <>
              <Cloud className="h-5 w-5 shrink-0 text-slate-400" strokeWidth={2.5} aria-hidden="true" />
              <span className="text-ink-soft dark:text-slate-400">Sign in to sync</span>
            </>
          )}
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          <Settings className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
