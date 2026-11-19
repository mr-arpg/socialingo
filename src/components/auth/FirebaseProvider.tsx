import { Cloud, GitMerge, Laptop } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { computeStats } from '../../engine/stats';
import { DAYS } from '../../content/days';
import { toISODate } from '../../lib/dates';
import { initCloudSync, useCloudSyncStore } from '../../store/cloudSync';

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const fatalError = useCloudSyncStore((s) => s.fatalError);
  const pendingConflict = useCloudSyncStore((s) => s.pendingConflict);
  const resolveConflict = useCloudSyncStore((s) => s.resolveConflict);

  useEffect(() => {
    return initCloudSync();
  }, []);

  if (fatalError) {
    throw fatalError;
  }

  const today = toISODate(new Date());
  const localStats = pendingConflict ? computeStats(pendingConflict.local, DAYS, today) : null;
  const remoteStats = pendingConflict ? computeStats(pendingConflict.remote, DAYS, today) : null;

  return (
    <>
      {children}
      <Modal
        open={Boolean(pendingConflict)}
        onClose={() => undefined}
        dismissible={false}
        labelledBy="sync-conflict-title"
      >
        <h2 id="sync-conflict-title" className="text-xl font-black">
          Progress found in both places
        </h2>
        <p className="mt-2 text-sm text-ink-soft dark:text-slate-400">
          You have challenge progress saved on this device and in your Google account. Choose how you want to sync them:
        </p>

        {localStats && remoteStats && (
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 dark:border-night-line dark:bg-night">
              <div className="flex items-center gap-1.5 font-extrabold text-ink dark:text-slate-100">
                <Laptop className="h-4 w-4 text-sky-500" /> This device
              </div>
              <p className="mt-1 text-xs font-bold text-ink-soft dark:text-slate-400">
                {localStats.daysCompleted} days · {localStats.totalXp} XP
              </p>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 bg-slate-50 p-3 dark:border-night-line dark:bg-night">
              <div className="flex items-center gap-1.5 font-extrabold text-ink dark:text-slate-100">
                <Cloud className="h-4 w-4 text-emerald-500" /> Google cloud
              </div>
              <p className="mt-1 text-xs font-bold text-ink-soft dark:text-slate-400">
                {remoteStats.daysCompleted} days · {remoteStats.totalXp} XP
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-col gap-2">
          <Button variant="primary" block onClick={() => void resolveConflict('merge')}>
            <GitMerge className="h-4 w-4" strokeWidth={3} /> Merge both (Recommended)
          </Button>
          <Button variant="secondary" block onClick={() => void resolveConflict('remote')}>
            <Cloud className="h-4 w-4" strokeWidth={3} /> Use Google cloud progress
          </Button>
          <Button variant="ghost" block onClick={() => void resolveConflict('local')}>
            <Laptop className="h-4 w-4" strokeWidth={3} /> Keep this device&apos;s progress
          </Button>
        </div>
      </Modal>
    </>
  );
}
