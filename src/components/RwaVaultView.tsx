import React, { useState } from 'react';
import {
  ArrowLeft,
  Layers,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  ExternalLink,
  Coins,
  ArrowRight
} from 'lucide-react';
import { NvidiaIcon, AppleIcon, TeslaIcon, MicrosoftIcon, GoogleIcon, BnbIcon } from './Icons';
import { Token } from '../types/token';

interface RwaVaultViewProps {
  onBack: () => void;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
}

export function RwaVaultView({ onBack, tokens, onSelectToken }: RwaVaultViewProps) {
  const [selectedAsset, setSelectedAsset] = useState<'ALL' | 'NVDA' | 'AAPL' | 'TSLA' | 'MSFT' | 'GOOGL'>('ALL');

  const rwaEquities = [
    {
      ticker: 'NVDA',
      name: 'NVIDIA Corporation',
      price: '$124.50',
      change24h: '+4.8%',
      avgApy: '34.2%',
      poolVolume: '$18.4M',
      icon: <NvidiaIcon className="w-8 h-8" />,
      description: 'AI & GPU computing leader. Most popular reflection target for BSC meme tokens.'
    },
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      price: '$228.40',
      change24h: '+0.5%',
      avgApy: '16.8%',
      poolVolume: '$24.1M',
      icon: <AppleIcon className="w-8 h-8" />,
      description: 'Consumer technology giant. Preferred for low-volatility synthetic yield.'
    },
    {
      ticker: 'TSLA',
      name: 'Tesla, Inc.',
      price: '$218.40',
      change24h: '+8.2%',
      avgApy: '22.4%',
      poolVolume: '$12.9M',
      icon: <TeslaIcon className="w-8 h-8" />,
      description: 'EV & autonomous robotics. High trading volume and frequent dividend payouts.'
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft Corporation',
      price: '$418.90',
      change24h: '+1.2%',
      avgApy: '18.5%',
      poolVolume: '$9.8M',
      icon: <MicrosoftIcon className="w-8 h-8" />,
      description: 'Cloud infrastructure & OpenAI investor. Consistent synthetic yield stream.'
    },
    {
      ticker: 'GOOGL',
      name: 'Alphabet Inc.',
      price: '$165.20',
      change24h: '+2.4%',
      avgApy: '19.5%',
      poolVolume: '$11.2M',
      icon: <GoogleIcon className="w-8 h-8" />,
      description: 'Search & Gemini AI ecosystem. Stable reflection index backed by on-chain reserves.'
    }
  ];

  const filteredTokens = tokens.filter(
    (t) => selectedAsset === 'ALL' || t.rwaAsset === selectedAsset
  );

  return (
    <div className="w-full bg-[#08090d] min-h-screen text-slate-100 bg-mesh-dark pb-24 font-sans">
      {/* Top Header */}
      <div className="max-w-[1500px] mx-auto px-4 lg:px-6 pt-8 pb-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#121622] border border-white/[0.08] hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xl sm:text-3xl font-extrabold text-white tracking-tight">
                Real-World Asset (RWA) Vaults
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold">
                24/7 DIVIDENDS
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Hold meme tokens launched on FLAP to automatically stream real-world synthetic equity dividends into your wallet.
            </p>
          </div>
        </div>

        {/* Equity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
          {rwaEquities.map((item) => (
            <div
              key={item.ticker}
              onClick={() => setSelectedAsset(selectedAsset === item.ticker ? 'ALL' : (item.ticker as any))}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedAsset === item.ticker
                  ? 'bg-emerald-500/10 border-emerald-500/50 shadow-lg shadow-emerald-500/15'
                  : 'bg-[#0e121a] hover:bg-[#121622] border-white/[0.08]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                {item.icon}
                <span className="text-xs font-mono font-bold text-emerald-400">{item.avgApy} APY</span>
              </div>
              <h3 className="font-display font-bold text-white text-base">{item.name}</h3>
              <div className="flex items-center justify-between text-xs font-mono mt-1 text-slate-400">
                <span>{item.ticker}</span>
                <span className="text-emerald-400 font-semibold">{item.change24h}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Filtered Tokens in this Vault */}
        <div className="bg-[#0e121a] border border-white/[0.08] rounded-3xl p-6 sm:p-7 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.06] mb-6">
            <div>
              <h2 className="font-display font-bold text-lg text-white">
                Active Tokens Distributing {selectedAsset === 'ALL' ? 'RWA Equities' : selectedAsset}
              </h2>
              <span className="text-xs text-slate-400">
                Click any asset to trade or view dividend mechanics
              </span>
            </div>
            <button
              onClick={() => setSelectedAsset('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono border cursor-pointer ${
                selectedAsset === 'ALL'
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 font-bold'
                  : 'bg-white/[0.03] border-white/[0.06] text-slate-400'
              }`}
            >
              Show All Assets
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTokens.map((token) => (
              <div
                key={token.id}
                onClick={() => onSelectToken(token)}
                className="p-4 rounded-2xl bg-[#121622] hover:bg-[#171c2b] border border-white/[0.06] hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={token.icon}
                    alt={token.symbol}
                    className="w-10 h-10 rounded-xl object-cover border border-white/[0.1]"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-display font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {token.symbol}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ${token.price.toFixed(4)}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 block truncate max-w-[150px]">
                      {token.name}
                    </span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-xs font-bold text-emerald-400 block">
                    {token.rwaYieldApy || 24.5}% APY
                  </span>
                  <span className="text-[10px] text-slate-500">
                    in {token.rwaAsset || 'NVDA'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
