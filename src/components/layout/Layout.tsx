import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toaster } from 'sonner';
import { clsx } from 'clsx';

const COLLAPSED_KEY = 'soc_sidebar_collapsed';

export function Layout() {
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSED_KEY) === 'true';
  });

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, collapsed.toString());
  }, [collapsed]);

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-slate-100 font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />

      <div
        className={clsx(
          'transition-all duration-300 flex flex-col min-h-screen',
          collapsed ? 'ml-16' : 'ml-64',
        )}
      >
        <Header sidebarCollapsed={collapsed} />

        <main className="flex-1 pt-16">
          <div className="max-w-[1600px] mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#f1f5f9',
          },
        }}
      />
    </div>
  );
}
