import { Shield } from 'lucide-react';
import { Link } from 'react-router';
import { setAdminUnlock, useAdminUnlock } from '../../lib/admin';

export function AdminScreen() {
  const unlocked = useAdminUnlock();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-black">Admin</h1>
        <p className="mt-1 font-semibold text-ink-soft dark:text-slate-400">
          A private switch for this browser. It is not in the menu, and it does not travel with a backup.
        </p>
      </header>

      <section className="card flex flex-col gap-4 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
            <Shield className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-black">Open every written day</h2>
            <p className="text-sm text-ink-soft dark:text-slate-400">
              Skips the 24-hour wait and the “finish the previous day” lock. Days that have no mission yet stay locked.
            </p>
          </div>
        </div>
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 dark:bg-night-line/40">
          <span className="font-extrabold">{unlocked ? 'Full path is open' : 'One day at a time'}</span>
          <input
            type="checkbox"
            role="switch"
            checked={unlocked}
            onChange={(e) => setAdminUnlock(e.target.checked)}
            className="peer sr-only"
          />
          <span className="relative h-8 w-14 shrink-0 rounded-full bg-slate-300 transition-colors after:absolute after:left-1 after:top-1 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-6 peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-400/60 dark:bg-night-line" />
        </label>
        <Link to="/" className="text-sm font-extrabold text-sky-600 dark:text-sky-300">
          Back to the path
        </Link>
      </section>
    </div>
  );
}
