import { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { BottomNav } from './BottomNav';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      <Sidebar />
      <div className="md:pl-64">
        <TopBar />
        <main className="mx-auto max-w-2xl px-4 pb-32 pt-6 md:pb-12">
          <Outlet />
        </main>
      </div>
      <BottomNav />
    </div>
  );
}
