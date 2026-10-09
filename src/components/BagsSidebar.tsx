import React, { useState } from 'react';
import {
  Home,
  Coins,
  ArrowRightLeft,
  FileText,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  Plus,
  MoreHorizontal,
  Wallet,
  Check,
  Copy,
  LogOut,
  SlidersHorizontal
} from 'lucide-react';
import { RetroLogo } from './Icons';
import { SidebarNavView, WalletState } from '../types/token';

interface BagsSidebarProps {
  currentView: SidebarNavView;
  onNavigate: (view: SidebarNavView) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLaunchClick: () => void;
  wallet: WalletState;
  activeAlertsCount?: number;
  onOpenWalletModal: () => void;
  onDisconnectWallet?: () => void;
  onOpenAlerts?: () => void;
  onOpenSettings?: () => void;
}

export function BagsSidebar({
  currentView,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onLaunchClick,
  wallet,
  activeAlertsCount = 0,
  onOpenWalletModal,
  onDisconnectWallet,
  onOpenAlerts,
  onOpenSettings,
}: BagsSidebarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const navItems = [
    { id: 'home' as SidebarNavView, label: 'Home', icon: Home },
    { id: 'earn' as SidebarNavView, label: 'Earn', icon: Coins },
    { id: 'trade' as SidebarNavView, label: 'Trade', icon: ArrowRightLeft },
  ];

  const username = wallet.address
    ? `spotty${wallet.address.slice(2, 6)}`
    : 'spottycapitalization581';
  const handle = `@${username}`;

  const handleCopy = () => {
    if (wallet.address) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <aside
      className={`hidden md:flex fixed top-0 left-0 bottom-0 z-40 bg-[#000000] border-r border-[#151917] flex-col justify-between transition-all duration-200 select-none ${
        isCollapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
    >
      {/* Top Brand, Navigation, User Item & Launch */}
      <div className="p-4 flex flex-col">
        {/* Header with Logo and Collapse button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group text-left"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0">
              <RetroLogo className="w-8 h-8 text-white transition-transform group-hover:scale-105" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-xl text-white tracking-tight">
                Retro
              </span>
            )}
          </button>

          {/* Collapse Toggle Button */}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-full hover:bg-[#1a1f1c] text-slate-400 hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <ChevronsLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation List: Home, Earn, Trade (Matches Image 1 & 2) */}
        <nav className="space-y-1.5 mb-5">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#141816]'
                    : 'text-slate-400 hover:text-white hover:bg-[#101312]'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <IconComponent className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Account Item with three dots (Matches Image 1 & 2) */}
        <div className="relative mb-5">
          <div
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={`flex items-center gap-3 p-2 rounded-2xl hover:bg-[#141816] cursor-pointer transition-colors ${
              isCollapsed ? 'justify-center p-1' : ''
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-[#1b221e] border border-[#2b3530] flex items-center justify-center shrink-0 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&q=80"
                alt={username}
                className="w-full h-full object-cover"
              />
            </div>

            {!isCollapsed && (
              <div className="flex-1 min-w-0 flex items-center justify-between">
                <div className="truncate pr-1">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {username}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono block truncate">
                    {handle}
                  </span>
                </div>

                <div className="text-slate-500 hover:text-white p-1">
                  <MoreHorizontal className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* User popup menu */}
          {showUserMenu && !isCollapsed && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#121715] border border-[#232f28] rounded-2xl p-2 shadow-2xl z-50 text-xs">
              {onOpenAlerts && (
                <button
                  onClick={() => {
                    onOpenAlerts();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1a221e] cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#8df0b5]" />
                    <span>Price Alerts</span>
                  </span>
                  {activeAlertsCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#8df0b5] text-black font-bold rounded-full">
                      {activeAlertsCount}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={handleCopy}
                className="w-full flex items-center justify-between p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#1a221e] cursor-pointer"
              >
                <span>Copy Address</span>
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              {onDisconnectWallet && (
                <button
                  onClick={() => {
                    onDisconnectWallet();
                    setShowUserMenu(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-xl text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Big White Launch Button (Matches Image 1 & 2) */}
        <div>
          <button
            onClick={onLaunchClick}
            className={`w-full py-3 bg-white hover:bg-slate-200 text-black font-bold text-sm rounded-full transition-all cursor-pointer shadow-lg hover:shadow-white/10 active:scale-98 flex items-center justify-center gap-2 ${
              isCollapsed ? 'px-0' : 'px-4'
            }`}
            title="Launch a new coin"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {!isCollapsed && <span>Launch</span>}
          </button>
        </div>
      </div>

      {/* Bottom Section: Docs & Settings (Matches Image 1 & 2) */}
      <div className="p-4 border-t border-[#151917] space-y-1">
        {/* Docs Button */}
        <a
          href="#docs"
          onClick={(e) => {
            e.preventDefault();
            alert("Retro Protocol Docs: 1% creator fee standard, non-custodial decentralized liquidity pools, and high-velocity DEX orderflow.");
          }}
          className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-[#101312] transition-colors ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Docs"
        >
          <FileText className="w-5 h-5" />
          {!isCollapsed && <span>Docs</span>}
        </a>

        {/* Settings Button */}
        <button
          onClick={() => {
            if (onOpenSettings) onOpenSettings();
          }}
          className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-[#101312] transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center px-0' : ''
          }`}
          title="Settings"
        >
          <Settings className="w-5 h-5" />
          {!isCollapsed && <span>Settings</span>}
        </button>
      </div>
    </aside>
  );
}
