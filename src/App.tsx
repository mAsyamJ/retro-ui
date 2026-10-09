import React, { useState, useMemo, useEffect } from 'react';
import { BagsSidebar } from './components/BagsSidebar';
import { BagsTopBar } from './components/BagsTopBar';
import { HeroEarningsCard } from './components/HeroEarningsCard';
import { TrendingRow } from './components/TrendingRow';
import { ExploreCoinsTable } from './components/ExploreCoinsTable';
import { EarnView } from './components/EarnView';
import { TradeView } from './components/TradeView';
import { LaunchCoinPage } from './components/LaunchCoinPage';
import { LaunchTokenModal } from './components/LaunchTokenModal';
import { ConnectWalletModal } from './components/ConnectWalletModal';
import { TokenDetailModal } from './components/TokenDetailModal';
import { TaxInfoModal } from './components/TaxInfoModal';
import { PriceAlertsModal } from './components/PriceAlertsModal';
import { SettingsModal } from './components/SettingsModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { INITIAL_TOKENS } from './data/mockTokens';
import { INITIAL_PRICE_ALERTS } from './data/mockPortfolio';
import {
  Token,
  CategoryTab,
  WalletState,
  PriceAlert,
  SidebarNavView
} from './types/token';
import { MessageSquare, Bell, Check, X, ArrowUpRight } from 'lucide-react';

