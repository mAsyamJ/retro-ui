import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, ShieldCheck, PieChart, Coins, Lock, Zap, Calculator } from 'lucide-react';
import { Token } from '../types/token';
import { NvidiaIcon, AppleIcon, TeslaIcon, GoogleIcon, BnbIcon } from './Icons';

interface TaxInfoModalProps {
  token: Token | null;
  onClose: () => void;
}

export function TaxInfoModal({ token, onClose }: TaxInfoModalProps) {
  const [copied, setCopied] = useState(false);
  const [holdingTokens, setHoldingTokens] = useState('10000');

  if (!token) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(token.contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRwaIcon = () => {
    switch (token.rwaAsset) {
      case 'NVDA': return <NvidiaIcon className="w-5 h-5" />;
      case 'AAPL': return <AppleIcon className="w-5 h-5" />;
      case 'TSLA': return <TeslaIcon className="w-5 h-5" />;
      case 'GOOGL': return <GoogleIcon className="w-5 h-5" />;
      default: return <BnbIcon className="w-5 h-5" />;
    }
  };

  const parsedHoldings = parseFloat(holdingTokens) || 0;
  const holdingUsd = parsedHoldings * token.price;
  const monthlyYieldUsd = holdingUsd * ((token.rwaYieldApy || 24.5) / 100 / 12);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-[#0e121a] border border-white/[0.12] rounded-3xl p-6 sm:p-7 font-sans text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                {token.symbol} Tax &amp; Yield Architecture
              </h3>
              <p className="text-[11px] font-mono text-slate-400">BEP-20 Reflection Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Token summary header */}
        <div className="flex items-center justify-between my-4 p-4 rounded-2xl bg-[#121622] border border-white/[0.06]">
          <div className="flex items-center gap-3">
            <img
              src={token.icon}
              alt={token.symbol}
              className="w-11 h-11 rounded-xl border border-white/[0.1] object-cover"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-base text-white">{token.symbol}</span>
                <span className="text-xs text-slate-400">({token.name})</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px]">
                <span className="text-slate-400">
                  {token.contractAddress.slice(0, 8)}...{token.contractAddress.slice(-6)}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="text-right font-mono">
            <span className="text-[10px] text-slate-500 block uppercase">TOTAL TAX</span>
            <span className="text-sm font-bold text-emerald-400">
              {token.buyTax}% Buy / {token.sellTax}% Sell
            </span>
          </div>
        </div>

        {/* Tax Breakdown Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4 font-mono">
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">BUY TAX RATE</span>
            <span className="text-xl font-bold text-emerald-400">{token.buyTax}%</span>
            <span className="text-[10px] text-slate-500 block mt-1">Deducted on PancakeSwap buys</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/[0.06] text-center">
            <span className="text-[10px] text-slate-400 uppercase block mb-1">SELL TAX RATE</span>
            <span className="text-xl font-bold text-rose-400">{token.sellTax}%</span>
            <span className="text-[10px] text-slate-500 block mt-1">Redistributed to holders</span>
          </div>
        </div>

        {/* Interactive Dividend Calculator */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/30 to-black/50 border border-emerald-500/25 mb-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 flex items-center gap-1.5 font-bold">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>RWA Dividend Calculator</span>
            </span>
            <span className="text-emerald-400 font-bold">{token.rwaYieldApy || 24.5}% APY</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1/2">
              <label className="text-[10px] font-mono text-slate-400 block mb-1">HOLDING AMOUNT</label>
              <input
                type="number"
                value={holdingTokens}
                onChange={(e) => setHoldingTokens(e.target.value)}
                className="w-full bg-[#121622] border border-white/[0.1] px-2.5 py-1.5 rounded-lg text-xs font-mono text-white outline-none"
              />
            </div>
            <div className="w-1/2 text-right">
              <label className="text-[10px] font-mono text-slate-400 block mb-1">EST. MONTHLY REWARD</label>
              <span className="text-sm font-mono font-bold text-emerald-400 block">
                +${monthlyYieldUsd.toFixed(2)} USD in {token.rwaAsset || 'NVDA'}
              </span>
            </div>
          </div>
        </div>

        {/* Mechanics */}
        <div className="space-y-2 mb-4 text-xs">
          <div className="p-3 rounded-xl bg-[#121622] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getRwaIcon()}
              <div>
                <span className="font-semibold text-white block">Synthetic {token.rwaAsset || 'NVDA'} Equity</span>
                <span className="text-[10px] text-slate-400">Streamed hourly via BSC synthetic oracle</span>
              </div>
            </div>
            <span className="font-mono text-emerald-400 font-bold">
              {token.sellTax > 0 ? (token.sellTax * 0.6).toFixed(1) : '0'}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#121622] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-white block">Auto-Liquidity Injection</span>
                <span className="text-[10px] text-slate-400">PancakeSwap V3 pool reinforcement</span>
              </div>
            </div>
            <span className="font-mono text-cyan-400 font-bold">
              {token.sellTax > 0 ? (token.sellTax * 0.4).toFixed(1) : '0'}%
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-display font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
        >
          Close Specification
        </button>
      </div>
    </div>
  );
}
