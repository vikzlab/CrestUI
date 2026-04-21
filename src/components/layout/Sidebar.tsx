import { NavLink, useLocation } from 'react-router-dom';
import { Shield, Home, List, History, Settings, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Dashboard', exact: true },
  { path: '/queue', icon: List, label: 'Alert Queue' },
  { path: '/history', icon: History, label: 'History' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-slate-950/90 backdrop-blur-md border-r border-slate-800/80 transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Logo */}
      <div className={clsx('flex items-center h-16 px-4 border-b border-slate-800/80', collapsed ? 'justify-center' : 'gap-3')}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-bold text-slate-100 text-sm leading-none">CrestSOC</div>
            <div className="text-[10px] text-slate-500 leading-none mt-0.5 font-mono uppercase tracking-widest">AI Triage</div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60',
                collapsed && 'justify-center',
              )}
            >
              <Icon className={clsx('w-4.5 h-4.5 flex-shrink-0', isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300')} size={18} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Quick Triage shortcut */}
      {!collapsed && (
        <div className="px-3 pb-4">
          <NavLink
            to="/"
            className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium hover:bg-cyan-500/15 transition-colors"
          >
            <Zap className="w-4 h-4 flex-shrink-0" />
            <span>Quick Triage</span>
          </NavLink>
        </div>
      )}

      {/* Collapse toggle */}
      <div className="p-3 border-t border-slate-800/80">
        <button
          onClick={onToggle}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className={clsx(
            'flex items-center gap-2 w-full px-3 py-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 text-sm transition-colors',
            collapsed && 'justify-center',
          )}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
