import { BookOpen, Check, NotebookPen, Target, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router';
import type { CompletionSummary, LogDraft } from '../../types';
import { getDay } from '../../content/days';
import { nodeState } from '../../engine/day';
import { useFeedback } from '../../hooks/useFeedback';
import { useNow } from '../../hooks/useStats';
import { useAdminUnlock } from '../../lib/admin';
import { cn } from '../../lib/text';
import { useAppStore } from '../../store/useAppStore';
import { BriefingDeck } from './BriefingDeck';
import { CompletionModal } from './CompletionModal';
import { LogbookForm } from './LogbookForm';
import { MissionPanel } from './MissionPanel';

type Step = 'briefing' | 'mission' | 'logbook';

const STEPS: Array<{ id: Step; label: string; icon: typeof BookOpen }> = [
  { id: 'briefing', label: 'Briefing', icon: BookOpen },
  { id: 'mission', label: 'Mission', icon: Target },
  { id: 'logbook', label: 'Logbook', icon: NotebookPen },
];

export function DayScreen() {
  const { dayNumber } = useParams();
  const day = Number(dayNumber);
  const content = getDay(day);
  const data = useAppStore((s) => s.data);
  const now = useNow();
  const admin = useAdminUnlock();
  const state = content ? nodeState(day, data, now, true, admin) : 'locked';

  if (!content || state === 'locked' || state === 'cooldown') return <Navigate to="/" replace />;
  return <DayFlow key={day} day={day} />;
}

function DayFlow({ day }: { day: number }) {
  const content = getDay(day)!;
  const navigate = useNavigate();
  const feedback = useFeedback();
  const progress = useAppStore((s) => s.data.days[day]);
  const hasLog = useAppStore((s) => Boolean(s.data.logEntries[day]));
  const completeBriefing = useAppStore((s) => s.completeBriefing);
  const saveLogEntry = useAppStore((s) => s.saveLogEntry);
  const completeDay = useAppStore((s) => s.completeDay);

  const done: Record<Step, boolean> = {
    briefing: Boolean(progress?.briefingCompletedAt),
    mission: Boolean(progress?.missionCompletedAt),
    logbook: hasLog,
  };
  const reachable: Record<Step, boolean> = { briefing: true, mission: done.briefing, logbook: done.mission };

  const [step, setStep] = useState<Step>(() => (!done.briefing ? 'briefing' : !done.mission ? 'mission' : 'logbook'));
  const [summary, setSummary] = useState<CompletionSummary | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [step]);

  const finishBriefing = () => {
    completeBriefing(day);
    setStep('mission');
  };

  const saveLog = (draft: LogDraft) => {
    saveLogEntry(day, draft);
    const result = completeDay(day);
    if (result) {
      setSummary(result);
      feedback.celebrate();
    }
  };

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pt-4">
      <header className="mb-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/')}
          aria-label="Back to path"
          className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-night-line"
        >
          <X className="h-7 w-7" strokeWidth={3} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="eyebrow">Day {day}</p>
          <h1 className="truncate text-lg font-black leading-tight">{content.title}</h1>
        </div>
      </header>

      <nav aria-label="Day steps" className="mb-5 grid grid-cols-3 gap-2">
        {STEPS.map(({ id, label, icon: StepIcon }) => (
          <button
            key={id}
            type="button"
            disabled={!reachable[id]}
            onClick={() => setStep(id)}
            aria-current={step === id ? 'step' : undefined}
            className={cn(
              'flex items-center justify-center gap-1.5 rounded-2xl border-2 border-b-4 py-2 text-xs font-black uppercase tracking-wide transition-colors disabled:opacity-40',
              step === id
                ? 'border-sky-300 bg-sky-50 text-sky-600 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300'
                : done[id]
                  ? 'border-emerald-200 text-emerald-600 dark:border-emerald-500/30 dark:text-emerald-400'
                  : 'border-slate-200 text-ink-soft dark:border-night-line dark:text-slate-400',
            )}
          >
            {done[id] ? <Check className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" /> : <StepIcon className="h-4 w-4" strokeWidth={3} aria-hidden="true" />}
            {label}
          </button>
        ))}
      </nav>

      <div className="flex flex-1 flex-col pb-6">
        {step === 'briefing' && <BriefingDeck content={content} onFinish={finishBriefing} />}
        {step === 'mission' && <MissionPanel content={content} onContinue={() => setStep('logbook')} />}
        {step === 'logbook' && <LogbookForm content={content} dayCompleted={Boolean(progress?.completedAt)} onSave={saveLog} />}
      </div>

      <CompletionModal summary={summary} title={content.title} onClose={() => navigate('/')} />
    </div>
  );
}
