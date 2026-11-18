import { ChartColumn, Map, Medal, NotebookPen, type LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Path', icon: Map },
  { to: '/logbook', label: 'Logbook', icon: NotebookPen },
  { to: '/stats', label: 'Stats', icon: ChartColumn },
  { to: '/badges', label: 'Badges', icon: Medal },
];
