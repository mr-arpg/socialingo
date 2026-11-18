import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import type { BriefingCard, CardResult, DayContent } from '../../types';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { useFeedback } from '../../hooks/useFeedback';
import { useAppStore } from '../../store/useAppStore';
import { ChoiceCardView, isChoiceSolved } from './cards/ChoiceCardView';
import { MythBusterCardView } from './cards/MythBusterCardView';
import {
  ConceptCardView,
  HookCardView,
  ScienceCardView,
  ScriptCardView,
  TakeawayCardView,
} from './cards/StaticCards';

const SWIPE_THRESHOLD = 80;
const NO_RESULTS: Record<string, CardResult> = {};

export function BriefingDeck({ content, onFinish }: { content: DayContent; onFinish: () => void }) {
  const cards = content.briefing;
  const recorded = useAppStore((s) => s.data.days[content.day]?.cardResults) ?? NO_RESULTS;
  const answerCard = useAppStore((s) => s.answerCard);
  const feedback = useFeedback();

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [picks, setPicks] = useState<Record<string, string[]>>({});

  const card = cards[index];
  const isLast = index === cards.length - 1;
  const canAdvance = isAnswered(card, picks[card.id] ?? [], Boolean(recorded[card.id]));

  const go = (delta: number) => {
    const next = index + delta;
    if (next < 0) return;
    if (next >= cards.length) {
      onFinish();
      return;
    }
    setDirection(delta);
    setIndex(next);
  };

  const pick = (choiceCard: Extract<BriefingCard, { kind: 'quiz' | 'scenario' }>, optionId: string) => {
    const option = choiceCard.options.find((o) => o.id === optionId)!;
    const good = 'correct' in option ? option.correct : option.rating === 'great';
    if (!recorded[choiceCard.id]) answerCard(content.day, choiceCard, good);
    setPicks((p) => ({ ...p, [choiceCard.id]: [...(p[choiceCard.id] ?? []), optionId] }));
    if (good) feedback.correct();
    else feedback.wrong();
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD && canAdvance) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  };

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <ProgressBar value={index + 1} max={cards.length} className="h-3" barClassName="bg-emerald-500" label="Briefing progress" />
        <span className="text-sm font-black tabular-nums text-ink-soft dark:text-slate-400">
          {index + 1}/{cards.length}
        </span>
      </div>

      <div className="relative flex flex-1">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.article
            key={card.id}
            custom={direction}
            variants={{
              enter: (d: number) => ({ x: d * 60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -60, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.25}
            onDragEnd={onDragEnd}
            className="card flex min-h-[380px] w-full touch-pan-y flex-col p-6"
          >
            <CardBody card={card} picks={picks[card.id] ?? []} onPick={pick} />
          </motion.article>
        </AnimatePresence>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" onClick={() => go(-1)} disabled={index === 0} aria-label="Previous card">
          <ChevronLeft className="h-5 w-5" strokeWidth={3} />
        </Button>
        <Button size="lg" block onClick={() => go(1)} disabled={!canAdvance}>
          {isLast ? 'Start the mission' : canAdvance ? 'Continue' : 'Pick an answer'}
        </Button>
      </div>
    </div>
  );
}

function isAnswered(card: BriefingCard, picks: string[], alreadyRecorded: boolean): boolean {
  if (card.kind !== 'quiz' && card.kind !== 'scenario') return true;
  return alreadyRecorded || isChoiceSolved(card, picks);
}

function CardBody({
  card,
  picks,
  onPick,
}: {
  card: BriefingCard;
  picks: string[];
  onPick: (card: Extract<BriefingCard, { kind: 'quiz' | 'scenario' }>, optionId: string) => void;
}) {
  switch (card.kind) {
    case 'hook':
      return <HookCardView card={card} />;
    case 'concept':
      return <ConceptCardView card={card} />;
    case 'science':
      return <ScienceCardView card={card} />;
    case 'script':
      return <ScriptCardView card={card} />;
    case 'takeaway':
      return <TakeawayCardView card={card} />;
    case 'mythBuster':
      return <MythBusterCardView card={card} />;
    case 'quiz':
    case 'scenario':
      return <ChoiceCardView card={card} picks={picks} onPick={(id) => onPick(card, id)} />;
  }
}
