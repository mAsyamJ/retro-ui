import React from 'react';
import { ArrowRight, Sparkles, TrendingUp, ShieldCheck, Zap, Layers, BarChart3 } from 'lucide-react';
import { BnbIcon, NvidiaIcon, AppleIcon, MicrosoftIcon, GoogleIcon, TeslaIcon } from './Icons';

interface HeroBannerProps {
  onCreateClick: () => void;
  onExploreRwa: () => void;
}

export function HeroBanner({ onCreateClick, onExploreRwa }: HeroBannerProps) {
  return (
    <div className="relative w-full border-b border-white/[0.08] bg-mesh-dark py-10 lg:py-14 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>BNB Chain v2.4 Engine Active</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">Zero-Code Contract Compiler</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08]">
                Decentralized Token Foundry &amp;{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  RWA Yield Engine
                </span>
              </h1>
              <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                Deploy tax &amp; meme tokens with auto-locked PancakeSwap liquidity. Holders earn 24/7 fractional dividends in synthetic tech equities (<strong className="text-emerald-400 font-semibold">$NVDA</strong>, <strong className="text-cyan-400 font-semibold">$TSLA</strong>, <strong className="text-white font-semibold">$AAPL</strong>).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <button
                onClick={onCreateClick}
                className="group flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 hover:from-emerald-300 hover:to-teal-300 text-black font-display font-bold text-sm tracking-wide shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Token in 60s</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreRwa}
                className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#131722]/80 hover:bg-[#1a2030] border border-white/[0.1] text-slate-200 hover:text-white font-medium text-sm transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Explore RWA Vaults</span>
              </button>
            </div>

            {/* Trust Metrics Bar */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06] max-w-xl font-mono text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">30D VOL TRADED</span>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">$142.8M</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">TOKENS LAUNCHED</span>
                <span className="text-base sm:text-lg font-bold text-white tracking-tight">14,920</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">LP SECURITY</span>
                <span className="text-base sm:text-lg font-bold text-emerald-400 tracking-tight">100% Locked</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Real-World Asset Reflection Glass Card */}
          <div className="lg:col-span-5">
            <div className="relative bg-gradient-to-b from-[#141824] to-[#0d1017] border border-white/[0.12] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80">
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-sm">RWA Yield Matrix</h3>
                    <span className="text-[11px] font-mono text-slate-400">24/7 Automated Reflections</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs font-mono font-medium">
                  <BnbIcon className="w-3.5 h-3.5" />
                  <span>BNB Chain</span>
                </div>
              </div>

              {/* RWA Stocks Showcase */}
              <div className="my-5 p-4 rounded-2xl bg-black/40 border border-white/[0.06]">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                  <span>SUPPORTED EQUITIES</span>
                  <span className="text-emerald-400">Avg APY: 28.4%</span>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                    <NvidiaIcon className="w-7 h-7 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-bold text-slate-200">NVDA</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                    <AppleIcon className="w-7 h-7 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-bold text-slate-200">AAPL</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                    <MicrosoftIcon className="w-7 h-7 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-bold text-slate-200">MSFT</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                    <GoogleIcon className="w-7 h-7 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-bold text-slate-200">GOOGL</span>
                  </div>
                  <div className="flex flex-col items-center p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                    <TeslaIcon className="w-7 h-7 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-mono font-bold text-slate-200">TSLA</span>
                  </div>
                </div>
              </div>

              {/* Live Yield Simulation Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/25 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">Estimated Monthly Dividend</span>
                  <span className="text-emerald-400 font-bold">+$340.20 USD</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Calculated based on holding 10,000 $ZERO tokens with active 1% tax reflections to synthetic NVIDIA stocks.
                </p>
              </div>

              {/* Bottom security assurance */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400 pt-3 border-t border-white/[0.06]">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Non-Custodial Direct Payout
                </span>
                <span className="text-emerald-400 font-semibold">Every 60 Mins</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
