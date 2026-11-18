import { Download, Monitor, Moon, Sun, Trash2, Upload } from 'lucide-react';
import { useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import type { MotionPreference, ThemePreference } from '../../types';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { toISODate } from '../../lib/dates';
import { downloadFile } from '../../lib/effects';
import { cn } from '../../lib/text';
import { useAppStore } from '../../store/useAppStore';

export function SettingsScreen() {
  const data = useAppStore((s) => s.data);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const setDisplayName = useAppStore((s) => s.setDisplayName);
  const replaceState = useAppStore((s) => s.replaceState);
  const resetAll = useAppStore((s) => s.resetAll);
  const { settings } = data;

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

      <Section title="Profile">
        <label htmlFor="display-name" className="font-bold">
          Your name
        </label>
        <input
          id="display-name"
          value={data.profile.displayName}
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
          Progress is stored only on this device. Export a backup regularly, or before switching phones.
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
          This deletes all days, reps, XP, badges, and logbook entries on this device. Export a backup first if you might want them back.
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
