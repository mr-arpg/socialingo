import { useId } from 'react';
import { sparkline } from '../../lib/charts';
import { cn } from '../../lib/text';

const WIDTH = 300;
const HEIGHT = 64;

interface SparklineProps {
  values: readonly number[];
  min: number;
  max: number;
  label: string;
  className?: string;
}

export function Sparkline({ values, min, max, label, className }: SparklineProps) {
  const gradientId = useId();
  const { points, line, area } = sparkline(values, WIDTH, HEIGHT, min, max, 6);

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} className={cn('h-auto w-full overflow-visible', className)}>
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[min, (min + max) / 2, max].map((v) => {
        const y = sparkline([v], WIDTH, HEIGHT, min, max, 6).points[0][1];
        return <line key={v} x1={0} x2={WIDTH} y1={y} y2={y} className="stroke-slate-200 dark:stroke-night-line" strokeDasharray="4 6" />;
      })}
      {points.length > 1 && (
        <>
          <path d={area} fill={`url(#${gradientId})`} />
          <path d={line} fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
      {points.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === points.length - 1 ? 5 : 3.5}
          className="fill-white dark:fill-night-card"
          stroke="currentColor"
          strokeWidth={3}
        />
      ))}
    </svg>
  );
}
