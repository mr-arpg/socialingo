import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { useFeedback } from '../../hooks/useFeedback';

const RADIUS = 52;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function format(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function MissionTimer({ seconds, label }: { seconds: number; label: string }) {
  const feedback = useFeedback();
  const [elapsedMs, setElapsedMs] = useState(0);
  const [running, setRunning] = useState(false);
  const startedAt = useRef<number | null>(null);
  const baseMs = useRef(0);
  const celebrated = useRef(false);

  useEffect(() => {
    if (!running) return;
    startedAt.current = performance.now();
    const tick = window.setInterval(() => {
      setElapsedMs(baseMs.current + performance.now() - (startedAt.current ?? performance.now()));
    }, 250);
    return () => window.clearInterval(tick);
  }, [running]);

  const elapsed = elapsedMs / 1000;
  const done = elapsed >= seconds;

  useEffect(() => {
    if (done && !celebrated.current) {
      celebrated.current = true;
      feedback.success();
    }
  }, [done, feedback]);

  const toggle = () => {
    if (running) baseMs.current = elapsedMs;
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    baseMs.current = 0;
    celebrated.current = false;
    setElapsedMs(0);
  };

  const progress = Math.min(1, elapsed / seconds);

  return (
    <div className="flex items-center gap-5 rounded-3xl border-2 border-b-4 border-slate-200 p-4 dark:border-night-line">
      <div className="relative h-32 w-32 shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="60" cy="60" r={RADIUS} strokeWidth="12" className="fill-none stroke-slate-200 dark:stroke-night-line" />
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            className={`fill-none transition-[stroke-dashoffset] duration-300 ${done ? 'stroke-amber-400' : 'stroke-indigo-500'}`}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <span className="text-2xl font-black tabular-nums" role="timer" aria-live="off">
            {done ? format(elapsed) : format(seconds - elapsed)}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <p className="eyebrow">{label}</p>
        <p className="text-sm font-bold text-ink-soft dark:text-slate-400">
          {done ? 'Three minutes reached. Keep going if it’s flowing!' : 'Start it before the conversation, then forget about it.'}
        </p>
        <div className="flex gap-2">
          <Button variant="indigo" size="sm" onClick={toggle}>
            {running ? <Pause className="h-4 w-4" strokeWidth={3} /> : <Play className="h-4 w-4" strokeWidth={3} />}
            {running ? 'Pause' : elapsedMs > 0 ? 'Resume' : 'Start'}
          </Button>
          <Button variant="secondary" size="sm" onClick={reset} disabled={elapsedMs === 0} aria-label="Reset timer">
            <RotateCcw className="h-4 w-4" strokeWidth={3} />
          </Button>
        </div>
      </div>
    </div>
  );
}
