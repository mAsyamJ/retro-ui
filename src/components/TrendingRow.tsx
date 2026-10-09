import React, { useState } from 'react';
import {
  Flame,
  TrendingUp,
  Zap,
  Sparkles,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { Token } from '../types/token';
import { SolanaIcon, BaseIcon, EthereumIcon, BnbIcon } from './Icons';

interface TrendingRowProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  activeSubTab: 'pulse' | 'trending';
  onSubTabChange: (tab: 'pulse' | 'trending') => void;
}

// Mini Sparkline SVG for Trending Cards
function TrendingSparkline({ points, isPositive }: { points?: number[]; isPositive: boolean }) {
  const defaultPoints = isPositive
    ? [20, 24, 32, 45, 52, 68, 74, 82, 89, 94, 98, 100]
    : [98, 92, 84, 76, 62, 55, 48, 38, 29, 24, 18, 14];

  const data = points && points.length > 0 ? points : defaultPoints;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const width = 72;
  const height = 24;

  const coords = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const pathD = `M ${coords.join(' L ')}`;
  const areaD = `M ${coords[0]} L ${coords.join(' L ')} L ${width},${height} L 0,${height} Z`;

  const strokeColor = isPositive ? '#22c55e' : '#ef4444';
  const fillColor = isPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)';

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

