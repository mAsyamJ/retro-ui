import React, { useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  CheckCircle2,
  Users,
  Crown,
  Share2,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Send,
  X,
  ArrowLeft
} from 'lucide-react';
import { SolanaIcon } from './Icons';
import { Token, WalletState } from '../types/token';

interface LaunchCoinPageProps {
  onBack: () => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  onTokenLaunched: (newToken: Token) => void;
}

export function LaunchCoinPage({
  onBack,
  wallet,
  onOpenWalletModal,
  onTokenLaunched,
}: LaunchCoinPageProps) {
  // Platform selection: Solana vs Robinhood
  const [platform, setPlatform] = useState<'solana' | 'robinhood'>('solana');

  // Form Fields
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fee Sharing: 'share' | 'holders' | 'creator'
  const [feeSharingMode, setFeeSharingMode] = useState<'share' | 'holders' | 'creator'>('share');
  const [selectedSocialPlatform, setSelectedSocialPlatform] = useState<'x' | 'solana' | 'kick' | 'tiktok' | 'moltbook' | 'github'>('x');
  const [socialHandle, setSocialHandle] = useState('');
  const [addedRecipients, setAddedRecipients] = useState<{ platform: string; handle: string; pct: number }[]>([
    { platform: 'x', handle: '@RetroApp', pct: 100 },
  ]);

  // Custom links accordion
  const [showCustomLinks, setShowCustomLinks] = useState(false);
  const [website, setWebsite] = useState('');
  const [telegram, setTelegram] = useState('');
  const [discord, setDiscord] = useState('');

  // Paired asset: SOL vs Custom
  const [pairedAsset, setPairedAsset] = useState<'sol' | 'custom'>('sol');

  // Dev buy amount
  const [devBuyAmount, setDevBuyAmount] = useState('0.00');

  // Deploying state
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  // Image Upload handler
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRecipient = () => {
    if (!socialHandle.trim()) return;
    const formattedHandle = socialHandle.startsWith('@') ? socialHandle : `@${socialHandle}`;
    setAddedRecipients((prev) => [
      ...prev,
      { platform: selectedSocialPlatform, handle: formattedHandle, pct: 10 },
    ]);
    setSocialHandle('');
  };

  const handleRemoveRecipient = (index: number) => {
    setAddedRecipients((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDevBuyPreset = (preset: string) => {
    setDevBuyAmount(preset);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet.isConnected) {
      onOpenWalletModal();
      return;
    }

    if (!name.trim() || !ticker.trim()) {
      alert('Please enter a coin name and ticker.');
      return;
    }

    setIsDeploying(true);

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);

      const formattedTicker = ticker.startsWith('$') ? ticker : `$${ticker.toUpperCase()}`;
      const defaultIcon = imagePreview || imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80';
      const randomContract = `7${Array.from({ length: 38 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

      const newToken: Token = {
        id: `token-${Date.now()}`,
        name: name.trim(),
        symbol: formattedTicker,
        icon: defaultIcon,
        verified: true,
        price: 0.0000786,
        payToken: 'SOL',
        payTokenIcon: 'sol',
        mcap: 78600,
        ath: 78600,
        age: 'Just now',
        txns: parseFloat(devBuyAmount) > 0 ? 1 : 0,
        vol24h: parseFloat(devBuyAmount) * 150,
        traders: 1,
        change5m: 0,
        change1h: 0,
        change4h: 0,
        change24h: 0,
        category: 'new',
        chain: 'solana',
        buyTax: 0,
        sellTax: 2,
        holders: 1,
        liquidity: 14500,
        contractAddress: randomContract,
        description: description.trim() || 'Community-launched coin on Retro with 1% creator fee standard.',
        website: website.trim() || undefined,
        telegram: telegram.trim() || undefined,
        twitter: addedRecipients.find((r) => r.platform === 'x')?.handle || undefined,
        creator: {
          handle: wallet.address ? `@${wallet.address.slice(0, 6)}` : '@You',
          avatar: defaultIcon,
          verified: true,
          earningsUsd: 0,
        },
        sparkline: [20, 25, 30, 45, 55, 65, 80, 90, 95, 100],
        createdAt: 'Just now',
      };

      onTokenLaunched(newToken);

      setTimeout(() => {
        onBack();
      }, 1500);
    }, 1400);
  };

  const displayTicker = ticker.trim() ? (ticker.startsWith('$') ? ticker.toUpperCase() : `$${ticker.toUpperCase()}`) : 'TICKER';
  const displayName = name.trim() || 'Coin name';

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Top back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-4 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to explore</span>
      </button>

      {/* Main Grid: Form on Left, Sticky Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Main Form Container (Matches Image 1 & 2) */}
        <div className="lg:col-span-8 bg-[#121513] border border-[#1b211d] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header: Title */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Launch a coin
              </h1>
            </div>

            {/* Network / Platform Selector Pills */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setPlatform('solana')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  platform === 'solana'
                    ? 'bg-[#1e2420] text-white border border-[#2b352e]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181d1a]'
                }`}
              >
                <SolanaIcon className="w-4 h-4" />
                <span>Solana</span>
              </button>

              <button
                type="button"
                onClick={() => setPlatform('robinhood')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  platform === 'robinhood'
                    ? 'bg-[#1e2420] text-white border border-[#2b352e]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181d1a]'
                }`}
              >
                <span className="text-[#22c55e] font-serif text-sm">🪶</span>
                <span>Robinhood</span>
              </button>
            </div>

            {/* Field: Coin image */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Coin image
              </label>

              <div className="relative">
                <label className="flex items-center gap-3 bg-[#181e1b] hover:bg-[#1e2622] border border-[#222b25] hover:border-slate-500 rounded-2xl p-3.5 cursor-pointer transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-[#222c26] border border-[#2e3b33] flex items-center justify-center shrink-0 overflow-hidden">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <span className="text-sm text-slate-400 font-medium">
                    {imagePreview ? 'Image selected (click to replace)' : 'Choose image'}
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Quick Preset Avatars */}
              <div className="flex items-center gap-2 mt-2.5">
                <span className="text-[11px] text-slate-500">Presets:</span>
                {[
                  { label: '🐸 Pepe', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&q=80' },
                  { label: '🐶 Doge', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=100&h=100&fit=crop&q=80' },
                  { label: '🦉 Owl', url: 'https://images.unsplash.com/photo-1548802673-380ab8ebc7b7?w=100&h=100&fit=crop&q=80' },
                  { label: '🤖 Cyber', url: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=100&h=100&fit=crop&q=80' },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setImagePreview(preset.url);
                      setImageUrl(preset.url);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#181e1b] hover:bg-[#222b26] border border-[#232c25] text-[11px] text-slate-300 hover:text-white cursor-pointer transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Field: Name & Ticker (Side by Side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Coin Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#181e1b] border border-[#222b25] focus:border-slate-400 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Ticker
                </label>
                <input
                  type="text"
                  required
                  placeholder="TICKER"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value)}
                  className="w-full bg-[#181e1b] border border-[#222b25] focus:border-slate-400 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none uppercase font-mono"
                />
              </div>
            </div>

            {/* Field: Description */}
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-2">
                Description
              </label>
              <textarea
                rows={4}
                placeholder="Enter a short description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#181e1b] border border-[#222b25] focus:border-slate-400 rounded-2xl p-4 text-sm text-white placeholder:text-slate-500 outline-none resize-none"
              />
            </div>

            {/* Section: Fee sharing */}
            <div className="space-y-4 pt-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Fee sharing
              </label>

              {/* Segmented 3-tab toggle: Share / Holders / Creator */}
              <div className="flex items-center bg-[#181e1b] p-1 rounded-2xl border border-[#222b25]">
                <button
                  type="button"
                  onClick={() => setFeeSharingMode('share')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    feeSharingMode === 'share'
                      ? 'bg-white text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeeSharingMode('holders')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    feeSharingMode === 'holders'
                      ? 'bg-white text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Holders</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFeeSharingMode('creator')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    feeSharingMode === 'creator'
                      ? 'bg-white text-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Crown className="w-3.5 h-3.5" />
                  <span>Creator</span>
                </button>
              </div>

              {/* Social Platform Icons Row */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {/* 𝕏 X button */}
                <button
                  type="button"
                  onClick={() => setSelectedSocialPlatform('x')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    selectedSocialPlatform === 'x'
                      ? 'bg-black text-white border-white'
                      : 'bg-[#181e1b] text-slate-400 border-[#222b25]'
                  }`}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  <span>X</span>
                </button>

                {/* Solana */}
                <button
                  type="button"
                  onClick={() => setSelectedSocialPlatform('solana')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    selectedSocialPlatform === 'solana'
                      ? 'bg-[#1f2823] text-white border-[#34d399]'
                      : 'bg-[#181e1b] text-slate-400 border-[#222b25]'
                  }`}
                >
                  <SolanaIcon className="w-3.5 h-3.5" />
                  <span>Solana</span>
                </button>

                {/* Kick */}
                <button
                  type="button"
                  onClick={() => setSelectedSocialPlatform('kick')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    selectedSocialPlatform === 'kick'
                      ? 'bg-[#1f2823] text-[#22c55e] border-[#22c55e]'
                      : 'bg-[#181e1b] text-slate-400 border-[#222b25]'
                  }`}
                >
                  <span className="w-3.5 h-3.5 bg-[#53FC18] text-black font-black text-[9px] rounded flex items-center justify-center">K</span>
                  <span>Kick</span>
                </button>

                {/* TikTok */}
                <button
                  type="button"
                  onClick={() => setSelectedSocialPlatform('tiktok')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    selectedSocialPlatform === 'tiktok'
                      ? 'bg-[#1f2823] text-white border-white'
                      : 'bg-[#181e1b] text-slate-400 border-[#222b25]'
                  }`}
                >
                  <span className="text-[11px]">🎵</span>
                  <span>TikTok</span>
                </button>

                {/* Moltbook */}
                <button
                  type="button"
                  onClick={() => setSelectedSocialPlatform('moltbook')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    selectedSocialPlatform === 'moltbook'
                      ? 'bg-[#1f2823] text-white border-white'
                      : 'bg-[#181e1b] text-slate-400 border-[#222b25]'
                  }`}
                >
                  <span className="text-[11px]">📖</span>
                  <span>Moltbook</span>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => setSelectedSocialPlatform('github')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold border transition-colors cursor-pointer shrink-0 ${
                    selectedSocialPlatform === 'github'
                      ? 'bg-[#1f2823] text-white border-white'
                      : 'bg-[#181e1b] text-slate-400 border-[#222b25]'
                  }`}
                >
                  <span className="text-[11px]">🐙</span>
                  <span>GitHub</span>
                </button>
              </div>

              {/* Handle input field: @ username with + Add */}
              <div className="flex items-center gap-2 bg-[#181e1b] border border-[#222b25] rounded-2xl px-4 py-2.5">
                <input
                  type="text"
                  placeholder="@ username"
                  value={socialHandle}
                  onChange={(e) => setSocialHandle(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddRecipient}
                  className="px-4 py-1.5 bg-[#232c26] hover:bg-[#2d3a32] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>

              {/* Added fee sharing recipients chips */}
              {addedRecipients.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {addedRecipients.map((rec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1e2722] border border-[#2a3730] text-xs text-white"
                    >
                      <span className="text-[#8df0b5] font-bold">{rec.handle}</span>
                      <span className="text-slate-400 text-[10px]">({rec.platform})</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveRecipient(i)}
                        className="text-slate-500 hover:text-white ml-1 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Accordion: Add custom links (Optional) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowCustomLinks(!showCustomLinks)}
                className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer transition-colors"
              >
                <span>🔗 Add custom links</span>
                <span className="text-slate-500">(Optional)</span>
                {showCustomLinks ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showCustomLinks && (
                <div className="mt-3 p-4 bg-[#181e1b] border border-[#222b25] rounded-2xl space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Website URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full bg-[#121614] border border-[#1e2420] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Telegram Group</label>
                    <input
                      type="url"
                      placeholder="https://t.me/..."
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="w-full bg-[#121614] border border-[#1e2420] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Discord Invite</label>
                    <input
                      type="url"
                      placeholder="https://discord.gg/..."
                      value={discord}
                      onChange={(e) => setDiscord(e.target.value)}
                      className="w-full bg-[#121614] border border-[#1e2420] rounded-xl px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Section: Paired asset */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Paired asset
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPairedAsset('sol')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    pairedAsset === 'sol'
                      ? 'bg-white text-black shadow'
                      : 'bg-[#181e1b] text-slate-400 border border-[#222b25]'
                  }`}
                >
                  <SolanaIcon className="w-4 h-4" />
                  <span>SOL</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPairedAsset('custom')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    pairedAsset === 'custom'
                      ? 'bg-white text-black shadow'
                      : 'bg-[#181e1b] text-slate-400 border border-[#222b25]'
                  }`}
                >
                  <span>📊 Custom</span>
                </button>
              </div>
            </div>

            {/* Section: Dev buy */}
            <div className="space-y-2.5 pt-2">
              <label className="text-xs font-semibold text-slate-300 block">
                Dev buy
              </label>

              <div className="flex items-center justify-between bg-[#181e1b] border border-[#222b25] rounded-2xl px-4 py-3">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={devBuyAmount}
                  onChange={(e) => setDevBuyAmount(e.target.value)}
                  className="bg-transparent text-sm font-bold text-white outline-none w-32 font-mono"
                />
                <div className="flex items-center gap-1.5 text-xs font-bold text-white font-mono">
                  <SolanaIcon className="w-3.5 h-3.5" />
                  <span>SOL</span>
                </div>
              </div>

              {/* Dev buy presets row */}
              <div className="grid grid-cols-4 gap-2">
                {['1 SOL', '3 SOL', '5 SOL', '10 SOL'].map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => handleDevBuyPreset(preset.split(' ')[0])}
                    className="py-2 bg-[#181e1b] hover:bg-[#202824] border border-[#222b25] rounded-xl text-xs font-bold text-slate-300 cursor-pointer transition-colors font-mono"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isDeploying}
                className="w-full py-4 bg-[#8df0b5] hover:bg-[#74ea9e] active:scale-98 disabled:opacity-50 text-black font-extrabold text-sm rounded-full transition-all cursor-pointer shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                {isDeploying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>LAUNCHING ON {platform.toUpperCase()}...</span>
                  </>
                ) : !wallet.isConnected ? (
                  <span>Log in to launch</span>
                ) : (
                  <span>Launch Coin</span>
                )}
              </button>

              <p className="text-center text-[11px] text-slate-500 mt-3 font-medium">
                By launching, you agree to the <span className="underline hover:text-slate-300 cursor-pointer">Terms of Use</span>.
              </p>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Sticky Live Preview (Matches Image 1 & 2 Right Side) */}
        <div className="lg:col-span-4 sticky top-24 space-y-4">
          {/* Top header banner card */}
          <div className="bg-[#121513] border border-[#1b211d] rounded-2xl p-4 text-center">
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Launch a coin, earn royalties forever
            </h3>
          </div>

          {/* Live Card Preview (Exact replica from Screenshot 1 & 2) */}
          <div className="bg-[#141816] border border-[#202722] rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3.5">
              {/* Token thumbnail image with 'preview' label */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-[#1d2420] border border-[#2b352f] flex items-center justify-center overflow-hidden shrink-0">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-slate-500" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 mt-1 font-mono">preview</span>
              </div>

              {/* Ticker & Name & Badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5 mb-2 truncate">
                  <span className="text-base font-extrabold text-white font-mono">
                    {displayTicker}
                  </span>
                  <span className="text-xs text-slate-400 truncate">
                    {displayName}
                  </span>
                </div>

                {/* Badges row: now, Tax 2%, SOL, TX 0 */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  <span className="text-[#34d399] font-bold">now</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#1f2722] text-slate-300">
                    Tax 2%
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md bg-[#1f2722] text-slate-300 flex items-center gap-1">
                    <SolanaIcon className="w-2.5 h-2.5" />
                    <span>SOL</span>
                  </span>
                  <span className="text-slate-400">
                    TX <strong className="text-white">0</strong>
                  </span>
                </div>

                {/* You Badge & Mint Green Buy Button */}
                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-[#1b221d]">
                  <div className="flex items-center gap-1 text-[11px] text-slate-300 bg-[#1a211d] px-2 py-0.5 rounded-full">
                    <span>👤</span>
                    <span className="font-semibold">You</span>
                  </div>

                  <button
                    type="button"
                    className="px-3.5 py-1 bg-[#8df0b5] text-black font-bold text-xs rounded-full flex items-center gap-1 shadow-[0_0_15px_rgba(141,240,181,0.25)]"
                  >
                    <Zap className="w-3 h-3 fill-black" />
                    <span>Buy</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics breakdown below preview card */}
            <div className="space-y-2 pt-3 border-t border-[#1b221d] text-xs font-mono">
              <div className="flex items-center justify-between text-slate-400">
                <span>Launches at</span>
                <span className="font-bold text-white">$78.6K · 725 SOL</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Graduates at</span>
                <span className="font-bold text-white">100 SOL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
