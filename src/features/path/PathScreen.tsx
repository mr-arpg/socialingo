import { useEffect, useMemo, useRef, useState } from 'react';
import { CHAPTERS } from '../../content/chapters';
import { DAYS } from '../../content/days';
import { buildPath } from '../../engine/day';
import { useToday } from '../../hooks/useStats';
import { useAppStore } from '../../store/useAppStore';
import { ChapterBanner } from './ChapterBanner';
import { ChestNode } from './ChestNode';
import { PathNode } from './PathNode';

/** Horizontal offsets (px) that make the trail wind left and right. */
const WIND = [0, 48, 76, 48, 0, -48, -76, -48];

export function PathScreen() {
  const data = useAppStore((s) => s.data);
  const today = useToday();
  const nodes = useMemo(() => buildPath(DAYS, data, data.settings.pacing, today), [data, today]);
  const [openDay, setOpenDay] = useState<number | null>(null);
  const currentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    currentRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (openDay === null) return;
    const close = (e: PointerEvent) => {
      if (!(e.target as HTMLElement).closest('[data-path-node]')) setOpenDay(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [openDay]);

  let windIndex = 0;

  return (
    <div className="flex flex-col gap-10">
      {CHAPTERS.map((chapter) => {
        const chapterNodes = nodes.filter((n) => n.day >= chapter.firstDay && n.day <= chapter.lastDay);
        const completed = chapterNodes.filter((n) => n.state === 'completed' || n.state === 'mastered').length;
        return (
          <section key={chapter.id} aria-label={`Chapter ${chapter.id}: ${chapter.title}`} className="flex flex-col gap-8">
            <ChapterBanner chapter={chapter} completed={completed} />
            <ol className="flex flex-col items-center gap-6 pb-2">
              {chapterNodes.map((node) => {
                const offset = WIND[windIndex++ % WIND.length];
                return (
                  <li key={node.day} data-path-node className={openDay === node.day ? 'relative z-20' : 'relative'}>
                    <PathNode
                      ref={node.state === 'current' ? currentRef : undefined}
                      node={node}
                      accent={chapter.accent}
                      offset={offset}
                      open={openDay === node.day}
                      onToggle={() => setOpenDay((d) => (d === node.day ? null : node.day))}
                    />
                  </li>
                );
              })}
              <li>
                <ChestNode chapter={chapter} offset={WIND[windIndex++ % WIND.length]} />
              </li>
            </ol>
          </section>
        );
      })}
    </div>
  );
}