export function TrendingRow({
  tokens,
  onSelectToken,
  activeSubTab,
  onSubTabChange,
}: TrendingRowProps) {
  const [timeframe, setTimeframe] = useState<'5m' | '1h' | '6h' | '24h'>('24h');

  // Filter tokens based on subtab
  const trendingTokens = React.useMemo(() => {
    if (activeSubTab === 'pulse') {
      return tokens
        .filter((t) => (t.change1h || 0) > 0 || (t.change5m || 0) > 0)
        .sort((a, b) => (b.change1h || 0) - (a.change1h || 0))
        .slice(0, 6);
    }

    // Default trending list
    const prioritySymbols = ['$RETRO', '$PPW', '$VAULT', '$RETROPAY', '$ELLIE', '$RETROBOT'];
    const matched = tokens.filter((t) => prioritySymbols.includes(t.symbol));
    const remaining = tokens.filter((t) => !prioritySymbols.includes(t.symbol));
    return [...matched, ...remaining].slice(0, 6);
  }, [tokens, activeSubTab]);

  const getRankBadgeStyle = (index: number) => {
    if (index === 0) return 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/30'; // Gold
    if (index === 1) return 'text-slate-300 bg-slate-300/10 border-slate-300/30'; // Silver
    if (index === 2) return 'text-[#d97706] bg-[#d97706]/10 border-[#d97706]/30'; // Bronze
    return 'text-slate-500 bg-white/5 border-white/10';
  };

  const getChainIcon = (chain?: string) => {
    switch (chain) {
      case 'solana':
        return <SolanaIcon className="w-3 h-3" />;
      case 'base':
        return <BaseIcon className="w-3 h-3" />;
      case 'bsc':
        return <BnbIcon className="w-3 h-3" />;
      default:
        return <SolanaIcon className="w-3 h-3" />;
    }
  };

  return (
    <div className="space-y-3.5">
      {/* Top Header Row with Title, Timeframe and Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-pulse" />
            <h3 className="text-lg font-bold text-white tracking-tight">
              Trending
            </h3>
          </div>

          {/* Sub Tabs: Pulse vs Trending */}
          <div className="flex items-center bg-[#111613] p-0.5 rounded-lg border border-[#1e2822]">
            <button
              onClick={() => onSubTabChange('pulse')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'pulse'
                  ? 'bg-[#1b2520] text-[#8df0b5] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Pulse</span>
            </button>
            <button
              onClick={() => onSubTabChange('trending')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                activeSubTab === 'trending'
                  ? 'bg-[#1b2520] text-[#8df0b5] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Trending</span>
            </button>
          </div>
        </div>

        {/* Timeframe Selector Pill Group */}
        <div className="flex items-center gap-1 bg-[#0f1411] border border-[#1b241e] rounded-lg p-0.5 self-start sm:self-auto">
          {(['5m', '1h', '6h', '24h'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2.5 py-1 text-[11px] font-mono font-semibold rounded transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#22c55e] text-black font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Responsive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {trendingTokens.map((token, index) => {
          const changeVal =
            timeframe === '5m'
              ? token.change5m || token.change24h * 0.1
              : timeframe === '1h'
              ? token.change1h || token.change24h * 0.3
              : timeframe === '6h'
              ? token.change4h || token.change24h * 0.6
              : token.change24h;

          const isUp = changeVal >= 0;
          const bondingProgress = token.bondingProgress || (index === 0 ? 98 : index === 1 ? 84 : 100);

          return (
            <div
              key={token.id}
              onClick={() => onSelectToken(token)}
              className="group relative bg-[#0b0f0d] hover:bg-[#121915] border border-[#18211b] hover:border-[#2a3c30] rounded-xl p-3 cursor-pointer transition-all hover:-translate-y-0.5 shadow-md flex flex-col justify-between"
            >
              {/* Top Row: Rank Badge, Token Info, Quick Sparkline */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${getRankBadgeStyle(
                        index
                      )}`}
                    >
                      #{index + 1}
                    </span>

                    <div className="relative shrink-0">
                      <img
                        src={token.icon}
                        alt={token.symbol}
                        className="w-8 h-8 rounded-lg object-cover border border-[#223028] group-hover:border-[#38bdf8] transition-colors"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-black rounded-full p-0.5 border border-[#223028]">
                        {getChainIcon(token.chain)}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-extrabold text-white truncate group-hover:text-[#8df0b5] transition-colors">
                          {token.symbol}
                        </span>
                        {token.verified && (
                          <Check className="w-2.5 h-2.5 text-[#38bdf8] shrink-0" />
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 truncate block">
                        {token.name}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    <TrendingSparkline points={token.sparkline} isPositive={isUp} />
                  </div>
                </div>

                {/* Price & MCAP Row */}
                <div className="flex items-baseline justify-between pt-1 mb-2">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block">MCAP</span>
                    <span className="text-xs font-mono font-bold text-slate-100">
                      ${token.mcap >= 1000000
                        ? `${(token.mcap / 1000000).toFixed(2)}M`
                        : `${(token.mcap / 1000).toFixed(1)}K`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-mono block">
                      ${token.price < 0.0001
                        ? token.price.toFixed(6)
                        : token.price < 0.1
                        ? token.price.toFixed(4)
                        : token.price.toFixed(2)}
                    </span>
                    <span
                      className={`text-xs font-mono font-extrabold flex items-center justify-end gap-0.5 ${
                        isUp ? 'text-[#22c55e]' : 'text-[#ef4444]'
                      }`}
                    >
                      {isUp ? '▲' : '▼'} {Math.abs(changeVal).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Bonding Curve Bar */}
                <div className="mb-2.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span className="text-[9px] text-slate-500">Curve Progress</span>
                    <span className="text-[9px] font-bold text-[#8df0b5]">
                      {bondingProgress >= 100 ? 'Graduated 🎓' : `${bondingProgress}%`}
                    </span>
                  </div>
                  <div className="w-full h-1 bg-[#16201a] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        bondingProgress >= 100 ? 'bg-[#38bdf8]' : 'bg-[#22c55e]'
                      }`}
                      style={{ width: `${Math.min(100, bondingProgress)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Row: Volume, Traders and Quick Trade CTA */}
              <div className="pt-2 border-t border-[#141b16] flex items-center justify-between text-[10px] font-mono text-slate-400">
                <div className="flex items-center gap-1">
                  <span>
                    Vol ${token.vol24h >= 1000000
                      ? `${(token.vol24h / 1000000).toFixed(1)}M`
                      : `${(token.vol24h / 1000).toFixed(0)}K`}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5 text-slate-500">
                    <Users className="w-2.5 h-2.5" />
                    <span>
                      {token.traders
                        ? token.traders >= 1000
                          ? `${(token.traders / 1000).toFixed(1)}k`
                          : token.traders
                        : `${(token.holders / 1000).toFixed(0)}k`}
                    </span>
                  </div>

                  <span className="text-[#8df0b5] group-hover:translate-x-0.5 transition-transform flex items-center font-bold">
                    Trade <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