export default function App() {
  // Navigation View: 'home' | 'earn' | 'trade' | 'create'
  const [currentView, setCurrentView] = useState<SidebarNavView>('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Search, Chain & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChain, setSelectedChain] = useState('all');
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('movers');
  const [exploreViewMode, setExploreViewMode] = useState<'table' | 'grid'>('table');
  const [trendingSubTab, setTrendingSubTab] = useState<'pulse' | 'trending'>('pulse');
  const [sortField, setSortField] = useState('change1h');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Network & Wallet State
  const [wallet, setWallet] = useState<WalletState>({
    isConnected: true, // Default connected so user can test immediately
    address: '0x71C8f2a49b2',
    network: 'Solana',
    balanceBNB: 4.825,
  });

  // Token Data State
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS);
  const [selectedTradeToken, setSelectedTradeToken] = useState<Token>(() => INITIAL_TOKENS[0]);

  // Local State-Based Price Alerts System
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    try {
      const saved =
        localStorage.getItem('retro_price_alerts') ||
        localStorage.getItem('bags_price_alerts') ||
        localStorage.getItem('flap_price_alerts');
      return saved ? JSON.parse(saved) : INITIAL_PRICE_ALERTS;
    } catch {
      return INITIAL_PRICE_ALERTS;
    }
  });

  // Triggered Price Alert Toast
  const [alertToast, setAlertToast] = useState<{
    id: string;
    title: string;
    message: string;
    alertId: string;
  } | null>(null);

  // Sync price alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('retro_price_alerts', JSON.stringify(priceAlerts));
    } catch {
      // ignore
    }
  }, [priceAlerts]);

  // Direct navigation to Trading terminal when clicking any token
  const handleSelectTokenForTrade = (token: Token) => {
    setSelectedTradeToken(token);
    setCurrentView('trade');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals State
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedTokenForDetail, setSelectedTokenForDetail] = useState<Token | null>(null);
  const [selectedTokenForTax, setSelectedTokenForTax] = useState<Token | null>(null);

  // Filter & Sort Logic for Coins
  const filteredAndSortedTokens = useMemo(() => {
    let result = tokens.filter((token) => {
      // Chain filter
      if (selectedChain !== 'all' && token.chain && token.chain !== selectedChain) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSymbol = token.symbol.toLowerCase().includes(query);
        const matchName = token.name.toLowerCase().includes(query);
        const matchCA = token.contractAddress.toLowerCase().includes(query);
        return matchSymbol || matchName || matchCA;
      }

      // Category filter for explore tab
      if (activeCategory === 'movers') return true;
      if (activeCategory === 'new') return token.category === 'new' || token.age?.includes('m');
      if (activeCategory === 'market-cap') return token.mcap > 50000;
      if (activeCategory === 'charities') return token.category === 'charities';
      if (activeCategory === 'custom-pairs') return token.category === 'custom-pairs';
      if (activeCategory === 'oldest') return token.age?.includes('d') || token.age?.includes('mo') || token.age?.includes('y');

      return true;
    });

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortField as keyof Token];
      let valB: any = b[sortField as keyof Token];

      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }
      return 0;
    });

    return result;
  }, [tokens, selectedChain, searchQuery, activeCategory, sortField, sortDirection]);

  // Handlers
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleConnectWallet = (walletName: string) => {
    const randomHex = Array.from({ length: 4 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    setWallet({
      isConnected: true,
      address: `0x71C${randomHex}49b2`,
      network: selectedChain !== 'all' ? selectedChain.toUpperCase() : 'Solana',
      balanceBNB: 4.825,
    });
    setIsWalletModalOpen(false);
  };

  const handleDisconnectWallet = () => {
    setWallet({
      isConnected: false,
      address: null,
      network: 'Solana',
      balanceBNB: 0,
    });
  };

  const handleNewTokenCreated = (newToken: Token) => {
    setTokens((prev) => [newToken, ...prev]);
    setIsLaunchModalOpen(false);
  };

  const handleBuySuccess = (token: Token, bnbSpent: number) => {
    setWallet((prev) => ({
      ...prev,
      balanceBNB: Math.max(0, prev.balanceBNB - bnbSpent),
    }));

    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === token.id) {
          const newPrice = t.price * 1.03;
          return {
            ...t,
            price: newPrice,
            vol24h: t.vol24h + bnbSpent * 580,
            holders: t.holders + 1,
            mcap: t.mcap * 1.03,
            change1h: t.change1h + 1.2,
            change24h: t.change24h + 2.5,
          };
        }
        return t;
      })
    );
  };

  const handleSellSuccess = (token: Token, tokenAmount: number, bnbReceived: number) => {
    setWallet((prev) => ({
      ...prev,
      balanceBNB: prev.balanceBNB + bnbReceived,
    }));

    setTokens((prev) =>
      prev.map((t) => {
        if (t.id === token.id) {
          const newPrice = Math.max(0.000001, t.price * 0.98);
          return {
            ...t,
            price: newPrice,
            vol24h: t.vol24h + bnbReceived * 580,
            mcap: t.mcap * 0.98,
            change1h: t.change1h - 0.8,
            change24h: t.change24h - 1.5,
          };
        }
        return t;
      })
    );
  };

  // Price Alert System Handlers
  const handleAddPriceAlert = (newAlert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>) => {
    const alertItem: PriceAlert = {
      ...newAlert,
      id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'active',
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPriceAlerts((prev) => [alertItem, ...prev]);

    setAlertToast({
      id: `toast-${Date.now()}`,
      title: `PRICE ALERT SET FOR ${alertItem.tokenSymbol}`,
      message: `Target ${alertItem.direction === 'above' ? '≥' : '≤'} $${alertItem.targetPrice < 0.001 ? alertItem.targetPrice.toFixed(6) : alertItem.targetPrice.toFixed(4)}`,
      alertId: alertItem.id,
    });

    setTimeout(() => {
      setAlertToast(null);
    }, 4500);
  };

  const handleDeletePriceAlert = (alertId: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  const handleSimulateTriggerAlert = (alertId: string) => {
    const target = priceAlerts.find((a) => a.id === alertId);
    if (!target) return;

    setPriceAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? { ...a, status: 'triggered', triggeredAt: 'Just now' }
          : a
      )
    );

    setAlertToast({
      id: `toast-${Date.now()}`,
      title: `PRICE ALERT TRIGGERED: ${target.tokenSymbol}`,
      message: `Target ${target.direction === 'above' ? '≥' : '≤'} $${target.targetPrice < 0.001 ? target.targetPrice.toFixed(6) : target.targetPrice.toFixed(4)} reached!`,
      alertId,
    });

    setTimeout(() => {
      setAlertToast(null);
    }, 6000);
  };

  const activeAlertsCount = priceAlerts.filter((a) => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 flex flex-col font-sans selection:bg-[#8df0b5] selection:text-black">
      {/* 1. Left Collapsible Sidebar System (Desktop / Tablet) */}
      <BagsSidebar
        currentView={currentView}
        onNavigate={setCurrentView}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLaunchClick={() => setCurrentView('create')}
        wallet={wallet}
        activeAlertsCount={activeAlertsCount}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onDisconnectWallet={handleDisconnectWallet}
        onOpenAlerts={() => setIsAlertsModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* 2. Main Content Container (offsets for sidebar on desktop, full width on mobile) */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-200 pl-0 ${
          isSidebarCollapsed ? 'md:pl-[72px]' : 'md:pl-[240px]'
        } pb-20 md:pb-0`}
      >
        {/* Top Header Bar */}
        <BagsTopBar
          showBack={currentView !== 'home'}
          onBack={() => setCurrentView('home')}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          tokens={tokens}
          onSelectToken={handleSelectTokenForTrade}
          wallet={wallet}
          onOpenWalletModal={() => setIsWalletModalOpen(true)}
          onDisconnectWallet={handleDisconnectWallet}
          onLaunchClick={() => setCurrentView('create')}
          selectedChain={selectedChain}
          onSelectChain={setSelectedChain}
          isSidebarCollapsed={isSidebarCollapsed}
          activeAlertsCount={activeAlertsCount}
          onOpenAlerts={() => setIsAlertsModalOpen(true)}
        />

        {/* View Router Content: ONLY Home, Earn, Trade, and Launch a coin */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto space-y-8">
          {/* HOME VIEW */}
          {currentView === 'home' && (
            <div className="space-y-8">
              {/* Creator Earnings Banner */}
              <HeroEarningsCard
                onLaunchClick={() => setCurrentView('create')}
                onSelectCreatorToken={(sym) => {
                  const target = tokens.find((t) => t.symbol === sym);
                  if (target) handleSelectTokenForTrade(target);
                }}
              />

              {/* Trending Cards Row */}
              <TrendingRow
                tokens={tokens}
                onSelectToken={handleSelectTokenForTrade}
                activeSubTab={trendingSubTab}
                onSubTabChange={setTrendingSubTab}
              />

              {/* Explore Coins Table */}
              <ExploreCoinsTable
                tokens={filteredAndSortedTokens}
                onSelectToken={handleSelectTokenForTrade}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                viewMode={exploreViewMode}
                onViewModeChange={setExploreViewMode}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
              />
            </div>
          )}

          {/* EARN VIEW (Creator Royalties Portal) */}
          {currentView === 'earn' && (
            <EarnView
              wallet={wallet}
              onOpenWalletModal={() => setIsWalletModalOpen(true)}
              onLaunchClick={() => setCurrentView('create')}
              onSelectToken={handleSelectTokenForTrade}
              tokens={tokens}
            />
          )}

          {/* TRADE VIEW (DEX Swap & Orderflow Terminal) */}
          {currentView === 'trade' && (
            <TradeView
              tokens={tokens}
              wallet={wallet}
              onOpenWalletModal={() => setIsWalletModalOpen(true)}
              onBuySuccess={handleBuySuccess}
              onSellSuccess={handleSellSuccess}
              selectedToken={selectedTradeToken}
              onSelectToken={setSelectedTradeToken}
            />
          )}

          {/* LAUNCH COIN PAGE */}
          {currentView === 'create' && (
            <LaunchCoinPage
              onBack={() => setCurrentView('home')}
              wallet={wallet}
              onOpenWalletModal={() => setIsWalletModalOpen(true)}
              onTokenLaunched={handleNewTokenCreated}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Home, Earn, Trade, Launch) */}
      <MobileBottomNav
        currentView={currentView}
        onNavigate={setCurrentView}
        onLaunchClick={() => setCurrentView('create')}
      />

      {/* Floating White Chat Bubble Widget Button */}
      <button
        onClick={() => alert("Retro Support & Community Chat: Join over 1.6M active degen traders on Retro.")}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 w-12 h-12 bg-white hover:bg-slate-200 text-black rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition-all"
        title="Community Support Chat"
      >
        <MessageSquare className="w-5 h-5 fill-black" />
      </button>

      {/* Triggered Price Alert Toast */}
      {alertToast && (
        <div className="fixed bottom-24 md:bottom-20 right-4 md:right-6 z-50 max-w-sm w-full bg-[#121715] border-2 border-[#8df0b5] rounded-2xl p-4 shadow-[0_0_35px_rgba(141,240,181,0.4)] font-mono animate-bounce">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#8df0b5]/15 border border-[#8df0b5] flex items-center justify-center text-[#8df0b5] shrink-0">
                <Bell className="w-4 h-4 animate-spin" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase">{alertToast.title}</h4>
                <p className="text-[11px] text-[#8df0b5] mt-0.5">{alertToast.message}</p>
              </div>
            </div>
            <button
              onClick={() => setAlertToast(null)}
              className="text-slate-500 hover:text-white p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 pt-2 border-t border-[#1e2823] flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Triggered live on DEX</span>
            <button
              onClick={() => {
                setIsAlertsModalOpen(true);
                setAlertToast(null);
              }}
              className="text-[#8df0b5] font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Alerts</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Price Alerts Management Modal */}
      <PriceAlertsModal
        isOpen={isAlertsModalOpen}
        onClose={() => setIsAlertsModalOpen(false)}
        priceAlerts={priceAlerts}
        onDeletePriceAlert={handleDeletePriceAlert}
        onSimulateTriggerAlert={handleSimulateTriggerAlert}
        onSelectTokenForTrade={(token) => {
          setSelectedTokenForDetail(token);
          setIsAlertsModalOpen(false);
        }}
        tokens={tokens}
      />

      {/* Trading Preferences / Settings Modal */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Launch Token Modal (Quick modal if invoked from other triggers) */}
      <LaunchTokenModal
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onTokenLaunched={handleNewTokenCreated}
      />

      {/* Connect Wallet Modal */}
      <ConnectWalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet}
      />

      {/* Tax Info Modal */}
      <TaxInfoModal
        token={selectedTokenForTax}
        onClose={() => setSelectedTokenForTax(null)}
      />

      {/* Token Trading & Chart Modal (With Recharts & Price Alert form) */}
      <TokenDetailModal
        token={selectedTokenForDetail}
        onClose={() => setSelectedTokenForDetail(null)}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        onBuySuccess={handleBuySuccess}
        onSellSuccess={handleSellSuccess}
        priceAlerts={priceAlerts}
        onAddPriceAlert={handleAddPriceAlert}
        onDeletePriceAlert={handleDeletePriceAlert}
        onSimulateTriggerAlert={handleSimulateTriggerAlert}
      />
    </div>
  );
}
