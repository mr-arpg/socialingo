import { Check, ChevronDown, Flame, Lightbulb, MapPin, ShieldCheck } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import type { CounterKey, DayContent } from '../../types';
import { COUNTER_KEYS } from '../../types';
import { CONTEXT_LABELS, COUNTER_META } from '../../content/chapters';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { COUNTER_STYLES } from '../../lib/accents';
import { canCompleteTier, type MissionTierKey } from '../../engine/actions';
import { counterKeysOutside, tallyReps } from '../../engine/day';
import { useFeedback } from '../../hooks/useFeedback';
import { cn } from '../../lib/text';
import { useAppStore } from '../../store/useAppStore';
import { MissionTimer } from './MissionTimer';
import { RepCounter } from './RepCounter';

export function MissionPanel({ content, onContinue }: { content: DayContent; onContinue: () => void }) {
  const { day, mission, rewards } = content;
  const data = useAppStore((s) => s.data);
  const tapRep = useAppStore((s) => s.tapRep);
  const undoRep = useAppStore((s) => s.undoRep);
  const toggleChecklist = useAppStore((s) => s.toggleChecklist);
  const completeMission = useAppStore((s) => s.completeMission);
  const feedback = useFeedback();

  const progress = data.days[day];
  const standardDone = Boolean(progress?.missionCompletedAt);
  const hardcoreDone = Boolean(progress?.hardcoreCompletedAt);
  const [tier, setTier] = useState<MissionTierKey>(standardDone && !hardcoreDone ? 'hardcore' : 'standard');
  const [showTips, setShowTips] = useState(false);

  const tallies = useMemo(() => tallyReps(data.repEvents, day), [data.repEvents, day]);
  const def = mission[tier];
  const checked = (tier === 'standard' ? progress?.standardChecklist : progress?.hardcoreChecklist) ?? [];
  const tierDone = tier === 'standard' ? standardDone : hardcoreDone;
  const canComplete = canCompleteTier(data, content, tier);

  const tap = (counter: CounterKey) => {
    const xp = tapRep(counter, day);
    if (counter === 'courageReps') feedback.courage();
    else feedback.tap();
    return xp;
  };

  const complete = () => {
    if (completeMission(day, tier)) feedback.success();
  };

  return (
    <div className="flex flex-col gap-5">
      <section className="card p-5">
        <p className="eyebrow text-emerald-600 dark:text-emerald-400">Fieldwork · {mission.codename}</p>
        <h2 className="mt-1 text-2xl font-black leading-tight">{mission.objective}</h2>
        <ul className="mt-3 flex flex-wrap gap-2" aria-label="Good places to try">
          {mission.contexts.map((ctx) => (
            <li
              key={ctx}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-extrabold text-ink-soft dark:bg-night-line dark:text-slate-300"
            >
              <MapPin className="h-3 w-3" strokeWidth={3} aria-hidden="true" /> {CONTEXT_LABELS[ctx]}
            </li>
          ))}
        </ul>
      </section>

      <div role="tablist" aria-label="Mission difficulty" className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1.5 dark:bg-night-line/60">
        <TierTab active={tier === 'standard'} done={standardDone} onClick={() => setTier('standard')}>
          Standard · +{rewards.xp} XP
        </TierTab>
        <TierTab active={tier === 'hardcore'} done={hardcoreDone} onClick={() => setTier('hardcore')} hardcore>
          <Flame className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Hardcore · +{rewards.hardcoreXp}
        </TierTab>
      </div>

      <section className={cn('card p-5', tier === 'hardcore' && 'border-orange-200 dark:border-orange-500/30')}>
        <h3 className="text-lg font-black">{def.title}</h3>
        <p className="mt-1 text-[15px] text-ink-soft dark:text-slate-300">{def.brief}</p>
        <ol className="mt-4 flex flex-col gap-2">
          {def.steps.map((step, i) => (
            <li key={step} className="flex gap-3 text-[15px]">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-100 text-xs font-black text-ink-soft dark:bg-night-line dark:text-slate-300">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section aria-label="Rep counters" className="flex flex-col gap-3">
        {def.targets.map((t) => (
          <RepCounter
            key={t.counter}
            counter={t.counter}
            label={t.label}
            target={t.target}
            count={tallies[t.counter]}
            onTap={() => tap(t.counter)}
            onUndo={() => undoRep(t.counter, day)}
          />
        ))}
        <div className="grid gap-2 sm:grid-cols-2">
          {counterKeysOutside(def).map((counter) => (
            <RepCounter
              key={counter}
              compact
              counter={counter}
              count={tallies[counter]}
              onTap={() => tap(counter)}
              onUndo={() => undoRep(counter, day)}
            />
          ))}
        </div>
        <CounterGuide />
      </section>

      {def.checklist && def.checklist.length > 0 && (
        <section aria-label="Checklist" className="flex flex-col gap-2">
          {def.checklist.map((item, i) => (
            <label
              key={item}
              className="flex cursor-pointer items-center gap-3 rounded-2xl border-2 border-slate-200 p-3 font-bold dark:border-night-line"
            >
              <input
                type="checkbox"
                checked={checked[i] === true}
                onChange={() => toggleChecklist(day, tier, i)}
                className="peer sr-only"
              />
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg border-2 border-slate-300 text-transparent peer-checked:border-emerald-500 peer-checked:bg-emerald-500 peer-checked:text-white peer-focus-visible:ring-4 peer-focus-visible:ring-indigo-400/60 dark:border-night-line">
                <Check className="h-5 w-5" strokeWidth={3.5} aria-hidden="true" />
              </span>
              {item}
            </label>
          ))}
        </section>
      )}

      {mission.timer && <MissionTimer seconds={mission.timer.seconds} label={mission.timer.label} />}

      <section className="flex gap-3 rounded-3xl bg-sky-50 p-4 text-sm font-semibold text-sky-900 dark:bg-sky-500/10 dark:text-sky-100">
        <ShieldCheck className="h-5 w-5 shrink-0 text-sky-500" strokeWidth={2.5} aria-hidden="true" />
        <p>{mission.guardrail}</p>
      </section>

      <section className="card overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTips((s) => !s)}
          aria-expanded={showTips}
          className="flex w-full items-center gap-3 p-4 text-left font-black"
        >
          <Lightbulb className="h-5 w-5 text-amber-500" strokeWidth={2.5} aria-hidden="true" />
          <span className="flex-1">Field tips</span>
          <ChevronDown className={cn('h-5 w-5 transition-transform', showTips && 'rotate-180')} strokeWidth={3} aria-hidden="true" />
        </button>
        {showTips && (
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {mission.tips.map((tip) => (
              <li key={tip} className="text-[15px] text-ink-soft dark:text-slate-300">
                • {tip}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="sticky bottom-0 -mx-4 flex flex-col gap-2 border-t-2 border-slate-200 bg-cream/95 px-4 pb-safe pt-3 backdrop-blur dark:border-night-line dark:bg-night/95">
        {!tierDone && (
          <Button size="lg" block variant={tier === 'hardcore' ? 'amber' : 'primary'} disabled={!canComplete} onClick={complete}>
            {canComplete ? `Complete ${tier} mission` : 'Hit every target to complete'}
          </Button>
        )}
        {standardDone && (
          <Button size="lg" block variant={tierDone ? 'primary' : 'secondary'} onClick={onContinue}>
            Continue to logbook
          </Button>
        )}
      </div>
    </div>
  );
}

function CounterGuide() {
  return (
    <div className="rounded-2xl bg-slate-50 p-4 dark:bg-night-line/40">
      <p className="eyebrow mb-3">What the counters mean</p>
      <ul className="flex flex-col gap-3">
        {COUNTER_KEYS.map((key) => {
          const meta = COUNTER_META[key];
          return (
            <li key={key} className="flex gap-3">
              <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', COUNTER_STYLES[key].chip)}>
                <Icon name={meta.icon} className="h-4 w-4" strokeWidth={2.5} />
              </span>
              <p className="text-sm leading-snug">
                <span className="font-extrabold">{meta.shortLabel}. </span>
                <span className="text-ink-soft dark:text-slate-300">{meta.description}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function TierTab({
  active,
  done,
  hardcore,
  onClick,
  children,
}: {
  active: boolean;
  done: boolean;
  hardcore?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-wide transition-colors',
        active
          ? hardcore
            ? 'bg-orange-500 text-white shadow-sm'
            : 'bg-white text-emerald-600 shadow-sm dark:bg-night-card dark:text-emerald-400'
          : 'text-ink-soft dark:text-slate-400',
      )}
    >
      {done && <Check className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />}
      {children}
    </button>
  );
}
