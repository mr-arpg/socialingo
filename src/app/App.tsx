import { lazy, Suspense } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router';
import { FirebaseProvider } from '../components/auth/FirebaseProvider';
import { BadgeToaster } from '../components/feedback/BadgeToaster';
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';
import { AppShell } from '../components/layout/AppShell';
import { PathScreen } from '../features/path/PathScreen';
import { useTheme } from '../hooks/useTheme';
import { useAppStore } from '../store/useAppStore';

const DayScreen = lazy(() => import('../features/day/DayScreen').then((m) => ({ default: m.DayScreen })));
const LogbookScreen = lazy(() => import('../features/logbook/LogbookScreen').then((m) => ({ default: m.LogbookScreen })));
const StatsScreen = lazy(() => import('../features/stats/StatsScreen').then((m) => ({ default: m.StatsScreen })));
const BadgesScreen = lazy(() => import('../features/badges/BadgesScreen').then((m) => ({ default: m.BadgesScreen })));
const SettingsScreen = lazy(() =>
  import('../features/settings/SettingsScreen').then((m) => ({ default: m.SettingsScreen })),
);
const AdminScreen = lazy(() => import('../features/admin/AdminScreen').then((m) => ({ default: m.AdminScreen })));

export function App() {
  useTheme();
  const hydrated = useAppStore((s) => s.hydrated);

  if (!hydrated) return <Splash />;

  return (
    <ErrorBoundary>
      <FirebaseProvider>
        <HashRouter>
          <BadgeToaster />
          <Suspense fallback={<Splash />}>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<PathScreen />} />
                <Route path="logbook" element={<LogbookScreen />} />
                <Route path="stats" element={<StatsScreen />} />
                <Route path="badges" element={<BadgesScreen />} />
                <Route path="settings" element={<SettingsScreen />} />
                <Route path="admin" element={<AdminScreen />} />
              </Route>
              <Route path="day/:dayNumber" element={<DayScreen />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </FirebaseProvider>
    </ErrorBoundary>
  );
}

function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center">
      <img src={`${import.meta.env.BASE_URL}icon.svg`} alt="Loading" className="h-20 w-20 animate-pulse" />
    </div>
  );
}
