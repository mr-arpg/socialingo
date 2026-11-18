import { PenLine } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import type { DayContent, LogDraft, MoodTag, Rating } from '../../types';
import { MOOD_TAGS } from '../../types';
import { CONFIDENCE_LABELS, ENERGY_LABELS, MOOD_META } from '../../content/chapters';
import { Button } from '../../components/ui/Button';
import { cn, countWords } from '../../lib/text';
import { useAppStore } from '../../store/useAppStore';

const MAX_MOODS = 3;

interface LogbookFormProps {
  content: DayContent;
  dayCompleted: boolean;
  onSave: (draft: LogDraft) => void;
}

export function LogbookForm({ content, dayCompleted, onSave }: LogbookFormProps) {
  const existing = useAppStore((s) => s.data.logEntries[content.day]);
  const [answers, setAnswers] = useState<Record<string, string>>(existing?.answers ?? {});
  const [confidence, setConfidence] = useState<Rating>(existing?.confidence ?? 3);
  const [energy, setEnergy] = useState<Rating>(existing?.energy ?? 3);
  const [moods, setMoods] = useState<MoodTag[]>(existing?.moods ?? []);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const totalWords = Object.values(answers).reduce((sum, t) => sum + countWords(t), 0);
  const allAnswered = content.logbook.every((p) => countWords(answers[p.id] ?? '') > 0);

  const toggleMood = (mood: MoodTag) =>
    setMoods((current) =>
      current.includes(mood) ? current.filter((m) => m !== mood) : current.length < MAX_MOODS ? [...current, mood] : current,
    );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    onSave({ answers, confidence, energy, moods });
    setSavedAt(Date.now());
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <header className="card flex items-center gap-4 p-5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          <PenLine className="h-6 w-6" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <div className="flex-1">
          <p className="eyebrow text-amber-600 dark:text-amber-400">Field Logbook · Day {content.day}</p>
          <p className="font-bold text-ink-soft dark:text-slate-300">Be honest. Nobody reads this but you.</p>
        </div>
        <span className="text-right">
          <span className="block text-2xl font-black tabular-nums">{totalWords}</span>
          <span className="eyebrow">words</span>
        </span>
      </header>

      {content.logbook.map((prompt, i) => {
        const value = answers[prompt.id] ?? '';
        return (
          <div key={prompt.id} className="card flex flex-col gap-3 p-5">
            <label htmlFor={prompt.id} className="text-[17px] font-black leading-snug">
              <span className="mr-2 text-amber-500">{i + 1}.</span>
              {prompt.question}
            </label>
            <textarea
              id={prompt.id}
              value={value}
              onChange={(e) => setAnswers((a) => ({ ...a, [prompt.id]: e.target.value }))}
              placeholder={prompt.placeholder}
              rows={4}
              className="w-full resize-y rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 text-[16px] leading-relaxed placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:outline-none dark:border-night-line dark:bg-night dark:focus:bg-night-card"
            />
            <span className="self-end text-xs font-bold text-ink-soft dark:text-slate-500">{countWords(value)} words</span>
          </div>
        );
      })}

      <div className="card flex flex-col gap-6 p-5">
        <RatingSlider id="confidence" label="How confident did you feel today?" labels={CONFIDENCE_LABELS} value={confidence} onChange={setConfidence} />
        <RatingSlider id="energy" label="How was your social energy?" labels={ENERGY_LABELS} value={energy} onChange={setEnergy} />
      </div>

      <fieldset className="card p-5">
        <legend className="sr-only">Mood tags</legend>
        <p className="text-[17px] font-black">How did today feel?</p>
        <p className="mb-3 text-sm text-ink-soft dark:text-slate-400">Pick up to {MAX_MOODS}.</p>
        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((tag) => {
            const meta = MOOD_META[tag];
            const active = moods.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => toggleMood(tag)}
                className={cn(
                  'rounded-full border-2 border-b-4 px-3 py-1.5 text-sm font-extrabold transition-colors active:translate-y-[1px] active:border-b-2',
                  active
                    ? 'border-sky-400 bg-sky-50 text-sky-700 dark:bg-sky-500/15 dark:text-sky-200'
                    : 'border-slate-200 bg-white text-ink-soft dark:border-night-line dark:bg-night-card dark:text-slate-300',
                )}
              >
                <span aria-hidden="true">{meta.emoji}</span> {meta.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="sticky bottom-0 -mx-4 border-t-2 border-slate-200 bg-cream/95 px-4 pb-safe pt-3 backdrop-blur dark:border-night-line dark:bg-night/95">
        <Button type="submit" size="lg" block disabled={!allAnswered}>
          {!allAnswered ? 'Answer every prompt' : dayCompleted ? (savedAt ? 'Saved ✓' : 'Save changes') : 'Save & complete day'}
        </Button>
      </div>
    </form>
  );
}

function RatingSlider({
  id,
  label,
  labels,
  value,
  onChange,
}: {
  id: string;
  label: string;
  labels: readonly string[];
  value: Rating;
  onChange: (v: Rating) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[17px] font-black">
          {label}
        </label>
        <span className="shrink-0 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
          {value} · {labels[value - 1]}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) as Rating)}
        aria-valuetext={`${value} out of 5, ${labels[value - 1]}`}
        className="rating-slider"
      />
      <div className="flex justify-between text-[11px] font-extrabold uppercase tracking-wide text-ink-soft dark:text-slate-500">
        <span>{labels[0]}</span>
        <span>{labels[4]}</span>
      </div>
    </div>
  );
}
