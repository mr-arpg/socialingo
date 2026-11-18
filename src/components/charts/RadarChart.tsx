import { motion } from 'framer-motion';
import { polarPoint, radarPoints, toPointsAttr } from '../../lib/charts';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export interface RadarAxis {
  key: string;
  label: string;
  value: number;
}

const WIDTH = 440;
const HEIGHT = 320;
const CX = WIDTH / 2;
const CY = 165;
const RADIUS = 104;
const LABEL_RADIUS = RADIUS + 26;
const RINGS = [0.25, 0.5, 0.75, 1];

interface RadarChartProps {
  axes: readonly RadarAxis[];
  max?: number;
  label: string;
}

export function RadarChart({ axes, max = 100, label }: RadarChartProps) {
  const reducedMotion = useReducedMotion();
  const count = axes.length;
  const shape = radarPoints(
    axes.map((a) => a.value),
    max,
    CX,
    CY,
    RADIUS,
  );

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={label} className="mx-auto h-auto w-full max-w-md">
      {RINGS.map((ring) => (
        <polygon
          key={ring}
          points={toPointsAttr(axes.map((_, i) => polarPoint(CX, CY, RADIUS * ring, i, count)))}
          className="fill-none stroke-slate-200 dark:stroke-night-line"
          strokeWidth={ring === 1 ? 2 : 1.5}
        />
      ))}
      {axes.map((axis, i) => {
        const [x, y] = polarPoint(CX, CY, RADIUS, i, count);
        return <line key={axis.key} x1={CX} y1={CY} x2={x} y2={y} className="stroke-slate-200 dark:stroke-night-line" strokeWidth={1.5} />;
      })}

      <motion.g
        initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.1 }}
        style={{ transformBox: 'view-box', transformOrigin: `${CX}px ${CY}px` }}
      >
        <polygon points={toPointsAttr(shape)} className="fill-violet-500/25 stroke-violet-500" strokeWidth={3} strokeLinejoin="round" />
        {shape.map(([x, y], i) => (
          <circle key={axes[i].key} cx={x} cy={y} r={5} className="fill-violet-500 stroke-white dark:stroke-night-card" strokeWidth={2} />
        ))}
      </motion.g>

      {axes.map((axis, i) => {
        const [x, y] = polarPoint(CX, CY, LABEL_RADIUS, i, count);
        const anchor = Math.abs(x - CX) < 4 ? 'middle' : x > CX ? 'start' : 'end';
        const top = y < CY - RADIUS;
        return (
          <text key={axis.key} textAnchor={anchor} className="text-[16px]">
            <tspan x={x} y={top ? y - 10 : y} className="fill-ink font-extrabold dark:fill-slate-100">
              {axis.label}
            </tspan>
            <tspan x={x} dy="1.2em" className="fill-violet-600 font-black dark:fill-violet-300">
              {Math.round(axis.value)}
            </tspan>
          </text>
        );
      })}
    </svg>
  );
}
