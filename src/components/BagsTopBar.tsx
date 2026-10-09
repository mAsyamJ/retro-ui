import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  ArrowLeft,
  Bell,
  LogOut,
  Wallet,
  Sparkles,
  ExternalLink,
  SlidersHorizontal,
  TrendingUp,
  X,
  Copy,
  Check
} from 'lucide-react';
import { SolanaIcon, BaseIcon, EthereumIcon, BnbIcon } from './Icons';
import { WalletState, Token } from '../types/token';

interface BagsTopBarProps {
  onBack?: () => void;
  showBack?: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  onLaunchClick: () => void;
  selectedChain: string;
  onSelectChain: (chain: string) => void;
  isSidebarCollapsed: boolean;
  activeAlertsCount?: number;
  onOpenAlerts?: () => void;
}

export function BagsTopBar({
  onBack,
  showBack = false,
  searchQuery,
  onSearchChange,
  tokens,
  onSelectToken,
  wallet,
  onOpenWalletModal,
  onDisconnectWallet,
  onLaunchClick,
  selectedChain,
  onSelectChain,
  isSidebarCollapsed,
  activeAlertsCount = 0,
  onOpenAlerts,
}: BagsTopBarProps) {
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [copied, setCopied] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut ⌘K or Ctrl+K to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const chains = [
    { id: 'all', name: 'All Chains', icon: null },
    { id: 'solana', name: 'Solana', icon: SolanaIcon },
    { id: 'base', name: 'Base', icon: BaseIcon },
    { id: 'ethereum', name: 'Ethereum', icon: EthereumIcon },
    { id: 'bsc', name: 'BNB Chain', icon: BnbIcon },
  ];

  const searchResults = searchQuery.trim()
    ? tokens.filter(
        (t) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.contractAddress.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const liveTraders = [
    { handle: '@alphaprophet', pnl: '+$154,172.01', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&h=60&fit=crop&q=80' },
    { handle: '@sp0ngey', pnl: '+$56,840.06', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&h=60&fit=crop&q=80' },
    { handle: '@Wickfiller', pnl: '+$34,586.20', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=60&h=60&fit=crop&q=80' },
    { handle: '@goyim', pnl: '+$29,186.98', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&q=80' },
    { handle: '@teodorZXC', pnl: '+$28,161.71', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&q=80' },
  ];

  const handleCopyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#090b0a]/90 backdrop-blur-md border-b border-[#141816] select-none">
      {/* Top Live Trader Marquee (Exact match to Image 2 top bar) */}
      <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-[#050706] border-b border-[#111613] text-[11px] overflow-x-hidden font-mono text-slate-400">
        <div className="flex items-center gap-1.5 shrink-0 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
          <span>TOP 24H REALIZED:</span>
        </div>

        <div className="flex items-center gap-6 overflow-hidden whitespace-nowrap">
          {liveTraders.map((trader, i) => (
            <div key={i} className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
              <img
                src={trader.avatar}
                alt={trader.handle}
                className="w-4 h-4 rounded-full object-cover border border-slate-700"
              />
              <span className="text-slate-300 font-medium">{trader.handle}</span>
              <span className="text-[#34d399] font-bold">{trader.pnl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Top Navigation Row */}
      <div className="px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Left: Back button & Search Box */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          {showBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-full bg-[#121614] hover:bg-[#1a201d] text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
              title="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {/* Search Input Container */}
          <div className="relative flex-1">
            <div className="flex items-center gap-2 bg-[#141916] border border-[#202723] focus-within:border-slate-500 rounded-full px-4 py-2 transition-all">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search coins and users..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
              />

              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="p-0.5 text-slate-500 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#1f2622] text-[10px] font-mono text-slate-400">
                  <span>⌘</span>
                  <span>K</span>
                </div>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#121715] border border-[#232f28] rounded-2xl shadow-2xl p-2 z-50">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 py-1 block">
                  COINS FOUND ({searchResults.length})
                </span>
                <div className="space-y-1">
                  {searchResults.map((t) => (
                    <div
                      key={t.id}
                      onClick={() => {
                        onSelectToken(t);
                        setIsSearchFocused(false);
                      }}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-[#1a221e] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={t.icon}
                          alt={t.symbol}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-white">{t.symbol}</span>
                            <span className="text-xs text-slate-400">{t.name}</span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-mono">
                            MCAP: ${(t.mcap / 1000).toFixed(1)}K
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-white block font-mono">
                          ${t.price < 0.001 ? t.price.toFixed(6) : t.price.toFixed(4)}
                        </span>
                        <span className={`text-xs font-bold ${t.change24h >= 0 ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
                          {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chain Filter Dropdown Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setIsChainDropdownOpen(!isChainDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#141916] hover:bg-[#1a201d] border border-[#202723] rounded-full px-3 py-2 text-xs font-semibold text-slate-200 cursor-pointer transition-colors"
            >
              {/* Overlapping mini chain icons */}
              <div className="flex -space-x-1.5 items-center">
                <div className="w-4 h-4 rounded-full bg-purple-950 flex items-center justify-center overflow-hidden">
                  <SolanaIcon className="w-3.5 h-3.5" />
                </div>
                <div className="w-4 h-4 rounded-full bg-blue-950 flex items-center justify-center overflow-hidden">
                  <BaseIcon className="w-3.5 h-3.5" />
                </div>
                <div className="w-4 h-4 rounded-full bg-amber-950 flex items-center justify-center overflow-hidden">
                  <BnbIcon className="w-3.5 h-3.5" />
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isChainDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-44 bg-[#121715] border border-[#232f28] rounded-2xl shadow-2xl p-1.5 z-50">
                {chains.map((chain) => {
                  const Icon = chain.icon;
                  const isSelected = selectedChain === chain.id;

                  return (
                    <button
                      key={chain.id}
                      onClick={() => {
                        onSelectChain(chain.id);
                        setIsChainDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#1b2520] text-[#6ee7b7] font-bold'
                          : 'text-slate-300 hover:bg-[#18201c] hover:text-white'
                      }`}
                    >
                      {Icon && <Icon className="w-4 h-4 shrink-0" />}
                      <span className="flex-1 text-left">{chain.name}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right: Price Alerts button, + Launch Button & Connect Wallet / Log In */}
        <div className="flex items-center gap-3">
          {/* Active Price Alerts Notification Icon */}
          {onOpenAlerts && (
            <button
              onClick={onOpenAlerts}
              className="relative p-2.5 rounded-full bg-[#141916] hover:bg-[#1b221e] border border-[#202723] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="View Price Alerts"
            >
              <Bell className="w-4 h-4" />
              {activeAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#6ee7b7] text-black text-[10px] font-black flex items-center justify-center animate-pulse">
                  {activeAlertsCount}
                </span>
              )}
            </button>
          )}

          {/* Mint Green "+ Launch" Pill Button (Matches Image 1 & 2) */}
          <button
            onClick={onLaunchClick}
            className="flex items-center gap-1.5 px-5 py-2.5 bg-[#8df0b5] hover:bg-[#74ea9e] active:scale-98 text-black font-bold text-sm rounded-full transition-all cursor-pointer shadow-[0_0_20px_rgba(141,240,181,0.25)]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Launch</span>
          </button>

          {/* Login or Connected Wallet Pill */}
          {!wallet.isConnected ? (
            <button
              onClick={onOpenWalletModal}
              className="px-5 py-2.5 bg-white hover:bg-slate-200 active:scale-98 text-black font-bold text-sm rounded-full transition-all cursor-pointer shadow"
            >
              log in
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setIsWalletDropdownOpen(!isWalletDropdownOpen)}
                className="flex items-center gap-2 bg-[#141916] hover:bg-[#1a201d] border border-[#202723] rounded-full px-3.5 py-2 text-xs font-semibold text-white cursor-pointer transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                <span className="font-mono">{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</span>
                <span className="text-[#8df0b5] font-mono font-bold hidden sm:inline">
                  {wallet.balanceBNB.toFixed(2)} BNB
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Wallet Dropdown Menu */}
              {isWalletDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-[#121715] border border-[#232f28] rounded-2xl shadow-2xl p-3 z-50 font-sans">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1b231f]">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">CONNECTED WALLET</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                      {wallet.network}
                    </span>
                  </div>

                  <div className="p-2.5 bg-[#0d110f] rounded-xl border border-[#1e2722] mb-3">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-mono mb-1">
                      <span>{wallet.address?.slice(0, 8)}...{wallet.address?.slice(-6)}</span>
                      <button onClick={handleCopyAddress} className="hover:text-white cursor-pointer" title="Copy Address">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-sm font-bold text-white font-mono">
                      {wallet.balanceBNB.toFixed(4)} <span className="text-[#8df0b5]">BNB</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setIsWalletDropdownOpen(false);
                        if (onOpenAlerts) onOpenAlerts();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#1a221e] cursor-pointer transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#8df0b5]" />
                        <span>Price Alerts</span>
                      </span>
                      {activeAlertsCount > 0 && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-[#8df0b5] text-black rounded-full">
                          {activeAlertsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setIsWalletDropdownOpen(false);
                        onDisconnectWallet();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Disconnect Wallet</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
