import React, { useState } from 'react';
import {
  Rocket,
  Sparkles,
  Link2,
  Heart,
  BarChart3,
  Clock,
  Zap,
  Filter,
  LayoutGrid,
  List,
  Settings,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Token, CategoryTab } from '../types/token';
import { SolanaIcon, BaseIcon, EthereumIcon, BnbIcon } from './Icons';

interface ExploreCoinsTableProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  activeCategory: CategoryTab;
  onCategoryChange: (cat: CategoryTab) => void;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSort: (field: string) => void;
}

// Mini SVG Sparkline Component matching Screenshot 2
function SparklineGraph({ points, isPositive }: { points?: number[]; isPositive: boolean }) {
  const defaultPoints = isPositive
    ? [20, 25, 30, 42, 55, 68, 75, 82, 88, 92, 98, 100]
    : [90, 85, 75, 60, 48, 40, 35, 28, 24, 20, 18, 15];

  const data = points && points.length > 0 ? points : defaultPoints;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 80;
  const height = 28;

  const coords = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${coords.join(' L ')}`;
  const areaD = `M ${coords[0]} L ${coords.join(' L ')} L ${width},${height} L 0,${height} Z`;

  const strokeColor = isPositive ? '#34d399' : '#f87171';
  const fillColor = isPositive ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)';

  return (
    <svg width={width} height={height} className="overflow-visible shrink-0">
      <path d={areaD} fill={fillColor} />
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExploreCoinsTable({
  tokens,
  onSelectToken,
  activeCategory,
  onCategoryChange,
  viewMode,
  onViewModeChange,
  sortField,
  sortDirection,
  onSort,
}: ExploreCoinsTableProps) {
  const categories: { id: CategoryTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'movers', label: 'Movers', icon: Rocket },
    { id: 'new', label: 'New', icon: Sparkles },
    { id: 'custom-pairs', label: 'Custom pairs', icon: Link2 },
    { id: 'charities', label: 'Charities', icon: Heart },
    { id: 'market-cap', label: 'Market cap', icon: BarChart3 },
    { id: 'oldest', label: 'Oldest', icon: Clock },
    { id: 'last-trade', label: 'Last trade', icon: Zap },
  ];

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `$${(num / 1000).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatCount = (num?: number) => {
    if (!num) return '0';
    return num.toLocaleString();
  };

  return (
    <div className="space-y-4">
      {/* Section Header: Explore Coins Title + Filters Bar (Matches Screenshot 2) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Explore coins
        </h2>

        {/* Categories Pills & Controls Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-[#0e1210] p-1 rounded-full border border-[#1b241f]">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#8df0b5] text-black shadow-[0_0_15px_rgba(141,240,181,0.3)]'
                      : 'text-slate-400 hover:text-white hover:bg-[#161d19]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Toolbar Actions */}
          <div className="flex items-center gap-1.5">
            {/* Multi-chain badge cluster */}
            <div className="hidden sm:flex items-center gap-1 bg-[#0e1210] border border-[#1b241f] rounded-full px-2.5 py-1.5 text-xs text-slate-300">
              <div className="flex -space-x-1 items-center">
                <SolanaIcon className="w-3.5 h-3.5" />
                <BaseIcon className="w-3.5 h-3.5" />
                <EthereumIcon className="w-3.5 h-3.5" />
                <BnbIcon className="w-3.5 h-3.5" />
              </div>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </div>

            {/* Filter button */}
            <button className="flex items-center gap-1.5 bg-[#0e1210] hover:bg-[#161d19] border border-[#1b241f] rounded-full px-3 py-1.5 text-xs font-semibold text-slate-300 cursor-pointer transition-colors">
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filter</span>
            </button>

            {/* View Mode Toggle: Grid vs Table */}
            <div className="flex items-center bg-[#0e1210] border border-[#1b241f] rounded-full p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1 rounded-full cursor-pointer transition-colors ${
                  viewMode === 'grid' ? 'bg-[#1b2520] text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Grid view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onViewModeChange('table')}
                className={`p-1 rounded-full cursor-pointer transition-colors ${
                  viewMode === 'table' ? 'bg-[#1b2520] text-white' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Table view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Settings button */}
            <button className="p-2 bg-[#0e1210] hover:bg-[#161d19] border border-[#1b241f] rounded-full text-slate-400 hover:text-white cursor-pointer transition-colors">
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Table View (Matches Screenshot 2) */}
      {viewMode === 'table' ? (
        <div className="w-full overflow-x-auto rounded-2xl border border-[#161d19] bg-[#090c0a] shadow-xl">
          <table className="w-full text-left text-xs font-mono select-none">
            <thead>
              <tr className="border-b border-[#161d19] text-slate-500 text-[11px] uppercase tracking-wider font-sans">
                <th className="py-3 px-3 w-10 text-center font-semibold">#</th>
                <th className="py-3 px-4 font-semibold">COIN</th>
                <th className="py-3 px-4 font-semibold text-center w-28">GRAPH</th>
                <th
                  onClick={() => onSort('mcap')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>MCAP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 font-semibold text-right">ATH</th>
                <th
                  onClick={() => onSort('age')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>AGE</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSort('txns')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>TXNS</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSort('vol24h')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>24H VOL</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSort('traders')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>TRADERS</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => onSort('change1h')}
                  className="py-3 px-4 font-semibold text-right cursor-pointer hover:text-white transition-colors"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>1H</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#131915]">
              {tokens.map((token, index) => {
                const isPositive1h = token.change1h >= 0;
                const mcapAthRatio = token.ath ? Math.min(100, (token.mcap / token.ath) * 100) : 60;

                return (
                  <tr
                    key={token.id}
                    onClick={() => onSelectToken(token)}
                    className="hover:bg-[#0f1412] cursor-pointer transition-colors group"
                  >
                    {/* # Index */}
                    <td className="py-3.5 px-3 text-center text-slate-500 font-mono text-xs">
                      {index + 1}
                    </td>

                    {/* COIN Name, Symbol, Avatar, Badges */}
                    <td className="py-3.5 px-4 font-sans">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#161d19] border border-[#232d27] flex items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={token.icon}
                            alt={token.symbol}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-sm group-hover:text-[#8df0b5] transition-colors">
                              {token.name}
                            </span>
                            {token.verified && (
                              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 text-[#34d399] flex items-center justify-center text-[9px] font-bold">
                                ✓
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 text-xs font-mono">
                            {token.symbol}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* GRAPH: Smooth SVG sparkline */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <SparklineGraph
                          points={token.sparkline}
                          isPositive={isPositive1h}
                        />
                      </div>
                    </td>

                    {/* MCAP */}
                    <td className="py-3.5 px-4 text-right font-bold text-white font-mono text-sm">
                      {formatNumber(token.mcap)}
                    </td>

                    {/* ATH: Progress bar + ATH value */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="inline-flex items-center gap-2">
                        {/* Comparison Progress Bar */}
                        <div className="w-10 bg-[#19221d] h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              mcapAthRatio > 80 ? 'bg-amber-400' : 'bg-[#34d399]'
                            }`}
                            style={{ width: `${mcapAthRatio}%` }}
                          />
                        </div>
                        <span className="text-slate-300 font-semibold">
                          {formatNumber(token.ath || token.mcap * 1.5)}
                        </span>
                      </div>
                    </td>

                    {/* AGE */}
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono">
                      {token.age || '23m'}
                    </td>

                    {/* TXNS */}
                    <td className="py-3.5 px-4 text-right text-slate-300 font-mono">
                      {formatCount(token.txns || token.holders * 4)}
                    </td>

                    {/* 24H VOL */}
                    <td className="py-3.5 px-4 text-right text-slate-200 font-mono font-medium">
                      {formatNumber(token.vol24h)}
                    </td>

                    {/* TRADERS */}
                    <td className="py-3.5 px-4 text-right text-slate-300 font-mono">
                      {formatCount(token.traders || token.holders)}
                    </td>

                    {/* 1H Change Pill (Exact match to Screenshot 2) */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex justify-end">
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono inline-flex items-center gap-0.5 ${
                            isPositive1h
                              ? 'bg-emerald-500/10 text-[#34d399]'
                              : 'bg-rose-500/10 text-[#f87171]'
                          }`}
                        >
                          <span>{isPositive1h ? '↑' : '↓'}</span>
                          <span>{Math.abs(token.change1h).toLocaleString(undefined, { maximumFractionDigits: 1 })}%</span>
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tokens.map((token) => {
            const isPositive = token.change1h >= 0;

            return (
              <div
                key={token.id}
                onClick={() => onSelectToken(token)}
                className="bg-[#090c0a] hover:bg-[#0f1412] border border-[#161d19] hover:border-[#28372f] rounded-2xl p-4 cursor-pointer transition-all hover:-translate-y-1 shadow-lg group"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={token.icon}
                      alt={token.symbol}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-white text-sm group-hover:text-[#8df0b5] transition-colors">
                          {token.name}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">{token.symbol}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
                      isPositive ? 'bg-emerald-500/10 text-[#34d399]' : 'bg-rose-500/10 text-[#f87171]'
                    }`}
                  >
                    {isPositive ? '↑' : '↓'} {Math.abs(token.change1h).toFixed(1)}%
                  </span>
                </div>

                {/* Graph preview */}
                <div className="my-3 flex items-center justify-center bg-[#070908] p-2 rounded-xl">
                  <SparklineGraph points={token.sparkline} isPositive={isPositive} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-[#161d19]">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">MCAP</span>
                    <span className="text-white font-bold">{formatNumber(token.mcap)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">24H VOL</span>
                    <span className="text-slate-300">{formatNumber(token.vol24h)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
