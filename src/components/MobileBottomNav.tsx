import React from 'react';
import { Home, Coins, ArrowRightLeft, Plus } from 'lucide-react';
import { SidebarNavView } from '../types/token';

interface MobileBottomNavProps {
  currentView: SidebarNavView;
  onNavigate: (view: SidebarNavView) => void;
  onLaunchClick: () => void;
}

export function MobileBottomNav({
  currentView,
  onNavigate,
  onLaunchClick,
}: MobileBottomNavProps) {
  const navItems = [
    { id: 'home' as SidebarNavView, label: 'Home', icon: Home },
    { id: 'earn' as SidebarNavView, label: 'Earn', icon: Coins },
    { id: 'trade' as SidebarNavView, label: 'Trade', icon: ArrowRightLeft },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090d0b]/95 backdrop-blur-lg border-t border-[#18221c] px-4 py-2 safe-bottom">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#18231e] text-[#8df0b5]' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[11px] font-semibold mt-0.5 ${isActive ? 'text-[#8df0b5]' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}

        {/* Quick Launch Button */}
        <button
          onClick={onLaunchClick}
          className="flex flex-col items-center justify-center py-1 px-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-full bg-[#8df0b5] text-black flex items-center justify-center shadow-[0_0_15px_rgba(141,240,181,0.3)] group-active:scale-95 transition-transform">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[11px] font-bold text-white mt-0.5">Launch</span>
        </button>
      </div>
    </nav>
  );
}
