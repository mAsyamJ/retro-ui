import React, { useState } from 'react';
import {
  List,
  LayoutGrid,
  Filter,
  Sparkles,
  Rocket,
  Gem,
  Check,
  ArrowUpDown,
  Layers,
  ShieldCheck,
  SlidersHorizontal
} from 'lucide-react';
import { CategoryTab } from '../types/token';

interface CategoryTabsProps {
  activeTab: CategoryTab;
  onTabChange: (tab: CategoryTab) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  filterLowTax: boolean;
  onToggleLowTax: () => void;
  filterAuditedOnly: boolean;
  onToggleAuditedOnly: () => void;
}

export function CategoryTabs({
  activeTab,
  onTabChange,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  filterLowTax,
  onToggleLowTax,
  filterAuditedOnly,
  onToggleAuditedOnly,
}: CategoryTabsProps) {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const tabs: { id: CategoryTab; label: string; icon?: React.ReactNode; isHot?: boolean }[] = [
    { id: 'trending', label: 'Trending', isHot: true },
    { id: 'seed-alpha', label: 'Seed Alpha', icon: <Gem className="w-3.5 h-3.5 text-amber-400" /> },
    { id: 'stocks', label: 'RWA Equities', icon: <Layers className="w-3.5 h-3.5 text-emerald-400" /> },
    { id: 'bonding', label: 'Bonding Curve', icon: <Rocket className="w-3.5 h-3.5 text-cyan-400" /> },
    { id: 'listadao', label: 'ListaDAO' },
    { id: 'gift-token', label: 'Gift Token' },
    { id: 'innovation', label: 'Innovation' },
    { id: 'low-risk', label: 'Low Risk', icon: <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> },
  ];

  const sortOptions = [
    { id: '24h-desc', label: 'Highest 24h Gain' },
    { id: 'mcap-desc', label: 'Highest Market Cap' },
    { id: 'vol-desc', label: 'Highest 24h Volume' },
    { id: 'holders-desc', label: 'Most Holders' },
    { id: 'price-desc', label: 'Highest Price' },
  ];

  return (
    <div className="w-full bg-[#08090d] border-b border-white/[0.06] py-3.5">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Category Segmented Scrollable Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-medium tracking-wide transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-emerald-500 text-black font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-[#12151e] hover:bg-[#181c28] text-slate-300 hover:text-white border border-white/[0.06]'
                }`}
              >
                {tab.isHot && (
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-emerald-400 animate-pulse'}`} />
                )}
                {tab.icon && <span>{tab.icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Filters & View Switchers on Right */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
          {/* Quick Filter: Low Tax (<= 1%) */}
          <button
            onClick={onToggleLowTax}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer ${
              filterLowTax
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold'
                : 'bg-[#12151e] border-white/[0.06] text-slate-400 hover:text-white'
            }`}
          >
            Tax &le; 1%
          </button>

          {/* Quick Filter: Audited Only */}
          <button
            onClick={onToggleAuditedOnly}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all border cursor-pointer flex items-center gap-1 ${
              filterAuditedOnly
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-semibold'
                : 'bg-[#12151e] border-white/[0.06] text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Audited (95+)</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-[#12151e] border border-white/[0.06] rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('list')}
              title="List Table View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange('grid')}
              title="Card Grid View"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#12151e] hover:bg-[#181c28] border border-white/[0.06] rounded-xl text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sort</span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 mt-2 w-52 bg-[#12151e] border border-white/[0.1] rounded-2xl shadow-2xl py-2 z-50 font-mono text-xs backdrop-blur-xl">
                <div className="px-3 py-1.5 text-slate-400 text-[10px] uppercase border-b border-white/[0.06] flex items-center gap-1.5">
                  <ArrowUpDown className="w-3 h-3 text-emerald-400" />
                  <span>Sort Order</span>
                </div>
                {sortOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onSortChange(opt.id);
                      setShowSortDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/[0.06] text-slate-300 hover:text-emerald-400"
                  >
                    <span>{opt.label}</span>
                    {sortBy === opt.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
