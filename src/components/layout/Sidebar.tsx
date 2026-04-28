import { NavLink, useLocation } from 'react-router-dom';
import { Home, List, History, Settings, ChevronLeft, ChevronRight, Zap, Plug } from 'lucide-react';
import { CrestDataLogo } from '@/components/ui/CrestDataLogo';
import { clsx } from 'clsx';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Dashboard', exact: true },
  { path: '/queue', icon: List, label: 'Alert Queue' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/configuration', icon: Plug, label: 'Integrations' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-[#070b16]/95 backdrop-blur-md border-r border-slate-800/60 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo area */}
      <div
        className={clsx(
          'flex items-center h-16 border-b border-slate-800/60 transition-all duration-300',
          collapsed ? 'justify-center px-3' : 'px-5 gap-3',
        )}
      >
        {collapsed ? (
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-lg shadow-violet-600/30 flex-shrink-0">
            <span className="text-white text-xs font-black">CD</span>
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            <CrestDataLogo size="sm" variant="full" />
            <div className="flex items-center gap-1.5 ml-0.5">
              <div className="w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.2em]">SOC Triage · AI</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2.5 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label, exact }) => {
          const isActive = exact ? location.pathname === path : location.pathname.startsWith(path);

          return (
            <NavLink
              key={path}
              to={path}
              title={collapsed ? label : undefined}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/10 to-transparent text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/50',
                collapsed && 'justify-center',
              )}
            >
              <Icon
                size={16}
                className={clsx(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-cyan-400' : 'text-slate-600 group-hover:text-slate-300',
                )}
              />
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick triage shortcut */}
      {!collapsed && (
        <div className="px-2.5 pb-3">
          <NavLink
            to="/"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 to-violet-500/5 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:from-cyan-500/15 hover:to-violet-500/10 transition-all duration-200 group"
          >
            <Zap size={14} className="flex-shrink-0 group-hover:animate-pulse" />
            <span>Quick Triage</span>
          </NavLink>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="p-2.5 border-t border-slate-800/60">
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={clsx(
            'flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-600 hover:text-slate-300 hover:bg-slate-800/50 text-sm transition-colors',
            collapsed && 'justify-center',
          )}
        >
          {collapsed ? <ChevronRight size={15} /> : <><ChevronLeft size={15} /><span className="text-xs">Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
