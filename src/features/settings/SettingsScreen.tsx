import { Cloud, CloudOff, Download, LogOut, Monitor, Moon, RefreshCw, Sun, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import type { MotionPreference, ThemePreference } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { MAX_DISPLAY_NAME_LENGTH } from '../../engine/mergeState';
import { toISODate } from '../../lib/dates';
import { downloadFile } from '../../lib/effects';
import { cn } from '../../lib/text';
import { useCloudSyncStore } from '../../store/cloudSync';
import { useAppStore } from '../../store/useAppStore';

export function SettingsScreen() {
  const data = useAppStore((s) => s.data);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setDisplayName = useAppStore((s) => s.setDisplayName);
  const replaceState = useAppStore((s) => s.replaceState);
  const resetAll = useAppStore((s) => s.resetAll);
  const { settings } = data;

  const user = useCloudSyncStore((s) => s.user);
  const authReady = useCloudSyncStore((s) => s.authReady);
  const syncStatus = useCloudSyncStore((s) => s.syncStatus);
  const syncError = useCloudSyncStore((s) => s.syncError);
  const signingIn = useCloudSyncStore((s) => s.signingIn);
  const signInWithGoogle = useCloudSyncStore((s) => s.signInWithGoogle);
  const signOutGoogle = useCloudSyncStore((s) => s.signOutGoogle);
  const syncNow = useCloudSyncStore((s) => s.syncNow);

  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ tone: 'ok' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const exportBackup = async () => {
    const { createBackup } = await import('../../store/backup');
    downloadFile(`30day-challenge-backup-${toISODate(new Date())}.json`, JSON.stringify(createBackup(data), null, 2));
    setMessage({ tone: 'ok', text: 'Backup downloaded. Keep it somewhere safe.' });
  };

  const importBackup = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const { parseBackup } = await import('../../store/backup');
    const result = parseBackup(await file.text());
    if (!result.ok) {
      setMessage({ tone: 'error', text: result.error });
      return;
    }
    if (!window.confirm('Replace your current progress with this backup? This cannot be undone.')) return;
    replaceState(result.state);
    setMessage({ tone: 'ok', text: 'Backup restored.' });
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-black">Settings</h1>

      <Section title="Account & Cloud Sync">
        {!user ? (
          <>
            <p className="text-sm text-ink-soft dark:text-slate-400">
              Sign in with your Google account to back up your challenge progress and sync it across your devices.
            </p>
            <Button
              variant="secondary"
              disabled={!authReady || signingIn}
              onClick={() => void signInWithGoogle()}
            >
              <GoogleMark />
              {signingIn ? 'Signing in...' : 'Sign in with Google'}
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-11 w-11 shrink-0 rounded-full border-2 border-slate-200 dark:border-night-line"
                  />
                ) : (
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-emerald-500 text-base font-black text-white">
                    {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-extrabold">{user.displayName || 'Google Account'}</p>
                  {user.email && <p className="truncate text-xs font-semibold text-ink-soft dark:text-slate-400">{user.email}</p>}
                </div>
              </div>
              <span
                className={cn(
                  'inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs font-extrabold',
                  syncStatus === 'synced' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
                  syncStatus === 'syncing' && 'bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
                  syncStatus === 'offline' && 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
                  syncStatus === 'error' && 'bg-rose-50 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
                )}
              >
                {syncStatus === 'offline' ? (
                  <CloudOff className="h-3.5 w-3.5" strokeWidth={2.5} />
                ) : (
                  <Cloud className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
                {syncStatus === 'synced' && 'Synced'}
                {syncStatus === 'syncing' && 'Syncing...'}
                {syncStatus === 'offline' && 'Offline'}
                {syncStatus === 'error' && 'Error'}
                {syncStatus === 'local' && 'Local'}
              </span>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Button variant="secondary" disabled={syncStatus === 'syncing'} onClick={() => void syncNow()}>
                <RefreshCw className={cn('h-4 w-4', syncStatus === 'syncing' && 'animate-spin')} strokeWidth={3} />
                Sync now
              </Button>
              <Button variant="ghost" onClick={() => void signOutGoogle()}>
                <LogOut className="h-4 w-4" strokeWidth={3} /> Sign out
              </Button>
            </div>
          </div>
        )}

        {syncError && (
          <p role="status" className="rounded-2xl bg-amber-50 p-3 text-sm font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
            {syncError}
          </p>
        )}
      </Section>

      <Section title="Profile">
        <label htmlFor="display-name" className="font-bold">
          Your name
        </label>
        <input
          id="display-name"
          value={data.profile.displayName}
          maxLength={MAX_DISPLAY_NAME_LENGTH}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Used on your exported logbook"
          className="h-12 rounded-2xl border-2 border-slate-200 bg-slate-50 px-4 font-semibold focus:border-sky-400 focus:outline-none dark:border-night-line dark:bg-night"
        />
      </Section>

      <Section title="Appearance">
        <Segmented<ThemePreference>
          label="Theme"
          value={settings.theme}
          onChange={(theme) => updateSettings({ theme })}
          options={[
            { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" strokeWidth={3} /> },
            { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" strokeWidth={3} /> },
            { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" strokeWidth={3} /> },
          ]}
        />
        <Segmented<MotionPreference>
          label="Animations"
          value={settings.motion}
          onChange={(motion) => updateSettings({ motion })}
          options={[
            { value: 'system', label: 'System' },
            { value: 'reduced', label: 'Reduced' },
            { value: 'full', label: 'Full' },
          ]}
        />
      </Section>

      <Section title="Feedback">
        <Toggle label="Sound effects" checked={settings.sound} onChange={(sound) => updateSettings({ sound })} />
        <Toggle label="Vibration" description="On supported phones" checked={settings.haptics} onChange={(haptics) => updateSettings({ haptics })} />
      </Section>

      <Section title="Your data">
        <p className="text-sm text-ink-soft dark:text-slate-400">
          {user
            ? 'Your progress is saved on this device and synced to your Google account. You can still export a JSON backup anytime.'
            : 'Progress is currently stored only on this device. Sign in with Google above to sync across devices, or export a backup regularly.'}
        </p>
        <div className="grid gap-2 sm:grid-cols-2">
          <Button variant="secondary" onClick={exportBackup}>
            <Download className="h-4 w-4" strokeWidth={3} /> Export backup
          </Button>
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            <Upload className="h-4 w-4" strokeWidth={3} /> Import backup
          </Button>
        </div>
        <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={importBackup} />
        {message && (
          <p
            role="status"
            className={cn(
              'rounded-2xl p-3 text-sm font-bold',
              message.tone === 'ok'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300',
            )}
          >
            {message.text}
          </p>
        )}
        <Button variant="ghost" className="text-rose-600 dark:text-rose-400" onClick={() => setConfirmReset(true)}>
          <Trash2 className="h-4 w-4" strokeWidth={3} /> Reset all progress
        </Button>
      </Section>

      <p className="px-2 text-xs text-ink-soft dark:text-slate-500">
        Inspired by the 30-Day Challenge format in Neil Strauss’s <i>The Rules of the Game</i>, rebuilt from scratch for
        authentic connection. Not affiliated with the original author or publisher.
      </p>

      <Modal open={confirmReset} onClose={() => setConfirmReset(false)} labelledBy="reset-title">
        <h2 id="reset-title" className="text-xl font-black">
          Reset everything?
        </h2>
        <p className="mt-2 text-ink-soft dark:text-slate-400">
          {user
            ? 'This deletes all days, reps, XP, badges, and logbook entries on this device and in your synced Google cloud backup. Export a backup first if you might want them back.'
            : 'This deletes all days, reps, XP, badges, and logbook entries on this device. Export a backup first if you might want them back.'}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Button variant="secondary" onClick={() => setConfirmReset(false)}>
            Cancel
          </Button>
          <Button
            variant="rose"
            onClick={() => {
              resetAll();
              setConfirmReset(false);
              setMessage({ tone: 'ok', text: 'Progress reset. Fresh start!' });
            }}
          >
            Reset
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function GoogleMark() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.08.73-2.47 1.16-4.23 1.16-3.25 0-6.01-2.2-6.99-5.15H1.01v3.14C3.03 21.14 7.19 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.01 14c-.25-.73-.39-1.51-.39-2.32s.14-1.59.39-2.32V6.22H1.01A11.98 11.98 0 0 0 0 11.68c0 1.93.46 3.76 1.01 5.46l4-3.14Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.8 0 3.41.62 4.68 1.83l3.51-3.51C18.07 1.19 15.3 0 12 0 7.19 0 3.03 2.86 1.01 7.22l4 3.14c.98-2.95 3.74-5.61 6.99-5.61Z"
      />
    </svg>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card flex flex-col gap-4 p-5">
      <h2 className="eyebrow">{title}</h2>
      {children}
    </section>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ value: T; label: string; icon?: ReactNode }>;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">{label}</span>
      <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-night-line/60">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2 py-2 text-sm font-extrabold transition-colors',
              value === option.value
                ? 'bg-white text-sky-600 shadow-sm dark:bg-night-card dark:text-sky-300'
                : 'text-ink-soft dark:text-slate-400',
            )}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <span>
        <span className="block font-bold">{label}</span>
        {description && <span className="text-sm text-ink-soft dark:text-slate-400">{description}</span>}
      </span>
      <input type="checkbox" role="switch" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-8 w-14 shrink-0 rounded-full bg-slate-300 transition-colors after:absolute after:left-1 after:top-1 after:h-6 after:w-6 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-emerald-500 peer-checked:after:translate-x-6 peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-400/60 dark:bg-night-line" />
    </label>
  );
}
