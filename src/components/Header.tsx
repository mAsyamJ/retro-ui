import React, { useState } from 'react';
import { Search, Globe, ChevronDown, Check, ExternalLink, Wallet, LogOut, Copy, ArrowRight, Bell } from 'lucide-react';
import { FlapLogo, BnbIcon } from './Icons';
import { WalletState } from '../types/token';

interface HeaderProps {
  currentView: 'home' | 'create' | 'portfolio';
  onNavigate: (view: 'home' | 'create' | 'portfolio') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onDisconnectWallet: () => void;
  selectedNetwork: string;
  onSelectNetwork: (network: string) => void;
  activeAlertsCount?: number;
  onOpenAlerts?: () => void;
}

export function Header({
  currentView,
  onNavigate,
  searchQuery,
  onSearchChange,
  wallet,
  onOpenWalletModal,
  onDisconnectWallet,
  selectedNetwork,
  onSelectNetwork,
  activeAlertsCount = 0,
  onOpenAlerts,
}: HeaderProps) {
  const [showNetworkMenu, setShowNetworkMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showCommunityMenu, setShowCommunityMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showWalletDropdown, setShowWalletDropdown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentLang, setCurrentLang] = useState<'EN' | 'ID' | 'CN' | 'KR'>('EN');

  const networks = [
    { id: 'BSC', name: 'BNB Chain', symbol: 'BSC', active: true },
    { id: 'ETH', name: 'Ethereum', symbol: 'ETH', active: false },
    { id: 'SOL', name: 'Solana', symbol: 'SOL', active: false },
    { id: 'BASE', name: 'Base', symbol: 'BASE', active: false },
    { id: 'ARB', name: 'Arbitrum', symbol: 'ARB', active: false },
  ];

  const languages = [
    { code: 'EN', label: 'English' },
    { code: 'ID', label: 'Bahasa Indonesia' },
    { code: 'CN', label: '简体中文' },
    { code: 'KR', label: '한국어' },
  ];

  const copyAddress = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0e0d]/95 backdrop-blur-md border-b border-[#1c2420] text-sm">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
        {/* Left Section: Logo & Main Navigation */}
        <div className="flex items-center gap-8">
          {/* FLAP Brand Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          >
            <FlapLogo className="w-7 h-7 transition-transform group-hover:scale-110" />
            <span className="font-pixel text-xl tracking-wider text-white font-bold group-hover:text-[#ccff00] transition-colors">
              FLAP
            </span>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-wider text-slate-300">
            <button
              onClick={() => onNavigate('home')}
              className={`hover:text-[#ccff00] transition-colors pb-1 cursor-pointer ${
                currentView === 'home' ? 'text-[#ccff00] font-bold border-b border-[#ccff00]' : ''
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => onNavigate('portfolio')}
              className={`hover:text-[#ccff00] transition-colors pb-1 cursor-pointer flex items-center gap-1.5 ${
                currentView === 'portfolio' ? 'text-[#ccff00] font-bold border-b border-[#ccff00]' : ''
              }`}
            >
              <span>PORTFOLIO</span>
              {wallet.isConnected && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
              )}
            </button>
            <button
              onClick={() => onNavigate('create')}
              className={`hover:text-[#ccff00] transition-colors pb-1 cursor-pointer ${
                currentView === 'create' ? 'text-[#ccff00] font-bold border-b border-[#ccff00]' : ''
              }`}
            >
              STORE
            </button>
            <a
              href="#event"
              onClick={(e) => { e.preventDefault(); alert("Season 1 Flap Airdrop Event is Live! Earn $FLAP by creating tokens."); }}
              className="hover:text-[#ccff00] transition-colors cursor-pointer"
            >
              EVENT
            </a>
            <a
              href="#docs"
              onClick={(e) => { e.preventDefault(); alert("FLAP Documentation: Decentralized token factory with zero coding and automated RWA distribution."); }}
              className="hover:text-[#ccff00] transition-colors cursor-pointer"
            >
              DOCS
            </a>

            {/* COMMUNITY Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowCommunityMenu(!showCommunityMenu)}
                onBlur={() => setTimeout(() => setShowCommunityMenu(false), 200)}
                className="flex items-center gap-1 hover:text-[#ccff00] transition-colors cursor-pointer"
              >
                COMMUNITY <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {showCommunityMenu && (
                <div className="absolute left-0 mt-2 w-44 bg-[#121715] border border-[#232f28] rounded shadow-2xl py-2 z-50">
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-[#1a231f] hover:text-[#ccff00]"
                  >
                    <span>Twitter / X</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  <a
                    href="https://telegram.org"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-[#1a231f] hover:text-[#ccff00]"
                  >
                    <span>Telegram Group</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                  <a
                    href="https://discord.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between px-3 py-2 text-xs text-slate-300 hover:bg-[#1a231f] hover:text-[#ccff00]"
                  >
                    <span>Discord Server</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
                  </a>
                </div>
              )}
            </div>

            {/* MORE Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                onBlur={() => setTimeout(() => setShowMoreMenu(false), 200)}
                className="flex items-center gap-1 hover:text-[#ccff00] transition-colors cursor-pointer"
              >
                MORE <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>
              {showMoreMenu && (
                <div className="absolute left-0 mt-2 w-48 bg-[#121715] border border-[#232f28] rounded shadow-2xl py-2 z-50">
                  <button
                    onClick={() => { onNavigate('create'); setShowMoreMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#1a231f] hover:text-[#ccff00]"
                  >
                    Create Tax Token
                  </button>
                  <button
                    onClick={() => { alert("Synthetic Stocks RWA: Stake meme tokens to earn real $NVDA and $TSLA dividend payouts."); setShowMoreMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#1a231f] hover:text-[#ccff00]"
                  >
                    RWA Stocks Yield
                  </button>
                  <button
                    onClick={() => { alert("Contract Auditor: All tokens launched on FLAP have auto-locked liquidity."); setShowMoreMenu(false); }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-[#1a231f] hover:text-[#ccff00]"
                  >
                    Audits & Verification
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right Section: Search, Network, Lang, Wallet */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Box */}
          <div className="relative hidden sm:block w-48 lg:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search token or CA..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#121715] border border-[#1e2823] focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] text-xs text-slate-200 pl-9 pr-3 py-2 rounded transition-all placeholder:text-slate-500 font-mono outline-none"
            />
          </div>

          {/* Network Switcher (BSC) */}
          <div className="relative">
            <button
              onClick={() => setShowNetworkMenu(!showNetworkMenu)}
              className="flex items-center gap-1.5 bg-[#121715] hover:bg-[#18211d] border border-[#1e2823] hover:border-[#2d3d35] px-2.5 py-1.5 rounded text-xs font-mono text-slate-200 transition-colors cursor-pointer"
            >
              <BnbIcon className="w-4 h-4" />
              <span>{selectedNetwork}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showNetworkMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-[#121715] border border-[#232f28] rounded shadow-2xl py-1 z-50">
                <div className="px-3 py-1.5 text-[10px] uppercase font-mono text-slate-500 border-b border-[#1c2420]">
                  Select Network
                </div>
                {networks.map((net) => (
                  <button
                    key={net.id}
                    onClick={() => {
                      onSelectNetwork(net.id);
                      setShowNetworkMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-[#19221d] text-slate-300 hover:text-white"
                  >
                    <div className="flex items-center gap-2 font-mono">
                      {net.id === 'BSC' && <BnbIcon className="w-3.5 h-3.5" />}
                      <span>{net.name}</span>
                    </div>
                    {selectedNetwork === net.id && <Check className="w-3.5 h-3.5 text-[#ccff00]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 bg-[#121715] hover:bg-[#18211d] border border-[#1e2823] px-2 py-1.5 rounded text-xs font-mono text-slate-300 transition-colors cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{currentLang}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-[#121715] border border-[#232f28] rounded shadow-2xl py-1 z-50">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setCurrentLang(lang.code as any);
                      setShowLangMenu(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-xs text-left hover:bg-[#19221d] text-slate-300"
                  >
                    <span>{lang.label}</span>
                    {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-[#ccff00]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price Alerts Notification Bell */}
          <button
            onClick={onOpenAlerts}
            className="relative p-2 bg-[#121715] hover:bg-[#18211d] border border-[#1e2823] hover:border-[#ccff00] text-slate-300 hover:text-white rounded transition-colors cursor-pointer"
            title="View Price Alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#ccff00] text-black font-bold text-[9px] rounded-full flex items-center justify-center font-mono animate-pulse">
                {activeAlertsCount}
              </span>
            )}
          </button>

          {/* Connect Wallet Button */}
          {wallet.isConnected && wallet.address ? (
            <div className="relative">
              <button
                onClick={() => setShowWalletDropdown(!showWalletDropdown)}
                className="flex items-center gap-2 border border-[#ccff00] bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer"
              >
                <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
                <span>
                  {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                </span>
                <span className="hidden sm:inline text-slate-300">
                  | {wallet.balanceBNB.toFixed(2)} BNB
                </span>
              </button>
              {showWalletDropdown && (
                <div className="absolute right-0 mt-2 w-52 bg-[#121715] border border-[#232f28] rounded shadow-2xl py-2 z-50 font-mono text-xs">
                  <div className="px-3 py-1 text-slate-400 text-[11px] border-b border-[#1c2420]">
                    Connected: {wallet.network}
                  </div>
                  <div className="px-3 py-2 text-slate-200">
                    Balance: <span className="text-[#ccff00] font-bold">{wallet.balanceBNB.toFixed(4)} BNB</span>
                  </div>
                  <button
                    onClick={() => {
                      onNavigate('portfolio');
                      setShowWalletDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-[#ccff00] hover:bg-[#18221d] font-bold"
                  >
                    <span>My Portfolio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={copyAddress}
                    className="w-full flex items-center justify-between px-3 py-2 text-slate-300 hover:bg-[#18221d] hover:text-white"
                  >
                    <span>{copied ? "Copied!" : "Copy Address"}</span>
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      onDisconnectWallet();
                      setShowWalletDropdown(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-red-400 hover:bg-red-500/10"
                  >
                    <span>Disconnect</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenWalletModal}
              className="relative px-3 sm:px-4 py-1.5 border border-[#ccff00] hover:bg-[#ccff00] text-[#ccff00] hover:text-black font-mono text-xs font-semibold tracking-wide transition-all cursor-pointer rounded-xs"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
