import { Link, useNavigate } from 'react-router-dom';
import { Settings, Bell, Shield, LogOut } from 'lucide-react';
import { ConnectionStatus } from '@/components/triage/ConnectionStatus';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export function Header({ sidebarCollapsed }: HeaderProps) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login', { replace: true });
  };

  return (
    <header
      className="fixed top-0 right-0 z-30 h-16 bg-[#070b16]/90 backdrop-blur-md border-b border-slate-800/60 flex items-center justify-between px-6 transition-all duration-300"
      style={{ left: sidebarCollapsed ? '4rem' : '16rem' }}
    >
      {/* Left: page context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Shield size={14} className="text-cyan-400" />
          <span className="text-sm font-semibold text-slate-300 hidden sm:block">
            AI-Enabled SOC Alert Triage
          </span>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2.5">
        <ConnectionStatus />

        <button
          title="Notifications"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
        >
          <Bell size={14} />
        </button>

        <Link
          to="/settings"
          title="Settings"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
        >
          <Settings size={14} />
        </Link>

        {/* User info + logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800/60">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-medium text-slate-300 leading-none">{user?.name ?? 'Analyst'}</span>
            <span className="text-[10px] text-slate-600 leading-none mt-0.5">{user?.role ?? 'SOC'}</span>
          </div>
          <div
            title={user?.email}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-[10px] font-bold shadow-lg shadow-violet-500/20 ring-1 ring-violet-500/30 cursor-default"
          >
            {user?.initials ?? 'A'}
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
