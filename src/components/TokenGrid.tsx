import React from 'react';
import { ShieldCheck, ArrowUpRight, Users, Droplets, TrendingUp, Zap, Layers } from 'lucide-react';
import { Token } from '../types/token';
import { BnbIcon } from './Icons';

interface TokenGridProps {
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  onOpenTaxInfo: (token: Token, e: React.MouseEvent) => void;
}

export function TokenGrid({ tokens, onSelectToken, onOpenTaxInfo }: TokenGridProps) {
  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `$${(val / 1000000).toFixed(2)}M`;
    if (val >= 1000) return `$${(val / 1000).toFixed(2)}K`;
    return `$${val.toFixed(2)}`;
  };

  const formatPrice = (price: number) => {
    if (price < 0.0001) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(6)}`;
    return `$${price.toFixed(2)}`;
  };

  const renderSparkline = (data: number[] | undefined, isPositive: boolean) => {
    const pointsData = data && data.length > 0 ? data : (isPositive ? [20, 25, 35, 50, 65, 80, 95, 100] : [90, 80, 65, 50, 40, 30, 20]);
    const min = Math.min(...pointsData);
    const max = Math.max(...pointsData);
    const range = max - min || 1;
    const width = 120;
    const height = 32;

    const points = pointsData
      .map((val, idx) => {
        const x = (idx / (pointsData.length - 1)) * width;
        const y = height - ((val - min) / range) * (height - 6) - 3;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');

    const strokeColor = isPositive ? '#10b981' : '#f43f5e';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 lg:p-6">
      {tokens.map((token) => {
        const isPositive = token.change24h >= 0;
        return (
          <div
            key={token.id}
            onClick={() => onSelectToken(token)}
            className="group relative bg-[#0e121a] hover:bg-[#121622] border border-white/[0.08] hover:border-emerald-500/40 rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10 cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Header: Avatar, Symbol, Badges, 24h change */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-xl bg-[#151a26] border border-white/[0.1] overflow-hidden shrink-0 flex items-center justify-center shadow-md">
                    <img
                      src={token.icon}
                      alt={token.symbol}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span className="font-display font-bold text-xs text-emerald-400">
                      {token.symbol.slice(1, 3)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                        {token.symbol}
                      </span>
                      {token.verified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                      {token.hasGTag && (
                        <span className="w-3.5 h-3.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono flex items-center justify-center font-bold">
                          G
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate max-w-[130px]">
                      {token.name}
                    </p>
                  </div>
                </div>

                {/* 24h gain pill */}
                <div
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold ${
                    isPositive
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {isPositive ? `+${token.change24h.toFixed(1)}%` : `${token.change24h.toFixed(1)}%`}
                </div>
              </div>

              {/* Sparkline & Price Metric */}
              <div className="flex items-center justify-between my-3 py-2 px-3 rounded-xl bg-black/40 border border-white/[0.04]">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">PRICE</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {formatPrice(token.price)}
                  </span>
                </div>
                <div className="flex items-center justify-end">
                  {renderSparkline(token.sparkline, isPositive)}
                </div>
              </div>

              {/* MCAP & Volume */}
              <div className="grid grid-cols-2 gap-2 my-2 text-xs font-mono">
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-500 block uppercase">Market Cap</span>
                  <span className="font-bold text-slate-200">{formatCurrency(token.mcap)}</span>
                </div>
                <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-[10px] text-slate-500 block uppercase">24h Vol</span>
                  <span className="font-bold text-slate-200">{formatCurrency(token.vol24h)}</span>
                </div>
              </div>

              {/* Bonding progress if applicable */}
              {token.bondingProgress && (
                <div className="my-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-emerald-400" /> Curve Migration
                    </span>
                    <span className="text-emerald-400 font-bold">{token.bondingProgress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/[0.04]">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, token.bondingProgress)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bottom row: RWA badge, Tax & action */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-400">
              <div className="flex items-center gap-2">
                {token.rwaAsset ? (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                    {token.rwaAsset} RWA
                  </span>
                ) : (
                  <span>Tax: {token.buyTax}%/{token.sellTax}%</span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenTaxInfo(token, e);
                }}
                className="text-emerald-400 hover:text-white font-semibold flex items-center gap-0.5"
              >
                <span>Tax Breakdown</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
