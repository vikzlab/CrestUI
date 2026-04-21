import { Link } from 'react-router-dom';
import { Settings, Bell } from 'lucide-react';
import { ConnectionStatus } from '@/components/triage/ConnectionStatus';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-6 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
    >
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-semibold text-slate-300 hidden sm:block">
          SOC Alert Triage System
        </h1>
        <span className="text-xs text-slate-600 font-mono hidden md:block">v1.0.0</span>
      </div>

      <div className="flex items-center gap-3">
        <ConnectionStatus />

        <button
          title="Notifications"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <Bell size={15} />
        </button>

        <Link
          to="/settings"
          title="Settings"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
        >
          <Settings size={15} />
        </Link>

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-xs font-bold shadow-lg">
          A
        </div>
      </div>
    </header>
  );
}
