import React from 'react';
import { User, Plus, CheckCircle2, Sparkles, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Token } from '../types/token';

interface HeroEarningsCardProps {
  onLaunchClick: () => void;
  onSelectCreatorToken?: (tokenSymbol: string) => void;
}

export function HeroEarningsCard({
  onLaunchClick,
  onSelectCreatorToken,
}: HeroEarningsCardProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#101b15] via-[#0d1411] to-[#090d0b] border border-[#1b2721] p-6 sm:p-8 md:p-10 shadow-2xl shadow-emerald-950/20">
      {/* Subtle background ambient mesh glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-64 h-64 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Top Section: Creator Earnings heading + Featured Creator Card */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div>
          {/* Section pill/tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#16221c] border border-[#23352c] text-xs font-semibold text-slate-300 mb-4">
            <User className="w-3.5 h-3.5 text-[#8df0b5]" />
            <span>Creator Earnings</span>
          </div>

          {/* Big Headline Number */}
          <div className="flex items-baseline tracking-tight">
            <span className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white">
              $47,212,695
            </span>
            <span className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white/35">
              .36
            </span>
          </div>

          <p className="text-sm sm:text-base text-slate-400 mt-2 font-medium">
            1% of every trade, earned by creators
          </p>
        </div>

        {/* Top-Right Floating Top Creator Pill (Matches Screenshot 1) */}
        <div
          onClick={() => onSelectCreatorToken && onSelectCreatorToken('$ELLIE')}
          className="self-start md:self-auto bg-[#131b17]/90 hover:bg-[#18231e] backdrop-blur-md border border-[#23352c] rounded-2xl p-3 sm:p-4 shadow-xl cursor-pointer transition-all hover:scale-[1.02] group"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80"
                alt="NeuraNova9"
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10b981] flex items-center justify-center text-[10px] text-black font-bold">
                ✓
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white group-hover:text-[#8df0b5] transition-colors">
                  @NeuraNova9
                </span>
                {/* 𝕏 icon */}
                <svg className="w-3 h-3 fill-slate-400" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                  <User className="w-3 h-3" />
                  <span>31.86K</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                <span className="text-[#8df0b5] font-bold font-mono">$43.92k</span>
                <span>from</span>
                <span className="font-bold text-white">$ELLIE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Three Key Metrics + "+ Launch" Button */}
      <div className="relative z-10 pt-6 border-t border-[#1a2821] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="grid grid-cols-3 gap-6 sm:gap-10">
          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Volume</span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-white font-mono">
              $4,721,269,536
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Creators funded</span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-white font-mono">
              189,774
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-medium block mb-1">Traders</span>
            <span className="text-base sm:text-lg md:text-xl font-bold text-white font-mono">
              1,669,330
            </span>
          </div>
        </div>

        {/* Right side Launch Button */}
        <div>
          <button
            onClick={onLaunchClick}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#8df0b5] hover:bg-[#74ea9e] active:scale-98 text-black font-bold text-sm rounded-full transition-all cursor-pointer shadow-[0_0_25px_rgba(141,240,181,0.25)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Launch</span>
          </button>
        </div>
      </div>
    </div>
  );
}
